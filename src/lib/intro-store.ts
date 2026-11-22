type Listener = () => void;

export interface IntroStore {
  getSnapshot: () => boolean;
  subscribe: (listener: Listener) => () => void;
  setReplayAvailable: (available: boolean) => void;
  requestReplay: () => void;
  onReplay: (listener: Listener) => () => void;
}

/**
 * Tiny bridge between the name intro (top of the page) and its "Replay intro" button (footer),
 * so neither needs a shared client ancestor.
 */
export const createIntroStore = (): IntroStore => {
  let replayAvailable = false;
  const listeners = new Set<Listener>();
  const replayListeners = new Set<Listener>();

  return {
    getSnapshot: () => replayAvailable,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setReplayAvailable: (available) => {
      if (available === replayAvailable) return;
      replayAvailable = available;
      listeners.forEach((l) => l());
    },
    requestReplay: () => replayListeners.forEach((l) => l()),
    onReplay: (listener) => {
      replayListeners.add(listener);
      return () => {
        replayListeners.delete(listener);
      };
    },
  };
};

export const introStore = createIntroStore();
