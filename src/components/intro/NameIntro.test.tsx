import { act, fireEvent, render, screen } from '@testing-library/react';
import { setMediaQuery } from '@/test/browser-mocks';
import { introStore } from '@/lib/intro-store';
import { NameIntro } from './NameIntro';

const html = document.documentElement;
const op = () => document.querySelector('[data-opener]') as HTMLElement;
const settle = async (ms: number) => {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });
};

describe('NameIntro', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    introStore.setReplayAvailable(false);
    delete (window as { __opClaimed?: boolean }).__opClaimed;
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the curtain hidden, with the name pieces and a skip button', () => {
    render(<NameIntro />);
    expect(op()).toHaveClass('op');
    expect(op()).not.toBeVisible();
    expect(op()).toHaveTextContent('Sashank');
    expect(op().querySelectorAll('.op__word')[0]).toHaveTextContent('Deb');
    expect(screen.getByRole('button', { name: /Skip intro/, hidden: true })).toHaveAttribute(
      'data-op-skip',
    );
  });

  it('plays on a first visit and lifts the curtain when it ends', async () => {
    html.setAttribute('data-intro', 'play');
    render(<NameIntro />);
    expect((window as { __opClaimed?: boolean }).__opClaimed).toBe(true);
    await settle(700);
    expect(op()).toBeVisible();
    expect(op()).toHaveClass('is-play');
    expect(html).toHaveClass('op-covering');
    expect(localStorage.getItem('introSeen')).toBe('1');
    fireEvent.animationEnd(op());
    expect(op()).not.toBeVisible();
    expect(html).not.toHaveAttribute('data-intro');
    expect(html).not.toHaveClass('op-covering');
    expect(introStore.getSnapshot()).toBe(true);
  });

  it('can be skipped with Escape, a click, or by timing out', async () => {
    html.setAttribute('data-intro', 'play');
    render(<NameIntro />);
    await settle(700);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(op()).not.toBeVisible();

    act(() => introStore.requestReplay());
    expect(op()).toBeVisible();
    fireEvent.click(op());
    expect(op()).not.toBeVisible();

    act(() => introStore.requestReplay());
    await settle(4300);
    expect(op()).not.toBeVisible();
  });

  it('replays from the footer button, scrolling to the top', () => {
    render(<NameIntro />);
    act(() => introStore.requestReplay());
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(op()).toHaveClass('is-play');
  });

  it('uses a static fade with reduced motion', async () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    html.setAttribute('data-intro', 'play');
    render(<NameIntro />);
    await settle(700);
    expect(op()).toHaveClass('is-static');
    await settle(1900);
    expect(op()).not.toBeVisible();
  });

  it('for returning visitors, offers the replay button and drops the skip marker shortly after', async () => {
    html.setAttribute('data-intro', 'skip');
    render(<NameIntro />);
    expect(introStore.getSnapshot()).toBe(true);
    await settle(700);
    expect(html).not.toHaveAttribute('data-intro');
  });

  it('cleans ?intro=replay out of the address bar', () => {
    window.history.replaceState(null, '', '/?intro=replay#top');
    render(<NameIntro />);
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('#top');
  });
});
