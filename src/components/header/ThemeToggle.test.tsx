import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders both icons so CSS can swap them before hydration', () => {
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('.theme-icon--moon')).toBeInTheDocument();
    expect(container.querySelector('.theme-icon--sun')).toBeInTheDocument();
  });

  it('toggles the dark theme on <html> and remembers it', async () => {
    document.documentElement.classList.add('dark-theme');
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle dark mode' }));
    expect(document.documentElement).not.toHaveClass('dark-theme');
    expect(localStorage.getItem('selected-theme')).toBe('light');
  });
});
