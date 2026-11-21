import { RESUME } from '@/content/site';
import { PdfIcon } from './icons';

export function CvButton({ ghost = false }: { ghost?: boolean }) {
  return (
    <a href={RESUME.href} className={`button${ghost ? ' button--ghost' : ''} cv-btn`} download={RESUME.filename}>
      <span className="cv-btn__icon" aria-hidden="true"><PdfIcon /></span>
      <span>Download CV</span>
      {' '}
      <i className="uil uil-download-alt" />
    </a>
  );
}
