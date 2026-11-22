import Image from 'next/image';
import { STATS } from '@/content/hero';
import { HEADSHOT, HERO_SOCIALS } from '@/content/site';
import { CvButton } from '../ui/CvButton';
import { Dot } from '../ui/Dot';

const NBSP = ' ';

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__container container">
        <div className="hero__data">
          <p
            className="eyebrow"
            data-reveal
          >{`Senior Software Engineer ${NBSP}/${NBSP} Bengaluru, India`}</p>
          <h1 className="hero__title" data-reveal>
            Hi, I&apos;m Sashank
            <Dot />
          </h1>

          <p className="home__description" data-reveal>
            I sit at the intersection of <strong>product engineering</strong> and{' '}
            <strong>technical leadership</strong>. The combination of technical depth paired with
            genuine care to ensure intuitive user experience is rare, and that&apos;s exactly what I
            bring to a team.
          </p>

          <div className="hero__buttons" data-reveal>
            <a href="#projects" className="button">
              See my work <i className="uil uil-arrow-down" />
            </a>
            <CvButton ghost />
          </div>

          <div className="hero__social" data-reveal>
            {HERO_SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                <i className={`uil ${s.icon}`} />
              </a>
            ))}
          </div>
        </div>

        <div className="portrait" data-reveal>
          <span className="portrait__blob portrait__blob--back" aria-hidden="true" />
          <span className="portrait__blob portrait__blob--ring" aria-hidden="true" />
          <div className="portrait__frame">
            <Image
              src={HEADSHOT.src}
              alt="Sashank Deb"
              width={HEADSHOT.width}
              height={HEADSHOT.height}
              sizes="(max-width: 560px) 238px, 294px"
              quality={85}
              preload
            />
          </div>
          <span className="portrait__dot portrait__dot--a" aria-hidden="true" />
          <span className="portrait__dot portrait__dot--b" aria-hidden="true" />
          <span className="portrait__tag">
            <span className="portrait__tag-dot" />
            {' 5+ years shipping'}
          </span>
        </div>
      </div>

      <div className="hero__stats container" data-reveal>
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat__value">
              {s.value}
              {s.arrowTo && (
                <>
                  {' '}
                  <i className="uil uil-arrow-right" />
                  {` ${s.arrowTo}`}
                </>
              )}
            </span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
