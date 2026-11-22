'use client';

import type { ComponentProps, MouseEvent } from 'react';
import { CONTACT_SUBJECT, EMAIL } from '@/content/site';
import { detectPlatform, gmailAndroidUrl, gmailIosUrl, gmailWebUrl } from '@/lib/gmail';
import { navigateTo } from '@/lib/navigate';
import { PeekingPill } from './PeekingPill';

/** How long to give the Gmail app to take over on iOS before opening Gmail on the web instead. */
const APP_TIMEOUT_MS = 1500;

type EmailPillProps = Omit<
  ComponentProps<typeof PeekingPill>,
  'href' | 'target' | 'rel' | 'onClick'
>;

const WEB_URL = gmailWebUrl(EMAIL, CONTACT_SUBJECT);

/**
 * iOS can't say whether an app link worked, so if the page is still showing a moment later
 * (the Gmail app didn't open), fall back to Gmail on the web.
 */
const openGmailOnIos = () => {
  let leftPage = false;
  const onHide = () => {
    if (document.visibilityState === 'hidden') leftPage = true;
  };
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('pagehide', onHide);
  navigateTo(gmailIosUrl(EMAIL, CONTACT_SUBJECT));
  window.setTimeout(() => {
    document.removeEventListener('visibilitychange', onHide);
    window.removeEventListener('pagehide', onHide);
    if (!leftPage) navigateTo(WEB_URL);
  }, APP_TIMEOUT_MS);
};

/**
 * The contact pill as an "email me" button. It's a real link to a pre-filled Gmail compose window
 * (opens in a new tab, and works without JavaScript); on phones a click opens the Gmail app instead.
 */
export function EmailPill(props: EmailPillProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const platform = detectPlatform(navigator.userAgent, navigator.maxTouchPoints);
    if (platform === 'desktop') return; // the link itself opens Gmail on the web in a new tab
    e.preventDefault();
    if (platform === 'android') navigateTo(gmailAndroidUrl(EMAIL, CONTACT_SUBJECT));
    else openGmailOnIos();
  };

  return (
    <PeekingPill
      {...props}
      href={WEB_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    />
  );
}
