import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setIntersecting } from '@/test/browser-mocks';
import { RECOMMENDATIONS } from '@/content/recommendations';
import { RecCard } from './RecCard';

const rec = RECOMMENDATIONS[0]!;

const withTextHeight = (height: number) => {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList.contains('rec__text') ? height : 0;
    },
  });
};

const renderCard = () =>
  render(
    <>
      <style>{'.rec__text { line-height: 20px; }'}</style>
      <RecCard rec={rec} revealIndex={2} />
    </>,
  );

describe('RecCard', () => {
  it('shows who wrote it and links to LinkedIn', () => {
    withTextHeight(400);
    renderCard();
    expect(screen.getByRole('heading', { name: rec.name })).toHaveClass('rec__name');
    expect(screen.getByRole('img', { name: rec.name })).toHaveClass('rec__avatar');
    expect(screen.getByText(rec.role)).toHaveAttribute('title', rec.role);
    expect(screen.getByText(rec.relation)).toHaveClass('rec__rel');
    expect(screen.getByRole('link', { name: /Read on LinkedIn/ })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(screen.getByRole('article').style.getPropertyValue('--d')).toBe('0.16s');
  });

  it('expands long recommendations to their full height and back', async () => {
    withTextHeight(400);
    renderCard();
    const article = screen.getByRole('article');
    expect(article).not.toHaveClass('is-short');
    await userEvent.click(screen.getByRole('button', { name: 'Show more' }));
    expect(article).toHaveClass('is-open');
    expect((article.querySelector('.rec__text') as HTMLElement).style.maxHeight).toBe('400px');
    const less = screen.getByRole('button', { name: 'Show less' });
    expect(less).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(less);
    expect(article).not.toHaveClass('is-open');
    expect((article.querySelector('.rec__text') as HTMLElement).style.maxHeight).toBe('');
  });

  it('marks short recommendations so the toggle is hidden', () => {
    withTextHeight(110);
    renderCard();
    expect(screen.getByRole('article')).toHaveClass('rec', 'is-short');
  });

  it('reveals itself on scroll', () => {
    withTextHeight(400);
    renderCard();
    const article = screen.getByRole('article');
    act(() => setIntersecting(article, true));
    expect(article).toHaveClass('is-in');
  });
});
