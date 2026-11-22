import { ABOUT_FACTS } from '@/content/hero';
import { CvButton } from '../ui/CvButton';
import { SectionHead } from '../ui/SectionHead';
import { AboutMedia } from './AboutMedia';
import { CountUp } from './CountUp';

const NBSP = ' ';

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionHead index="01" label="About" title="A little about me" />

        <div className="about__container">
          <AboutMedia />

          <div className="about__data" data-reveal>
            <p className="about__description">
              {`I'm a senior software engineer with 5+ years of building and scaling user-focused products
              across healthcare SaaS, e-commerce and EV technology. Most recently at RamSoft, I owned
              authentication for a multi-tenant radiology platform serving 50+ clients with zero downtime,
              and led the performance work that took LCP from 3.8${NBSP}s to under 800${NBSP}ms.`}
            </p>
            <p className="about__description">
              Outside work I build things for fun and in public: the open-source npm library{' '}
              <a href="https://react-liquid-fill.com/" target="_blank" rel="noopener noreferrer">
                react-liquid-fill
              </a>{' '}
              and the AI mind-mapping app{' '}
              <a href="https://noodl.tech/" target="_blank" rel="noopener noreferrer">
                noodl
              </a>
              . I also happen to have won Bajaj Finserv&apos;s HackRx&apos;21.
            </p>

            <div className="about__info">
              {ABOUT_FACTS.map((f) => (
                <div key={f.label}>
                  <CountUp to={f.count} suffix={f.suffix} />
                  <span className="about__info-name">{f.label}</span>
                </div>
              ))}
            </div>

            <CvButton />
          </div>
        </div>
      </div>
    </section>
  );
}
