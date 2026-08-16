import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CompTrail",
  description:
    "Build and share your career salary progression timeline — track every raise, promotion, and job change, then share a link or export it as an image or PDF.",
  openGraph: {
    siteName: "CompTrail",
    type: "website",
    description:
      "Track every raise, promotion, and job change in one clear salary timeline, then share a link or export it as an image or PDF.",
  },
  twitter: {
    card: "summary_large_image",
    description:
      "Track every raise, promotion, and job change in one clear salary timeline, then share a link or export it as an image or PDF.",
  },
};

const THEME_INIT_SCRIPT = `
  try {
    var stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex h-dvh flex-col overflow-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
