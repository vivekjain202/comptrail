import ExportMenu from "../../ExportMenu";
import { downloadElementAsPdf, downloadElementAsPng } from "@/lib/export";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/export", () => ({
  downloadElementAsPng: vi.fn().mockResolvedValue(undefined),
  downloadElementAsPdf: vi.fn().mockResolvedValue(undefined),
}));

describe("ExportMenu", () => {
  beforeEach(() => {
    vi.mocked(downloadElementAsPng).mockClear();
    vi.mocked(downloadElementAsPdf).mockClear();
  });

  it("is closed initially and opens when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<ExportMenu getNode={() => document.createElement("div")} filename="chart" label="chart" />);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Download options for chart"));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Download as image")).toBeInTheDocument();
    expect(screen.getByText("Download as PDF")).toBeInTheDocument();
  });

  it("downloads a PNG and closes the menu when clicking Download as image", async () => {
    const user = userEvent.setup();
    const node = document.createElement("div");
    render(<ExportMenu getNode={() => node} filename="chart" label="chart" />);

    await user.click(screen.getByLabelText("Download options for chart"));
    await user.click(screen.getByText("Download as image"));

    expect(downloadElementAsPng).toHaveBeenCalledWith(node, "chart");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("closes the menu without downloading when clicking outside", async () => {
    const user = userEvent.setup();
    render(<ExportMenu getNode={() => document.createElement("div")} filename="chart" label="chart" />);

    await user.click(screen.getByLabelText("Download options for chart"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(document.body);

    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(downloadElementAsPng).not.toHaveBeenCalled();
    expect(downloadElementAsPdf).not.toHaveBeenCalled();
  });
});
