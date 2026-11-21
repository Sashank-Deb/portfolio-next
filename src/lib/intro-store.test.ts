import { createIntroStore } from './intro-store';

describe('intro store', () => {
  it('starts with the replay button hidden', () => {
    expect(createIntroStore().getSnapshot()).toBe(false);
  });

  it('notifies subscribers when the replay button becomes available', () => {
    const store = createIntroStore();
    const listener = jest.fn();
    store.subscribe(listener);
    store.setReplayAvailable(true);
    expect(store.getSnapshot()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    store.setReplayAvailable(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('relays replay requests to the intro', () => {
    const store = createIntroStore();
    const onReplay = jest.fn();
    const off = store.onReplay(onReplay);
    store.requestReplay();
    expect(onReplay).toHaveBeenCalledTimes(1);
    off();
    store.requestReplay();
    expect(onReplay).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes listeners', () => {
    const store = createIntroStore();
    const listener = jest.fn();
    store.subscribe(listener)();
    store.setReplayAvailable(true);
    expect(listener).not.toHaveBeenCalled();
  });
});
