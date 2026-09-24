"use server";

import { serverClient } from "@/sanity/lib/serverClient";
import { auth } from "@clerk/nextjs/server";

export async function getMyOrderCount(): Promise<number> {
  const { userId } = await auth();
  if (!userId) return 0;
  return serverClient.fetch<number>(
    `count(*[_type == "order" && clerkUserId == $userId])`,
    { userId }
  );
}
