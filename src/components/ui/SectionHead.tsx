import type { ReactNode } from 'react';
import { Dot } from './Dot';

interface SectionHeadProps {
  index: string;
  label: string;
  title: string;
  /** Right-hand side of a split head (lead text or a count chip). */
  aside?: ReactNode;
}

const NBSP = ' ';

export function SectionHead({ index, label, title, aside }: SectionHeadProps) {
  const eyebrow = <p className="eyebrow">{`${index} ${NBSP}/${NBSP} ${label}`}</p>;
  const heading = (
    <h2 className="section__title">
      {title}
      <Dot />
    </h2>
  );
  if (!aside) {
    return (
      <div className="section__head" data-reveal>
        {eyebrow}
        {heading}
      </div>
    );
  }
  return (
    <div className="section__head section__head--split" data-reveal>
      <div>
        {eyebrow}
        {heading}
      </div>
      {aside}
    </div>
  );
}

export function CountChip({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="count-chip" href={href} target="_blank" rel="noopener noreferrer">
      {children} <i className="uil uil-arrow-up-right" />
    </a>
  );
}
