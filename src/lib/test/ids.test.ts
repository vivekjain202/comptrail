import { generateEditToken, generateSlug } from "@/lib/ids";
import { describe, expect, it } from "vitest";

describe("generateSlug", () => {
  it("returns a 10-character lowercase alphanumeric string", () => {
    expect(generateSlug()).toMatch(/^[0-9a-z]{10}$/);
  });

  it("produces different values across calls", () => {
    expect(generateSlug()).not.toBe(generateSlug());
  });
});

describe("generateEditToken", () => {
  it("returns a 32-character alphanumeric string", () => {
    expect(generateEditToken()).toMatch(/^[0-9a-zA-Z]{32}$/);
  });

  it("produces different values across calls", () => {
    expect(generateEditToken()).not.toBe(generateEditToken());
  });
});
