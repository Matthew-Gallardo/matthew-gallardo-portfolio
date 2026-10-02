import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.productionOrigin) return [];
  return ["/", "/projects"].map((path) => ({
    url: new URL(path, site.productionOrigin!).toString(),
  }));
}
