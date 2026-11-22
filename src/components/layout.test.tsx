import { CONTACT_SUBJECT, EMAIL } from '@/content/site';
import { gmailWebUrl } from '@/lib/gmail';
import { render, screen } from '@testing-library/react';
import { Header } from './header/Header';
import { Footer } from './footer/Footer';

describe('Header', () => {
  it('has the logo, six section links, the toggles and the contact pill', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /^Sashank Deb/ })).toHaveAttribute('href', '#home');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav.querySelectorAll('.nav__link')).toHaveLength(6);
    expect(screen.getByRole('button', { name: 'Toggle dark mode' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Turn sound effects off' })).toBeInTheDocument();
    const pill = screen.getByRole('link', { name: 'Email Sashank' });
    expect(pill).toHaveClass('pill--nav');
    expect(pill).toHaveAttribute('href', gmailWebUrl(EMAIL, CONTACT_SUBJECT));
    expect(pill).toHaveAttribute('target', '_blank');
  });
});

describe('Footer', () => {
  it('shows the name, the flapboard with a text equivalent, socials and the year', () => {
    render(<Footer year={2026} />);
    expect(screen.getByText('Senior Software Engineer')).toHaveClass('sr-only');
    expect(document.querySelector('[data-flap]')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/sashank_deb/',
    );
    expect(document.querySelector('.footer__copy')).toHaveTextContent(
      '© 2026 Sashank Deb. All rights reserved.',
    );
    expect(document.getElementById('year')).toHaveTextContent('2026');
  });
});
