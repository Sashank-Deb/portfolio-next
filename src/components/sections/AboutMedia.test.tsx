import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { setMediaQuery } from '@/test/browser-mocks';
import { AboutMedia } from './AboutMedia';

const wrapper = () => document.getElementById('about-media-wrapper') as HTMLElement;
const video = () => document.getElementById('about-video') as HTMLVideoElement;

describe('AboutMedia', () => {
  it('shows the photo with a play hint and a lazy video', () => {
    render(<AboutMedia />);
    expect(screen.getByRole('img', { name: 'Sashank Deb' })).toHaveClass('about__img');
    expect(wrapper()).toHaveAttribute('title', 'Click to play');
    expect(video()).toHaveAttribute('preload', 'none');
    expect(screen.getByText('Play')).toBeInTheDocument();
  });

  it('plays on click and resets on the second click', () => {
    render(<AboutMedia />);
    fireEvent.click(wrapper());
    expect(wrapper()).toHaveClass('about__img-wrapper', 'is-playing');
    expect(video().play).toHaveBeenCalled();
    video().currentTime = 3;
    fireEvent.click(wrapper());
    expect(wrapper()).not.toHaveClass('is-playing');
    expect(video().pause).toHaveBeenCalled();
    expect(video().currentTime).toBe(0);
  });

  it('stops when the clip ends or cannot play', async () => {
    render(<AboutMedia />);
    fireEvent.click(wrapper());
    fireEvent.ended(video());
    expect(wrapper()).not.toHaveClass('is-playing');

    (HTMLMediaElement.prototype.play as jest.Mock).mockReturnValueOnce(
      Promise.reject(new Error('blocked')),
    );
    fireEvent.click(wrapper());
    await waitFor(() => expect(wrapper()).not.toHaveClass('is-playing'));
  });

  it('tilts towards the cursor on hover devices and settles on leave', () => {
    setMediaQuery('(hover: hover)', true);
    render(<AboutMedia />);
    jest.spyOn(wrapper(), 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    } as DOMRect);
    fireEvent.mouseMove(wrapper(), { clientX: 100, clientY: 0 });
    expect(wrapper().style.transform).toBe('perspective(900px) rotateX(6.00deg) rotateY(6.00deg)');
    expect(wrapper().style.cursor).toContain('meme-pop-cat');
    fireEvent.mouseLeave(wrapper());
    expect(wrapper().style.transform).toBe('');
  });
});
