import { ACHIEVEMENTS, EDUCATION, type Entry, WORK } from '@/content/experience';
import { Chips } from '../ui/Chips';
import { SectionHead } from '../ui/SectionHead';
import { Tabs } from './Tabs';

function Job({ entry, reveal = false }: { entry: Entry; reveal?: boolean }) {
  return (
    <article className="job" data-reveal={reveal || undefined}>
      <div className="job__meta">
        <span className="job__date">{entry.date}</span>
        <span className="job__place">{entry.place}</span>
      </div>
      <div className="job__body">
        <h3 className="job__role">{entry.role}</h3>
        {(entry.company || entry.detail) && (
          <p className="job__company">
            {entry.company}
            {entry.detail && <span>{entry.detail}</span>}
          </p>
        )}
        {entry.points && (
          <ul className="job__points">
            {entry.points.map((p, i) => (
              // Points are static strings or fragments that never reorder.
              // eslint-disable-next-line react/no-array-index-key
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}
        {entry.chips && <Chips items={entry.chips} />}
        {entry.link && (
          <a className="link-arrow job__link" href={entry.link.href}>
            {entry.link.label} <i className="uil uil-arrow-down" />
          </a>
        )}
      </div>
    </article>
  );
}

const panel = (entries: Entry[], reveal = false) =>
  entries.map((e) => <Job key={e.role} entry={e} reveal={reveal} />);

export function Experience() {
  return (
    <section className="section experience" id="experience">
      <div className="container">
        <SectionHead index="02" label="Experience" title="Where I've worked" />
        <Tabs
          label="Qualification"
          tabs={[
            {
              id: 'work',
              label: 'Work',
              icon: 'uil-briefcase-alt',
              panel: panel(WORK, true),
            },
            {
              id: 'education',
              label: 'Education',
              icon: 'uil-graduation-cap',
              panel: panel(EDUCATION),
            },
            {
              id: 'achievements',
              label: 'Achievements',
              icon: 'uil-trophy',
              panel: panel(ACHIEVEMENTS),
            },
          ]}
        />
      </div>
    </section>
  );
}
