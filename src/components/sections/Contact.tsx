import { EMAIL, LOCATION, PHONE, SOCIALS, mailto } from '@/content/site';
import { Dot } from '../ui/Dot';
import { PeekingPill } from '../ui/PeekingPill';
import { CopyEmail } from './CopyEmail';

export function Contact() {
  return (
    <section className="cta" id="contact">
      <div className="container cta__container">
        <h2 className="cta__title" data-reveal>
          We may work
          <br />
          {' well together'}
          <Dot />
        </h2>

        <div className="cta__actions" data-reveal>
          {/* Starts half a beat after the header pill so the two take turns. */}
          <PeekingPill
            className="pill--lg"
            href={mailto("Let's work together")}
            label="Send me an email"
            avatarSize={44}
            arrow
            firstPeekMs={4500}
          />
          <a
            className="cta__link"
            href={SOCIALS.linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Or reach me on LinkedIn
          </a>
        </div>

        <div className="cta__details" data-reveal>
          <CopyEmail email={EMAIL} />
          <a href={PHONE.href}>{PHONE.label}</a>
          <span>{LOCATION}</span>
        </div>
      </div>
    </section>
  );
}
