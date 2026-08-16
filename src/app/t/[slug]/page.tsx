import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import LearningsSection from "@/components/LearningsSection/LearningsSection";
import MilestoneChart from "@/components/MilestoneChart/MilestoneChart";
import PublicPageActions from "@/components/PublicPageActions/PublicPageActions";
import ScrollToHash from "@/components/ScrollToHash/ScrollToHash";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import StatsCards from "@/components/StatsCards/StatsCards";
import TimelineView from "@/components/TimelineView/TimelineView";
import ViewTracker from "@/components/ViewTracker/ViewTracker";
import { getDb } from "@/db/client";
import { timelines } from "@/db/schema";
import { buildTimelineDescriptions } from "@/lib/seo-description";

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

  const { meta: metaDescription, social: socialDescription } = buildTimelineDescriptions(
    row.title,
    row.note,
    row.entries
  );
  const imageUrl = `/api/timelines/${slug}/image`;

  return {
    title: `${row.title} · Salary Progression`,
    description: metaDescription,
    openGraph: {
      title: row.title,
      description: socialDescription,
      siteName: "Salary Progression",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: row.title,
      description: socialDescription,
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
      <SiteHeader sticky />
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-10">
        {/* Reserved for future ad placement — left gutter */}
        <aside className="hidden w-40 shrink-0 xl:block" aria-hidden="true" />
        <div className="mx-auto flex w-full max-w-4xl min-w-0 flex-col gap-6">
          <PublicPageActions slug={slug} viewCount={row.viewCount} />
          <StatsCards entries={row.entries} currency={row.currency} />
          <MilestoneChart
            entries={row.entries}
            currency={row.currency}
            title={row.title}
            note={row.note}
            slug={slug}
            readOnly
          />
          <TimelineView
            entries={row.entries}
            currency={row.currency}
            title={row.title}
            slug={slug}
            readOnly
          />
          <LearningsSection learnings={row.learnings} slug={slug} readOnly />
        </div>
        {/* Reserved for future ad placement — right gutter */}
        <aside className="hidden w-40 shrink-0 xl:block" aria-hidden="true" />
      </div>

      <Footer />
    </div>
  );
}
