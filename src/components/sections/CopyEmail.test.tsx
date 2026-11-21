import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyEmail } from './CopyEmail';

describe('CopyEmail', () => {
  it('copies the address and confirms briefly', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const writeText = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    render(<CopyEmail email="sashankdebrgu7@gmail.com" />);
    const btn = screen.getByRole('button', { name: /sashankdebrgu7@gmail.com/ });
    expect(btn).toHaveAttribute('id', 'copy-email');
    await user.click(btn);
    expect(writeText).toHaveBeenCalledWith('sashankdebrgu7@gmail.com');
    expect(screen.getByText('Copied')).toHaveClass('cta__copied');
    act(() => { jest.advanceTimersByTime(1800); });
    expect(screen.queryByText('Copied')).not.toBeInTheDocument();
    jest.useRealTimers();
  });
});
