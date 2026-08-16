import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

// Buttons/toolbars we render on top of a capturable section carry this
// attribute so they show up on-screen but never end up baked into the
// downloaded image/PDF of that same section.
export const EXPORT_IGNORE_ATTR = "data-export-ignore";

function surfaceColor(): string {
  if (typeof window === "undefined") return "#ffffff";
  const value = getComputedStyle(document.documentElement).getPropertyValue("--surface-1").trim();
  return value || "#ffffff";
}

async function captureNode(node: HTMLElement) {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: surfaceColor(),
    cacheBust: true,
    filter: (domNode) => !(domNode instanceof HTMLElement && domNode.hasAttribute(EXPORT_IGNORE_ATTR)),
  });
  const rect = node.getBoundingClientRect();
  return { dataUrl, width: rect.width, height: rect.height };
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function slugifyFilename(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "comptrail";
}

export async function downloadElementAsPng(node: HTMLElement, filename: string) {
  const { dataUrl } = await captureNode(node);
  triggerDownload(dataUrl, `${slugifyFilename(filename)}.png`);
}

export async function downloadElementAsPdf(node: HTMLElement, filename: string) {
  const { dataUrl, width, height } = await captureNode(node);
  const pdf = new jsPDF({
    orientation: width >= height ? "landscape" : "portrait",
    unit: "px",
    format: [width, height],
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
  pdf.save(`${slugifyFilename(filename)}.pdf`);
}
