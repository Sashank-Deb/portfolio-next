import { act, render, screen } from '@testing-library/react';
import { MockIntersectionObserver, setIntersecting } from '@/test/browser-mocks';
import { useInView } from './useInView';

function Probe({ once = false }: { once?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 }, once);
  return <div ref={ref} data-testid="probe">{inView ? 'in' : 'out'}</div>;
}

describe('useInView', () => {
  it('tracks visibility with the given observer options', () => {
    render(<Probe />);
    const el = screen.getByTestId('probe');
    expect(el).toHaveTextContent('out');
    expect(MockIntersectionObserver.instances[0]?.thresholds).toEqual([0.35]);
    act(() => setIntersecting(el, true));
    expect(el).toHaveTextContent('in');
    act(() => setIntersecting(el, false));
    expect(el).toHaveTextContent('out');
  });

  it('can latch on after the first time it is seen', () => {
    render(<Probe once />);
    const el = screen.getByTestId('probe');
    act(() => setIntersecting(el, true));
    act(() => setIntersecting(el, false));
    expect(el).toHaveTextContent('in');
  });

  it('disconnects on unmount', () => {
    const { unmount } = render(<Probe />);
    const io = MockIntersectionObserver.instances[0] as MockIntersectionObserver;
    unmount();
    expect(io.targets.size).toBe(0);
  });
});
