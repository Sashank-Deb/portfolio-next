import { act, fireEvent, render, screen } from '@testing-library/react';
import { CopyEmail } from './CopyEmail';

const mockClipboard = (writeText: jest.Mock) => {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
};

describe('CopyEmail', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('copies the address and confirms briefly', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(<CopyEmail email="sashankdebrgu7@gmail.com" />);
    const btn = screen.getByRole('button', { name: /sashankdebrgu7@gmail.com/ });
    expect(btn).toHaveAttribute('id', 'copy-email');
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(writeText).toHaveBeenCalledWith('sashankdebrgu7@gmail.com');
    expect(screen.getByText('Copied')).toHaveClass('cta__copied');
    act(() => {
      jest.advanceTimersByTime(1800);
    });
    expect(screen.queryByText('Copied')).not.toBeInTheDocument();
  });

  it('falls back to opening the mail app when the clipboard is blocked', async () => {
    mockClipboard(jest.fn().mockRejectedValue(new Error('denied')));
    render(<CopyEmail email="sashankdebrgu7@gmail.com" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(screen.queryByText('Copied')).not.toBeInTheDocument();
  });
});
