import { render, screen, within } from '@testing-library/react';
import { About } from './About';
import { Certifications } from './Certifications';
import { Contact } from './Contact';
import { EarlierWork } from './EarlierWork';
import { Experience } from './Experience';
import { Hero } from './Hero';
import { Projects } from './Projects';
import { Recommendations } from './Recommendations';
import { Skills } from './Skills';
import { Writing } from './Writing';

const section = (id: string) => document.getElementById(id) as HTMLElement;

describe('Hero', () => {
  it('introduces Sashank with the CTAs, socials, portrait and stats', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm Sashank.");
    expect(section('home').querySelector('.eyebrow')?.textContent).toBe(
      'Senior Software Engineer \u00a0/\u00a0 Bengaluru, India',
    );
    expect(screen.getByRole('link', { name: /See my work/ })).toHaveAttribute('href', '#projects');
    expect(screen.getByRole('link', { name: /Download CV/ })).toHaveAttribute(
      'download',
      'Sashank_Deb_Resume.pdf',
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/Sashank-Deb',
    );
    expect(screen.getByRole('img', { name: 'Sashank Deb' })).toBeInTheDocument();
    expect(screen.getByText('5+ years shipping')).toBeInTheDocument();
    expect(section('home').querySelectorAll('.stat')).toHaveLength(3);
  });
});

describe('About', () => {
  it('has the bio, the facts and a CV download', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /A little about me/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'react-liquid-fill' })).toHaveAttribute(
      'href',
      'https://react-liquid-fill.com/',
    );
    expect(screen.getByText('Years of experience')).toHaveClass('about__info-name');
    expect(screen.getByRole('link', { name: /Download CV/ })).toHaveClass('button', 'cv-btn');
  });
});

describe('Experience', () => {
  it('lists the three roles under Work, with education and achievements in other tabs', () => {
    render(<Experience />);
    const work = screen.getByRole('tabpanel');
    expect(within(work).getAllByRole('article')).toHaveLength(3);
    expect(
      within(work).getByRole('heading', { name: 'Senior Software Engineer' }),
    ).toBeInTheDocument();
    expect(within(work).getByText('useUndoRedo').tagName).toBe('CODE');
    expect(
      screen.getByRole('link', { name: /Machine Learning with Python, IBM/, hidden: true }),
    ).toHaveAttribute('target', '_blank');
    expect(screen.getByText("Winner, HackRx'21")).toBeInTheDocument();
  });
});

describe('Projects', () => {
  it('shows the four featured projects', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { name: /Things I've built recently/ })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });
});

describe('Certifications', () => {
  it('links every certificate to its HackerRank page and counts them', () => {
    render(<Certifications />);
    expect(screen.getByRole('link', { name: /7 certificates on HackerRank/ })).toHaveAttribute(
      'href',
      'https://www.hackerrank.com/profile/sashankdebrgu7',
    );
    const certs = section('cert-grid').querySelectorAll('a.cert');
    expect(certs).toHaveLength(7);
    expect(certs[0]).toHaveClass('cert--role');
    expect(certs[0]).toHaveAttribute(
      'href',
      'https://www.hackerrank.com/certificates/384980329822',
    );
    expect(within(certs[1] as HTMLElement).getByText('SKILL')).toHaveClass('cert__tag');
  });
});

describe('Skills', () => {
  it('groups the stack into five cards, the last one wide', () => {
    render(<Skills />);
    const cards = section('skills').querySelectorAll('.skill-card');
    expect(cards).toHaveLength(5);
    expect(cards[4]).toHaveClass('skill-card--wide');
    expect(screen.getByRole('heading', { name: 'Frameworks & libraries' })).toBeInTheDocument();
  });
});

describe('EarlierWork', () => {
  it('lists the archive projects with a load-more control', () => {
    render(<EarlierWork />);
    expect(section('work-grid').querySelectorAll('a.work')).toHaveLength(7);
    expect(screen.getByRole('button', { name: /Load more/, hidden: true })).toHaveAttribute(
      'aria-controls',
      'work-grid',
    );
  });
});

describe('Writing', () => {
  it('features one post, lists four more and links to the blog', () => {
    render(<Writing />);
    expect(screen.getByRole('link', { name: /5 posts on Hashnode/ })).toHaveAttribute(
      'href',
      'https://sashankdeb.hashnode.dev/',
    );
    expect(screen.getByRole('link', { name: /React-Liquid-Fill/ })).toHaveClass('post-feature');
    expect(section('writing').querySelectorAll('.post-grid .post')).toHaveLength(4);
    expect(
      screen.getByRole('heading', { name: 'What makes React a library?' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Read everything on Binary Trek/ })).toHaveClass(
      'blog-banner',
    );
  });
});

describe('Recommendations', () => {
  it('leads with a pull quote and shows all six recommendations', () => {
    render(<Recommendations />);
    expect(screen.getByText('Strongest possible recommendation.').tagName).toBe('MARK');
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect(screen.getAllByRole('article')[5]).toHaveTextContent('Ayonija Mathur');
  });
});

describe('Contact', () => {
  it('offers email, LinkedIn, copy and phone', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'We may work well together.',
    );
    const pill = screen.getByRole('link', { name: 'Email Sashank' });
    expect(pill).toHaveAttribute(
      'href',
      'mailto:sashankdebrgu7@gmail.com?subject=Let%27s%20work%20together',
    );
    expect(pill).toHaveClass('pill--lg');
    expect(screen.getByRole('link', { name: 'Or reach me on LinkedIn' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+91 73974 41915' })).toHaveAttribute(
      'href',
      'tel:+917397441915',
    );
    expect(screen.getByRole('button', { name: /sashankdebrgu7@gmail.com/ })).toBeInTheDocument();
  });
});
