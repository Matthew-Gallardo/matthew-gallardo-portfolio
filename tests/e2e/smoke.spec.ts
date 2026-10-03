import { test, expect } from "@playwright/test";

test("page renders without hydration errors and navigation works", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydration|react|uncaught/i.test(message.text())
    )
      errors.push(message.text());
  });
  await page.route("https://wakatime.com/**/*.svg", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="191" height="20"/>',
    }),
  );
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.emulateMedia({ colorScheme: "light" });
  await page.getByRole("switch", { name: "Dark mode" }).first().click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("link", { name: "All projects", exact: true }).click();
  await expect(page.locator("[data-project]")).toHaveCount(8);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/opengraph-image/,
  );
  await page.setViewportSize({ width: 375, height: 812 });
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("dialog").getByRole("link", { name: /Stack/ }).click();
  await expect(page).toHaveURL(/\/#stack$/);
  await expect(page.locator("#stack-heading")).toBeFocused();
  expect(errors).toEqual([]);
});
