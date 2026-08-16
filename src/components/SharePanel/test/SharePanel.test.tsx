import SharePanel from "../SharePanel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

let writeText: ReturnType<typeof vi.fn>;

describe("SharePanel", () => {
  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  });

  it("saves an unsaved timeline", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SharePanel slug={null} saving={false} error={null} onSave={onSave} />);
    await user.click(screen.getByRole("button", { name: "Save & get link" }));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it("shows and copies the public link", async () => {
    const user = userEvent.setup();
    render(<SharePanel slug="career" viewCount={2} saving={false} error={null} onSave={vi.fn()} />);
    await user.click(screen.getByLabelText("Copy link"));
    expect(screen.getByLabelText("Copy link").querySelector(".lucide-check")).toBeInTheDocument();
    expect(screen.getByText("2 views")).toBeVisible();
  });
});
