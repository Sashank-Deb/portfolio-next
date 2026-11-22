import { act, fireEvent, render, screen } from '@testing-library/react';
import { setIntersecting, setMediaQuery } from '@/test/browser-mocks';
import { PROJECTS } from '@/content/projects';
import { FeatureCards } from './FeatureCards';

const WIDE = '(min-width: 901px)';
const card = (name: string) => screen.getByRole('article', { name });
const feat = () => document.getElementById('feat') as HTMLElement;

describe('FeatureCards (expanding project cards)', () => {
  beforeEach(() => setMediaQuery(WIDE, true));

  it('renders every project with its link, image and chips; the first is open', () => {
    render(<FeatureCards projects={PROJECTS} revealIndex={1} />);
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(card('react-liquid-fill')).toHaveClass('feat__card', 'is-active');
    expect(card('noodl')).not.toHaveClass('is-active');
    expect(screen.getByRole('img', { name: 'noodl website' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Visit site/ })[2]).toHaveAttribute(
      'href',
      'https://purrcast.vercel.app/',
    );
    expect(feat()).toHaveAttribute('data-reveal', 'self');
    expect(feat().style.getPropertyValue('--d')).toBe('0.08s');
  });

  it('opens a card on click and after a short hover', () => {
    jest.useFakeTimers();
    render(<FeatureCards projects={PROJECTS} />);
    fireEvent.click(card('CreditQ'));
    expect(card('CreditQ')).toHaveClass('is-active');
    expect(card('react-liquid-fill')).not.toHaveClass('is-active');
    fireEvent.mouseEnter(card('noodl'));
    act(() => {
      jest.advanceTimersByTime(119);
    });
    expect(card('noodl')).not.toHaveClass('is-active');
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(card('noodl')).toHaveClass('is-active');
    fireEvent.mouseEnter(card('PurrCast'));
    fireEvent.mouseLeave(card('PurrCast'));
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(card('PurrCast')).not.toHaveClass('is-active');
    jest.useRealTimers();
  });

  it('supports Enter and the arrow keys', () => {
    render(<FeatureCards projects={PROJECTS} />);
    fireEvent.keyDown(card('noodl'), { key: 'Enter' });
    expect(card('noodl')).toHaveClass('is-active');
    fireEvent.keyDown(card('noodl'), { key: 'ArrowRight' });
    expect(card('PurrCast')).toHaveClass('is-active');
    expect(card('PurrCast')).toHaveFocus();
    fireEvent.keyDown(card('react-liquid-fill'), { key: 'ArrowLeft' });
    expect(card('CreditQ')).toHaveClass('is-active');
  });

  it('advances to the next card when the progress bar completes, wrapping at the end', () => {
    const { container } = render(<FeatureCards projects={PROJECTS} />);
    const fills = () => container.querySelectorAll('.feat__fill');
    fireEvent.animationEnd(fills()[0] as Element);
    expect(card('noodl')).toHaveClass('is-active');
    fireEvent.click(card('CreditQ'));
    fireEvent.animationEnd(fills()[3] as Element);
    expect(card('react-liquid-fill')).toHaveClass('is-active');
  });

  it('only the open card keeps its links in the tab order on wide screens', () => {
    render(<FeatureCards projects={PROJECTS} />);
    const visits = screen.getAllByRole('link', { name: /Visit site/ });
    expect(visits[0]).toHaveAttribute('tabindex', '0');
    expect(visits[1]).toHaveAttribute('tabindex', '-1');
  });

  it('is a plain stacked list on narrow screens', () => {
    setMediaQuery(WIDE, false);
    render(<FeatureCards projects={PROJECTS} />);
    fireEvent.click(card('noodl'));
    expect(card('noodl')).not.toHaveClass('is-active');
    expect(screen.getAllByRole('link', { name: /Visit site/ })[1]).toHaveAttribute('tabindex', '0');
  });

  it('plays only while on screen, pauses while hovered or focused, and reveals itself', () => {
    render(<FeatureCards projects={PROJECTS} />);
    act(() => setIntersecting(feat(), true));
    expect(feat()).toHaveClass('feat', 'is-playing', 'is-in');
    fireEvent.mouseEnter(feat());
    expect(feat()).toHaveClass('is-paused');
    fireEvent.mouseLeave(feat());
    expect(feat()).not.toHaveClass('is-paused');
    fireEvent.focus(card('noodl'));
    expect(feat()).toHaveClass('is-paused');
    fireEvent.blur(card('noodl'));
    expect(feat()).not.toHaveClass('is-paused');
    act(() => setIntersecting(feat(), false));
    expect(feat()).not.toHaveClass('is-playing');
    expect(feat()).toHaveClass('is-offscreen', 'is-in');
  });

  it('does not autoplay with reduced motion', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    render(<FeatureCards projects={PROJECTS} />);
    act(() => setIntersecting(feat(), true));
    expect(feat()).not.toHaveClass('is-playing');
  });
});
