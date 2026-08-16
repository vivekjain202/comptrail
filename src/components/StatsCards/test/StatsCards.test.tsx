import StatsCards from "../StatsCards";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const entries = [
  { id: "a", date: "2020-01-01", company: "Acme", title: "Engineer", level: "", type: "new_job" as const, base: 100000, bonus: 0, equity: 0, note: "" },
  { id: "b", date: "2024-01-01", company: "Acme", title: "Senior", level: "", type: "promotion" as const, base: 200000, bonus: 0, equity: 0, note: "" },
];

describe("StatsCards", () => {
  it("shows derived statistics for a progression", () => {
    render(<StatsCards entries={entries} currency="USD" />);
    expect(screen.getByText("Total growth")).toBeVisible();
    expect(screen.getAllByText("+100.00%")).toHaveLength(2);
    expect(screen.getByText("$200,000")).toBeVisible();
  });
});
