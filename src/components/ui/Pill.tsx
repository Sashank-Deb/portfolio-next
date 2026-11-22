import Image from 'next/image';
import type { ComponentProps } from 'react';
import { HEADSHOT } from '@/content/site';
import { GmailIcon } from './icons';

type PillProps = Omit<ComponentProps<'a'>, 'children'> & {
  label: string;
  avatarSize: number;
  arrow?: boolean;
};

/** The expanding "avatar → Gmail" contact pill used in the header and the CTA. */
export function Pill({ label, avatarSize, arrow = false, className, ...anchor }: PillProps) {
  return (
    <a className={`pill${className ? ` ${className}` : ''}`} aria-label="Email Sashank" {...anchor}>
      <span className="pill__faces" aria-hidden="true">
        <Image
          className="pill__avatar"
          src={HEADSHOT.src}
          alt=""
          width={avatarSize}
          height={avatarSize}
        />
        <span className="pill__gmail">
          <GmailIcon />
        </span>
      </span>
      <span className="pill__label">{label}</span>
      {arrow && <i className="uil uil-arrow-right pill__arrow" aria-hidden="true" />}
    </a>
  );
}
