import { GET, PUT } from "../route";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db/client", () => ({ getDb: vi.fn() }));

import { getDb } from "@/db/client";

function makeChain(result: unknown) {
  const chain: {
    from: ReturnType<typeof vi.fn>;
    where: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
    returning: ReturnType<typeof vi.fn>;
    then: (resolve: (v: unknown) => void, reject: (e: unknown) => void) => void;
  } = {
    from: vi.fn(() => chain),
    where: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    set: vi.fn(() => chain),
    returning: vi.fn(() => chain),
    then: (resolve, reject) => {
      Promise.resolve(result).then(resolve, reject);
    },
  };
  return chain;
}

const row = {
  slug: "existing-slug",
  editToken: "correct-token",
  title: "My progression",
  note: "A note",
  learnings: "",
  currency: "USD",
  entries: [],
  viewCount: 3,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-02"),
};

function params(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

describe("GET /api/timelines/[slug]", () => {
  beforeEach(() => {
    vi.mocked(getDb).mockReset();
  });

  it("returns the public shape of an existing timeline", async () => {
    const select = vi.fn(() => makeChain([row]));
    vi.mocked(getDb).mockReturnValue({ select } as never);

    const res = await GET(new Request("http://localhost/api/timelines/existing-slug"), params("existing-slug"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      slug: "existing-slug",
      title: "My progression",
      note: "A note",
      learnings: "",
      currency: "USD",
      entries: [],
      updatedAt: row.updatedAt.toISOString(),
      viewCount: 3,
    });
  });

  it("returns 404 when the slug does not exist", async () => {
    const select = vi.fn(() => makeChain([]));
    vi.mocked(getDb).mockReturnValue({ select } as never);

    const res = await GET(new Request("http://localhost/api/timelines/missing"), params("missing"));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
  });
});

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

function putRequest(body: unknown) {
  return new Request("http://localhost/api/timelines/existing-slug", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

describe("PUT /api/timelines/[slug]", () => {
  beforeEach(() => {
    vi.mocked(getDb).mockReset();
  });

  it("rejects a request with no edit token before touching the database", async () => {
    const res = await PUT(
      putRequest({ title: "x", currency: "USD", entries: [] }),
      params("existing-slug")
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Missing edit token" });
  });

  it("rejects an invalid payload even with a valid-looking edit token", async () => {
    const res = await PUT(
      putRequest({ editToken: "correct-token", entries: "not-an-array" }),
      params("existing-slug")
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "entries must be an array" });
  });

  it("returns 404 when the timeline does not exist", async () => {
    const select = vi.fn(() => makeChain([]));
    vi.mocked(getDb).mockReturnValue({ select } as never);

    const res = await PUT(
      putRequest({ editToken: "correct-token", currency: "USD", entries: [validEntry] }),
      params("missing")
    );
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
  });

  it("rejects an update with the wrong edit token", async () => {
    const select = vi.fn(() => makeChain([row]));
    vi.mocked(getDb).mockReturnValue({ select } as never);

    const res = await PUT(
      putRequest({ editToken: "wrong-token", currency: "USD", entries: [validEntry] }),
      params("existing-slug")
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Invalid edit token" });
  });

  it("updates and returns the timeline when the edit token matches", async () => {
    const updatedRow = { ...row, title: "New title", entries: [validEntry] };
    const select = vi.fn(() => makeChain([row]));
    const update = vi.fn(() => makeChain([updatedRow]));
    vi.mocked(getDb).mockReturnValue({ select, update } as never);

    const res = await PUT(
      putRequest({ editToken: "correct-token", title: "New title", currency: "USD", entries: [validEntry] }),
      params("existing-slug")
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("New title");
    expect(data.entries).toEqual([validEntry]);
    expect(update).toHaveBeenCalledTimes(1);
  });
});
