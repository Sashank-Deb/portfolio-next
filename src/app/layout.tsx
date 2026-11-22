import '@iconscout/unicons/css/line.css';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ClickSounds } from '@/components/effects/ClickSounds';
import { ViewportEffects } from '@/components/effects/ViewportEffects';
import { NameIntro } from '@/components/intro/NameIntro';
import { introCriticalCss, introGateScript } from '@/lib/intro';
import { themeScript } from '@/lib/theme';
import { dmSans, jost, spaceMono } from './fonts';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

const TITLE = 'Sashank Deb · Senior Software Engineer';
const SHARE_DESCRIPTION =
  'Product engineering and technical leadership. React, Next.js, TypeScript, auth and web performance.';
const OG_IMAGE = {
  url: '/assets/img/og-banner.jpg',
  type: 'image/jpeg',
  width: 1200,
  height: 630,
  alt: "Hi, I'm Sashank. Senior Software Engineer, Bengaluru. Product engineering and technical leadership.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description:
    'Sashank Deb is a senior software engineer in Bengaluru who sits at the intersection of product engineering and technical leadership. React, Next.js, TypeScript.',
  openGraph: {
    title: TITLE,
    description: SHARE_DESCRIPTION,
    type: 'website',
    url: '/',
    siteName: 'Sashank Deb',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SHARE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: [
      { url: '/assets/img/favicon.ico', sizes: 'any' },
      { url: '/assets/img/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/img/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/assets/img/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#161415',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The inline scripts set the theme and intro state on <html> before hydration.
    <html
      lang="en"
      className={`${jost.variable} ${dmSans.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Must run before first paint: no theme flash, and the intro curtain is up from frame one. */}
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: introGateScript }} />
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: introCriticalCss }} />
      </head>
      <body>
        <NameIntro />
        {children}
        <ViewportEffects />
        <ClickSounds />
      </body>
    </html>
  );
}
