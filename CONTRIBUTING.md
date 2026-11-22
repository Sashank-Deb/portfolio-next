# Contributing

## Branching strategy

Trunk-based (GitHub Flow): `main` is always deployable and Vercel ships every merge to it.

- **Never commit to `main` directly.** It's protected: changes land only through pull requests, and the `pre-push` hook refuses a push from `main`.
- **One short-lived branch per change**, named `type/short-description` in lowercase with hyphens, using the same types as commits: `feat/`, `fix/`, `perf/`, `refactor/`, `style/`, `test/`, `docs/`, `build/`, `ci/`, `chore/`, `deps/`, `revert/`.
  Examples: `feat/cta-pill-peek`, `fix/intro-flash-slow-network`, `perf/hero-image-lcp`.
- **Keep it current by rebasing** on `main` (`git pull --rebase origin main`), not by merging `main` in. History stays linear.
- **Merge with "Rebase and merge"** so every micro commit lands on `main` as-is. Squash and merge commits are disabled. The branch is deleted after merge.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), checked by commitlint on every commit and again in CI:

```
type(optional-scope): what changed, in the imperative

Why, if it isn't obvious.
```

**Micro commits.** Each commit is one small, reviewable idea that leaves the build green, at most **400 changed lines**. The lockfile, images and fonts don't count. Follow the TDD rhythm:

1. `test(scope): …` adds the failing spec
2. `feat(scope): …` or `fix(scope): …` makes it pass
3. `refactor(scope): …` tidies up, if needed

A commit that has to be big (a formatter run, a generated file) states why with a trailer, and the check reports it instead of failing:

```
Large-Commit: one-off prettier run over the whole codebase
```

Formatting-only commits go in `.git-blame-ignore-revs`. Run `git config blame.ignoreRevsFile .git-blame-ignore-revs` once to use it.

## Local checks (installed by `npm install`)

| Hook         | Runs                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| `pre-commit` | lint-staged on staged files: ESLint `--fix`, Prettier, and the Jest tests related to them |
| `commit-msg` | commitlint (Conventional Commits)                                                         |
| `pre-push`   | branch-name policy, `tsc --noEmit`, the full test suite                                   |

Formatting is Prettier's job and code quality is ESLint's (Airbnb rules, with `eslint-config-prettier` turning off the style rules they'd disagree on). `npm run format` formats everything.

## Pull requests

Open a PR from your branch into `main` and fill in the template. A PR can merge when:

- **CI › Lint, types, tests, build** passes: Prettier check, ESLint, TypeScript, Jest with coverage thresholds, and a production build.
- **CI › PR policy** passes: branch name, a conventional message for every commit, and every commit within the micro-commit budget.
- **Lighthouse › Core Web Vitals before/after** has run. It builds `main` and the PR, runs the Lighthouse CLI three times on each for mobile and desktop, and posts the median LCP, CLS, TBT (the lab stand-in for INP), FCP, Speed Index and performance score side by side. A regression beyond run-to-run noise is flagged ⚠️ and must be fixed or explained in the PR.
- All review conversations are resolved, and the branch is up to date with `main`.

The rules for `main` are kept in `.github/rulesets/main.json`, so they're versioned with the code.

### Running Lighthouse locally

```bash
npm run build && npx next start -p 3001 &
npm run lighthouse:run -- http://localhost:3001/ mobile .lighthouse/head-mobile.json 3
# … the same against a build of main on another port as base-mobile.json, then:
npm run lighthouse:compare -- .lighthouse
```
