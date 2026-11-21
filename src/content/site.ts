export const EMAIL = 'sashankdebrgu7@gmail.com';
export const PHONE = { href: 'tel:+917397441915', label: '+91 73974 41915' } as const;
export const LOCATION = 'Bengaluru, India';
export const RESUME = { href: '/assets/pdf/Sashank_Deb_Resume.pdf', filename: 'Sashank_Deb_Resume.pdf' } as const;
export const HEADSHOT = { src: '/assets/img/headshot.webp', width: 1172, height: 1395 } as const;

export const mailto = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject).replace(/'/g, '%27')}`;

export interface Social { label: string; href: string; icon: string }

export const SOCIALS = {
  linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sashank-deb/', icon: 'uil-linkedin' },
  github: { label: 'GitHub', href: 'https://github.com/Sashank-Deb', icon: 'uil-github' },
  behance: { label: 'Behance', href: 'https://www.behance.net/sashankdeb1', icon: 'uil-behance' },
  instagram: { label: 'Instagram', href: 'https://www.instagram.com/sashank_deb/', icon: 'uil-instagram' },
  twitter: { label: 'X / Twitter', href: 'https://twitter.com/SashankDeb', icon: 'uil-twitter' },
} satisfies Record<string, Social>;

export const HERO_SOCIALS: Social[] = [SOCIALS.linkedin, SOCIALS.github, SOCIALS.behance];
export const FOOTER_SOCIALS: Social[] = Object.values(SOCIALS);

export interface NavItem { id: string; label: string; icon: string }

export const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', icon: 'uil-user' },
  { id: 'experience', label: 'Experience', icon: 'uil-briefcase-alt' },
  { id: 'projects', label: 'Projects', icon: 'uil-scenery' },
  { id: 'skills', label: 'Skills', icon: 'uil-file-alt' },
  { id: 'writing', label: 'Writing', icon: 'uil-edit-alt' },
  { id: 'contact', label: 'Contact', icon: 'uil-message' },
];

export const FLAP_LINES = 'SENIOR|SOFTWARE|ENGINEER;I BUILD|STUFF ON|THE WEB;ONE|PIXEL AT|A TIME';
