import { readStorage, writeStorage } from './storage';

describe('storage', () => {
  it('reads and writes localStorage and sessionStorage', () => {
    writeStorage('local', 'a', '1');
    writeStorage('session', 'b', '2');
    expect(readStorage('local', 'a')).toBe('1');
    expect(readStorage('session', 'b')).toBe('2');
    expect(localStorage.getItem('a')).toBe('1');
    expect(sessionStorage.getItem('b')).toBe('2');
  });

  it('returns null for missing keys', () => {
    expect(readStorage('local', 'missing')).toBeNull();
  });

  it('never throws when storage is blocked (private mode, sandboxed iframes)', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied'); });
    expect(readStorage('local', 'a')).toBeNull();
    expect(() => writeStorage('session', 'a', '1')).not.toThrow();
  });
});
