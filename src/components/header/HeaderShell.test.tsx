import { act, render, screen } from '@testing-library/react';
import { HeaderShell } from './HeaderShell';
import { ScrollUp } from '../footer/ScrollUp';

const scrollTo = (y: number) => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
  window.dispatchEvent(new Event('scroll'));
};

describe('scroll-aware chrome', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 0; });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  });

  it('gives the header its scrolled style after 12px', () => {
    render(<HeaderShell><span>nav</span></HeaderShell>);
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('id', 'header');
    expect(header).toHaveClass('header');
    act(() => scrollTo(20));
    expect(header).toHaveClass('scroll-header');
  });

  it('shows the back-to-top button after 640px', () => {
    render(<ScrollUp />);
    const link = screen.getByRole('link', { name: 'Back to top' });
    expect(link).toHaveAttribute('href', '#home');
    expect(link).not.toHaveClass('show-scroll');
    act(() => scrollTo(700));
    expect(link).toHaveClass('scrollup', 'show-scroll');
  });
});
