import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import LearningsSection from "@/components/LearningsSection";
import MilestoneChart from "@/components/MilestoneChart";
import PreviewExport from "@/components/PreviewExport";
import PublicPageActions from "@/components/PublicPageActions";
import ScrollToHash from "@/components/ScrollToHash";
import StatsCards from "@/components/StatsCards";
import TimelineView from "@/components/TimelineView";
import ViewTracker from "@/components/ViewTracker";
import { getDb } from "@/db/client";
import { timelines } from "@/db/schema";

async function getTimeline(slug: string) {
  const db = getDb();
  const [row] = await db.select().from(timelines).where(eq(timelines.slug, slug)).limit(1);
  return row ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await getTimeline(slug);
  if (!row) {
    return { title: "Salary Progression" };
  }

  const description = row.note || "A shared salary progression timeline.";
  const imageUrl = `/api/timelines/${slug}/image`;

  return {
    title: `${row.title} · Salary Progression`,
    description,
    openGraph: {
      title: row.title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: row.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PublicTimelinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const row = await getTimeline(slug);
  if (!row) {
    notFound();
  }

  return (
    <div className="h-full overflow-y-auto">
      <ScrollToHash />
      <ViewTracker slug={slug} />
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
        <PublicPageActions slug={slug} viewCount={row.viewCount} />
        <PreviewExport filename={`${row.title}-full-preview`}>
          <StatsCards entries={row.entries} currency={row.currency} />
          <MilestoneChart
            entries={row.entries}
            currency={row.currency}
            title={row.title}
            note={row.note}
            slug={slug}
          />
          <TimelineView entries={row.entries} currency={row.currency} title={row.title} slug={slug} />
          <LearningsSection learnings={row.learnings} slug={slug} />
        </PreviewExport>
      </div>

      <Footer />
    </div>
  );
}
