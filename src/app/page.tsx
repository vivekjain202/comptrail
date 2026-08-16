import { ArrowRight, LineChart, Link2, ListChecks, Share2, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer/Footer";
import MilestoneChart from "@/components/MilestoneChart/MilestoneChart";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import { CompEntry } from "@/lib/types";

const SAMPLE_ENTRIES: CompEntry[] = [
  {
    id: "sample-1",
    date: "2019-06-01",
    company: "Initech",
    title: "Software Engineer",
    level: "L3",
    type: "new_job",
    base: 85_000,
    bonus: 5_000,
    equity: 10_000,
    note: "",
  },
  {
    id: "sample-2",
    date: "2020-09-01",
    company: "Initech",
    title: "Software Engineer",
    level: "L3",
    type: "raise",
    base: 92_000,
    bonus: 5_000,
    equity: 10_000,
    note: "",
  },
  {
    id: "sample-3",
    date: "2021-06-01",
    company: "Initech",
    title: "Senior Software Engineer",
    level: "L4",
    type: "promotion",
    base: 118_000,
    bonus: 10_000,
    equity: 25_000,
    note: "",
  }
];

export default function LandingPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-start gap-6">
            <h1
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              See how a career actually grows, in numbers.
            </h1>
            <p className="max-w-xl text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Turn your job history into a clear compensation timeline — every raise, promotion,
              and job change plotted out. Build it in minutes, then share a link or download it as
              an image or PDF. No account required.
            </p>
            <Link
              href="/app"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white"
              style={{ background: "var(--series-1)" }}
            >
              Build your timeline <ArrowRight size={16} />
            </Link>
          </div>

          <div>
            <MilestoneChart entries={SAMPLE_ENTRIES} currency="USD" title="Sample Career" note="" readOnly preview />
          </div>
        </section>

        <section className="grid gap-4 pb-16 sm:grid-cols-3">
          <Feature
            icon={<ShieldCheck size={18} style={{ color: "var(--series-1)" }} />}
            title="Anonymous by default"
            text="No login, no email. Share only the details you choose."
          />
          <Feature
            icon={<LineChart size={18} style={{ color: "var(--series-1)" }} />}
            title="An honest chart"
            text="Growth plotted the way pay actually moves — step by step, not squashed by outliers."
          />
          <Feature
            icon={<Link2 size={18} style={{ color: "var(--series-1)" }} />}
            title="One link to share"
            text="A single shareable URL, plus downloadable images and PDFs for anywhere else."
          />
        </section>

        <section className="border-t py-12" style={{ borderColor: "var(--gridline)" }}>
          <h2 className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>
            How it works
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <HowStep
              icon={<ListChecks size={18} style={{ color: "var(--series-1)" }} />}
              step={1}
              title="Add your career events"
              text="Every raise, promotion, job change, and relocation — as much or as little as you want."
            />
            <HowStep
              icon={<TrendingUp size={18} style={{ color: "var(--series-1)" }} />}
              step={2}
              title="See an honest chart"
              text="A log-scaled timeline that shows real growth, not one squashed flat by a single outlier."
            />
            <HowStep
              icon={<Share2 size={18} style={{ color: "var(--series-1)" }} />}
              step={3}
              title="Share it your way"
              text="Post a link, or export a PNG or PDF — no account needed for any of it."
            />
          </div>
        </section>

        <section className="border-t py-12" style={{ borderColor: "var(--gridline)" }}>
          <h2 className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>
            Why I built this
          </h2>
          <div className="mt-3 max-w-2xl space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <p>
              Most conversations about pay happen in private — a friend&apos;s DM, an anonymous
              forum post, a hushed comment between colleagues. What&apos;s usually missing is the
              shape of it: how compensation actually moves over years, across promotions, job
              changes, and relocations, rather than a single number frozen in time.
            </p>
            <p>
              I built CompTrail so anyone can plot that shape for themselves in a few
              minutes and choose exactly how much of it to share. There&apos;s no login and no
              directory of companies or people — just a timeline you control, and a link you can
              hand to whoever might find it useful.
            </p>
            <p>
              My hope is that a few honest, anonymous timelines make the invisible math of a
              career a little easier to reason about — whether you&apos;re deciding to ask for a
              raise, weighing a new offer, or just curious what normal growth looks like.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div
      className="flex flex-col gap-2 rounded-lg border p-4"
      style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
    >
      {icon}
      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {text}
      </p>
    </div>
  );
}

function HowStep({
  icon,
  step,
  title,
  text,
}: {
  icon: React.ReactNode;
  step: number;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: "var(--series-1)" }}
        >
          {step}
        </span>
        {icon}
      </div>
      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {text}
      </p>
    </div>
  );
}
