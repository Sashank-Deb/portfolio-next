import { cx } from './cx';

it('joins truthy class names', () => {
  expect(cx('a', false, 'b', null, undefined, '')).toBe('a b');
});
