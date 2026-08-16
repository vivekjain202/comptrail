import { CURRENCIES } from "@/lib/currencies";
import { describe, expect, it } from "vitest";

describe("CURRENCIES", () => {
  it("is a non-empty list of currencies with unique 3-letter codes", () => {
    expect(CURRENCIES.length).toBeGreaterThan(0);

    for (const currency of CURRENCIES) {
      expect(currency.code).toMatch(/^[A-Z]{3}$/);
      expect(currency.label).toContain(currency.code);
    }

    expect(new Set(CURRENCIES.map((c) => c.code)).size).toBe(CURRENCIES.length);
  });
});
