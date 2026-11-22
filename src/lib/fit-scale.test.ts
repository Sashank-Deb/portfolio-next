import { fitScale } from './fit-scale';

const base = { margin: 20, max: 1.5 };

describe('fitScale', () => {
  it('uses the full scale when there is room', () => {
    expect(fitScale({ ...base, left: 150, width: 260, originX: 130, viewport: 1440 })).toBe(1.5);
  });

  it('grows from the left edge only as far as the right margin allows', () => {
    // 292px pill at x=20 on a 390px phone: (390 - 20 - 20) / 292
    expect(fitScale({ ...base, left: 20, width: 292, originX: 0, viewport: 390 })).toBe(1.19);
  });

  it('limits a centred pill by the closer edge', () => {
    // centre origin: 100px spare on the left caps growth at 1 + 100 / 146
    expect(fitScale({ ...base, left: 120, width: 292, originX: 146, viewport: 2000, max: 3 })).toBe(
      1.68,
    );
  });

  it('never shrinks the pill', () => {
    expect(fitScale({ ...base, left: 20, width: 400, originX: 0, viewport: 390 })).toBe(1);
  });
});
