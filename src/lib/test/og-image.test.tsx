// @vitest-environment node
import { renderTimelineImage } from "../og-image";
import { CompEntry } from "../types";
import { describe, expect, it } from "vitest";

const entries: CompEntry[] = [
  {
    id: "a",
    date: "2020-01-01",
    company: "Acme",
    title: "Engineer",
    level: "L3",
    type: "new_job",
    base: 100_000,
    bonus: 0,
    equity: 0,
    note: "",
  },
  {
    id: "b",
    date: "2022-06-01",
    company: "Acme",
    title: "Senior Engineer",
    level: "L5",
    type: "promotion",
    base: 150_000,
    bonus: 20_000,
    equity: 30_000,
    note: "",
  },
  {
    id: "c",
    date: "2023-09-01",
    company: "Globex",
    title: "Senior Engineer",
    level: "L5",
    type: "relocation",
    base: 170_000,
    bonus: 10_000,
    equity: 40_000,
    note: "",
  },
];

describe("renderTimelineImage", () => {
  it("renders a PNG for a timeline with multiple entries and mixed event types", async () => {
    const res = renderTimelineImage({ title: "My Career", note: "A note", currency: "USD", entries });
    expect(res.headers.get("content-type")).toBe("image/png");
    const buf = await res.arrayBuffer();
    expect(buf.byteLength).toBeGreaterThan(0);
  });

  it("renders a placeholder image when there are no entries", async () => {
    const res = renderTimelineImage({ title: "Empty", note: "", currency: "USD", entries: [] });
    expect(res.headers.get("content-type")).toBe("image/png");
    const buf = await res.arrayBuffer();
    expect(buf.byteLength).toBeGreaterThan(0);
  });

  it("renders a single-entry timeline without a connecting line", async () => {
    const res = renderTimelineImage({ title: "Solo", note: "", currency: "EUR", entries: [entries[0]] });
    const buf = await res.arrayBuffer();
    expect(buf.byteLength).toBeGreaterThan(0);
  });
});
