import { Footer } from '@/components/footer/Footer';
import { ScrollUp } from '@/components/footer/ScrollUp';
import { Header } from '@/components/header/Header';
import { About } from '@/components/sections/About';
import { Certifications } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';
import { EarlierWork } from '@/components/sections/EarlierWork';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Recommendations } from '@/components/sections/Recommendations';
import { Skills } from '@/components/sections/Skills';
import { Writing } from '@/components/sections/Writing';

// Static at build time; re-generated daily so the footer year never goes stale.
export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <Header />
      <main className="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Certifications />
        <Skills />
        <EarlierWork />
        <Writing />
        <Recommendations />
        <Contact />
      </main>
      <Footer year={new Date().getFullYear()} />
      <ScrollUp />
    </>
  );
}
