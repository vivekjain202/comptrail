import MilestoneChart from "../../MilestoneChart";
import { CompEntry } from "@/lib/types";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    note: "",
  },
];

describe("MilestoneChart", () => {
  it("shows a placeholder when there are no entries", () => {
    render(<MilestoneChart entries={[]} currency="USD" title="Career" note="" />);
    expect(screen.getByText("Add career events to build your progression card.")).toBeVisible();
  });

  it("renders a point per entry with its date and compact total", () => {
    render(<MilestoneChart entries={entries} currency="USD" title="Career" note="" />);

    expect(screen.getByRole("heading", { name: "Career" })).toBeVisible();
    expect(screen.getByText("2020 – 2023")).toBeVisible();
    expect(screen.getByText("Jan 2020")).toBeVisible();
    expect(screen.getByText("Jun 2023")).toBeVisible();
    expect(screen.getByText("$100.0K")).toBeVisible();
    expect(screen.getByText("$200.0K")).toBeVisible();
  });

  it("shows the promotion and bonus legend only when relevant entries exist", () => {
    render(<MilestoneChart entries={entries} currency="USD" title="Career" note="" />);
    expect(screen.getByText("Promotion")).toBeVisible();
    expect(screen.getByText("One-time bonus")).toBeVisible();
    expect(screen.queryByText("Relocation")).not.toBeInTheDocument();
  });

  it("shows a compensation breakdown tooltip on hover and hides it on unhover", async () => {
    const user = userEvent.setup();
    render(<MilestoneChart entries={entries} currency="USD" title="Career" note="" />);

    expect(screen.queryByText("Base")).not.toBeInTheDocument();
    expect(screen.queryByText("Equity")).not.toBeInTheDocument();

    const point = screen.getByLabelText("Senior Engineer compensation breakdown");
    await user.hover(point);

    expect(screen.getByText("Base")).toBeVisible();
    expect(screen.getByText("Equity")).toBeVisible();
    expect(screen.getByText("$200,000")).toBeVisible();

    await user.unhover(point);
    expect(screen.queryByText("Base")).not.toBeInTheDocument();
  });

  it("shows the tooltip on focus and hides it on blur", () => {
    render(<MilestoneChart entries={entries} currency="USD" title="Career" note="" />);

    const point = screen.getByLabelText("Engineer compensation breakdown");
    fireEvent.focus(point);
    expect(screen.getByText("Base")).toBeVisible();

    fireEvent.blur(point);
    expect(screen.queryByText("Base")).not.toBeInTheDocument();
  });

  it("shows the note callout when a note is provided", () => {
    render(<MilestoneChart entries={entries} currency="USD" title="Career" note="Delayed appraisal cycle" />);
    expect(screen.getByText(/Delayed appraisal cycle/)).toBeVisible();
  });

  it("omits the note callout when the note is blank", () => {
    render(<MilestoneChart entries={entries} currency="USD" title="Career" note="   " />);
    expect(screen.queryByText("Note:")).not.toBeInTheDocument();
  });
});
