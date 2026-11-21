import type { ReactNode } from 'react';

export interface Entry {
  date: string;
  place: string;
  role: string;
  /** Company line; `detail` renders in the muted span after it. */
  company?: string;
  detail?: string;
  points?: ReactNode[];
  chips?: string[];
  link?: { href: string; label: string };
}

const NBSP = ' ';

export const WORK: Entry[] = [
  {
    date: 'Apr 2023 – Aug 2026',
    place: 'Remote',
    role: 'Senior Software Engineer',
    company: 'RamSoft Inc. ',
    detail: '· Healthcare SaaS / Radiology Platform',
    points: [
      `Led a feature-flagged PIN-to-password migration on React and Azure AD B2C, cutting auth tickets by 30%. Added OTP rate limiting, origin validation and a 300${NBSP}s code expiry, saving an estimated $500–$2K in monthly abuse.`,
      'Launched an AI-driven SSO onboarding flow that completes setup in under 3 hours; integrated OpenReplay and Datadog for production tracing.',
      <>
        Engineered Workflow Automation tooling with a custom serialized-state
        {' '}
        <code>useUndoRedo</code>
        {' '}
        React hook, enabling a drag-and-drop tree UI that manages 500+ complex rule sets.
      </>,
      'Automated release regression testing with end-to-end suites, saving 2 hours of manual QA per release; shipped a HIPAA-compliant audit trail with full Jest and Storybook coverage.',
      'Migrated the website from WordPress to Next.js SSR with a headless CMS, lifting patient sign-ups by 15%.',
    ],
    chips: ['React', 'Next.js', 'Azure AD B2C', 'Datadog', 'Jest', 'Storybook'],
  },
  {
    date: 'Oct 2021 – Mar 2023',
    place: 'Bengaluru',
    role: 'Software Developer',
    company: 'Phable Care ',
    detail: '· Healthcare Technology',
    points: [
      'Led a team of 4 engineers to raise a doctor appointment booking platform to a PageSpeed score of 98–100 through code splitting, image optimisation, lazy loading and SSR in Next.js, supporting 78–80 appointments a week.',
      'Decoupled content with a Strapi headless CMS and config-driven pages, letting marketing update doctor profiles without engineers and cutting update time by 75%.',
      'Delivered e-commerce product, cart and checkout flows (upselling, saved cart, returns and refunds) and integrated Google Tag Manager and Search Console, driving an estimated 8x increase in organic CTR.',
    ],
    chips: ['Next.js', 'Strapi', 'Web performance', 'E-commerce'],
  },
  {
    date: 'May 2021 – Oct 2021',
    place: 'Pune',
    role: 'Software Developer (Graduate Engineer Trainee), R&D',
    company: 'Varroc Engineering Ltd. ',
    detail: '· Electric Vehicles',
    points: [
      'Developed supervised machine learning models forecasting the Remaining Useful Life of lithium-ion EV battery cells at 99% accuracy, with JavaScript dashboards for battery-health data.',
    ],
    chips: ['Machine learning', 'JavaScript', 'Data dashboards'],
  },
];

const credly = (id: string) => `https://www.credly.com/badges/${id}/print`;

export const EDUCATION: Entry[] = [
  {
    date: '2017 – 2021',
    place: 'Chennai',
    role: 'B.Tech., Electronics and Computer Engineering',
    company: 'Vellore Institute of Technology ',
    detail: '· CGPA 8.57/10',
  },
  {
    date: 'Certifications',
    place: 'HackerRank',
    role: 'HackerRank certifications',
    detail: 'Frontend Developer (React) role, plus React, JavaScript, SQL and CSS skills.',
    link: { href: '#certifications', label: 'See all 7 certificates' },
  },
  {
    date: '2020 – 2021',
    place: 'Earlier',
    role: 'Earlier certifications',
    points: [
      'Web GIS Technology, Indian Space Research Organisation (2021)',
      <>
        <a href={credly('9b67ffcc-6c13-40a4-a695-2ef6a1d4fb23')} target="_blank" rel="noopener noreferrer">Machine Learning with Python, IBM</a>
        {' (2020)'}
      </>,
      <>
        <a href={credly('79180d67-c44c-4dfb-8a78-d2234fe3c696')} target="_blank" rel="noopener noreferrer">Node-RED: basics to bots, IBM</a>
        {' (2020)'}
      </>,
    ],
  },
];

export const ACHIEVEMENTS: Entry[] = [
  {
    date: 'Jul 2021', place: 'Bajaj Finserv', role: "Winner, HackRx'21", company: 'National healthcare hackathon by Bajaj Finserv, across 2.5k participants',
  },
  {
    date: 'Jul 2020', place: 'IIT Madras', role: 'Student Leader of the Year 2020', company: 'Awarded by IIT Madras alumni for managing and building systems for the student chapter',
  },
  {
    date: 'Nov 2019', place: 'IIT Madras', role: 'Winner, Tinkathon', company: 'DIY hackathon by the IIT Madras Alumni Center',
  },
  {
    date: '2021', place: 'Open source', role: 'Rasa contributor', company: 'Contributed to the Rasa conversational AI framework',
  },
];
