import LearningsSection from "../LearningsSection";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("LearningsSection", () => {
  it("does not render an empty learnings section", () => {
    const { container } = render(<LearningsSection learnings="   " />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders markdown learnings when supplied", () => {
    render(<LearningsSection learnings={"## Negotiate\n\nAlways compare offers."} />);

    expect(screen.getByRole("heading", { name: "Career Learnings" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Negotiate" })).toBeInTheDocument();
    expect(screen.getByText("Always compare offers.")).toBeInTheDocument();
  });
});
