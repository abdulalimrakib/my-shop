import "server-only";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  throw new Error("SANITY_API_READ_TOKEN is not set");
}

// Token-authenticated, uncached reads for server actions and route handlers.
// Works when the dataset is private; never import this from client components.
export const serverClient = client.withConfig({ token, useCdn: false });
