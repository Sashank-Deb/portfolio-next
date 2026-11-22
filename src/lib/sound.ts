import { readStorage, writeStorage } from './storage';

/*
 * Tiny synthesised UI sounds (Web Audio, no audio files): a low, rounded "thock" for clicks,
 * a softer one for toggles, a dry mechanical click for the split-flap board, and a two-note chime.
 */

export const SOUND_KEY = 'site-sound';

export type SoundName = 'tick' | 'soft' | 'flap' | 'toggle-on' | 'toggle-off';

type ContextCtor = typeof AudioContext;

interface ToneOptions {
  type?: OscillatorType;
  from: number;
  to?: number;
  dur?: number;
  vol?: number;
  at?: number;
}
interface NoiseOptions {
  dur?: number;
  vol?: number;
  at?: number;
  filter?: BiquadFilterType;
  f0?: number;
  f1?: number;
  q?: number;
}

const tone = (
  c: AudioContext,
  out: AudioNode,
  { type = 'sine', from, to = from, dur = 0.06, vol = 0.05, at = 0 }: ToneOptions,
) => {
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.02);
};

const noise = (
  c: AudioContext,
  out: AudioNode,
  { dur = 0.2, vol = 0.2, at = 0, filter = 'lowpass', f0 = 2000, f1 = 200, q = 0.7 }: NoiseOptions,
) => {
  const t = c.currentTime + at;
  const len = Math.ceil(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const bq = c.createBiquadFilter();
  bq.type = filter;
  bq.Q.value = q;
  bq.frequency.setValueAtTime(f0, t);
  bq.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bq).connect(g).connect(out);
  src.start(t);
  src.stop(t + dur + 0.02);
};

const SOUNDS: Record<SoundName, (c: AudioContext, out: AudioNode) => void> = {
  tick: (c, out) => {
    tone(c, out, { from: 380, to: 210, dur: 0.07, vol: 0.05 });
    noise(c, out, { dur: 0.03, vol: 0.025, f0: 900, f1: 300 });
  },
  soft: (c, out) => {
    tone(c, out, { from: 300, to: 170, dur: 0.09, vol: 0.05 });
    noise(c, out, { dur: 0.035, vol: 0.02, f0: 700, f1: 250 });
  },
  flap: (c, out) => {
    const p = 0.85 + Math.random() * 0.3;
    noise(c, out, {
      dur: 0.016,
      vol: 0.05,
      filter: 'bandpass',
      f0: 2600 * p,
      f1: 1500 * p,
      q: 1.4,
    });
    tone(c, out, {
      from: 210 * p,
      to: 140 * p,
      dur: 0.025,
      vol: 0.018,
    });
  },
  'toggle-on': (c, out) => {
    tone(c, out, { from: 620, dur: 0.06, vol: 0.04 });
    tone(c, out, {
      from: 930,
      dur: 0.08,
      vol: 0.04,
      at: 0.06,
    });
  },
  'toggle-off': (c, out) => {
    tone(c, out, { from: 930, dur: 0.06, vol: 0.04 });
    tone(c, out, {
      from: 620,
      dur: 0.08,
      vol: 0.04,
      at: 0.06,
    });
  },
};

export interface SoundEngine {
  play: (name: SoundName) => void;
  isEnabled: () => boolean;
  toggle: () => void;
  subscribe: (listener: () => void) => () => void;
  context: () => AudioContext | null;
}

export const createSoundEngine = (getCtor: () => ContextCtor | undefined): SoundEngine => {
  let enabled = readStorage('local', SOUND_KEY) !== 'off';
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  const listeners = new Set<() => void>();

  const audio = (): [AudioContext, AudioNode] | null => {
    if (!ctx) {
      const Ctor = getCtor();
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return [ctx, master as GainNode];
  };

  const play = (name: SoundName) => {
    const sound = SOUNDS[name];
    if (!enabled || !sound) return;
    const a = audio();
    if (a) sound(...a);
  };

  return {
    play,
    isEnabled: () => enabled,
    toggle: () => {
      enabled = !enabled;
      writeStorage('local', SOUND_KEY, enabled ? 'on' : 'off');
      if (enabled) play('toggle-on');
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    context: () => ctx,
  };
};

const SOFT =
  '.tabs__btn, .more-btn, .rec__more, #theme-button, .nav__toggle, .nav__close, .feat__card';
const TICK =
  '.button, .pill, .nav__link, .link-arrow, .count-chip, .hero__social a, .footer__socials a, .cert, ' +
  '.work, .post, .post-feature, .blog-banner, .cta__link, .cta__copy, .rec__link, .scrollup, .footer__replay';

/** Which click sound an element should make, if any (the sound toggle plays its own chime). */
export const soundForElement = (target: Element): SoundName | null => {
  const hit = target.closest(`${SOFT}, ${TICK}`);
  if (!hit || hit.id === 'sound-button') return null;
  return hit.matches(SOFT) ? 'soft' : 'tick';
};

type WindowWithWebkit = Window & { webkitAudioContext?: ContextCtor };

let singleton: SoundEngine | null = null;

/** The site-wide engine, created on first use in the browser. */
export const getSiteSound = (): SoundEngine => {
  singleton ??= createSoundEngine(
    () => window.AudioContext ?? (window as WindowWithWebkit).webkitAudioContext,
  );
  return singleton;
};
