export const BLOG_URL = 'https://sashankdeb.hashnode.dev/';

export interface Post { slug: string; title: string; brief: string; tag: string; date: string; read: string }

export const FEATURED_POST = {
  slug: 'react-liquid-fill',
  kicker: '// 01  open source',
  title: 'React-Liquid-Fill',
  brief: 'A reusable React component that fills SVG icons with colour from the side the cursor enters. Open source, zero dependencies, 2.7 kB, and the story of how it was built.',
  chips: ['Open source'],
  date: 'Oct 12, 2026',
  read: '6 min read',
};

export const POSTS: Post[] = [
  {
    slug: 'react-keys-aren-t-just-for-silencing-warnings-identity-reconciliation-and-state',
    title: "React keys aren't just for silencing warnings",
    brief: 'Why array indexes and random IDs break lists, and how keys decide whether a component keeps its state.',
    tag: 'React',
    date: 'Oct 12, 2026',
    read: '8 min read',
  },
  {
    slug: 'preload-preconnect-prefetch-in-a-nutshell',
    title: 'Preload, preconnect, prefetch in a nutshell',
    brief: 'Stop guessing and start using resource hints right.',
    tag: 'Performance',
    date: 'Oct 8, 2026',
    read: '7 min read',
  },
  {
    slug: 'beginners-guide-to-using-the-react-compiler',
    title: "Beginner's guide to using the React Compiler",
    brief: 'Not a step-by-step guide to the React Compiler.',
    tag: 'React',
    date: 'May 17, 2024',
    read: '5 min read',
  },
  {
    slug: 'what-makes-react-a-library',
    title: 'What makes React a library?',
    brief: "How React's flexibility and fit into existing projects make it a library, not a framework.",
    tag: 'Fundamentals',
    date: 'Oct 11, 2023',
    read: '5 min read',
  },
];

export const postUrl = (slug: string) => `${BLOG_URL}${slug}`;
export const POST_COUNT = POSTS.length + 1;
