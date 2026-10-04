import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const stops = [
  "welcome",
  "experience",
  "stack",
  "projects",
  "activity",
  "education",
  "contact",
];
const targets = [
  "hero-heading",
  ...stops.slice(1).map((id) => `${id}-heading`),
];
const guide = (page: Page) => page.locator(".tour-bubble");
const typed = (page: Page) => page.locator(".tour-message-typed");
async function freezeTime(page: Page) {
  const now = new Date("2026-10-04T12:00:00+08:00");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
}
async function ready(page: Page, id = "welcome") {
  await expect(guide(page)).toHaveAttribute("data-tour-step", id);
  await expect(guide(page)).toHaveAttribute("data-tour-ready", "true");
}
async function start(page: Page) {
  await page
    .getByRole("button", { name: "Take a tour with Matt", exact: true })
    .click();
  await ready(page);
}
async function startClocked(page: Page) {
  await page.getByRole("button", { name: /Take a tour with Matt|Take the tour again/ }).click();
  await expect(guide(page)).toHaveCount(1);
  await page.clock.runFor(1000);
  await ready(page);
}
async function advanceReduced(page: Page, next?: string) {
  await page.clock.runFor(8000);
  if (next) {
    await expect(guide(page)).toHaveAttribute("data-tour-step", next);
    await page.clock.runFor(100);
    await ready(page, next);
  } else {
    await expect(guide(page)).toHaveCount(0);
  }
}
test.beforeEach(async ({ page }) => {
  await page.route("https://wakatime.com/**/*.svg", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="191" height="20"/>',
    }),
  );
});

test("tour is opt-in, dismissal persists, and footer can restart it", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Take a tour with Matt" }),
  ).toBeVisible();
  await expect(guide(page)).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.getByRole("button", { name: "Dismiss tour invitation" }).click();
  await page.reload();
  await expect(page.locator(".tour-invitation")).toHaveCount(0);
  await page.getByRole("button", { name: "Take a tour", exact: true }).click();
  await ready(page);
  await expect(guide(page)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(guide(page)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Take the tour again" }),
  ).toBeFocused();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Take the tour again" }),
  ).toBeVisible();
});

test("direct section links and the projects route do not show an invitation", async ({
  page,
}) => {
  await page.goto("/#stack");
  await expect(
    page.getByRole("button", { name: "Take a tour", exact: true }),
  ).toHaveCount(1);
  await expect(page.locator(".tour-invitation")).toHaveCount(0);
  await page.goto("/projects");
  await expect(page.getByRole("button", { name: /Take.*tour/ })).toHaveCount(0);
});

