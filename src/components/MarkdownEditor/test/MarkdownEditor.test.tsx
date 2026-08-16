import MarkdownEditor from "../../MarkdownEditor";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("MarkdownEditor", () => {
  it("switches to preview and saves changes", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<MarkdownEditor value={"## Lesson"} onChange={vi.fn()} onSave={onSave} hasChanges />);

    await user.click(screen.getByRole("tab", { name: "Preview" }));
    expect(screen.getByText("Lesson")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onSave).toHaveBeenCalledOnce();
  });
});
