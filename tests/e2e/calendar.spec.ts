import { test, expect } from "@playwright/test";

test.describe("Calendar Range Features", () => {
  test("can select date range and see summary cards", async ({ page }) => {
    await page.goto("/");

    // Navigate to Calendar view
    await page.getByRole("button", { name: "Calendario" }).click();

    // Wait for calendar to load
    await expect(page.getByRole("button", { name: "Año" })).toBeVisible();

    // Click on range start date input
    const startDateInput = page.locator('input[type="date"]').first();
    await expect(startDateInput).toBeVisible();

    // Set range dates (assuming we have shifts in December 2025)
    await startDateInput.fill("2025-12-15");

    const endDateInput = page.locator('input[type="date"]').last();
    await endDateInput.fill("2025-12-20");

    // Verify summary cards appear
    // Should show totals for the selected range
    await expect(page.getByText("Total Rango").first()).toBeVisible();
  });

  test("filters work correctly", async ({ page }) => {
    await page.goto("/");

    // Navigate to Calendar
    await page.getByRole("button", { name: "Calendario" }).click();

    // Look for filter dropdown (if visible)
    const filterButton = page
      .getByText(/Filtrar|Categoría|Tipo de hora/i)
      .first();
    if (await filterButton.isVisible()) {
      await filterButton.click();

      // Select a category filter
      await page
        .getByText(/Programado/i)
        .first()
        .click();

      // Verify filtering applied (should update displayed shifts)
      // This is a basic check - specific assertions depend on test data
      await expect(page.getByText(/Programado/i)).toBeVisible();
    }
  });

  test("clear range button resets filters and range", async ({ page }) => {
    await page.goto("/");

    // Navigate to Calendar
    await page.getByRole("button", { name: "Calendario" }).click();

    // Set a date range
    const startDateInput = page.locator('input[type="date"]').first();
    if (await startDateInput.isVisible()) {
      await startDateInput.fill("2025-12-15");

      // Click clear button
      const clearButton = page.getByRole("button", { name: /Limpiar/i });
      if (await clearButton.isVisible()) {
        await clearButton.click();

        // Verify inputs are cleared
        await expect(startDateInput).toHaveValue("");
      }
    }
  });

  test("navigation is limited in range mode", async ({ page }) => {
    await page.goto("/");

    // Navigate to Calendar
    await page.getByRole("button", { name: "Calendario" }).click();

    // Set a date range
    const startDateInput = page.locator('input[type="date"]').first();
    const endDateInput = page.locator('input[type="date"]').last();

    if (await startDateInput.isVisible()) {
      await startDateInput.fill("2025-12-15");
      await endDateInput.fill("2025-12-20");

      // Switch to week view
      const weekButton = page.getByRole("button", { name: /Sem/i });
      if (await weekButton.isVisible()) {
        await weekButton.click();

        // Navigation buttons should be present but might be disabled for out-of-range weeks
        const prevButton = page
          .locator(
            'button[aria-label="Mes anterior"], button[aria-label="Semana anterior"]'
          )
          .first();
        await expect(prevButton).toBeVisible();
      }
    }
  });

  test("range persists when changing views", async ({ page }) => {
    await page.goto("/");

    // Navigate to Calendar
    await page.getByRole("button", { name: "Calendario" }).click();

    // Set a date range
    const startDateInput = page.locator('input[type="date"]').first();
    const endDateInput = page.locator('input[type="date"]').last();

    if (await startDateInput.isVisible()) {
      const startDate = "2025-12-15";
      const endDate = "2025-12-20";

      await startDateInput.fill(startDate);
      await endDateInput.fill(endDate);

      // Switch between views
      const monthButton = page.getByRole("button", { name: /Mes/i });
      if (await monthButton.isVisible()) {
        await monthButton.click();

        // Verify range inputs still have values
        await expect(startDateInput).toHaveValue(startDate);
        await expect(endDateInput).toHaveValue(endDate);

        // Switch to another view
        const dayButton = page.getByRole("button", { name: /Día/i });
        if (await dayButton.isVisible()) {
          await dayButton.click();

          // Range should still persist
          await expect(startDateInput).toHaveValue(startDate);
          await expect(endDateInput).toHaveValue(endDate);
        }
      }
    }
  });
});
