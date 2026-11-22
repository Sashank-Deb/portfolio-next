import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClickSounds } from './ClickSounds';

const mockPlay = jest.fn();
jest.mock('@/lib/sound', () => ({
  ...jest.requireActual('@/lib/sound'),
  getSiteSound: () => ({ play: mockPlay }),
}));

describe('ClickSounds', () => {
  it('plays a tick for links and a soft thock for toggles', async () => {
    render(
      <>
        <ClickSounds />
        <a className="button" href="#x">
          Go
        </a>
        <button className="tabs__btn" type="button">
          Tab
        </button>
        <p>Plain</p>
      </>,
    );
    await userEvent.click(screen.getByText('Go'));
    expect(mockPlay).toHaveBeenLastCalledWith('tick');
    await userEvent.click(screen.getByText('Tab'));
    expect(mockPlay).toHaveBeenLastCalledWith('soft');
    mockPlay.mockClear();
    await userEvent.click(screen.getByText('Plain'));
    expect(mockPlay).not.toHaveBeenCalled();
  });
});
