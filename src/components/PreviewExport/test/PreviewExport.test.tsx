import PreviewExport from "../../PreviewExport";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("PreviewExport", () => {
  it("renders its children and an export menu trigger", () => {
    render(
      <PreviewExport filename="my-file">
        <div>Hello content</div>
      </PreviewExport>
    );

    expect(screen.getByText("Hello content")).toBeInTheDocument();
    expect(screen.getByLabelText("Download options for full preview")).toBeInTheDocument();
  });
});
