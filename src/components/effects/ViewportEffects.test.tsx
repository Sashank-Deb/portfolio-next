import { act, render } from '@testing-library/react';
import { setIntersecting } from '@/test/browser-mocks';
import { ViewportEffects } from './ViewportEffects';

const Page = () => (
  <>
    <div>
      <p data-reveal id="a">a</p>
      <p data-reveal id="b">b</p>
      <p data-reveal="self" id="self">managed</p>
    </div>
    <div className="portrait" id="portrait" />
    <ViewportEffects />
  </>
);

const $ = (id: string) => document.getElementById(id) as HTMLElement;

describe('ViewportEffects', () => {
  it('reveals server-rendered [data-reveal] blocks once, with a stagger', () => {
    render(<Page />);
    expect($('b').style.getPropertyValue('--d')).toBe('0.08s');
    act(() => setIntersecting($('b'), true));
    expect($('b')).toHaveClass('is-in');
    act(() => setIntersecting($('b'), false));
    expect($('b')).toHaveClass('is-in');
    expect($('a')).not.toHaveClass('is-in');
  });

  it('leaves blocks owned by client components alone', () => {
    render(<Page />);
    act(() => setIntersecting($('self'), true));
    expect($('self')).not.toHaveClass('is-in');
  });

  it('pauses looping decorations while they are off screen', () => {
    render(<Page />);
    act(() => setIntersecting($('portrait'), false));
    expect($('portrait')).toHaveClass('is-offscreen');
    act(() => setIntersecting($('portrait'), true));
    expect($('portrait')).not.toHaveClass('is-offscreen');
  });
});
