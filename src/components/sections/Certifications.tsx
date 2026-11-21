import { CERTIFICATES, HACKERRANK_PROFILE, certificateUrl } from '@/content/certifications';
import { CertBadge } from '../ui/icons';
import { CountChip, SectionHead } from '../ui/SectionHead';
import { LoadMore } from './LoadMore';

export function Certifications() {
  return (
    <section className="section certs" id="certifications">
      <div className="container">
        <SectionHead
          index="04"
          label="Certifications"
          title="Verified on HackerRank"
          aside={<CountChip href={HACKERRANK_PROFILE}>{`${CERTIFICATES.length} certificates on HackerRank`}</CountChip>}
        />
        <LoadMore id="cert-grid" className="cert-grid" itemSelector=".cert" scrollTargetId="certifications">
          {CERTIFICATES.map((c) => (
            <a key={c.id} className={`cert cert--${c.kind}`} href={certificateUrl(c.id)} target="_blank" rel="noopener noreferrer" data-reveal>
              <span className="cert__paper">
                <span className="cert__top">
                  <span>HackerRank</span>
                  <span>Certificate</span>
                </span>
                <CertBadge />
                <span className="cert__name">{c.name}</span>
                <span className="cert__verified">
                  <i className="uil uil-check-circle" />
                  {' Verified'}
                </span>
                <span className="cert__lines" aria-hidden="true">
                  <span />
                  <span />
                </span>
                <span className="cert__foot">
                  <span className="cert__view">
                    View PDF
                    {' '}
                    <i className="uil uil-arrow-up-right" />
                  </span>
                  <span className="cert__tag">{c.kind.toUpperCase()}</span>
                </span>
              </span>
            </a>
          ))}
        </LoadMore>
      </div>
    </section>
  );
}
