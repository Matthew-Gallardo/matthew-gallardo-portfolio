# Matthew Gallardo — portfolio

A content-focused portfolio for a backend software engineer working in banking and digital payments. Built as a fresh Next.js application, separate from the existing React/Create React App portfolio.

## Develop and verify

Use **Node.js 24.x** and npm. `.nvmrc` and `package.json` specify the runtime. Commit `package-lock.json`; do not introduce another package manager's lockfile.

```sh
npm ci --strict-peer-deps
npm run dev
```

Open `http://localhost:3000`.

```sh
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm run start
```

The build first validates content and then prerenders the pages. `npm run check` runs type checking, linting, career-date unit tests and production build together. `next/font` downloads Geist at build time and self-hosts it; an initial build needs network access to Google Fonts.

```sh
npx playwright install chromium firefox webkit
npm run test:e2e
```

On Linux, use `npx playwright install --with-deps chromium firefox webkit`. Tests start the production server automatically, so build first. Chromium runs detailed coverage; Firefox and WebKit cover rendering, themes, navigation and console errors. Axe checks both pages and the mobile dialog in each theme. Test fixtures isolate WakaTime availability from application correctness.

To test an already-running local or accessible preview server, set the optional test-only `PLAYWRIGHT_BASE_URL` environment variable. It is not a deployment secret or application requirement.

## Stack and structure

- Next.js App Router, React, strict TypeScript, Tailwind CSS, semantic CSS custom properties.
- Static Server Components for content; small client components for themes, navigation, the career timer, clipboard, media errors, the optional tour and selected Motion entrances.
- Geist Sans/Mono with `next/font`; raster assets through `next/image`; Lucide UI icons.
- Local typed content, no CMS, database, authentication, contact backend, analytics, or required paid services.

```text
src/app/                  Routes, global styles and metadata assets
src/components/layout/    Desktop rail, mobile dialog and footer
src/components/sections/  Homepage content
src/components/projects/  Project presentation
src/components/ui/        Theme, media, clipboard and animation
src/components/tour/      Invitation and dynamically loaded Matt guide
src/content/              Editable profile, projects, experience, skills, education, activity, career
src/types/content.ts      Readonly content contracts
src/lib/                  Metadata and safe local image lookup
public/resume/            Downloadable PDF
public/images/            Optional supplied portrait and project screenshots
scripts/                  Build-time content validation
tests/e2e/                Focused interaction and accessibility checks
tests/unit/               Calendar-duration boundary checks
docs/                     Sources, attribution and verification record
```

Versions were selected together using package peer requirements. Next.js 16.3.8 and React 19.3.0 are paired with Tailwind 4.3.3 and Motion 14.0.0. ESLint 9.39.5 and TypeScript 6.0.3 match the supported ranges of Next's lint tooling; newer incompatible major versions were not forced. Recheck official documentation and peer dependencies during upgrades.

## Edit content

Edit the appropriate file under `src/content/`. Data uses readonly TypeScript models; errors appear during type checking. `npm run validate:content` verifies eight unique entries (one professional and seven academic), featured ordering, appropriate source links, resume presence, all-time WakaTime configuration and interface-copy constraints.

Evidence lives in [the content ledger](docs/content-sources.md), separate from public copy. Prefer Matthew's resume for employment, education and professional achievements. Confirm personal contributions before adding them. Do not infer professional experience from the technologies used to build this website.

The home page orders Experience, Stack, Projects, Activity, Education and Contact, with a connected employment timeline. Four selected projects lead with Security Bank App. `/projects` contains one professional contribution and all seven academic projects. Professional work links to the official app page, without implying a public source repository. There are no project detail routes in this release. Only SackCal has a verified published demo link.

## Career timer

`src/content/career.ts` contains Matthew's confirmed start date, 2 September 2024, interpreted as midnight in Manila, and the playful retirement message. The date is used only for calculation and is not displayed in the hero. A flat stats strip presents calendar duration, a live clock and the retirement line, with thin dividers and uppercase labels. On phones the retirement line moves below the two timer columns. The timer reports elapsed calendar time since that date, not hours worked. Years and months respect calendar anniversaries; a visitor can pause updates, and hidden tabs stop ticking. It reserves space before hydration and does not announce every second to screen readers. Retirement has no estimated date or countdown.

## Matt guided tour

The homepage offers an optional “Take a tour with Matt” invitation. Nothing scrolls until the visitor starts it. After scrolling and pointer movement settle, Matt types each explanation at 18ms per character, then leaves the completed message visible for 2.5 seconds before advancing. All seven stops and completion are automatic. Only Pause/Resume, Skip and the step counter remain; the footer always offers replay.

Edit the typed steps in `src/content/tour.ts`, keeping targets aligned with real heading IDs. The controller loads only when requested. Dismissal/completion is stored under `mg-portfolio-tour-v1`; blocked storage falls back to session memory. Direct section links suppress the invitation, and `/projects` has no tour.

Pause preserves the current character and remaining reading time. Manual scrolling or interaction pauses progression, hidden tabs pause until explicitly resumed, and page links or mobile navigation end the tour. Escape dismisses it and restores focus. Reduced motion removes travel and typing, shows each complete explanation immediately after arrival, and advances after eight seconds. The speech bubble fits the visible text and grows as Matt types, with compact padding and no reserved empty message area. Pause/Resume, Skip and progress sit in a separate fixed pill so controls stay still. The arrow and speech bubble share one animated anchor at the active heading on every screen size. They stay together while moving and typing; the bubble flips above the arrow or scrolls internally when space is tight. Screen readers receive each explanation once instead of character updates. No content or essential action depends on the guide or JavaScript.

## Replace the portrait or project images

The initial site intentionally uses MG and project-preview placeholders. To add Matthew's supplied photo:

