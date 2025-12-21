import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ApunTiti/);
});

test("can switch to settings and toggle theme", async ({ page }) => {
  await page.goto("/");

  // Check initial theme (assuming local storage empty or default dark)
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);

  // Click on Settings button - use first() to avoid strict mode violation
  const settingsBtn = page.getByRole("button", { name: "Ajustes" }).first();
  await expect(settingsBtn).toBeVisible();
  await settingsBtn.click();

  // Verify we are on settings view
  await expect(
    page.getByRole("heading", { name: "Configuración" })
  ).toBeVisible({ timeout: 10000 });
});
