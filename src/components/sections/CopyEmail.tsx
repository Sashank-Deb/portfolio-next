'use client';

import { useEffect, useRef, useState } from 'react';

const CONFIRM_MS = 1800;

export function CopyEmail({ email }: { email: string }) {
  const [note, setNote] = useState('');
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setNote('Copied');
    } catch {
      window.location.href = `mailto:${email}`;
    }
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNote(''), CONFIRM_MS);
  };

  return (
    <button className="cta__copy" type="button" id="copy-email" data-email={email} onClick={copy}>
      <span>{email}</span>
      <i className="uil uil-copy" />
      <span className="cta__copied" aria-live="polite">{note}</span>
    </button>
  );
}