test("quick typing waits for movement, reserves height and pauses both timers", async ({
  page,
}) => {
  await freezeTime(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Take a tour with Matt" }).click();
  await expect(guide(page)).toHaveCount(1);
  await expect(typed(page)).toHaveText("");
  await expect(page.getByRole("button", { name: /^(Back|Next|Finish)$/ })).toHaveCount(0);
  await page.clock.runFor(1000);
  await ready(page);
  const fullText = (await page.locator(".tour-message-reserve").textContent())!;
  const initialBox = await guide(page).boundingBox();
  const live = page.locator("#matt-tour-description");
  await expect(live).toHaveText(fullText);
  await live.evaluate((element) => {
    element.setAttribute("data-updates", "0");
    new MutationObserver(() => element.setAttribute("data-updates", String(Number(element.getAttribute("data-updates")) + 1))).observe(element, { childList: true, characterData: true, subtree: true });
  });
  const before = (await typed(page).textContent())!.length;
  await page.clock.runFor(180);
  const after = (await typed(page).textContent())!.length;
  expect(after - before).toBeGreaterThanOrEqual(9);
  expect(after - before).toBeLessThanOrEqual(11);
  expect(fullText.startsWith((await typed(page).textContent())!)).toBe(true);
  await page.getByRole("button", { name: "Pause tour", exact: true }).click();
  const partial = await typed(page).textContent();
  await page.clock.runFor(12000);
  await expect(typed(page)).toHaveText(partial!);
  await expect(page.locator(".tour-caret")).toHaveCSS("animation-name", "none");
  await ready(page);
  await page.getByRole("button", { name: "Resume tour", exact: true }).click();
  await page.clock.runFor((fullText.length - partial!.length) * 18 + 18);
  await expect(page.locator(".tour-message")).toHaveAttribute("data-tour-phase", "reading");
  await expect(typed(page)).toHaveText(fullText);
  await expect(live).toHaveAttribute("data-updates", "0");
  await expect(page.locator(".tour-caret")).toHaveCount(0);
  const fullBox = await guide(page).boundingBox();
  expect(fullBox!.height).toBe(initialBox!.height);
  expect(fullBox!.y).toBe(initialBox!.y);
  await page.clock.runFor(1000);
  await page.getByRole("button", { name: "Pause tour" }).click();
  await page.clock.runFor(10000);
  await ready(page);
  await page.getByRole("button", { name: "Resume tour" }).click();
  await page.clock.runFor(1400);
  await ready(page);
  await page.clock.runFor(200);
  await expect(guide(page)).toHaveAttribute("data-tour-step", "experience");
  await page.clock.runFor(1000);
  await ready(page, "experience");
  await page.keyboard.press("Escape");
  await page.clock.runFor(20000);
  await expect(guide(page)).toHaveCount(0);
});

test("all seven typed messages advance and complete automatically with replay", async ({ page }) => {
  await freezeTime(page);
  await page.goto("/");
  await startClocked(page);
  for (let index = 0; index < stops.length; index++) {
    await ready(page, stops[index]);
    const text = (await page.locator(".tour-message-reserve").textContent())!;
    const remaining = text.length - (await typed(page).textContent())!.length;
    await page.clock.runFor(remaining * 18 + 20);
    await expect(typed(page)).toHaveText(text);
    await expect(page.locator(".tour-message")).toHaveAttribute("data-tour-phase", "reading");
    await page.clock.runFor(2400);
    await ready(page, stops[index]);
    await page.clock.runFor(150);
    if (index < stops.length - 1) {
      await expect(guide(page)).toHaveAttribute("data-tour-step", stops[index + 1]);
      await page.clock.runFor(1000);
    }
  }
  await expect(guide(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Take the tour again" })).toBeFocused();
  await startClocked(page);
  await expect(page.locator(".tour-message")).toHaveAttribute("data-tour-phase", "typing");
});

test("visitor control pauses playback and navigation cleans up the tour", async ({
  page,
}) => {
  await page.goto("/");
  await start(page);
  await page.mouse.wheel(0, 100);
  await expect(page.getByRole("button", { name: "Resume tour" })).toBeVisible();
  await page.getByRole("button", { name: "Resume tour" }).click();
  await page.evaluate(() => window.scrollTo({ top: scrollY + 64, behavior: "instant" }));
  await expect(page.getByRole("button", { name: "Resume tour" })).toBeVisible();
  await page.getByRole("button", { name: "Resume tour" }).click();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("button", { name: "Resume tour" })).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("button", { name: "Resume tour" })).toBeVisible();
  await page.getByRole("link", { name: "All projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(guide(page)).toHaveCount(0);
  await expect(page.locator(".tour-pointer")).toHaveCount(0);
});

test("mobile navigation ends the guide without taking focus from the menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await start(page);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(guide(page)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
});

test("reduced motion reveals text immediately for eight seconds, skips missing targets and tolerates blocked storage", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await freezeTime(page);
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page.goto("/");
  await startClocked(page);
  await expect(page.getByRole("button", { name: "Pause tour" })).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
  await expect(page.getByRole("button", { name: "Pause tour" })).toBeVisible();
  await expect(page.locator(".tour-caret")).toHaveCount(0);
  await expect(typed(page)).toHaveText((await page.locator(".tour-message-reserve").textContent())!);
  await page.clock.runFor(6500);
  await ready(page);
  await page.evaluate(() =>
    document.getElementById("experience-heading")?.remove(),
  );
  await page.clock.runFor(1600);
  await expect(guide(page)).toHaveAttribute("data-tour-step", "stack");
  await page.clock.runFor(100);
  await ready(page, "stack");
  await page.evaluate(() => document.getElementById("stack-heading")?.remove());
  await page.clock.runFor(100);
  await expect(guide(page)).toHaveAttribute("data-tour-step", "projects");
  await page.clock.runFor(100);
  await ready(page, "projects");
  await page.getByRole("button", { name: "Skip tour" }).click();
  await expect(
    page.getByRole("button", { name: "Take the tour again" }),
  ).toBeVisible();
  await expect(page.locator("[data-tour-active]")).toHaveCount(0);
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`${colorScheme}: all tour stops fit five widths and remain accessible`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await freezeTime(page);
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
      await page.goto("/");
      await startClocked(page);
      for (let index = 0; index < stops.length; index++) {
        await ready(page, stops[index]);
        const box = await guide(page).boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.y + box!.height).toBeLessThanOrEqual(
          page.viewportSize()!.height,
        );
        const heading = await page.locator(`#${targets[index]}`).boundingBox();
        expect(heading!.y).toBeGreaterThanOrEqual(width < 1024 ? 64 : 0);
        expect(heading!.y + heading!.height).toBeLessThanOrEqual(box!.y);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await advanceReduced(page, stops[index + 1]);
      }
      await expect(guide(page)).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Take the tour again" }),
      ).toBeVisible();
    }
  });
  test(`${colorScheme}: the typing guide remains accessible`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await start(page);
    await page.getByRole("button", { name: "Pause tour" }).click();
    // Axe uses its own timers and may scroll/focus the page while auditing.
    // Run it with real time, separately from the automatic pacing assertions.
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  });
}

test("short screens, orientation changes and enlarged text keep the guide usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 400 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await freezeTime(page);
  await page.goto("/");
  await startClocked(page);
  await page.addStyleTag({
    content: ".tour-message { font-size: 28px; line-height: 1.5; }",
  });
  await advanceReduced(page, "experience");
  await ready(page, "experience");
  await page.setViewportSize({ width: 812, height: 375 });
  await expect
    .poll(async () => {
      const box = await guide(page).boundingBox();
      return box!.y + box!.height;
    })
    .toBeLessThanOrEqual(375);
  await page.getByRole("button", { name: "Skip tour" }).click();
  await expect(guide(page)).toHaveCount(0);
});
