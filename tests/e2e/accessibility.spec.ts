import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
  test("should not have any automatically detectable accessibility issues on Clock view", async ({
    page,
  }) => {
    await page.goto("http://localhost:5174");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have any automatically detectable accessibility issues on Calendar view", async ({
    page,
  }) => {
    await page.goto("http://localhost:5174");
    await page.waitForLoadState("networkidle");

    // Navigate to Calendar view
    await page.getByRole("button", { name: "Calendario" }).click();
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have any automatically detectable accessibility issues on Settings view", async ({
    page,
  }) => {
    await page.goto("http://localhost:5174");
    await page.waitForLoadState("networkidle");

    // Navigate to Settings view
    await page.getByRole("button", { name: "Ajustes" }).click();
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper keyboard navigation (Tab order)", async ({
    page,
  }) => {
    await page.goto("http://localhost:5174");
    await page.waitForLoadState("networkidle");

    // Verify that navigation buttons are focusable
    await page.keyboard.press("Tab");
    const relojButton = page.getByRole("button", { name: "Reloj" });
    await expect(relojButton).toBeFocused();

    await page.keyboard.press("Tab");
    const calendarioButton = page.getByRole("button", {
      name: "Calendario",
    });
    await expect(calendarioButton).toBeFocused();

    await page.keyboard.press("Tab");
    const ajustesButton = page.getByRole("button", { name: "Ajustes" });
    await expect(ajustesButton).toBeFocused();

    await page.keyboard.press("Tab");
    const themeButton = page.getByRole("button", { name: "Cambiar tema" });
    await expect(themeButton).toBeFocused();
  });

  test("should allow Escape key to close confirmation dialogs", async ({
    page,
  }) => {
    await page.goto("http://localhost:5174");
    await page.waitForLoadState("networkidle");

    // Navigate to Settings
    await page.getByRole("button", { name: "Ajustes" }).click();
    await page.waitForTimeout(500);

    // Add a category and then try to delete it
    await page.fill('input[placeholder="Añadir categoría"]', "Test Category");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);

    // Click delete button
    const deleteButtons = page.locator('button[aria-label="Eliminar"]');
    const firstDeleteButton = deleteButtons.first();
    await firstDeleteButton.click();
    await page.waitForTimeout(300);

    // Confirmation dialog should be visible
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Press Escape to close
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Dialog should be gone
    await expect(dialog).not.toBeVisible();
  });
});