1. Keep the original privately; place an optimized publication copy, such as `matthew.webp`, in `public/images/portrait/`.
2. Add `portrait: { src: "/images/portrait/matthew.webp", alt: "Matthew Gallardo", width: 800, height: 800, focalPosition: "50% 50%" }` to `src/content/profile.ts`, replacing dimensions with the real image dimensions.
3. Preview the centered square crop at mobile and desktop sizes. Adjust only `focalPosition` if required; do not retouch or generate a replacement face.

For a project, add an approved screenshot under `public/images/projects/` and add its `image` object to the matching project. Write useful alt text and real dimensions. Preview frames are 16:9 and contain the image without cropping its content. Missing local files and runtime image failures retain intentional placeholders. Only local `/images/` raster assets are supported.

Record provenance and permissions in [asset attribution](docs/asset-attribution.md). Do not import old screenshots until they have been checked for rights, sensitive content and readability.

## Resume and contact

Replace `public/resume/matthew-gallardo-resume-2026.pdf` with an approved PDF, or update `profile.resume` if its filename changes. The download uses a relative public URL and an attachment header, with no embedded PDF viewer. The supplied PDF still references the old website URL; it has not been rewritten.

Contact uses a working `mailto:` link and optional clipboard action with accessible success/failure feedback. The page exposes the email as selectable text. There is no contact-form delivery service.

## WakaTime

`src/content/activity.ts` holds the public profile, tracked-time badge and language chart URLs. Images load directly from WakaTime without a key, proxy, script, iframe, polling or backend request. The chart is labeled **all time**, reserves an 800:600 ratio and sits inside a native disclosure. The badge remains visible outside it.

The existing shared SVG has white labels and no verified public light-theme URL. The site adapts its presentation in light mode with `invert(1) hue-rotate(180deg)` on a light canvas; dark mode shows the original SVG. This changes presentation only, without editing provider values or introducing a second data source. Verify readability in both themes if the provider changes its SVG styles.

Do not hardcode totals, rename the period to weekly, or present activity as productivity. A failed image shows an unavailable message; it never displays invented zero values. Provider failure cannot fail a build. Browser tests mock provider responses; manually verify the live provider before release.

## Themes and accessibility

The first visit follows system preference. A labeled light/dark switch saves an explicit choice; the adjacent Auto button returns to the system preference. The choice persists under `mg-portfolio-theme`. The pre-paint `next-themes` script avoids theme flashes; only the root HTML element suppresses expected hydration differences. CSS also supports the system theme without JavaScript.

The mobile menu uses a native modal dialog, contained Tab navigation, Escape dismissal, scroll locking and focus restoration. Section destinations account for the sticky header. A no-JavaScript section navigation remains available. Reduced motion disables translations and smooth scrolling. No content depends on an animation becoming visible.

## Repository and Vercel deployment

The public repository is [Matthew-Gallardo/matthew-gallardo-portfolio](https://github.com/Matthew-Gallardo/matthew-gallardo-portfolio), with `main` as its production branch. The site is [matthew-gallardo.vercel.app](https://matthew-gallardo.vercel.app), attached to the existing Vercel project named `matthew-gallardo-portfolio`. The original `Matthew-Gallardo/Portfolio` repository and `gallardo-matthew.vercel.app` deployment are independent.

The former address `matthew-gallardo-portfolio.vercel.app` permanently redirects with HTTP 308 to the current site, preserving paths and query strings. Section fragments are preserved by the browser.

The existing project imports this repository with these settings. Use the same settings if recreating the deployment:

- Framework: Next.js.
- Root directory: repository root.
- Node.js: 24.x.
- Install: `npm ci`.
- Build: `npm run build`.
- Output: standard Next.js default; do not set an export directory.
- No user-defined environment variables or secrets are required.

Vercel provides its own `VERCEL_ENV` and deployment URL system variables. `main` is the production branch; pull requests and other branches create previews. GitHub Actions independently runs quality checks. Keep normal preview access protection; do not disable it just to run automated tests. Use an authorized preview/share URL when access is protected.

For manual CLI deployment after sign-in:

```sh
npx vercel link
npx vercel deploy
```

Link explicitly to `matthew-gallardo-portfolio`. The default deploy creates a preview. Inspect that preview before promoting a deployment to the project's production URL. Do not reassign or replace `gallardo-matthew.vercel.app`.

## Metadata and domain changes

Set `productionOrigin` in `src/content/site.ts` to the new verified HTTPS production origin when assigned. Until configured, metadata remains non-indexable and the sitemap is empty. Preview deployments retain `noindex`; only Vercel production builds with a configured origin enable indexing.

For a future domain change, connect and verify the domain in Vercel, update that single origin setting, rebuild and redeploy. Check both canonical URLs, the Open Graph image URL, sitemap and robots. Only after the new origin works, configure a permanent 308 project-domain redirect from the previous address and test paths, query strings and section fragments in a browser. The compatibility address for this release is `matthew-gallardo-portfolio.vercel.app`. Browser theme and tour storage is origin-specific, so the first visit on a new origin follows system preference. Update the resume separately if Matthew supplies a revised PDF. Never put a Windows path into a website URL.

## Release and rollback

Check both content routes, desktop/mobile in both themes, resume, contact, WakaTime success/failure, headings, keyboard focus, console, metadata, sitemap, robots and HTTPS. Record Lighthouse measurements and review any deviations from the 90 performance / 95 accessibility, best-practices and SEO targets. Preview noindex is intentional and can lower its SEO audit score.

Promote only a reviewed deployment. If an issue appears, restore a previous known-good deployment in the **new** Vercel project and revert the corresponding source change. Neither rollback nor preview testing requires touching the existing portfolio.
