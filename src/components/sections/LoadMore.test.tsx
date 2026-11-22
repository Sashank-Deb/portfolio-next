import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoadMore } from './LoadMore';

const css = '.cert-grid:not(.is-expanded) .cert:nth-child(n+4) { display: none; }';

const renderGrid = (count: number) =>
  render(
    <>
      <style>{css}</style>
      <section id="certifications" />
      <LoadMore
        id="cert-grid"
        className="cert-grid"
        itemSelector=".cert"
        scrollTargetId="certifications"
      >
        {Array.from({ length: count }, (_, i) => (
          <a key={i} className="cert" href={`#c${i}`}>{`Cert ${i}`}</a>
        ))}
      </LoadMore>
    </>,
  );

describe('LoadMore', () => {
  it('counts the items CSS hides at this breakpoint', () => {
    renderGrid(7);
    const btn = screen.getByRole('button', { name: 'Load more (4)' });
    expect(btn).toHaveAttribute('aria-controls', 'cert-grid');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('reveals the rest with a cascade, then collapses and scrolls back', async () => {
    renderGrid(7);
    await userEvent.click(screen.getByRole('button', { name: 'Load more (4)' }));
    const grid = document.getElementById('cert-grid') as HTMLElement;
    expect(grid).toHaveClass('cert-grid', 'is-expanded');
    const revealed = grid.querySelectorAll('.is-revealed');
    expect(revealed).toHaveLength(4);
    expect((revealed[1] as HTMLElement).style.getPropertyValue('--wd')).toBe('0.07s');
    expect(revealed[0]).toHaveClass('is-in');

    const less = screen.getByRole('button', { name: 'Show less' });
    expect(less).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(less);
    expect(grid).not.toHaveClass('is-expanded');
    expect(grid.querySelectorAll('.is-revealed')).toHaveLength(0);
    expect(document.getElementById('certifications')?.scrollIntoView).toHaveBeenCalled();
  });

  it('hides itself when everything already fits', () => {
    renderGrid(3);
    expect(document.querySelector('.more-wrap')).not.toBeVisible();
  });
});
