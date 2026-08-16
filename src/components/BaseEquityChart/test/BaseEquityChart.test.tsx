import BaseEquityChart from "../BaseEquityChart";
import { CompEntry } from "@/lib/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const entryWithEquity = (id: string, date: string, base: number, equity: number): CompEntry => ({
  id,
  date,
  company: "Acme",
  title: `Role ${id}`,
  level: "L3",
  type: "raise",
  base,
  bonus: 0,
  equity,
  note: "",
});

describe("BaseEquityChart", () => {
  it("renders nothing when fewer than two entries have equity", () => {
    const entries = [entryWithEquity("a", "2020-01-01", 100_000, 0), entryWithEquity("b", "2021-01-01", 110_000, 5_000)];
    const { container } = render(<BaseEquityChart entries={entries} currency="USD" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the chart when at least two entries have equity", () => {
    const entries = [
      entryWithEquity("a", "2020-01-01", 100_000, 10_000),
      entryWithEquity("b", "2021-01-01", 110_000, 20_000),
    ];
    render(<BaseEquityChart entries={entries} currency="USD" />);
    expect(screen.getByRole("heading", { name: "Base vs equity" })).toBeVisible();
    expect(screen.getByText("Base salary")).toBeVisible();
    expect(screen.getByText("Equity")).toBeVisible();
  });

  it("shows a tooltip with base and equity values on hover", () => {
    const entries = [
      entryWithEquity("a", "2020-01-01", 100_000, 10_000),
      entryWithEquity("b", "2021-06-01", 110_000, 20_000),
    ];
    render(<BaseEquityChart entries={entries} currency="USD" />);

    expect(screen.queryByText("Base: $110,000")).not.toBeInTheDocument();

    const point = screen.getByLabelText("Role b base and equity for Jun 2021");
    fireEvent.mouseEnter(point);

    expect(screen.getByText("Base: $110,000")).toBeVisible();
    expect(screen.getByText("Equity: $20,000")).toBeVisible();

    fireEvent.mouseLeave(point);
    expect(screen.queryByText("Base: $110,000")).not.toBeInTheDocument();
  });

  it("keeps a zero-equity value visually distinct from the smallest positive value on the log scale", () => {
    // Regression: the smallest positive value in the dataset could map to
    // fraction 0 on the log scale, landing on the exact same baseline pixel
    // reserved for an actual zero.
    const entries = [
      entryWithEquity("a", "2020-01-01", 1_212, 0),
      entryWithEquity("b", "2021-01-01", 137_567, 50_000),
      entryWithEquity("c", "2022-01-01", 1_997_045, 500_000),
    ];
    const { container } = render(<BaseEquityChart entries={entries} currency="USD" />);

    const dots = Array.from(container.querySelectorAll("div.absolute.rounded-full")) as HTMLElement[];
    const [aBase, aEquity] = dots;

    const aBaseTop = parseFloat(aBase.style.top);
    const aEquityTop = parseFloat(aEquity.style.top);

    expect(Math.abs(aBaseTop - aEquityTop)).toBeGreaterThan(5);
  });

  it("hides the share and export actions in read-only mode", () => {
    const entries = [
      entryWithEquity("a", "2020-01-01", 100_000, 10_000),
      entryWithEquity("b", "2021-01-01", 110_000, 20_000),
    ];
    render(<BaseEquityChart entries={entries} currency="USD" readOnly />);
    expect(screen.queryByLabelText("Copy link to this section")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Download options for base vs equity chart")).not.toBeInTheDocument();
  });
});
