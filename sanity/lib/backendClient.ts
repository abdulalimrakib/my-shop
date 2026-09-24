import "server-only";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Write client (webhook and server actions only). No CDN so reads are fresh.
export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
