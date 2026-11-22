export const loadMoreLabel = (open: boolean, hiddenCount: number): string =>
  open ? 'Show less' : `Load more (${hiddenCount})`;

/** The control only makes sense while some items are hidden at the current breakpoint. */
export const shouldHideLoadMore = (open: boolean, hiddenCount: number): boolean =>
  !open && hiddenCount === 0;
