import { RECOMMENDATIONS, avatarFor } from '@/content/recommendations';
import { SectionHead } from '../ui/SectionHead';
import { RecCard } from './RecCard';

export function Recommendations() {
  return (
    <section className="section recs" id="recommendations">
      <div className="container">
        <SectionHead
          index="08"
          label="Recommendations"
          title="What people say"
          aside={
            <p className="section__lead">
              From the managers, product partners and engineers I&apos;ve built with, straight from
              LinkedIn.
            </p>
          }
        />

        <figure className="rec-quote" data-reveal>
          <blockquote>
            “Real technical depth paired with genuine care about getting it right is rarer than it
            should be. <mark>Strongest possible recommendation.</mark>”
          </blockquote>
          <figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element -- 96px avatar, already its display size */}
            <img
              className="rec__avatar"
              src={avatarFor('saiteja')}
              alt="Saiteja Ganapavarapu"
              width="96"
              height="96"
              loading="lazy"
              decoding="async"
            />
            {' Saiteja Ganapavarapu '}
            <span>· managed me at RamSoft</span>
          </figcaption>
        </figure>

        <div className="rec-grid">
          {RECOMMENDATIONS.map((rec, i) => (
            <RecCard key={rec.id} rec={rec} revealIndex={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
