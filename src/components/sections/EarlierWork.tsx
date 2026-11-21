import Image from 'next/image';
import { EARLIER_WORK } from '@/content/earlier-work';
import { SectionHead } from '../ui/SectionHead';
import { LoadMore } from './LoadMore';

export function EarlierWork() {
  return (
    <section className="section earlier" id="earlier">
      <div className="container">
        <SectionHead index="06" label="Archive" title="Earlier work" />
        <LoadMore id="work-grid" className="work-grid" itemSelector=".work" scrollTargetId="earlier">
          {EARLIER_WORK.map((w) => (
            <a key={w.title} className="work" href={w.href} target="_blank" rel="noopener noreferrer" data-reveal>
              <span className="work__img">
                <Image src={w.cover} alt="" width={1000} height={500} sizes="(max-width: 560px) 92vw, (max-width: 1024px) 46vw, 300px" />
              </span>
              <span className="work__title">{w.title}</span>
              <span className="work__desc">{w.description}</span>
            </a>
          ))}
        </LoadMore>
      </div>
    </section>
  );
}
