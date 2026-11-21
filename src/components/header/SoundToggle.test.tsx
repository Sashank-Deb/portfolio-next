import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SoundToggle } from './SoundToggle';

describe('SoundToggle', () => {
  it('starts on and announces how to turn sound off', () => {
    render(<SoundToggle />);
    const btn = screen.getByRole('button', { name: 'Turn sound effects off' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(btn).toHaveAttribute('title', 'Sound on');
    expect(btn).toHaveAttribute('id', 'sound-button');
  });

  it('mutes, persists, and flips its label and icon state', async () => {
    render(<SoundToggle />);
    await userEvent.click(screen.getByRole('button', { name: 'Turn sound effects off' }));
    const btn = screen.getByRole('button', { name: 'Turn sound effects on' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    expect(btn).toHaveClass('is-muted');
    expect(btn).toHaveAttribute('title', 'Sound off');
    expect(localStorage.getItem('site-sound')).toBe('off');
    await userEvent.click(btn);
    expect(localStorage.getItem('site-sound')).toBe('on');
  });
});
