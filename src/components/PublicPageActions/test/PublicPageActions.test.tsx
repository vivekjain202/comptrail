import PublicPageActions from "../PublicPageActions";
import { getEditToken } from "@/lib/local-store";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("copies the current page link when Copy link is clicked", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    vi.mocked(getEditToken).mockReturnValue(null);
    render(<PublicPageActions slug="career" viewCount={1} />);

    await user.click(screen.getByRole("button", { name: /Copy link/ }));

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });
});
