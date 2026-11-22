export interface Project {
  name: string;
  kind: string;
  href: string;
  image: string;
  alt: string;
  description: string;
  chips: string[];
}

export const PROJECTS: Project[] = [
  {
    name: 'react-liquid-fill',
    kind: 'npm library',
    href: 'https://react-liquid-fill.com/',
    image: '/assets/img/projects/liquid.webp',
    alt: 'react-liquid-fill website',
    description:
      'A React component and hook that pours colour into icons, buttons and text with an animated liquid edge on hover, focus or scroll. 2.7 kB, zero dependencies, SSR-safe.',
    chips: ['React', 'TypeScript', 'npm'],
  },
  {
    name: 'noodl',
    kind: 'AI mind-mapping app',
    href: 'https://noodl.tech/',
    image: '/assets/img/projects/noodl.webp',
    alt: 'noodl website',
    description:
      'Every note is both an outline and a mind map. AI suggestions on every node and one-prompt map generation; local-first, works offline, and near-zero-cost infrastructure keeps it free.',
    chips: ['Next.js', 'Zustand', 'IndexedDB', 'Supabase'],
  },
  {
    name: 'PurrCast',
    kind: 'read with your ears',
    href: 'https://purrcast.vercel.app/',
    image: '/assets/img/projects/purrcast.webp',
    alt: 'PurrCast website',
    description:
      'Turns any article link, document or pasted text into an audio read-along narrated by natural neural voices. Click any sentence to jump there, with a companion Chrome extension.',
    chips: ['Next.js', 'Tailwind', 'Chrome extension'],
  },
  {
    name: 'CreditQ',
    kind: 'bill reminders',
    href: 'https://credit-q.vercel.app/',
    image: '/assets/img/projects/creditq.webp',
    alt: 'CreditQ website',
    description:
      'Credit card bill reminders for India that group all your bills into one pay day. A calm, offline PWA: no account, no server copy, everything encrypted on the device.',
    chips: ['Next.js PWA', 'TypeScript', 'SCSS'],
  },
];
