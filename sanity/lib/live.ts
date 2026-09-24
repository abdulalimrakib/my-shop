// Catalog reads (products, categories, blog) for server components. Results
// are cached for a minute; checkout re-reads prices and stock uncached.
import { defineLive } from "next-sanity";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  throw new Error("SANITY_API_READ_TOKEN is not set");
}

export const { sanityFetch } = defineLive({
  client,
  serverToken: token,
  fetchOptions: {
    revalidate: 60,
  },
});
