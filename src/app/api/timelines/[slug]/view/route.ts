import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { timelines } from "@/db/schema";

const DEDUPE_WINDOW_SECONDS = 60 * 60 * 12;

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieName = `viewed_${slug}`;

  const cookieStore = await cookies();
  if (cookieStore.get(cookieName)) {
    return NextResponse.json({ counted: false });
  }

  const db = getDb();
  const [updated] = await db
    .update(timelines)
    .set({ viewCount: sql`${timelines.viewCount} + 1` })
    .where(eq(timelines.slug, slug))
    .returning({ viewCount: timelines.viewCount });

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const response = NextResponse.json({ counted: true, viewCount: updated.viewCount });
  response.cookies.set(cookieName, "1", {
    maxAge: DEDUPE_WINDOW_SECONDS,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
