"use server";

import { serverClient } from "@/sanity/lib/serverClient";
import { CatalogProduct, SearchProduct } from "@/types";
import { z } from "zod";

const PRODUCT_PROJECTION = `{...,"categories": categories[]->title}`;

const slugSchema = z.string().trim().min(1).max(200);

export async function searchProducts(term: string): Promise<SearchProduct[]> {
  const search = z.string().trim().min(1).max(100).safeParse(term);
  if (!search.success) return [];
  return serverClient.fetch(
    `*[_type == "product" && (
      name match $search
      || description match $search
      || categories[]->title match $search
      || brand->title match $search
    )] | order(name asc) [0...10] {
      ...,"categories": categories[]->title,"brandTitle": brand->title
    }`,
    { search: `${search.data}*` }
  );
}

const priceRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().positive().nullable(),
});

const filterSchema = z.object({
  categories: z.array(slugSchema).max(50),
  brands: z.array(slugSchema).max(50),
  priceRanges: z.array(priceRangeSchema).max(10),
  sort: z.enum(["name-asc", "price-asc", "price-desc", "newest"]),
});

export type ProductFilters = z.infer<typeof filterSchema>;

const SORT_ORDER: Record<ProductFilters["sort"], string> = {
  "name-asc": "name asc",
  "price-asc": "price asc",
  "price-desc": "price desc",
  newest: "_createdAt desc",
};

export async function getFilteredProducts(
  filters: ProductFilters
): Promise<CatalogProduct[]> {
  const parsed = filterSchema.safeParse(filters);
  if (!parsed.success) return [];
  const { categories, brands, priceRanges, sort } = parsed.data;
  // Options within a group are OR-ed; the groups themselves are AND-ed.
  // Price ranges are [min, max) so boundary prices land in exactly one range.
  return serverClient.fetch(
    `*[_type == 'product'
      && (count($categories) == 0 || count((categories[]->slug.current)[@ in $categories]) > 0)
      && (count($brands) == 0 || brand->slug.current in $brands)
      && (count($priceRanges) == 0 || count($priceRanges[^.price >= min && (max == null || ^.price < max)]) > 0)
    ] | order(${SORT_ORDER[sort]}) ${PRODUCT_PROJECTION}`,
    { categories, brands, priceRanges }
  );
}

export async function getProductsByVariant(
  variant: string
): Promise<CatalogProduct[]> {
  const parsed = slugSchema.safeParse(variant);
  if (!parsed.success) return [];
  // `variant` is a reserved option name in the Sanity client, so the
  // GROQ parameter is called $productVariant
  return serverClient.fetch(
    `*[_type == "product" && variant == $productVariant] | order(name asc) ${PRODUCT_PROJECTION}`,
    { productVariant: parsed.data.toLowerCase() }
  );
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<CatalogProduct[]> {
  const parsed = slugSchema.safeParse(categorySlug);
  if (!parsed.success) return [];
  return serverClient.fetch(
    `*[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc) ${PRODUCT_PROJECTION}`,
    { categorySlug: parsed.data }
  );
}
