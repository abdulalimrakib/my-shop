import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/", "/cart", "/orders", "/success", "/wishlist"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
