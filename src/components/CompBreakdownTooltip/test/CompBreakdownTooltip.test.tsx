import CompBreakdownTooltip from "../CompBreakdownTooltip";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const entry = {
  id: "entry-1",
  date: "2024-01-01",
  company: "Acme",
  title: "Senior Engineer",
  level: "L5",
  type: "promotion" as const,
  base: 150_000,
  bonus: 20_000,
  equity: 30_000,
  note: "",
};

describe("CompBreakdownTooltip", () => {
  it("shows the full compensation breakdown", () => {
    render(<CompBreakdownTooltip entry={entry} currency="USD" />);

    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
    expect(screen.getByText("Base")).toBeInTheDocument();
    expect(screen.getByText("Bonus")).toBeInTheDocument();
    expect(screen.getByText("Equity")).toBeInTheDocument();
    expect(screen.getByText("$200,000")).toBeInTheDocument();
  });
});
