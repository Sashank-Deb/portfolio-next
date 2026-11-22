import { FLAP_CHARS, parseScreens, randomGlyph, screenChars, spinSteps, tileDelay } from './flap';

describe('split-flap helpers', () => {
  it('parses screens separated by ";" and rows by "|"', () => {
    expect(parseScreens('SENIOR|SOFTWARE|ENGINEER;ONE|PIXEL AT|A TIME')).toEqual([
      ['SENIOR', 'SOFTWARE', 'ENGINEER'],
      ['ONE', 'PIXEL AT', 'A TIME'],
    ]);
  });

  it('lays a screen out row by row, padded and clipped to the column count', () => {
    expect(screenChars(['ab', 'TOO LONG!'], 2, 4)).toEqual([
      'A',
      'B',
      ' ',
      ' ',
      'T',
      'O',
      'O',
      ' ',
    ]);
  });

  it('fills missing rows with blanks', () => {
    expect(screenChars(['HI'], 2, 2)).toEqual(['H', 'I', ' ', ' ']);
  });

  it('picks a random glyph that is neither the target nor the current face', () => {
    const rolls = [0, 0, 1 / FLAP_CHARS.length]; // " " (excluded) twice, then "A"
    const rng = () => rolls.shift() ?? 0;
    expect(randomGlyph(rng, [' '])).toBe('A');
  });

  it('spins 3 to 7 times before landing', () => {
    expect(spinSteps(() => 0)).toBe(3);
    expect(spinSteps(() => 0.999)).toBe(7);
  });

  it('staggers tiles left to right, then row by row', () => {
    expect(tileDelay(0, 0)).toBe(0);
    expect(tileDelay(0, 3)).toBe(165);
    expect(tileDelay(2, 1)).toBe(335);
  });
});
