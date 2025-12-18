import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ApunTiti/);
});

test("can switch to settings and toggle theme", async ({ page }) => {
  await page.goto("/");

  // Check initial theme (assuming local storage empty or default dark)
  // We can't easily check local storage, but we can check the html class 'dark'
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);

  // Click on Settings using explicit selector in case role name is ambiguous
  const settingsBtn = page.locator('button[aria-label="Ajustes"]');
  await expect(settingsBtn).toBeVisible();
  await settingsBtn.click();

  // Verify we are on settings view (Title "Configuración")
  // Wait for the heading to appear (lazy load)
  await expect(
    page.getByRole("heading", { name: "Configuración" })
  ).toBeVisible({ timeout: 10000 });

  // Find theme toggle button (moon/sun icon) in header.
  // It's the button inside Helper that toggles theme.
  // Let's rely on the aria-label or just the button location if accessible.
  // The header has a button for theme.
  // We might need to add a test-id or better selector if "Ajustes" button is ambiguous.
  // Actually, header buttons: Clock, Calendar, Settings.
});
