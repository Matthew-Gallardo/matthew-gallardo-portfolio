# Verification record

Validation dates: 3–4 October 2026 (Asia/Manila). Matthew's supplied portrait remains pending; MG is the approved fallback.

## Revision checks

- Type checking, linting, content validation and static production build passed.
- Three unit checks passed for career-calendar duration, anniversaries, before-start behavior and month-end boundaries.
- All 24 local Chromium/WebKit browser checks passed. The suite verifies the light/dark switch, Auto/system preference, persistence, pause/resume timer, experience-first order, professional project, seven academic projects, mobile focus/Tab/Escape, anchors, clipboard success/failure, resume, mailto, WakaTime themes/failure/disclosure, reduced motion and no-JavaScript essentials.
- Both routes passed responsive checks at 320, 375, 768, 1024 and 1440px in both themes, with intentional media placeholders and no horizontal overflow.
- Axe scans found no WCAG A/AA violations on either route or the mobile dialog in light and dark mode.
- Desktop/mobile visual captures at 1440/375px in both themes recorded no console errors. The live WakaTime badge and chart loaded, with dark labels on the light chart canvas and original labels in dark mode. Provider values are never copied into source.
- Firefox cannot launch on this Windows host because its side-by-side native runtime is missing. Linux CI includes Firefox; this host limitation is not treated as a passed test.

## Career strip visual refinement

The subsequent screenshot-driven revision replaces the rounded timer card with a flat three-column strip, thin separators, monospace figures and uppercase labels. The visible starting date was removed; the confirmed date still drives the elapsed-time calculation. The strip follows the primary actions and social links, and places retirement beneath the timer columns on narrow screens.

Type checking, linting, unit tests and production build passed. All 15 focused Chromium/WebKit checks passed for timer controls, five responsive widths in both themes, accessibility and navigation. Visual captures at 320, 375, 768, 1024 and 1440px in both themes showed no overflow, displayed starting date or page errors. Reference logos and achievements were not reproduced.

## Matt guided tour

