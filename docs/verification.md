# Verification record

Validation date: 3 October 2026 (Asia/Manila). The supplied portrait remains pending; MG is the approved production fallback.

## Local checks

- Strict dependency installation completed successfully with the committed npm lockfile; npm reported zero vulnerabilities. ESLint 9 is retained because Next's current lint tooling does not support ESLint 10's peer range.
- Type checking, linting, content validation and static production build passed.
- Initial complete browser pass: 21 Chromium/WebKit checks passed. Firefox could not launch on this Windows host because its side-by-side runtime configuration is missing; this is a browser installation error before any page loads. Firefox remains enabled in Linux CI.
- Five widths (320, 375, 768, 1024, 1440) and both themes passed overflow and placeholder checks on both content routes.
- Theme persistence, changing system preference, mobile menu focus/Tab/Escape, anchor navigation, clipboard success/denial, resume download, mailto, seven projects, WakaTime success/failure and keyboard disclosure, reduced motion and no-JavaScript essentials were covered.
- Axe scans found no WCAG A/AA violations on either page or the mobile dialog in light/dark mode.
- Live browser captures of both routes at 375px and 1440px in both themes recorded no browser console errors and no horizontal overflow. The public WakaTime badge and chart loaded successfully. Provider data was not copied into source.

## Initial Lighthouse mobile audit

Measured against the local production build with preview indexing disabled:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 97 | 100 | 100 | 66 | 2.6s | 0 | 70ms |
| Projects | 97 | 98 | 100 | 63 | 2.4s | 0 | 110ms |

The projects audit identified a skipped heading level and a mismatch between “Live demo” and its accessible name. Both were corrected before deployment. Low preview SEO scores reflect deliberate `noindex` and crawler blocking, not the intended production policy. Final deployment measurements and CI results are recorded below once available.

Lighthouse is a lab sample. Real-user INP and field Core Web Vitals require traffic and are not established by these tests. Home LCP in the initial run was slightly above the 2.5s target; deployed measurements will determine whether further optimization is needed.

## Deployment verification

Pending first preview review and remote CI completion.

The new Vercel project is `matthew-gallardo-portfolio`, project ID `prj_DLY6DLywgPvWXTMOmth92y3lGhCv`. Vercel assigned and verified `matthew-gallardo-portfolio.vercel.app`; Node.js is 24.x. The existing portfolio project and its domain have not been modified.

## Reproduce

```sh
npm ci --strict-peer-deps
npm run check
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
```

Windows hosts without Firefox's native runtime can run `npm run test:e2e -- --project=chromium --project=webkit` while Linux CI runs all three engines. Do not interpret a browser launch failure as an application assertion passing.

Local screenshots, Lighthouse HTML/JSON, Playwright reports and traces are in ignored `artifacts/`, `playwright-report/` and `test-results/` folders. Test failures are uploaded by GitHub Actions; source evidence is in `docs/content-sources.md`.
