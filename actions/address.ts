"use server";

import { Address } from "@/sanity.types";
import { backendClient } from "@/sanity/lib/backendClient";
import { serverClient } from "@/sanity/lib/serverClient";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

export type UserAddress = Pick<
  Address,
  "_id" | "name" | "address" | "city" | "state" | "zip" | "default"
>;

const ADDRESS_FIELDS = `{_id, name, address, city, state, zip, default}`;

// Only ever returns addresses owned by the signed-in user
export async function getMyAddresses(): Promise<UserAddress[]> {
  const { userId } = await auth();
  if (!userId) return [];
  return serverClient.fetch(
    `*[_type == "address" && clerkUserId == $userId] | order(default desc, createdAt desc) ${ADDRESS_FIELDS}`,
    { userId }
  );
}

// Mirrors the validation in sanity/schemaTypes/addressType.ts
const addressSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  address: z
    .string()
    .trim()
    .min(5, "Street address must be at least 5 characters")
    .max(100),
  city: z.string().trim().min(1, "City is required").max(50),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, "Use a two-letter state code, e.g. NY"),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Use a ZIP like 12345 or 12345-6789"),
  default: z.boolean(),
});

export type AddressInput = z.input<typeof addressSchema>;

export type CreateAddressResult =
  | { ok: true; address: UserAddress }
  | { ok: false; error: string };

export async function createAddress(
  input: AddressInput
): Promise<CreateAddressResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Please sign in first." };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid address" };
  }

  const user = await currentUser();
  const existing = await getMyAddresses();
  // The first address is always the default
  const isDefault = parsed.data.default || existing.length === 0;

  try {
    const transaction = backendClient.transaction();
    if (isDefault) {
      for (const address of existing.filter((a) => a.default)) {
        transaction.patch(address._id, (patch) => patch.set({ default: false }));
      }
    }
    const _id = `address-${crypto.randomUUID()}`;
    transaction.create({
      _id,
      _type: "address",
      ...parsed.data,
      default: isDefault,
      clerkUserId: userId,
      email: user?.primaryEmailAddress?.emailAddress,
      createdAt: new Date().toISOString(),
    });
    await transaction.commit();
    return {
      ok: true,
      address: { _id, ...parsed.data, default: isDefault },
    };
  } catch (error) {
    console.error("Failed to create address", error);
    return { ok: false, error: "Couldn't save the address. Please try again." };
  }
}
