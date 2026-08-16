import SectionShareButton from "../SectionShareButton";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("SectionShareButton", () => {
  it("is disabled and does nothing when slug is not provided", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<SectionShareButton slug={null} anchor="stats" />);

    const button = screen.getByLabelText("Copy link to this section");
    expect(button).toBeDisabled();

    await user.click(button);
    expect(writeText).not.toHaveBeenCalled();
  });

  it("copies the section link and shows the copied icon when slug is provided", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<SectionShareButton slug="career" anchor="stats" />);

    const button = screen.getByLabelText("Copy link to this section");
    expect(button).toBeEnabled();

    await user.click(button);

    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/t/career#stats`);
    expect(button.querySelector(".lucide-check")).toBeInTheDocument();
  });
});
