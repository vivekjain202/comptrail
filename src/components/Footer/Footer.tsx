import { ArrowUpRight } from "lucide-react";

const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vivek-jain-16957a56/" },
  { label: "Discord", href: "https://discord.com/users/vivek0372" },
  { label: "Report an issue", href: "https://github.com/vivekjain202/comptrail/issues/new" },
];

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--gridline)" }}>
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Have feedback, a suggestion, or a business opportunity? Reach out.
        </p>
        <div className="flex items-center gap-4">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
              <ArrowUpRight size={12} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
