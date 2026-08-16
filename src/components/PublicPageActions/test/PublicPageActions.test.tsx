import PublicPageActions from "../PublicPageActions";
import { getEditToken } from "@/lib/local-store";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/local-store", () => ({ getEditToken: vi.fn() }));

describe("PublicPageActions", () => {
  beforeEach(() => {
    vi.mocked(getEditToken).mockReset();
  });

  it("does not render an edit link and shows singular view count when there is no edit token", async () => {
    vi.mocked(getEditToken).mockReturnValue(null);
    render(<PublicPageActions slug="career" viewCount={1} />);

    expect(await screen.findByText("1 view")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Edit" })).not.toBeInTheDocument();
  });

  it("shows plural view count when there is no edit token", async () => {
    vi.mocked(getEditToken).mockReturnValue(null);
    render(<PublicPageActions slug="career" viewCount={3} />);

    expect(await screen.findByText("3 views")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Edit" })).not.toBeInTheDocument();
  });

  it("renders an edit link when an edit token exists", async () => {
    vi.mocked(getEditToken).mockReturnValue("token-123");
    render(<PublicPageActions slug="career" viewCount={5} />);

    const link = await screen.findByRole("link", { name: "Edit" });
    expect(link).toHaveAttribute("href", "/app?slug=career");
  });

  it("does not render a copy link button", async () => {
    vi.mocked(getEditToken).mockReturnValue(null);
    render(<PublicPageActions slug="career" viewCount={1} />);

    expect(await screen.findByText("1 view")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /copy link/i })).not.toBeInTheDocument();
  });
});
