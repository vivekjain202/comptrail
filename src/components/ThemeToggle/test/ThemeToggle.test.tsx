import ThemeToggle from "../ThemeToggle";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("ThemeToggle", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    vi.restoreAllMocks();
  });

  it("defaults to the light theme label when no data-theme is set", () => {
    render(<ThemeToggle />);
    expect(screen.getByLabelText("Switch to dark theme")).toBeInTheDocument();
  });

  it("switches to dark theme, persists it, and flips the label on click", async () => {
    const user = userEvent.setup();
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    render(<ThemeToggle />);

    await user.click(screen.getByLabelText("Switch to dark theme"));

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(setItem).toHaveBeenCalledWith("theme", "dark");
    expect(screen.getByLabelText("Switch to light theme")).toBeInTheDocument();
  });

  it("shows the light theme label when data-theme is already dark on mount", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    render(<ThemeToggle />);
    expect(screen.getByLabelText("Switch to light theme")).toBeInTheDocument();
  });
});
