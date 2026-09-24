import { CheckoutMetadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Card payments arrive here already paid. Delayed payment methods
      // arrive unpaid and are confirmed by async_payment_succeeded.
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await recordOrder(session);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await backendClient
          .patch(orderIdFor(session.id))
          .set({ status: "cancelled" })
          .commit()
          .catch(() => undefined); // no order exists if it was never recorded
        break;
      }
    }
  } catch (error) {
    // A non-2xx response makes Stripe retry; recordOrder is idempotent
    console.error(`Error handling Stripe event ${event.id}:`, error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// Deterministic id so retried or duplicate events map to the same order
const orderIdFor = (sessionId: string) => `order-${sessionId}`;

async function recordOrder(session: Stripe.Checkout.Session) {
  const orderId = orderIdFor(session.id);
  const isPaid = session.payment_status !== "unpaid";

  const existing = await backendClient.getDocument<{ status?: string }>(orderId);
  if (existing) {
    // Already recorded (retry, or completed -> async_payment_succeeded)
    if (isPaid && existing.status === "pending") {
      await backendClient.patch(orderId).set({ status: "paid" }).commit();
    }
    return;
  }

  const { orderNumber, customerName, customerEmail, clerkUserId, addressId } =
    (session.metadata ?? {}) as unknown as CheckoutMetadata;

  const [lineItems, address, invoice] = await Promise.all([
    stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
      limit: 100,
    }),
    addressId
      ? backendClient.fetch<{
          name?: string;
          address?: string;
          city?: string;
          state?: string;
          zip?: string;
        } | null>(
          `*[_type == "address" && _id == $addressId][0]{name, address, city, state, zip}`,
          { addressId }
        )
      : null,
    session.invoice
      ? stripe.invoices.retrieve(session.invoice as string)
      : null,
  ]);

  const products = [];
  const stockChanges = new Map<string, number>();
  for (const item of lineItems.data) {
    const productId = (item.price?.product as Stripe.Product)?.metadata?.id;
    const quantity = item.quantity ?? 0;
    if (!productId || quantity <= 0) continue;
    products.push({
      _key: crypto.randomUUID(),
      product: { _type: "reference", _ref: productId },
      quantity,
      // What the customer actually paid per unit, after any discount
      price: item.amount_total / quantity / 100,
    });
    stockChanges.set(productId, (stockChanges.get(productId) ?? 0) + quantity);
  }

  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? "";

  const transaction = backendClient.transaction().create({
    _id: orderId,
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id,
    stripeCustomerId,
    customerName,
    clerkUserId,
    email: customerEmail ?? session.customer_details?.email,
    currency: session.currency,
    amountDiscount: (session.total_details?.amount_discount ?? 0) / 100,
    products,
    totalPrice: (session.amount_total ?? 0) / 100,
    status: isPaid ? "paid" : "pending",
    orderDate: new Date().toISOString(),
    invoice: invoice
      ? {
          id: invoice.id,
          number: invoice.number,
          hosted_invoice_url: invoice.hosted_invoice_url,
        }
      : undefined,
    address: address ?? undefined,
  });

  // Only decrement products that track stock. `dec` is applied atomically by
  // Sanity, so concurrent orders can't overwrite each other's changes.
  const trackedIds: string[] = await backendClient.fetch(
    `*[_type == "product" && _id in $ids && defined(stock)]._id`,
    { ids: [...stockChanges.keys()] }
  );
  for (const productId of trackedIds) {
    transaction.patch(productId, (patch) =>
      patch.dec({ stock: stockChanges.get(productId) ?? 0 })
    );
  }

  try {
    await transaction.commit();
  } catch (error) {
    // A concurrent delivery of the same event created the order first
    if ((error as { statusCode?: number }).statusCode === 409) return;
    throw error;
  }

  const oversold: { name?: string; stock: number }[] = await backendClient.fetch(
    `*[_type == "product" && _id in $ids && stock < 0]{name, stock}`,
    { ids: trackedIds }
  );
  if (oversold.length) {
    console.warn(`Order ${orderNumber} oversold products:`, oversold);
  }
}
