import { test, expect } from "@playwright/test";

test("add shift and verify in calendar", async ({ page }) => {
  await page.goto("/");

  // 1. Clock View: Add a shift
  // Assuming default time starts at 09:00 - 17:00
  // Fill inputs (they have labels "Entrada", "Salida", "Categoría")
  // We need to use exact matching or careful selectors

  // Wait for inputs to be ready (lazy loading)
  const entryInput = page.getByLabel("Entrada");
  await expect(entryInput).toBeVisible({ timeout: 10000 });
  await entryInput.fill("08:00");

  await page.getByLabel("Salida").fill("16:00");

  // Select Category (default might be "Programado")
  // Let's type a note
  await page.getByPlaceholder("Notas opcionales...").fill("Test Shift E2E");

  // Save
  await page.getByRole("button", { name: "Guardar" }).click();

  // Verify toast?
  await expect(page.getByText("Turno registrado correctamente")).toBeVisible({ timeout: 10000 });

  // 2. Switch to Calendar View
  await page.getByRole("button", { name: "Calendario" }).click();

  // 3. Verify Shift in Day view (default is usually month, need to select day or check grid)
  // Let's switch to "Day" view to see the list clearly
  await page.getByRole("button", { name: "Día" }).click();

  // Check if "Test Shift E2E" is visible
  await expect(page.getByText("Test Shift E2E")).toBeVisible();
});

