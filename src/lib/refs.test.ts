import { createRef } from 'react';
import { mergeRefs } from './refs';

describe('mergeRefs', () => {
  it('assigns object refs and calls callback refs', () => {
    const obj = createRef<string>();
    const cb = jest.fn();
    mergeRefs(obj, cb, undefined)('node');
    expect(obj.current).toBe('node');
    expect(cb).toHaveBeenCalledWith('node');
  });
});
