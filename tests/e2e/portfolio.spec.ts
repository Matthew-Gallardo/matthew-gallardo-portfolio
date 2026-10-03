import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const badge =
  '<svg xmlns="http://www.w3.org/2000/svg" width="191" height="20"><rect width="191" height="20" fill="#151922"/><text x="8" y="14" fill="white">WakaTime test fixture</text></svg>';
test.beforeEach(async ({ page }) => {
  await page.route("https://wakatime.com/**/*.svg", (route) =>
    route.fulfill({ contentType: "image/svg+xml", body: badge }),
  );
});

test("experience leads the page and professional work leads the projects", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    await page
      .locator("main .section")
      .evaluateAll((sections) => sections.map((section) => section.id)),
  ).toEqual([
    "experience",
    "stack",
    "projects",
    "activity",
    "education",
    "contact",
  ]);
  await expect(page.locator(".timeline-marker")).toHaveCount(2);
  await expect(page.locator(".timeline-current")).toHaveCount(1);
  await expect(page.locator("[data-project]").first()).toHaveAttribute(
    "data-project",
    "security-bank-app",
  );
  await expect(
    page.getByText("Still in the backlog.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/days to go|40-year career|2064/)).toHaveCount(0);
});

test("career timer uses the confirmed date and can pause and resume", async ({
  page,
}) => {
  const now = new Date("2026-10-03T12:34:00+08:00");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.goto("/");
  await expect(page.locator('[data-unit="years"]')).toHaveText("2");
  await expect(page.locator('[data-unit="months"]')).toHaveText("1");
  await expect(page.locator('[data-unit="days"]')).toHaveText("1");
  await expect(page.locator(".career-clock")).not.toContainText(
    /September|2024|Since/,
  );
  await expect(page.locator('[data-unit="hours"]')).toHaveText("12");
  await expect(page.getByRole("timer")).toHaveAttribute("aria-live", "off");
  await page.clock.runFor(2000);
  await expect(page.locator('[data-unit="seconds"]')).toHaveText("02");
  await page.getByRole("button", { name: "Pause career timer" }).click();
  await page.clock.runFor(5000);
  await expect(page.locator('[data-unit="seconds"]')).toHaveText("02");
  await page.getByRole("button", { name: "Resume career timer" }).click();
  await expect(page.locator('[data-unit="seconds"]')).toHaveText("07");
});

test("WakaTime canvas and presentation follow the active theme", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.locator(".activity-disclosure summary").click();
  await expect(page.locator(".activity-chart")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await expect(page.locator(".activity-chart img")).toHaveCSS(
    "filter",
    "invert(1) hue-rotate(180deg)",
  );
  await page.getByRole("switch", { name: "Dark mode" }).first().click();
  await expect(page.locator(".activity-chart img")).toHaveCSS("filter", "none");
  await expect(page.locator(".activity-chart")).toHaveCSS(
    "background-color",
    "rgb(21, 25, 34)",
  );
});

test("all content, links, and resume are present without unsupported sections", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Matthew.*Gallardo/,
  );
  await expect(
    page.getByRole("heading", {
      name: "Backend Software Engineer",
      exact: true,
    }),
  ).toBeVisible();
  const pdf = await request.get("/resume/matthew-gallardo-resume-2026.pdf");
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  expect(pdf.headers()["content-disposition"]).toContain("attachment");
  await expect(
    page.getByRole("link", { name: "Email Matthew", exact: true }).last(),
  ).toHaveAttribute("href", "mailto:gallardomatthew8@gmail.com");
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Download resume", exact: true })
    .last()
    .click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "Matthew-Gallardo-Resume-2026.pdf",
  );
  await page.getByRole("link", { name: "All projects", exact: true }).click();
  await expect(page.locator("[data-project]")).toHaveCount(8);
  await expect(
    page.getByRole("link", {
      name: "Visit Security Bank App official app page",
    }),
  ).toHaveAttribute(
    "href",
    "https://www.securitybank.com/apps/personal-banking/",
  );
  await expect(
    page
      .locator('[data-project="security-bank-app"]')
      .getByRole("link", { name: /repository/ }),
  ).toHaveCount(0);
  await expect(page.getByRole("link", { name: /repository$/ })).toHaveCount(7);
  await expect(page.getByRole("link", { name: /demo$/ })).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "View SackCal live demo" }),
  ).toHaveAttribute(
    "href",
    "https://bruteforce-knapsack-algorithm.vercel.app/",
  );
  const body = await page.locator("body").innerText();
  expect(body).not.toMatch(
    /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/u,
  );
  expect(await page.locator('a[href="#"]').count()).toBe(0);
  for (const name of [
    "Blog",
    "Shop",
    "Gear",
    "Resources",
    "Collab",
    "Collabs",
    "Consulting",
  ])
    await expect(page.getByRole("link", { name, exact: true })).toHaveCount(0);
});

