import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

interface SiteHeaderProps {
  sticky?: boolean;
}

export default function SiteHeader({ sticky = false }: SiteHeaderProps) {
  return (
    <header
      className={`flex w-full items-center justify-between border-b px-6 py-4 ${sticky ? "sticky top-0 z-30" : ""}`}
      style={{ borderColor: "var(--gridline)", background: "var(--background)" }}
    >
      <Link href="/" className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        CompTrail
      </Link>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/app"
          className="rounded-md px-3 py-1.5 text-sm font-semibold text-white"
          style={{ background: "var(--series-1)" }}
        >
          Open the app
        </Link>
      </div>
    </header>
  );
}
