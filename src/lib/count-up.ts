/** Starts fast and settles gently, so the last few numbers tick over slowly. */
export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/** The whole number to show `elapsed` ms into a count from 0 to `target` lasting `duration` ms. */
export const countAt = (elapsed: number, duration: number, target: number): number => {
  const progress = Math.min(Math.max(elapsed / duration, 0), 1);
  return Math.round(easeOutCubic(progress) * target);
};
