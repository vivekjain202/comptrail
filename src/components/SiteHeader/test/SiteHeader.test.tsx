import SiteHeader from "../SiteHeader";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("SiteHeader", () => {
  it("links the logo back to the homepage", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "CompTrail" })).toHaveAttribute("href", "/");
  });

  it("links to the app builder", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Open the app" })).toHaveAttribute("href", "/app");
  });

  it("is not sticky by default", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("banner").className).not.toMatch(/sticky/);
  });

  it("is sticky when the sticky prop is set", () => {
    render(<SiteHeader sticky />);
    expect(screen.getByRole("banner").className).toMatch(/sticky/);
  });
});
