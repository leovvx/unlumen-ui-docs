import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ui.unlumen.com";

  return source.getPages().map((page) => ({
    url: `${base}/docs${page.url === "/" ? "" : page.url}`,
    lastModified: page.data.lastModified
      ? new Date(page.data.lastModified)
      : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
}
