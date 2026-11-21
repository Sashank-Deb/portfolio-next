import { FLAP_LINES, FOOTER_SOCIALS } from '@/content/site';
import { ReplayIntroButton } from '../intro/ReplayIntroButton';
import { Dot } from '../ui/Dot';
import { Flapboard } from './Flapboard';

export function Footer({ year }: { year: number }) {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <div>
          <p className="footer__title">
            Sashank Deb
            <Dot />
          </p>
          <p className="footer__subtitle">
            <span className="sr-only">Senior Software Engineer</span>
            <Flapboard lines={FLAP_LINES} cols={8} />
          </p>
        </div>

        <div className="footer__socials">
          {FOOTER_SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}><i className={`uil ${s.icon}`} /></a>
          ))}
        </div>
      </div>
      <p className="footer__copy container">
        <span>
          {'© '}
          <span id="year">{year}</span>
          {' Sashank Deb. All rights reserved. '}
          <ReplayIntroButton />
        </span>
      </p>
    </footer>
  );
}
