import "server-only";
import type { QueryParams } from "next-sanity";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  throw new Error("SANITY_API_READ_TOKEN is not set");
}

const catalogClient = client.withConfig({ token, useCdn: false });

// Catalog reads (products, categories, blog) for server components. Results
// are cached by Next for a minute; checkout re-reads prices and stock
// uncached. Result types come from the `defineQuery` registry in
// sanity.types.ts, keyed by the query string.
export async function sanityFetch<const Q extends string>({
  query,
  params = {},
}: {
  query: Q;
  params?: QueryParams;
}) {
  const data = await catalogClient.fetch(query, params, {
    next: { revalidate: 60 },
  });
  return { data };
}
