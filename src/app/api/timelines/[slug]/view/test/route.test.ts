import { POST } from "../route";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db/client", () => ({ getDb: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));

import { cookies } from "next/headers";
import { getDb } from "@/db/client";

function makeChain(result: unknown) {
  const chain: {
    set: ReturnType<typeof vi.fn>;
    where: ReturnType<typeof vi.fn>;
    returning: ReturnType<typeof vi.fn>;
    then: (resolve: (v: unknown) => void, reject: (e: unknown) => void) => void;
  } = {
    set: vi.fn(() => chain),
    where: vi.fn(() => chain),
    returning: vi.fn(() => chain),
    then: (resolve, reject) => {
      Promise.resolve(result).then(resolve, reject);
    },
  };
  return chain;
}

function params(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

function mockCookieStore(existingCookie: unknown) {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn(() => existingCookie),
  } as never);
}

describe("POST /api/timelines/[slug]/view", () => {
  beforeEach(() => {
    vi.mocked(getDb).mockReset();
  });

  it("does not double-count a view when the dedupe cookie is already set", async () => {
    mockCookieStore({ value: "1" });
    const update = vi.fn();
    vi.mocked(getDb).mockReturnValue({ update } as never);

    const res = await POST(new Request("http://localhost/api/timelines/my-slug/view", { method: "POST" }), params("my-slug"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ counted: false });
    expect(update).not.toHaveBeenCalled();
  });

  it("increments the view count and sets a dedupe cookie on first view", async () => {
    mockCookieStore(undefined);
    const update = vi.fn(() => makeChain([{ viewCount: 4 }]));
    vi.mocked(getDb).mockReturnValue({ update } as never);

    const res = await POST(new Request("http://localhost/api/timelines/my-slug/view", { method: "POST" }), params("my-slug"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ counted: true, viewCount: 4 });
    expect(res.cookies.get("viewed_my-slug")?.value).toBe("1");
  });

  it("returns 404 when the timeline does not exist", async () => {
    mockCookieStore(undefined);
    const update = vi.fn(() => makeChain([]));
    vi.mocked(getDb).mockReturnValue({ update } as never);

    const res = await POST(new Request("http://localhost/api/timelines/missing/view", { method: "POST" }), params("missing"));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
  });
});
