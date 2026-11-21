# portfolio-next

Sashank Deb's portfolio, rebuilt in **Next.js (App Router) + TypeScript**, test-first with **Jest + React Testing Library**, linted with the **Airbnb** style guide.

It is a pixel-for-pixel port of the static site at [sashank-deb.github.io/Profile](https://sashank-deb.github.io/Profile/): same markup, same stylesheet, same assets.

## Scripts

| | |
|---|---|
| `npm run dev` | Local dev server |
| `npm test` / `npm run test:watch` | Unit tests |
| `npm run test:coverage` | Tests with the enforced coverage thresholds |
| `npm run lint` | ESLint (Airbnb, TypeScript, React, hooks, jsx-a11y, Next) |
| `npm run typecheck` | `tsc --noEmit` (strict, `noUncheckedIndexedAccess`) |
| `npm run build` | Production build (the page is statically prerendered, revalidated daily) |

## Architecture: server first, small client islands

Everything that is just content is a **Server Component** and ships no JavaScript: hero, about, experience entries, certificates, skills, earlier work, writing, recommendations text, contact and footer. Content lives as typed data in `src/content`.

Only the parts that react to the visitor are client components, each kept as small as possible:

| Island | What it does |
|---|---|
| `HeaderShell`, `ScrollUp` | Scroll-aware header style and back-to-top (`useScrolledPast`, rAF-throttled, re-renders only when the boolean flips) |
| `NavProvider`, `NavMenu`, `NavToggle`, `NavClose`, `NavLink` | Mobile bottom sheet and the active-section scroll-spy; the link list itself is server-rendered children |
| `ThemeToggle`, `SoundToggle` | Theme lives on `<html>` (set before paint), sound state in a `useSyncExternalStore` engine |
| `NavContactPill` | The 5-second "peek" that stops for the session after real interaction |
| `Tabs` | Accessible tabs; the panels are server-rendered and passed in as props |
| `FeatureCards` | Expanding project cards with the auto-advancing progress bar |
| `LoadMore` | Load more / show less around server-rendered grids |
| `RecCard`, `AboutMedia`, `CopyEmail` | Show more, video and tilt, clipboard |
| `Flapboard` | Split-flap footer driven by the Web Animations API |
| `NameIntro`, `ReplayIntroButton` | First-visit name intro and its replay button |
| `ViewportEffects`, `ClickSounds` | One observer pair for all server-rendered reveals, one delegated listener for UI sounds |

Two tiny inline scripts in `<head>` (`src/lib/theme.ts`, `src/lib/intro.ts`) run before first paint, so there is never a theme flash and the intro curtain is up from the very first frame.

Fonts are the same variable font files the site used from Google Fonts, self-hosted through `next/font/local`. That means they're preloaded, with no third-party request and no layout shift. Images go through `next/image` for per-device sizes.

## Testing approach

Each module was written test-first: the git history has a failing `test:` commit before each `feat:` commit. Browser APIs jsdom lacks (IntersectionObserver, matchMedia, Web Animations, media playback) have deterministic doubles in `src/test/browser-mocks.ts`. Inline head scripts are tested by executing the exact string that ships.

## Deploying

Import the repo in Vercel; no configuration is needed. Set `NEXT_PUBLIC_SITE_URL` once a custom domain is used (Open Graph URLs fall back to the Vercel production URL).
