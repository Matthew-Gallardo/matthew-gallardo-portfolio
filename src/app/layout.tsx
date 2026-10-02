import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeRoot } from "@/components/ui/theme";
import { SiteShell } from "@/components/layout/site-shell";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-sans",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  ...pageMetadata("/", site.title, site.description),
  metadataBase: new URL(site.productionOrigin ?? "http://localhost:3000"),
  authors: [
    { name: "Matthew Gallardo", url: "https://github.com/Matthew-Gallardo" },
  ],
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0E13" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${mono.variable}`}>
        <ThemeRoot>
          <SiteShell>{children}</SiteShell>
        </ThemeRoot>
      </body>
    </html>
  );
}
