import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setIntersecting } from '@/test/browser-mocks';
import { NavProvider } from './NavProvider';
import { NavMenu } from './NavMenu';
import { NavToggle } from './NavToggle';
import { NavClose } from './NavClose';
import { NavLink } from './NavLink';

function Harness() {
  return (
    <>
      <NavProvider>
        <NavMenu>
          <ul>
            <li><NavLink id="about" icon="uil-user" label="About" /></li>
            <li><NavLink id="skills" icon="uil-file-alt" label="Skills" /></li>
          </ul>
          <NavClose />
        </NavMenu>
        <NavToggle />
      </NavProvider>
      <p>Outside</p>
      <section id="about">a</section>
      <section id="skills">s</section>
      <section id="earlier">e</section>
    </>
  );
}

const menu = () => document.getElementById('nav-menu') as HTMLElement;

describe('mobile navigation', () => {
  it('opens and closes from the app-bar toggle', async () => {
    render(<Harness />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-controls', 'nav-menu');
    await userEvent.click(toggle);
    expect(menu()).toHaveClass('nav__menu', 'show-menu');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName('Close menu');
    await userEvent.click(toggle);
    expect(menu()).not.toHaveClass('show-menu');
  });

  it('closes from the close button, Escape, outside clicks and link clicks', async () => {
    render(<Harness />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });

    await userEvent.click(toggle);
    await userEvent.click(document.getElementById('nav-close') as HTMLElement);
    expect(menu()).not.toHaveClass('show-menu');

    await userEvent.click(toggle);
    await userEvent.keyboard('{Escape}');
    expect(menu()).not.toHaveClass('show-menu');

    await userEvent.click(toggle);
    await userEvent.click(screen.getByText('Outside'));
    expect(menu()).not.toHaveClass('show-menu');

    await userEvent.click(toggle);
    await userEvent.click(screen.getByRole('link', { name: 'About' }));
    expect(menu()).not.toHaveClass('show-menu');
  });

  it('keeps the menu open when clicking inside it', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await userEvent.click(screen.getByRole('list'));
    expect(menu()).toHaveClass('show-menu');
  });
});

describe('active nav link', () => {
  it('highlights the link for the section in the middle of the viewport', () => {
    render(<Harness />);
    const about = screen.getByRole('link', { name: 'About' });
    expect(about).toHaveAttribute('href', '#about');
    expect(about).toHaveClass('nav__link');
    act(() => setIntersecting(document.getElementById('skills') as Element));
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveClass('active-link');
    expect(about).not.toHaveClass('active-link');
  });

  it('clears the highlight over sections without a link', () => {
    render(<Harness />);
    act(() => setIntersecting(document.getElementById('about') as Element));
    act(() => setIntersecting(document.getElementById('earlier') as Element));
    expect(document.querySelector('.active-link')).toBeNull();
  });
});
