export const FLAP_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,'!?&-";

export type Screen = string[];
export type Rng = () => number;

/** "A|B;C|D" → [["A","B"],["C","D"]]: screens split by ";" and rows by "|". */
export const parseScreens = (lines: string): Screen[] => lines.split(';').map((s) => s.split('|'));

/** One character per tile, row-major, upper-cased, each row padded/clipped to `cols`. */
export const screenChars = (screen: Screen, rows: number, cols: number): string[] => (
  Array.from({ length: rows * cols }, (_, k) => {
    const row = (screen[Math.floor(k / cols)] ?? '').padEnd(cols).slice(0, cols);
    return (row[k % cols] ?? ' ').toUpperCase();
  })
);

/** A random glyph for the in-between flips, never one of `exclude`. */
export const randomGlyph = (rng: Rng, exclude: readonly string[]): string => {
  for (;;) {
    const ch = FLAP_CHARS[Math.floor(rng() * FLAP_CHARS.length)] ?? ' ';
    if (!exclude.includes(ch)) return ch;
  }
};

/** How many random faces a tile shows before landing on its target (3–7). */
export const spinSteps = (rng: Rng): number => 3 + Math.floor(rng() * 5);

/** Tiles start left to right, row by row, so the board ripples rather than flips at once. */
export const tileDelay = (row: number, col: number): number => col * 55 + row * 140;

export const FLIP_MS = 84;
export const LAND_MS = 150;
export const FIRST_HOLD_MS = 5200;
export const HOLD_MS = 3400;
