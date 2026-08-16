import { downloadElementAsPdf, downloadElementAsPng, EXPORT_IGNORE_ATTR } from "@/lib/export";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const toPng = vi.fn();
const addImage = vi.fn();
const save = vi.fn();
const jsPDFCtor = vi.fn().mockImplementation(() => ({ addImage, save }));

vi.mock("html-to-image", () => ({
  toPng: (...args: unknown[]) => toPng(...args),
}));

vi.mock("jspdf", () => ({
  jsPDF: function (this: unknown, ...args: unknown[]) {
    return jsPDFCtor(...args);
  },
}));

describe("export", () => {
  let clickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    toPng.mockReset().mockResolvedValue("data:image/png;base64,abc");
    addImage.mockReset();
    save.mockReset();
    jsPDFCtor.mockClear();
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  it("exposes the export-ignore attribute name used to exclude UI chrome from captures", () => {
    expect(EXPORT_IGNORE_ATTR).toBe("data-export-ignore");
  });

  it("downloads a PNG using a slugified filename and filters ignored nodes", async () => {
    const node = document.createElement("div");
    await downloadElementAsPng(node, "My Card!!");

    expect(toPng).toHaveBeenCalledTimes(1);
    const [passedNode, options] = toPng.mock.calls[0];
    expect(passedNode).toBe(node);
    expect(options.pixelRatio).toBe(2);
    expect(options.cacheBust).toBe(true);

    const ignoredEl = document.createElement("div");
    ignoredEl.setAttribute(EXPORT_IGNORE_ATTR, "");
    const normalEl = document.createElement("div");
    expect(options.filter(ignoredEl)).toBe(false);
    expect(options.filter(normalEl)).toBe(true);

    expect(clickSpy).toHaveBeenCalledTimes(1);
    const link = clickSpy.mock.instances[0] as unknown as HTMLAnchorElement;
    expect(link.href).toBe("data:image/png;base64,abc");
    expect(link.download).toBe("my-card.png");
  });

  it("falls back to a default filename when the slug is empty", async () => {
    const node = document.createElement("div");
    await downloadElementAsPng(node, "!!!");

    const link = clickSpy.mock.instances[0] as unknown as HTMLAnchorElement;
    expect(link.download).toBe("comptrail.png");
  });

  it("downloads a landscape PDF sized to the captured node and slugified filename", async () => {
    const node = document.createElement("div");
    vi.spyOn(node, "getBoundingClientRect").mockReturnValue({
      width: 800,
      height: 400,
      top: 0,
      left: 0,
      right: 800,
      bottom: 400,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    await downloadElementAsPdf(node, "Timeline Export");

    expect(jsPDFCtor).toHaveBeenCalledWith(
      expect.objectContaining({ orientation: "landscape", unit: "px", format: [800, 400] })
    );
    expect(addImage).toHaveBeenCalledWith("data:image/png;base64,abc", "PNG", 0, 0, 800, 400);
    expect(save).toHaveBeenCalledWith("timeline-export.pdf");
  });

  it("downloads a portrait PDF when the captured node is taller than it is wide", async () => {
    const node = document.createElement("div");
    vi.spyOn(node, "getBoundingClientRect").mockReturnValue({
      width: 300,
      height: 900,
      top: 0,
      left: 0,
      right: 300,
      bottom: 900,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    await downloadElementAsPdf(node, "Portrait");

    expect(jsPDFCtor).toHaveBeenCalledWith(expect.objectContaining({ orientation: "portrait" }));
  });
});
