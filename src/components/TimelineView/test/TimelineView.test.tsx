import TimelineView from "../../TimelineView";
import { CompEntry } from "@/lib/types";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const entries: CompEntry[] = [
  {
    id: "a",
    date: "2020-01-01",
    company: "Acme",
    title: "Engineer",
    level: "L3",
    type: "new_job",
    base: 100_000,
    bonus: 0,
    equity: 0,
    note: "",
  },
  {
    id: "b",
    date: "2023-06-01",
    company: "Acme",
    title: "Senior Engineer",
    level: "L5",
    type: "promotion",
    base: 150_000,
    bonus: 20_000,
    equity: 30_000,
    note: "Relocated to a new office",
  },
];

describe("TimelineView", () => {
  it("shows a placeholder when there are no entries", () => {
    render(<TimelineView entries={[]} currency="USD" />);
    expect(screen.getByText("Your timeline will appear here.")).toBeVisible();
  });

  it("lists entries most recent first with their details", () => {
    render(<TimelineView entries={entries} currency="USD" />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText((_, el) => el?.textContent === "Senior Engineer · L5")).toBeVisible();
    expect(within(items[0]).getByText("Acme · Jun 2023 · Promotion")).toBeVisible();
    expect(within(items[0]).getAllByText("$200,000").length).toBeGreaterThan(0);
    expect(within(items[0]).getByText("Relocated to a new office")).toBeVisible();
    expect(within(items[1]).getByText((_, el) => el?.textContent === "Engineer · L3")).toBeVisible();
    expect(within(items[1]).getAllByText("$100,000").length).toBeGreaterThan(0);
  });

  it("shows percent change relative to the prior entry, and none for the earliest", () => {
    render(<TimelineView entries={entries} currency="USD" />);

    const items = screen.getAllByRole("listitem");
    expect(within(items[0]).getByText("+100.00%")).toBeVisible();
    expect(within(items[1]).queryByText(/%/)).not.toBeInTheDocument();
  });

  it("includes a compensation breakdown tooltip for each entry", () => {
    render(<TimelineView entries={entries} currency="USD" />);

    const items = screen.getAllByRole("listitem");
    expect(within(items[0]).getByLabelText("Senior Engineer compensation breakdown")).toBeInTheDocument();
    expect(within(items[0]).getByText("Base")).toBeInTheDocument();
    expect(within(items[0]).getByText("Equity")).toBeInTheDocument();
    expect(within(items[1]).getByLabelText("Engineer compensation breakdown")).toBeInTheDocument();
  });
});
