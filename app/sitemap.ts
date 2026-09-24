import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";
import { serverClient } from "@/sanity/lib/serverClient";

export const revalidate = 3600;

type SlugDoc = { slug: string; updatedAt: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const { products, categories, brands, blogs } = await serverClient.fetch<{
    products: SlugDoc[];
    categories: SlugDoc[];
    brands: SlugDoc[];
    blogs: SlugDoc[];
  }>(`{
    "products": *[_type == "product" && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt},
    "categories": *[_type == "category" && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt},
    "brands": *[_type == "brand" && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt},
    "blogs": *[_type == "blog" && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt}
  }`);

  const staticPages = [
    "",
    "/shop",
    "/deal",
    "/blog",
    "/about",
    "/contact",
    "/faqs",
    "/help",
    "/terms",
    "/privacy",
  ].map((path) => ({ url: `${base}${path}` }));
  const toEntries = (docs: SlugDoc[], prefix: string) =>
    docs.map((doc) => ({
      url: `${base}${prefix}/${doc.slug}`,
      lastModified: doc.updatedAt,
    }));

  return [
    ...staticPages,
    ...toEntries(products, "/product"),
    ...toEntries(categories, "/category"),
    ...toEntries(brands, "/brand"),
    ...toEntries(blogs, "/blog"),
  ];
}
