import { SKILLS } from '@/content/skills';
import { Chips } from '../ui/Chips';
import { SectionHead } from '../ui/SectionHead';

export function Skills() {
  return (
    <section className="section skills" id="skills">
      <div className="container">
        <SectionHead index="05" label="Skills" title="What I work with" />
        <div className="skills__grid">
          {SKILLS.map((g) => (
            <div key={g.title} className={`skill-card${g.wide ? ' skill-card--wide' : ''}`} data-reveal>
              <i className={`uil ${g.icon} skill-card__icon`} />
              <h3>{g.title}</h3>
              <Chips items={g.chips} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
