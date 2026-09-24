"use server";

import stripe from "@/lib/stripe";
import { serverClient } from "@/sanity/lib/serverClient";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { z } from "zod";

// Everything Stripe charges is re-read from Sanity here. The browser only
// sends product ids, quantities and the chosen address id.
const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .min(1, "Your cart is empty.")
    .max(50),
  addressId: z.string().min(1, "Please select a delivery address."),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Stored in Stripe session metadata; each value must stay under 500 characters
export interface CheckoutMetadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  addressId: string;
}

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

type CheckoutProduct = Pick<
  Product,
  "_id" | "name" | "description" | "price" | "stock" | "images"
>;

export async function createCheckoutSession(
  input: CheckoutInput
): Promise<CheckoutResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Please sign in to check out." };

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid cart." };
  }
  const { items, addressId } = parsed.data;

  const user = await currentUser();
  const customerEmail = user?.primaryEmailAddress?.emailAddress;
  if (!customerEmail) {
    return { ok: false, error: "Your account needs an email address to check out." };
  }
  const customerName =
    user?.fullName || user?.username || customerEmail.split("@")[0];

  // Merge duplicate lines so stock is checked against the real total
  const quantities = new Map<string, number>();
  for (const { productId, quantity } of items) {
    quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
  }
  const productIds = [...quantities.keys()];

  const [products, address] = await Promise.all([
    serverClient.fetch<CheckoutProduct[]>(
      `*[_type == "product" && _id in $productIds]{_id, name, description, price, stock, images}`,
      { productIds }
    ),
    serverClient.fetch<{ _id: string } | null>(
      `*[_type == "address" && _id == $addressId && clerkUserId == $userId][0]{_id}`,
      { addressId, userId }
    ),
  ]);

  if (!address) {
    return { ok: false, error: "Please select one of your delivery addresses." };
  }

  const productsById = new Map(products.map((p) => [p._id, p]));
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const [productId, quantity] of quantities) {
    const product = productsById.get(productId);
    if (!product || typeof product.price !== "number") {
      return {
        ok: false,
        error: "A product in your cart is no longer available. Please remove it and try again.",
      };
    }
    // A missing stock value means stock isn't tracked for this product
    if (typeof product.stock === "number" && product.stock < quantity) {
      return {
        ok: false,
        error:
          product.stock > 0
            ? `Only ${product.stock} of "${product.name}" left in stock.`
            : `"${product.name}" is out of stock.`,
      };
    }
    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name || "Product",
          description: product.description || undefined,
          metadata: { id: product._id },
          images: product.images?.[0]
            ? [urlFor(product.images[0]).width(800).url()]
            : undefined,
        },
      },
    });
  }

  const metadata: CheckoutMetadata = {
    orderNumber: crypto.randomUUID(),
    customerName: customerName.slice(0, 200),
    customerEmail,
    clerkUserId: userId,
    addressId,
  };

  try {
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });
    const customerId = customers.data[0]?.id;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      metadata: { ...metadata },
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: { enabled: true },
      line_items: lineItems,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      ...(customerId
        ? { customer: customerId }
        : { customer_email: customerEmail, customer_creation: "always" }),
    });

    if (!session.url) {
      return { ok: false, error: "Couldn't start checkout. Please try again." };
    }
    return { ok: true, url: session.url };
  } catch (error) {
    console.error("Error creating Checkout Session", error);
    return { ok: false, error: "Couldn't start checkout. Please try again." };
  }
}
