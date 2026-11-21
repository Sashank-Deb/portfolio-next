'use client';

import Image from 'next/image';
import {
  type MouseEvent, useEffect, useRef, useState,
} from 'react';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/cx';
import { mergeRefs } from '@/lib/refs';

const TILT_DEG = 12;
const CURSORS = ['meme-pop-cat-cursor.png', 'meme-pop-cat-pointer.png']
  .map((file) => `url("/assets/img/${file}") 32 32, pointer`);

/** Portrait that plays a short clip on click, with a cursor-following tilt and a pop-cat cursor. */
export function AboutMedia() {
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const cursor = useRef({ frame: 0, timer: 0, idle: 0 });
  const reduced = useReducedMotion();
  const hover = useMediaQuery('(hover: hover)');
  const tilt = hover && !reduced;
  const [revealRef, revealed, revealStyle] = useReveal<HTMLDivElement>();

  useEffect(() => () => {
    clearInterval(cursor.current.timer);
    clearTimeout(cursor.current.idle);
  }, []);

  const stop = () => {
    const v = video.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    setPlaying(false);
  };

  const onClick = () => {
    if (playing) {
      stop();
      return;
    }
    setPlaying(true);
    video.current?.play().catch(stop);
  };

  // Tilt and cursor frames change on every mouse move, so they bypass React state.
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = 'transform .15s ease-out';
    el.style.transform = `perspective(900px) rotateX(${(-y * TILT_DEG).toFixed(2)}deg) rotateY(${(x * TILT_DEG).toFixed(2)}deg)`;

    const c = cursor.current;
    if (!c.timer) {
      el.style.cursor = CURSORS[0] as string;
      c.timer = window.setInterval(() => {
        c.frame ^= 1;  
        el.style.cursor = CURSORS[c.frame] as string;
      }, 150);
    }
    clearTimeout(c.idle);
    c.idle = window.setTimeout(() => {
      clearInterval(c.timer);
      c.timer = 0;
      c.frame = 0;
      el.style.cursor = CURSORS[0] as string;
    }, 80);
  };

  const onMouseLeave = () => {
    const el = wrapper.current;
    if (!el || !tilt) return;
    el.style.transition = '';
    el.style.transform = '';
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={cx('about__img-wrapper', revealed && 'is-in', playing && 'is-playing')}
      id="about-media-wrapper"
      data-reveal="self"
      title="Click to play"
      ref={mergeRefs(wrapper, revealRef)}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Image src="/assets/img/about.webp" alt="Sashank Deb" className="about__img" id="about-img" width={825} height={1600} sizes="340px" />
      {/* Decorative clip with no speech, so there is nothing to caption. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={video} id="about-video" className="about__video" src="/assets/img/About.mp4" preload="none" playsInline onEnded={stop} />
      <span className="about__hint">
        <i className="uil uil-play" />
        {' '}
        Play
      </span>
    </div>
  );
}