test("system preference and explicit themes persist across reload and navigation", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const theme = page.getByRole("switch", { name: "Dark mode" }).first();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(theme).toBeChecked();
  await theme.click();
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.getByRole("link", { name: "All projects", exact: true }).click();
  await expect(theme).not.toBeChecked();
  await theme.focus();
  await page.keyboard.press("Space");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page
    .getByRole("button", { name: "Auto (use system theme)" })
    .first()
    .click();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("mobile dialog supports focus containment, Escape, and anchored navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toBeFocused();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBeTruthy();
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: /Experience/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("#experience-heading")).toBeFocused();
  await expect(page).toHaveURL(/#experience$/);
  await expect
    .poll(async () => (await page.locator("#experience").boundingBox())!.y)
    .toBeGreaterThanOrEqual(64);
});

test("clipboard success and denied access provide accessible feedback", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as Window & { copied?: string }).copied = text;
        },
      },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(
    page.getByText("Email address copied.", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => (window as Window & { copied?: string }).copied),
  ).toBe("gallardomatthew8@gmail.com");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
    }),
  );
  await page.getByRole("button", { name: "Copied", exact: true }).click();
  await expect(page.getByText(/Couldn’t copy the email address/)).toBeVisible();
});

test("WakaTime disclosure loads attributed all-time data and handles failure", async ({
  page,
}) => {
  await page.goto("/");
  const disclosure = page.locator(".activity-disclosure");
  await expect(disclosure).not.toHaveAttribute("open");
  await disclosure.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open");
  await expect(disclosure.locator("img")).toBeVisible();
  await expect
    .poll(() =>
      disclosure
        .locator("img")
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(
    page.getByText(
      "Reflects tracked editor activity and may not include all professional work.",
    ),
  ).toHaveCount(0);
  await page.route("https://wakatime.com/**/*.svg", (route) =>
    route.fulfill({ status: 404, body: "Unavailable" }),
  );
  await page.reload();
  await disclosure.locator("summary").click();
  await expect(disclosure.getByRole("status")).toHaveText(
    "WakaTime statistics are temporarily unavailable.",
  );
  await expect(
    page.getByRole("link", { name: "View profile" }),
  ).toHaveAttribute("href", "https://wakatime.com/@MattG");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

for (const width of [320, 375, 768, 1024, 1440]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${width}px ${colorScheme}: responsive layout and media placeholders`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ colorScheme });
      for (const path of ["/", "/projects"]) {
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBeTruthy();
        await expect(
          page.locator(".project-placeholder").first(),
        ).toBeVisible();
        await expect(page.locator(".project-placeholder")).toHaveCount(
          path === "/" ? 4 : 8,
        );
      }
    });
  }
}

test("reduced motion preserves visible content and removes smooth scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator(".reveal").first()).toHaveCSS("opacity", "1");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

test("essential content and navigation work without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Section navigation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Download resume", exact: true }).last(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).not.toBeVisible();
  await page.getByRole("link", { name: "All projects", exact: true }).click();
  await expect(page.locator("[data-project]")).toHaveCount(8);
  await context.close();
});

for (const theme of ["light", "dark"] as const) {
  test(`${theme}: accessible pages and mobile menu`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    for (const path of ["/", "/projects"]) {
      await page.goto(path);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  });
}
