import { SOUND_KEY, createSoundEngine, soundForElement } from './sound';

class FakeParam {
  value = 0;

  setValueAtTime = jest.fn();

  exponentialRampToValueAtTime = jest.fn();
}

class FakeNode {
  gain = new FakeParam();

  frequency = new FakeParam();

  Q = new FakeParam();

  type = '';

  buffer: unknown = null;

  connect = jest.fn((next: unknown) => next);

  start = jest.fn();

  stop = jest.fn();
}

class FakeAudioContext {
  static created = 0;

  state: AudioContextState = 'suspended';

  currentTime = 0;

  sampleRate = 8000;

  destination = {};

  resume = jest.fn(() => { this.state = 'running'; return Promise.resolve(); });

  oscillators: FakeNode[] = [];

  constructor() { FakeAudioContext.created += 1; }

  createGain = () => new FakeNode();

  createBiquadFilter = () => new FakeNode();

  createBufferSource = () => new FakeNode();

  createBuffer = (_c: number, len: number) => ({ getChannelData: () => new Float32Array(len) });

  createOscillator = () => {
    const o = new FakeNode();
    this.oscillators.push(o);
    return o;
  };
}

const engine = (Ctor: unknown = FakeAudioContext) => createSoundEngine(
  () => Ctor as typeof AudioContext | undefined,
);

describe('sound engine', () => {
  beforeEach(() => { FakeAudioContext.created = 0; });

  it('is on by default and lazily creates one AudioContext', () => {
    const s = engine();
    expect(s.isEnabled()).toBe(true);
    expect(FakeAudioContext.created).toBe(0);
    s.play('tick');
    s.play('soft');
    expect(FakeAudioContext.created).toBe(1);
  });

  it('resumes a suspended context before playing', () => {
    const s = engine();
    s.play('flap');
    expect(s.context()?.state).toBe('running');
  });

  it('synthesises a tone for each sound', () => {
    const s = engine();
    s.play('toggle-on');
    expect((s.context() as unknown as FakeAudioContext).oscillators).toHaveLength(2);
  });

  it('stays silent and creates nothing when disabled', () => {
    localStorage.setItem(SOUND_KEY, 'off');
    const s = engine();
    expect(s.isEnabled()).toBe(false);
    s.play('tick');
    expect(FakeAudioContext.created).toBe(0);
  });

  it('ignores unknown sounds and browsers without Web Audio', () => {
    expect(() => engine().play('nope' as never)).not.toThrow();
    expect(() => engine(undefined).play('tick')).not.toThrow();
  });

  it('persists the toggle and plays a chime when turned back on', () => {
    const s = engine();
    const listener = jest.fn();
    s.subscribe(listener);
    s.toggle();
    expect(s.isEnabled()).toBe(false);
    expect(localStorage.getItem(SOUND_KEY)).toBe('off');
    s.toggle();
    expect(localStorage.getItem(SOUND_KEY)).toBe('on');
    expect((s.context() as unknown as FakeAudioContext).oscillators).toHaveLength(2);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

describe('soundForElement', () => {
  const el = (html: string) => {
    document.body.innerHTML = html;
    return document.querySelector('[data-t]') as Element;
  };

  it('uses the soft thock for toggles, tabs and cards', () => {
    expect(soundForElement(el('<button class="tabs__btn" data-t>Work</button>'))).toBe('soft');
    expect(soundForElement(el('<article class="feat__card"><span data-t></span></article>'))).toBe('soft');
  });

  it('uses the tick for buttons and links', () => {
    expect(soundForElement(el('<a class="button" data-t>Go</a>'))).toBe('tick');
    expect(soundForElement(el('<div class="footer__socials"><a data-t><i></i></a></div>'))).toBe('tick');
  });

  it('leaves the sound toggle itself and plain elements alone', () => {
    expect(soundForElement(el('<button class="icon-btn" id="sound-button" data-t></button>'))).toBeNull();
    expect(soundForElement(el('<p data-t>text</p>'))).toBeNull();
  });
});
