import Collapsible from "../Collapsible";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("Collapsible", () => {
  it("toggles its content when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<Collapsible title="Details" defaultOpen={false}><p>Hidden content</p></Collapsible>);

    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Details" }));
    expect(screen.getByText("Hidden content")).toBeVisible();
  });

  it("notifies the parent when controlled", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<Collapsible title="Details" open onToggle={onToggle}><p>Content</p></Collapsible>);

    await user.click(screen.getByRole("button", { name: "Details" }));
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
