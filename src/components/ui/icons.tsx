/* Inline brand marks, kept byte-for-byte with the original markup. */

export function GmailIcon() {
  return (
    <svg viewBox="0 0 48 48">
      <path fill="#4285F4" d="M7 39h7V22L4 14.5V36a3 3 0 0 0 3 3z" />
      <path fill="#34A853" d="M34 39h7a3 3 0 0 0 3-3V14.5L34 22z" />
      <path fill="#FBBC04" d="M34 12v10l10-7.5v-3c0-3.7-4.2-5.8-7.2-3.6z" />
      <path fill="#EA4335" d="M14 22V12l10 7.5L34 12v10l-10 7.5z" />
      <path fill="#C5221F" d="M4 11.5v3L14 22V12l-2.8-2.1C8.2 7.7 4 9.8 4 11.5z" />
    </svg>
  );
}

export function PdfIcon() {
  return (
    <svg viewBox="0 0 32 40">
      <path
        d="M4 0h17l11 11v25a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
        fill="#fff"
        stroke="#D9D4CD"
        strokeWidth="1.2"
      />
      <path d="M21 0l11 11h-7a4 4 0 0 1-4-4z" fill="#D9D4CD" />
      <rect x="-1" y="19" width="27" height="12.5" rx="2.5" fill="#E5322D" />
      <text
        x="12.5"
        y="28.6"
        fontSize="8.6"
        fontWeight="700"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        PDF
      </text>
    </svg>
  );
}

export function LinkedInMark() {
  return (
    <svg className="rec__li" viewBox="0 0 24 24" aria-label="LinkedIn" role="img">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7.1 9.6H4.7V19h2.4V9.6zM5.9 5.2a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8zM19.3 13.8c0-2.5-.5-4.4-3.4-4.4-1.4 0-2.3.8-2.7 1.5h-.1V9.6h-2.3V19h2.4v-4.6c0-1.2.2-2.4 1.7-2.4 1.5 0 1.5 1.4 1.5 2.5V19h2.4l.5-5.2z"
      />
    </svg>
  );
}

export function CertBadge() {
  return (
    <svg className="cert__badge" viewBox="0 0 32 40" aria-hidden="true">
      <circle cx="16" cy="13" r="10.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="16" cy="13" r="5" fill="currentColor" opacity=".25" />
      <path
        d="M9.5 21.5 7 37l9-5 9 5-2.5-15.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A Unicons line icon. */
export function Icon({ name, className }: { name: string; className?: string }) {
  return <i className={`uil ${name}${className ? ` ${className}` : ''}`} />;
}
