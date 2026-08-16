import { expect, test } from "@playwright/test";

async function addEntry(
  page: import("@playwright/test").Page,
  entry: { date: string; company: string; title: string; base: string; bonus?: string; equity?: string }
) {
  await page.getByLabel("Date").fill(entry.date);
  await page.getByLabel("Company").fill(entry.company);
  await page.getByLabel("Title").fill(entry.title);
  await page.getByLabel("Base salary").fill(entry.base);
  if (entry.bonus) await page.getByLabel("Bonus (optional)").fill(entry.bonus);
  if (entry.equity) await page.getByLabel("Equity/yr (optional)").fill(entry.equity);
  await page.getByRole("button", { name: /add to timeline|save changes/i }).click();
}

test("a creator can edit an existing entry in place", async ({ page }) => {
  await page.goto("/app");

  await addEntry(page, { date: "2022-01-01", company: "Acme Labs", title: "Engineer", base: "100000" });
  await addEntry(page, { date: "2023-01-01", company: "Acme Labs", title: "Senior Engineer", base: "150000" });
  await expect(page.getByRole("heading", { name: "Your entries (2)" })).toBeVisible();

  await page.getByLabel("Edit Engineer at Acme Labs").click();
  await expect(page.getByLabel("Company")).toHaveValue("Acme Labs");
  await expect(page.getByRole("button", { name: "Save changes" })).toBeVisible();

  await page.getByLabel("Title").fill("Engineer II");
  await page.getByLabel("Base salary").fill("110000");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByRole("heading", { name: "Your entries (2)" })).toBeVisible();
  await expect(page.getByText("Engineer II · Acme Labs")).toBeVisible();
  await expect(page.getByText("$110,000").first()).toBeVisible();
});

test("a creator can remove an entry from the timeline", async ({ page }) => {
  await page.goto("/app");

  await addEntry(page, { date: "2022-01-01", company: "Acme Labs", title: "Engineer", base: "100000" });
  await addEntry(page, { date: "2023-01-01", company: "Acme Labs", title: "Senior Engineer", base: "150000" });
  await expect(page.getByRole("heading", { name: "Your entries (2)" })).toBeVisible();

  await page.getByLabel("Remove Engineer at Acme Labs").click();

  await expect(page.getByRole("heading", { name: "Your entries (1)" })).toBeVisible();
  await expect(page.getByText("Engineer · Acme Labs", { exact: true })).not.toBeVisible();
  await expect(page.getByText("Senior Engineer · Acme Labs")).toBeVisible();
});

test("switching currency updates the displayed compensation amounts", async ({ page }) => {
  await page.goto("/app");

  await addEntry(page, { date: "2022-01-01", company: "Acme Labs", title: "Engineer", base: "100000" });
  await expect(page.getByText("$100,000").first()).toBeVisible();

  await page.getByRole("button", { name: "Card details" }).click();
  await page.getByLabel("Currency").selectOption("EUR");

  await expect(page.getByText("€100,000").first()).toBeVisible();
});

test("hovering a timeline entry's total shows its base, bonus, and equity breakdown", async ({ page }) => {
  await page.goto("/app");

  await addEntry(page, {
    date: "2023-01-01",
    company: "Acme Labs",
    title: "Senior Engineer",
    base: "150000",
    bonus: "20000",
    equity: "30000",
  });

  const timeline = page.locator("#timeline-section");
  await timeline.getByLabel("Senior Engineer compensation breakdown").hover();

  await expect(timeline.getByText("Base", { exact: true })).toBeVisible();
  await expect(timeline.getByText("Bonus", { exact: true })).toBeVisible();
  await expect(timeline.getByText("Equity", { exact: true })).toBeVisible();
  await expect(timeline.getByText("$150,000")).toBeVisible();
  await expect(timeline.getByText("$20,000")).toBeVisible();
  await expect(timeline.getByText("$30,000")).toBeVisible();
});

test("a returning owner can update their saved timeline", async ({ page }) => {
  let putBody: unknown = null;
  await page.route("**/api/timelines/my-career", async (route) => {
    if (route.request().method() === "PUT") {
      putBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          slug: "my-career",
          title: (putBody as { title: string }).title,
          note: "",
          learnings: "",
          currency: "USD",
          entries: (putBody as { entries: unknown[] }).entries,
          updatedAt: new Date().toISOString(),
          viewCount: 5,
        }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        title: "CompTrail",
        note: "",
        learnings: "",
        currency: "USD",
        entries: [],
        viewCount: 5,
      }),
    });
  });

  await page.addInitScript(() => {
    localStorage.setItem("comptrail:timeline:my-career", "test-edit-token");
  });

  await page.goto("/app?slug=my-career");
  await expect(page.getByText("5 views")).toBeVisible();

  await addEntry(page, { date: "2023-01-01", company: "Acme Labs", title: "Engineer", base: "120000" });
  await page.getByRole("button", { name: "Update link" }).first().click();

  await expect(page.getByText("Unsaved changes")).not.toBeVisible();
  expect((putBody as { editToken: string }).editToken).toBe("test-edit-token");
  expect((putBody as { entries: { title: string }[] }).entries[0].title).toBe("Engineer");
});
