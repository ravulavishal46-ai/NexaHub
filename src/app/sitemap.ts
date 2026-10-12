import type { MetadataRoute } from "next";
import { services } from "@/lib/mock/services";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/services", "/about", "/contact", "/login", "/register"];
  return [
    ...pages.map((path) => ({ url: `${siteConfig.url}${path}` })),
    ...services
      .filter((s) => s.isActive)
      .map((s) => ({ url: `${siteConfig.url}/services/${s.slug}` })),
  ];
}
