import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { introStore } from '@/lib/intro-store';
import { ReplayIntroButton } from './ReplayIntroButton';

describe('ReplayIntroButton', () => {
  beforeEach(() => introStore.setReplayAvailable(false));

  it('stays hidden until the intro has finished or was skipped', () => {
    render(<ReplayIntroButton />);
    expect(screen.getByRole('button', { hidden: true })).not.toBeVisible();
    act(() => introStore.setReplayAvailable(true));
    expect(screen.getByRole('button', { name: 'Replay intro' })).toHaveClass('footer__replay');
  });

  it('asks the intro to replay', async () => {
    const onReplay = jest.fn();
    const off = introStore.onReplay(onReplay);
    introStore.setReplayAvailable(true);
    render(<ReplayIntroButton />);
    await userEvent.click(screen.getByRole('button', { name: 'Replay intro' }));
    expect(onReplay).toHaveBeenCalled();
    off();
  });
});
