import { POST } from "../route";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db/client", () => ({ getDb: vi.fn() }));

import { getDb } from "@/db/client";

function makeChain(result: unknown) {
  const chain: {
    values: ReturnType<typeof vi.fn>;
    then: (resolve: (v: unknown) => void, reject: (e: unknown) => void) => void;
  } = {
    values: vi.fn(() => chain),
    then: (resolve, reject) => {
      Promise.resolve(result).then(resolve, reject);
    },
  };
  return chain;
}

function uniqueViolation() {
  return Object.assign(new Error("duplicate key"), { code: "23505" });
}

const validEntry = {
  id: "entry-1",
  date: "2024-01-01",
  company: "Acme",
  title: "Engineer",
  level: "L4",
  type: "promotion",
  base: 100_000,
  bonus: 0,
  equity: 0,
  note: "",
};

const validBody = { title: "My progression", note: "", learnings: "", currency: "USD", entries: [validEntry] };

function request(body: unknown) {
  return new Request("http://localhost/api/timelines", { method: "POST", body: JSON.stringify(body) });
}

describe("POST /api/timelines", () => {
  beforeEach(() => {
    vi.mocked(getDb).mockReset();
  });

  it("rejects an invalid payload without touching the database", async () => {
    const res = await POST(request({ entries: "not-an-array" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "entries must be an array" });
    expect(getDb).not.toHaveBeenCalled();
  });

  it("saves a valid timeline and returns a generated slug and edit token", async () => {
    const insert = vi.fn(() => makeChain(undefined));
    vi.mocked(getDb).mockReturnValue({ insert } as never);

    const res = await POST(request(validBody));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.slug).toMatch(/^[0-9a-z]{10}$/);
    expect(data.editToken).toMatch(/^[0-9a-zA-Z]{32}$/);
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("retries with a new slug on a unique-constraint violation and succeeds", async () => {
    const insert = vi
      .fn()
      .mockImplementationOnce(() => makeChain(Promise.reject(uniqueViolation())))
      .mockImplementationOnce(() => makeChain(undefined));
    vi.mocked(getDb).mockReturnValue({ insert } as never);

    const res = await POST(request(validBody));
    expect(res.status).toBe(201);
    expect(insert).toHaveBeenCalledTimes(2);
  });

  it("gives up after repeated unique-constraint violations", async () => {
    const insert = vi.fn(() => makeChain(Promise.reject(uniqueViolation())));
    vi.mocked(getDb).mockReturnValue({ insert } as never);

    const res = await POST(request(validBody));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Could not generate a unique link, please try again" });
    expect(insert).toHaveBeenCalledTimes(5);
  });

  it("returns a 500 immediately on a non-unique-constraint database error", async () => {
    const insert = vi.fn(() => makeChain(Promise.reject(new Error("connection refused"))));
    vi.mocked(getDb).mockReturnValue({ insert } as never);

    const res = await POST(request(validBody));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to save timeline" });
    expect(insert).toHaveBeenCalledTimes(1);
  });
});
