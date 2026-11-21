export const INTRO_SEEN_KEY = 'introSeen';

/**
 * Inlined in <head>: decides before paint whether the name intro plays, so it never flashes in late.
 *   play  – first visit (or ?intro=replay)
 *   skip  – returning visitor: a short rise of the hero instead
 *   none  – reload, back/forward, deep link or reduced motion
 * If the app never claims the curtain (JS failed to boot), it lifts itself after window load.
 */
export const introGateScript = `(function () {
  var d = document.documentElement;
  try {
    var nav = performance.getEntriesByType('navigation')[0];
    var replay = /[?&]intro=replay/.test(location.search);
    var seen = true;
    try { seen = localStorage.getItem('${INTRO_SEEN_KEY}') === '1'; } catch (e) {}
    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var resumed = (nav && (nav.type === 'reload' || nav.type === 'back_forward')) || Boolean(location.hash);
    var mode = replay || (!seen && !location.hash) ? 'play' : (reduced || resumed ? 'none' : 'skip');
    d.setAttribute('data-intro', mode);
    if (mode === 'play') {
      window.addEventListener('load', function () {
        setTimeout(function () { if (!window.__opClaimed) d.removeAttribute('data-intro'); }, 1500);
      });
    }
  } catch (e) { d.removeAttribute('data-intro'); }
})();`;

/**
 * Critical intro styles, inlined so the curtain covers the page from the very first paint,
 * before the stylesheet arrives.
 */
export const introCriticalCss = `html[data-intro="play"] { background: #1C1A1B; }
html[data-intro="play"] body { overflow: hidden; }
html[data-intro="play"]:not(.op-covering) body > :not(.op) { visibility: hidden; }
html[data-intro="play"] .op { display: block !important; position: fixed; inset: 0; z-index: 300; background: #1C1A1B; }`;
