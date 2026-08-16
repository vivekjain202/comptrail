import { expect, test } from "@playwright/test";

test("landing page introduces the product and opens the timeline builder", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "See how a career actually grows, in numbers." })).toBeVisible();
  await expect(page.getByText("Anonymous by default")).toBeVisible();

  await page.getByRole("link", { name: /build your timeline/i }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading", { name: "Salary Progression" })).toBeVisible();
});

test("a creator can add career events and see progression statistics", async ({ page }) => {
  await page.goto("/app");

  await page.getByLabel("Date").fill("2022-01-01");
  await page.getByLabel("Company").fill("Acme Labs");
  await page.getByLabel("Title").fill("Software Engineer");
  await page.getByLabel("Base salary").fill("100000");
  await page.getByLabel("Bonus (optional)").fill("10000");
  await page.getByRole("button", { name: "Add to timeline" }).click();

  await page.getByLabel("Date").fill("2024-01-01");
  await page.getByLabel("Company").fill("Acme Labs");
  await page.getByLabel("Title").fill("Senior Engineer");
  await page.getByLabel("Base salary").fill("150000");
  await page.getByLabel("Bonus (optional)").fill("20000");
  await page.getByLabel("Equity/yr (optional)").fill("30000");
  await page.getByRole("button", { name: "Add to timeline" }).click();

  await expect(page.getByRole("heading", { name: "Your entries (2)" })).toBeVisible();
  await expect(page.getByText("Latest total comp")).toBeVisible();
  await expect(page.getByText("$200,000").first()).toBeVisible();
  await expect(page.getByText("Senior Engineer · Acme Labs")).toBeVisible();
});

test("a creator can save a timeline and receive a shareable link", async ({ page }) => {
  await page.route("**/api/timelines", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ slug: "my-career", editToken: "test-edit-token" }),
    });
  });

  await page.goto("/app");
  await page.getByLabel("Date").fill("2023-01-01");
  await page.getByLabel("Company").fill("Acme Labs");
  await page.getByLabel("Title").fill("Software Engineer");
  await page.getByLabel("Base salary").fill("120000");
  await page.getByRole("button", { name: "Add to timeline" }).click();

  await page.getByRole("button", { name: "Save & get link" }).click();

  await expect(page).toHaveURL(/\/app\?slug=my-career$/);
  await expect(page.locator("input[readonly]")).toHaveValue("http://127.0.0.1:3100/t/my-career");
  await expect(page.getByRole("link", { name: /view public page/i })).toHaveAttribute("href", "/t/my-career");
});
