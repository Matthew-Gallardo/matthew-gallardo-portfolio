# Verification record

Validation date: 3 October 2026 (Asia/Manila). Matthew's supplied portrait remains pending; MG is the approved fallback.

## Revision checks

- Type checking, linting, content validation and static production build passed.
- Three unit checks passed for career-calendar duration, anniversaries, before-start behavior and month-end boundaries.
- All 24 local Chromium/WebKit browser checks passed. The suite verifies the light/dark switch, Auto/system preference, persistence, pause/resume timer, experience-first order, professional project, seven academic projects, mobile focus/Tab/Escape, anchors, clipboard success/failure, resume, mailto, WakaTime themes/failure/disclosure, reduced motion and no-JavaScript essentials.
- Both routes passed responsive checks at 320, 375, 768, 1024 and 1440px in both themes, with intentional media placeholders and no horizontal overflow.
- Axe scans found no WCAG A/AA violations on either route or the mobile dialog in light and dark mode.
- Desktop/mobile visual captures at 1440/375px in both themes recorded no console errors. The live WakaTime badge and chart loaded, with dark labels on the light chart canvas and original labels in dark mode. Provider values are never copied into source.
- Firefox cannot launch on this Windows host because its side-by-side native runtime is missing. Linux CI includes Firefox; this host limitation is not treated as a passed test.

## Dependency audit

Strict peer-dependency installation succeeds with the committed npm lockfile. ESLint 9 is retained because Next's current lint tooling does not support ESLint 10's peer range.

The release audit reports **zero production dependency vulnerabilities** (`npm audit --omit=dev`). The full tooling audit reports five high entries tracing to one unpatched advisory in `braces`, through `micromatch`, `fast-glob` and Next's ESLint configuration: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). It concerns deeply nested input patterns exhausting the stack. This portfolio does not accept user-supplied glob patterns, and the affected chain is development lint tooling. No patched braces version was available (latest 3.0.3). The suggested forced downgrade to Next 14's lint configuration is incompatible with this stack and was not applied. Recheck when upstream publishes a compatible fix.

## Deployment and CI

- Public repository: [Matthew-Gallardo/matthew-gallardo-portfolio](https://github.com/Matthew-Gallardo/matthew-gallardo-portfolio).
- New Vercel project: `matthew-gallardo-portfolio`, ID `prj_DLY6DLywgPvWXTMOmth92y3lGhCv`, Node.js 24.x.
- Production: [matthew-gallardo-portfolio.vercel.app](https://matthew-gallardo-portfolio.vercel.app).
- Revision preview: [protected Vercel preview](https://matthew-gallardo-portfolio-etvpa44t1-matthewgallardos-projects.vercel.app), deployment `dpl_Bsn55vXimVk5Fh6tj7RNJ1vVpJYR`, READY.
- This Vercel preview was visually reviewed at 375px and 1440px in both themes, including the hero timer, navigation, timeline, project inventory and live activity chart. Both routes reported no console errors or overflow. Preview robots metadata remained noindex.
- GitHub is connected to the new Vercel project, with `main` as production branch. Preview access protection remains enabled; authenticated CLI access is used for review.
- The initial implementation's [CI run](https://github.com/Matthew-Gallardo/matthew-gallardo-portfolio/actions/runs/37075307258) passed all checks and 22 browser tests across Chromium, Firefox and WebKit. Revised CI results are recorded after publication.
- The existing `Portfolio` repository and `gallardo-matthew.vercel.app` deployment remain independent and untouched.

## Lighthouse mobile measurements

Initial deployed production results, before the requested UI revisions:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 98 | 100 | 100 | 100 | 2.1s | 0 | 130ms |
| Projects | 99 | 100 | 100 | 100 | 2.0s | 0 | 100ms |

Revision results will be added after its production deployment. Preview SEO scores reflect deliberate noindex. Lighthouse is a lab sample, not a guarantee; real-user INP and field Core Web Vitals require traffic.

## Reproduce

```sh
npm ci --strict-peer-deps
npm run check
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
npm audit --omit=dev
```

Windows hosts without Firefox's native runtime can run `npm run test:e2e -- --project=chromium --project=webkit` while Linux CI runs all three engines.

Local screenshots, Lighthouse HTML/JSON, Playwright reports and traces are in ignored `artifacts/`, `playwright-report/` and `test-results/`. Test failures are uploaded by GitHub Actions. Source evidence is in `docs/content-sources.md`.
