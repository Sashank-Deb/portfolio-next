interface FitScaleInput {
  /** Element's left edge and width in viewport pixels, before scaling. */
  left: number;
  width: number;
  /** transform-origin x, in pixels from the element's left edge. */
  originX: number;
  viewport: number;
  /** Space to keep clear at each screen edge. */
  margin: number;
  max: number;
}

/**
 * The largest scale (up to `max`, never below 1) that keeps an element inside the viewport,
 * given where it scales from. Rounded down to two decimals.
 */
export const fitScale = ({
  left,
  width,
  originX,
  viewport,
  margin,
  max,
}: FitScaleInput): number => {
  const limits = [max];
  if (originX > 0) limits.push(1 + (left - margin) / originX);
  if (width - originX > 0) limits.push((viewport - margin - left - originX) / (width - originX));
  return Math.max(1, Math.floor(Math.min(...limits) * 100) / 100);
};
