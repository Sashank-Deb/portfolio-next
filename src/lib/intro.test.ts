import { INTRO_SEEN_KEY, introGateScript } from './intro';

const html = document.documentElement;
const runGate = () => new Function(introGateScript)();

const setNavigationType = (type?: NavigationTimingType) => {
  jest.spyOn(performance, 'getEntriesByType').mockReturnValue(
    (type ? [{ type }] : []) as unknown as PerformanceEntryList,
  );
};

describe('intro gate (inline, runs before first paint)', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    setNavigationType('navigate');
    delete (window as { __opClaimed?: boolean }).__opClaimed;
  });

  it('plays on a first visit', () => {
    runGate();
    expect(html).toHaveAttribute('data-intro', 'play');
  });

  it('skips with a short rise once the intro has been seen', () => {
    localStorage.setItem(INTRO_SEEN_KEY, '1');
    runGate();
    expect(html).toHaveAttribute('data-intro', 'skip');
  });

  it('shows nothing extra on reload or back/forward', () => {
    localStorage.setItem(INTRO_SEEN_KEY, '1');
    setNavigationType('reload');
    runGate();
    expect(html).toHaveAttribute('data-intro', 'none');
  });

  it('does not play when the visitor deep-links to a section', () => {
    window.history.replaceState(null, '', '/#projects');
    runGate();
    expect(html).toHaveAttribute('data-intro', 'none');
  });

  it('respects reduced motion for returning visitors', () => {
    localStorage.setItem(INTRO_SEEN_KEY, '1');
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });
    runGate();
    expect(html).toHaveAttribute('data-intro', 'none');
  });

  it('replays on ?intro=replay even after it was seen', () => {
    localStorage.setItem(INTRO_SEEN_KEY, '1');
    window.history.replaceState(null, '', '/?intro=replay');
    runGate();
    expect(html).toHaveAttribute('data-intro', 'play');
  });

  it('lifts the curtain after load if the app never claims it', () => {
    jest.useFakeTimers();
    runGate();
    window.dispatchEvent(new Event('load'));
    jest.advanceTimersByTime(1500);
    expect(html).not.toHaveAttribute('data-intro');
    jest.useRealTimers();
  });

  it('leaves the curtain alone once the app has claimed it', () => {
    jest.useFakeTimers();
    runGate();
    (window as { __opClaimed?: boolean }).__opClaimed = true;
    window.dispatchEvent(new Event('load'));
    jest.advanceTimersByTime(1500);
    expect(html).toHaveAttribute('data-intro', 'play');
    jest.useRealTimers();
  });
});
