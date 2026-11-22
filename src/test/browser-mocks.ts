/**
 * Deterministic stand-ins for browser APIs that jsdom does not implement
 * (IntersectionObserver, matchMedia, Web Animations, clipboard).
 * Tests drive them through the helpers exported below.
 */

type IOCallback = IntersectionObserverCallback;

export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root = null;

  readonly rootMargin: string;

  readonly thresholds: readonly number[];

  readonly scrollMargin = '0px';

  readonly targets = new Set<Element>();

  constructor(
    private readonly callback: IOCallback,
    options: IntersectionObserverInit = {},
  ) {
    this.rootMargin = options.rootMargin ?? '0px';
    const { threshold } = options;
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold ?? 0];
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.targets.add(target);
  }

  unobserve(target: Element) {
    this.targets.delete(target);
  }

  disconnect() {
    this.targets.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Fire the observer callback for one of its targets. */
  emit(target: Element, isIntersecting: boolean) {
    if (!this.targets.has(target)) return;
    const rect = target.getBoundingClientRect();
    const entry = {
      target,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: rect,
      intersectionRect: rect,
      rootBounds: null,
      time: 0,
    } as IntersectionObserverEntry;
    this.callback([entry], this);
  }
}

/** Mark an element as entering (or leaving) the viewport for every observer watching it. */
export const setIntersecting = (target: Element, isIntersecting = true) => {
  MockIntersectionObserver.instances.forEach((io) => io.emit(target, isIntersecting));
};

const mediaState = new Map<string, boolean>();
const mediaLists = new Map<string, Set<MediaQueryList & { emit: () => void }>>();

/** Flip a media query on or off; listeners on matching MediaQueryLists are notified. */
export const setMediaQuery = (query: string, matches: boolean) => {
  mediaState.set(query, matches);
  mediaLists.get(query)?.forEach((mql) => mql.emit());
};

const createMediaQueryList = (query: string) => {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    media: query,
    get matches() {
      return mediaState.get(query) ?? false;
    },
    onchange: null,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
    addListener: (cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeListener: (cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
    dispatchEvent: () => true,
    emit() {
      const event = { matches: mql.matches, media: query } as MediaQueryListEvent;
      listeners.forEach((cb) => cb(event));
    },
  };
  const set = mediaLists.get(query) ?? new Set();
  set.add(mql as unknown as MediaQueryList & { emit: () => void });
  mediaLists.set(query, set);
  return mql as unknown as MediaQueryList;
};

export const mockAnimate = jest.fn(
  (): Animation =>
    ({
      finished: Promise.resolve(),
      cancel: jest.fn(),
      onfinish: null,
    }) as unknown as Animation,
);

export const installBrowserMocks = () => {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(window, 'matchMedia', { writable: true, value: createMediaQueryList });
  Element.prototype.animate = mockAnimate as unknown as Element['animate'];
  Element.prototype.getAnimations = () => [];
  Element.prototype.scrollIntoView = jest.fn();
  window.scrollTo = jest.fn() as unknown as typeof window.scrollTo;
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();

  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    mediaState.clear();
    mediaLists.clear();
    localStorage.clear();
    sessionStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-intro');
  });
};
