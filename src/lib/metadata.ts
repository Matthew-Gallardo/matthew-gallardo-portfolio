import type { Metadata } from "next";
import { site } from "@/content/site";

export const indexable =
  Boolean(site.productionOrigin) && process.env.VERCEL_ENV === "production";
export function pageMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  const canonical = site.productionOrigin
    ? new URL(path, site.productionOrigin).toString()
    : undefined;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "en_PH",
      siteName: "Matthew Gallardo",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: indexable, follow: indexable },
  };
}
