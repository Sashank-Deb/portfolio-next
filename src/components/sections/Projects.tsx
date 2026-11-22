import { PROJECTS } from '@/content/projects';
import { SectionHead } from '../ui/SectionHead';
import { FeatureCards } from './FeatureCards';

export function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="container">
        <SectionHead
          index="03"
          label="Projects"
          title="Things I've built recently"
          aside={
            <p className="section__lead">Designed, engineered and shipped on my own, end to end.</p>
          }
        />
        <FeatureCards projects={PROJECTS} revealIndex={1} />
      </div>
    </section>
  );
}
