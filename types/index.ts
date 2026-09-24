import { Product } from "@/sanity.types";

// A product as the storefront uses it. Listing queries resolve category
// references to their titles; single-product queries keep the references.
export type CatalogProduct = Omit<Product, "categories"> & {
  categories?: Array<string | null> | Product["categories"] | null;
};

export type SearchProduct = CatalogProduct & { brandTitle?: string | null };
