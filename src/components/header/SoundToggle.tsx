'use client';

import { useSyncExternalStore } from 'react';
import { getSiteSound } from '@/lib/sound';

const subscribe = (cb: () => void) => getSiteSound().subscribe(cb);
const isEnabled = () => getSiteSound().isEnabled();

export function SoundToggle() {
  // Server HTML assumes sound is on; a stored "off" is applied right after hydration.
  const enabled = useSyncExternalStore(subscribe, isEnabled, () => true);
  return (
    <button
      className={`icon-btn${enabled ? '' : ' is-muted'}`}
      id="sound-button"
      type="button"
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn sound effects off' : 'Turn sound effects on'}
      title={enabled ? 'Sound on' : 'Sound off'}
      onClick={() => getSiteSound().toggle()}
    >
      <i className="uil uil-volume sound-icon sound-icon--on" />
      <i className="uil uil-volume-mute sound-icon sound-icon--off" />
    </button>
  );
}
