import ViewTracker from "../../ViewTracker";
import { getEditToken } from "@/lib/local-store";
import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/local-store", () => ({ getEditToken: vi.fn() }));

describe("ViewTracker", () => {
  beforeEach(() => {
    vi.mocked(getEditToken).mockReset();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({}));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("records a view when the viewer is not the owner", () => {
    vi.mocked(getEditToken).mockReturnValue(null);
    render(<ViewTracker slug="career" />);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/timelines/career/view", { method: "POST" });
  });

  it("does not record a view when the viewer owns the page", () => {
    vi.mocked(getEditToken).mockReturnValue("token-123");
    render(<ViewTracker slug="career" />);

    expect(fetch).not.toHaveBeenCalled();
  });
});
