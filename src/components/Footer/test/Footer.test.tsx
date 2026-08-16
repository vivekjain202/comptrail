import Footer from "../Footer";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Footer", () => {
  it("renders external links for LinkedIn, Discord, and Report an issue", () => {
    render(<Footer />);

    for (const name of ["LinkedIn", "Discord", "Report an issue"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
    }
  });
});
