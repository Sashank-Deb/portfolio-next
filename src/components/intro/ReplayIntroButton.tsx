'use client';

import { useSyncExternalStore } from 'react';
import { introStore } from '@/lib/intro-store';

export function ReplayIntroButton() {
  const available = useSyncExternalStore(introStore.subscribe, introStore.getSnapshot, () => false);
  return (
    <button
      className="footer__replay"
      type="button"
      data-replay-intro
      hidden={!available}
      onClick={introStore.requestReplay}
    >
      Replay intro
    </button>
  );
}
