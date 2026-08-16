import { ValidationError, parseTimelinePayload } from "@/lib/validate";
import { describe, expect, it } from "vitest";

const validEntry = {
  id: "entry-1",
  date: "2024-04-01",
  company: "Acme",
  title: "Engineer",
  level: "L4",
  type: "promotion",
  base: 120_000,
  bonus: 10_000,
  equity: 20_000,
  note: "Promotion cycle",
};

describe("parseTimelinePayload", () => {
  it("accepts valid timelines and preserves supported learning content", () => {
    expect(parseTimelinePayload({
      title: "My progression",
      note: "A note",
      learnings: "## Learnings\nNegotiate every offer.",
      currency: "INR",
      entries: [validEntry],
    })).toEqual({
      title: "My progression",
      note: "A note",
      learnings: "## Learnings\nNegotiate every offer.",
      currency: "INR",
      entries: [validEntry],
    });
  });

  it("defaults malformed optional values and clamps negative compensation", () => {
    const payload = parseTimelinePayload({
      entries: [{ ...validEntry, id: "", type: "unknown", base: -1, bonus: Infinity, equity: "5000" }],
      currency: "usd",
      title: 42,
    });

    expect(payload.title).toBe("Salary Progression");
    expect(payload.currency).toBe("USD");
    expect(payload.entries[0]).toMatchObject({
      id: "entry-0",
      type: "raise",
      base: 0,
      bonus: 0,
      equity: 0,
    });
  });

  it("rejects invalid bodies, missing entries, and invalid dates", () => {
    expect(() => parseTimelinePayload(null)).toThrow(ValidationError);
    expect(() => parseTimelinePayload({ entries: "not-an-array" })).toThrow("entries must be an array");
    expect(() => parseTimelinePayload({ entries: [{ ...validEntry, date: "2024/04/01" }] })).toThrow(
      "Invalid date at index 0"
    );
  });
});
