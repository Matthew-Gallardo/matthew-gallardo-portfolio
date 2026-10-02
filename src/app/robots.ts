import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { indexable } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return indexable && site.productionOrigin
    ? {
        rules: { userAgent: "*", allow: "/" },
        sitemap: `${site.productionOrigin}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
