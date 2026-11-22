import { applyRevealStagger, revealDelay } from './reveal';

describe('reveal stagger', () => {
  it('has no delay for the first item, then 80ms steps capped at 6', () => {
    expect(revealDelay(0)).toBeUndefined();
    expect(revealDelay(1)).toBe('0.08s');
    expect(revealDelay(3)).toBe('0.24s');
    expect(revealDelay(9)).toBe('0.48s');
  });

  it('sets --d from the position among revealing siblings only', () => {
    document.body.innerHTML = `
      <div id="p">
        <div data-reveal id="a"></div>
        <span></span>
        <div data-reveal id="b"></div>
        <div data-reveal id="c"></div>
      </div>`;
    applyRevealStagger(document.querySelectorAll('[data-reveal]'));
    const d = (id: string) =>
      (document.getElementById(id) as HTMLElement).style.getPropertyValue('--d');
    expect(d('a')).toBe('');
    expect(d('b')).toBe('0.08s');
    expect(d('c')).toBe('0.16s');
  });
});
