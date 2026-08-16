import { getEditToken, saveEditToken } from "@/lib/local-store";
import { beforeEach, describe, expect, it } from "vitest";

describe("local edit-token storage", () => {
  beforeEach(() => localStorage.clear());

  it("saves and retrieves edit tokens by timeline slug", () => {
    saveEditToken("career-path", "secret-token");

    expect(getEditToken("career-path")).toBe("secret-token");
    expect(getEditToken("another-path")).toBeNull();
  });
});
