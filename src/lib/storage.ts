type StorageKind = 'local' | 'session';

const area = (kind: StorageKind): Storage =>
  kind === 'local' ? window.localStorage : window.sessionStorage;

/** Read a value, treating blocked storage (private mode, sandboxed frames) as empty. */
export const readStorage = (kind: StorageKind, key: string): string | null => {
  try {
    return area(kind).getItem(key);
  } catch {
    return null;
  }
};

/** Write a value; a blocked storage area is silently ignored. */
export const writeStorage = (kind: StorageKind, key: string, value: string): void => {
  try {
    area(kind).setItem(key, value);
  } catch {
    // Storage unavailable: the preference simply won't persist.
  }
};