- The opt-in homepage tour contains seven typed steps. The controller is dynamically loaded after starting; no packages or services were added.
- All 33 local Chromium/WebKit tests passed across the full regression run and a focused timing-test rerun. The initial timing assertion was corrected to advance the mocked clock after React commits the next step; the application timer itself did not require a correction.
- Coverage includes invitation/dismissal persistence, footer replay, direct hash entry, automatic timing after movement, pause/resume, Back/Next/Skip/Finish, focus restoration, manual scrolling, hidden tabs, navigation cleanup, reduced motion, unavailable storage and missing targets.
- Every stop fits 320, 375, 768, 1024 and 1440px in both themes. Short screens, orientation changes and enlarged guide text remain usable. Active-guide Axe scans pass in both themes.
- Local visual captures at 375px and 1440px in light/dark mode show no horizontal overflow or browser errors. Type checking, linting and production build pass.
- The [protected tour preview](https://matthew-gallardo-portfolio-ei69zi5s2-matthewgallardos-projects.vercel.app), deployment `dpl_HKiyL9BnvoFiNh8uvzteZviWCE5B`, was reviewed through authenticated access at 375px and 1440px in both themes. All seven stops and Finish worked, with no overflow or console errors. Deployment protection remains enabled.
- Release `d5597ce` passed [GitHub CI](https://github.com/Matthew-Gallardo/matthew-gallardo-portfolio/actions/runs/37158708139), including strict install, type checking, linting, unit checks, build and the complete Chromium/Firefox/WebKit suite. All 11 focused tour/navigation checks also passed against the public new origin.
- Production visual captures at 375px and 1440px in both themes confirm all seven stops, reserved positions, readable panels and no overflow or console errors.

## Automatic typing tour revision

The revised guide types at 18ms per character after movement settles, holds each completed message for 2.5 seconds, and completes all seven stops automatically. Back, Next and Finish have been removed; Pause/Resume and Skip remain. The full message height is reserved, with a single full-text announcement per stop for assistive technology. Reduced motion reveals text immediately and allows eight seconds per stop.

Type checking, linting, three unit checks, content validation and production build pass. All 36 local Chromium/WebKit browser tests pass, including the retained portfolio regressions. Tour coverage checks typing cadence, stable bubble height, no per-character live announcements, preserved pause time in both phases, all seven automatic stops, automatic completion/replay, reduced motion, blocked storage, missing targets, hidden tabs, navigation cleanup, responsive widths and short screens. Both theme-specific Axe checks pass.

The reduced-motion checks caught delayed programmatic scroll notifications. The controller waits for rendering frames to flush and ignores notifications at the last programmed scroll position, including notifications delivered later under load. Genuine scroll position changes, wheel/touch input and navigation keys still pause the tour. Dedicated checks cover delayed notifications and actual scrolling separately.

The [protected typing preview](https://matthew-gallardo-portfolio-cj20cevhs-matthewgallardos-projects.vercel.app), deployment `dpl_2i1i6rfqwRcP69FH25fWjHxF698J`, completed all seven stops automatically in real time at 375px and 1440px in both themes. Typing, completed messages and the final replay state were visually reviewed. No horizontal overflow or browser errors occurred; preview protection and noindex remain enabled. No dependencies, domains or content claims changed in this revision.

The follow-up [protected scroll-fix preview](https://matthew-gallardo-portfolio-2df0f6no5-matthewgallardos-projects.vercel.app), deployment `dpl_718azt5GjK4QXmXjiEw2G9jEPsPa`, also completed all seven stops automatically with reduced motion at 375px in dark mode. Its eight-second reading intervals, final replay state and mobile panel were checked in real time, with no overflow or browser errors.

## Address change

On 4 October 2026, `matthew-gallardo.vercel.app` was verified and attached to the existing project. Release `d5597ce` deployed as `dpl_Ci6i3CDigs6R617FodY3k91GwH4Z`. Both routes, PDF resume, favicon, Open Graph image, sitemap and robots return HTTP 200 over HTTPS. Production canonicals, social images, sitemap and robots use the new origin.

`matthew-gallardo-portfolio.vercel.app` has a permanent 308 project-domain redirect. HTTP checks preserve `/projects`, query strings and the resume path; a Chromium navigation confirms query strings and `#experience` survive together, with no invitation on direct section entry. The original `gallardo-matthew.vercel.app` still returns HTTP 200 and was not changed. Repository identity, deployment history and the supplied PDF remain intact.

## Dependency audit

Strict peer-dependency installation succeeds with the committed npm lockfile. ESLint 9 is retained because Next's current lint tooling does not support ESLint 10's peer range.

The release audit reports **zero production dependency vulnerabilities** (`npm audit --omit=dev`). The full tooling audit reports five high entries tracing to one unpatched advisory in `braces`, through `micromatch`, `fast-glob` and Next's ESLint configuration: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). It concerns deeply nested input patterns exhausting the stack. This portfolio does not accept user-supplied glob patterns, and the affected chain is development lint tooling. No patched braces version was available (latest 3.0.3). The suggested forced downgrade to Next 14's lint configuration is incompatible with this stack and was not applied. Recheck when upstream publishes a compatible fix.

## Deployment and CI

- Public repository: [Matthew-Gallardo/matthew-gallardo-portfolio](https://github.com/Matthew-Gallardo/matthew-gallardo-portfolio).
- New Vercel project: `matthew-gallardo-portfolio`, ID `prj_DLY6DLywgPvWXTMOmth92y3lGhCv`, Node.js 24.x.
- Production: [matthew-gallardo.vercel.app](https://matthew-gallardo.vercel.app), assigned to the existing project on 4 October 2026. Domain assignment is verified and HTTPS serves the correct portfolio.
- Revision preview: [protected Vercel preview](https://matthew-gallardo-portfolio-etvpa44t1-matthewgallardos-projects.vercel.app), deployment `dpl_Bsn55vXimVk5Fh6tj7RNJ1vVpJYR`, READY.
- This Vercel preview was visually reviewed at 375px and 1440px in both themes, including the hero timer, navigation, timeline, project inventory and live activity chart. Both routes reported no console errors or overflow. Preview robots metadata remained noindex.
- GitHub is connected to the new Vercel project, with `main` as production branch. Preview access protection remains enabled; authenticated CLI access is used for review.
- The initial implementation's [CI run](https://github.com/Matthew-Gallardo/matthew-gallardo-portfolio/actions/runs/37075307258) passed all checks and 22 browser tests across Chromium, Firefox and WebKit. Revised CI results are recorded after publication.
- The [revision CI run](https://github.com/Matthew-Gallardo/matthew-gallardo-portfolio/actions/runs/37095076032) for `89415f9` passed strict installation, all quality checks and the 25-test suite across Chromium, Firefox and WebKit. All 22 detailed Chromium checks also passed against the public production URL.
- Production deployment `dpl_hWGWFQAvHs65XTjmEc484YhWhvE5` reached READY via the GitHub push and serves the requested revisions. Post-deployment review caught and corrected the projects route's missing Open Graph image; focused Chromium/WebKit smoke checks passed after that correction.
- Both routes, robots, sitemap, favicon, Open Graph image and resume returned HTTP 200 with correct production canonicals, indexing policy and PDF attachment disposition. All seven source repositories, SackCal's demo and the old portfolio returned HTTP 200. Security Bank's official page was accessible through the research browser, while a generic Node HTTP link check returned 403; retain the verified official link rather than interpreting its automated-request restriction as a missing page.
- The existing `Portfolio` repository and `gallardo-matthew.vercel.app` deployment remain independent and untouched.

## Lighthouse mobile measurements

Revised deployed production results at `89415f9`:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 95 | 100 | 100 | 100 | 2.2s | 0 | 180ms |
| Projects | 93 | 100 | 100 | 100 | 2.2s | 0 | 290ms |

Both pages meet the requested category-score targets. The projects lab run has 290ms total blocking time, which is a useful future optimization opportunity and is not a field INP measurement. Preview SEO scores reflect deliberate noindex. Lighthouse is a lab sample, not a guarantee; real-user INP and field Core Web Vitals require traffic.

Tour release `d5597ce`, measured on 4 October 2026 at the new production origin:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 78 | 100 | 100 | 100 | 2.4s | 0 | 830ms |
| Projects | 79 | 100 | 100 | 100 | 2.6s | 0 | 760ms |

These current performance samples fall below the 90 target; the other category targets are met. Main-thread blocking is the main contributor. A same-host comparison of the previous `3c99834` homepage returned 71 performance and 1,800ms TBT through its protected deployment URL, so these samples do not establish a tour-specific regression. That comparison is not fully equivalent to the public origin, and its SEO result is affected by deployment protection. The earlier 93–95 scores are historical measurements, not the tour release's results. Further performance profiling remains an improvement opportunity; no scores are guaranteed.

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
