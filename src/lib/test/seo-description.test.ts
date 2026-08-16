import { buildTimelineDescriptions } from "../seo-description";
import { CompEntry } from "../types";
import { describe, expect, it } from "vitest";

function makeEntry(overrides: Partial<CompEntry>): CompEntry {
  return {
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
    ...overrides,
  };
}

describe("buildTimelineDescriptions", () => {
  it("sizes both descriptions within their recommended ranges for a computed summary", () => {
    const entries = [
      makeEntry({ id: "a", date: "2020-01-01", base: 100_000 }),
      makeEntry({ id: "b", date: "2023-01-01", base: 150_000 }),
    ];
    const { meta, social } = buildTimelineDescriptions("My Career", "", entries);

    expect(meta.length).toBeGreaterThanOrEqual(120);
    expect(meta.length).toBeLessThanOrEqual(160);
    expect(social.length).toBeGreaterThanOrEqual(80);
    expect(social.length).toBeLessThanOrEqual(125);
  });

  it("omits the growth clause when the computed percentage is an unrealistic outlier", () => {
    const entries = [
      makeEntry({ id: "a", date: "2020-01-01", base: 10 }),
      makeEntry({ id: "b", date: "2021-01-01", base: 100_000 }),
    ];
    const { meta, social } = buildTimelineDescriptions("Salary Progression", "", entries);

    expect(meta).not.toMatch(/%/);
    expect(social).not.toMatch(/%/);
  });

  it("sizes both descriptions when the timeline has no entries", () => {
    const { meta, social } = buildTimelineDescriptions("Empty Timeline", "", []);

    expect(meta.length).toBeGreaterThanOrEqual(120);
    expect(meta.length).toBeLessThanOrEqual(160);
    expect(social.length).toBeGreaterThanOrEqual(80);
    expect(social.length).toBeLessThanOrEqual(125);
  });

  it("truncates a long user-provided note instead of overflowing either target", () => {
    const longNote = "A".repeat(300);
    const { meta, social } = buildTimelineDescriptions("My Career", longNote, []);

    expect(meta.length).toBeLessThanOrEqual(160);
    expect(social.length).toBeLessThanOrEqual(125);
  });

  it("pads a short user-provided note up to each target range", () => {
    const { meta, social } = buildTimelineDescriptions("My Career", "A short note.", []);

    expect(meta.length).toBeGreaterThanOrEqual(120);
    expect(meta.length).toBeLessThanOrEqual(160);
    expect(social.length).toBeGreaterThanOrEqual(80);
    expect(social.length).toBeLessThanOrEqual(125);
    expect(meta.startsWith("A short note.")).toBe(true);
  });

  it("leaves a note that already fits the social range untouched", () => {
    const note = "A".repeat(90);
    const { social } = buildTimelineDescriptions("My Career", note, []);

    expect(social).toBe(note);
  });
});
