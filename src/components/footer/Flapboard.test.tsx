import { act, render } from '@testing-library/react';
import { setIntersecting, setMediaQuery } from '@/test/browser-mocks';
import { Flapboard } from './Flapboard';

const mockPlay = jest.fn();
jest.mock('@/lib/sound', () => ({
  ...jest.requireActual('@/lib/sound'),
  getSiteSound: () => ({ play: mockPlay }),
}));

const LINES = 'HI|YOU;GO|ON';
const faces = (board: Element) =>
  Array.from(board.querySelectorAll('.flap'))
    .map((tile) => tile.querySelector('.flap__half--bottom:not(.flap__leaf) span')?.textContent)
    .join('');

describe('Flapboard', () => {
  it('builds a hidden grid of blank tiles, four halves each', () => {
    const { container } = render(<Flapboard lines={LINES} cols={3} />);
    const board = container.querySelector('.flapboard') as HTMLElement;
    expect(board).toHaveAttribute('aria-hidden', 'true');
    expect(board).toHaveClass('flapboard--footer');
    expect(board.style.getPropertyValue('--cols')).toBe('3');
    expect(board.querySelectorAll('.flap')).toHaveLength(6);
    expect(board.querySelectorAll('.flap__half')).toHaveLength(24);
    expect(faces(board)).toBe(' '.repeat(6));
  });

  it('shows the first screen at once with reduced motion, once visible', async () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    const { container } = render(<Flapboard lines={LINES} cols={3} />);
    const board = container.querySelector('.flapboard') as HTMLElement;
    await act(async () => {
      setIntersecting(board, true);
      await new Promise((r) => {
        setTimeout(r, 300);
      });
    });
    expect(faces(board)).toBe('HI YOU');
  });

  it('flips every tile to the first screen with a clatter when it scrolls into view', async () => {
    jest.useFakeTimers();
    const { container } = render(<Flapboard lines={LINES} cols={3} />);
    const board = container.querySelector('.flapboard') as HTMLElement;
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000);
    });
    expect(mockPlay).not.toHaveBeenCalled();
    act(() => setIntersecting(board, true));
    await act(async () => {
      await jest.advanceTimersByTimeAsync(3000);
    });
    expect(faces(board)).toBe('HI YOU');
    expect(mockPlay).toHaveBeenCalledWith('flap');
    jest.useRealTimers();
  });
});
