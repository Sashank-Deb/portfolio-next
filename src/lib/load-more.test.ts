import { loadMoreLabel, shouldHideLoadMore } from './load-more';

describe('load more', () => {
  it('counts what is still hidden', () => {
    expect(loadMoreLabel(false, 3)).toBe('Load more (3)');
  });

  it('offers to collapse once open', () => {
    expect(loadMoreLabel(true, 0)).toBe('Show less');
  });

  it('hides the control when nothing is hidden at this breakpoint', () => {
    expect(shouldHideLoadMore(false, 0)).toBe(true);
    expect(shouldHideLoadMore(false, 2)).toBe(false);
    expect(shouldHideLoadMore(true, 0)).toBe(false);
  });
});
