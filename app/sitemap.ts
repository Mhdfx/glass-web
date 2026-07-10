import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { serviceSlugs } from "@/data/service-details";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: company.siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...serviceSlugs.map((slug) => ({
      url: `${company.siteUrl}/expertises/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${company.siteUrl}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
}
