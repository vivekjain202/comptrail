import ScrollToHash from "../../ScrollToHash";
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("ScrollToHash", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing when there is no hash", () => {
    const { container } = render(<ScrollToHash />);
    expect(container).toBeEmptyDOMElement();
  });

  it("scrolls the matching element into view when a hash is present", () => {
    Object.defineProperty(window, "location", {
      value: { ...window.location, hash: "#my-section" },
      writable: true,
    });
    Element.prototype.scrollIntoView = vi.fn();

    render(
      <>
        <div id="my-section" />
        <ScrollToHash />
      </>
    );

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });
});
