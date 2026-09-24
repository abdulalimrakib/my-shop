import SuccessCard, { SuccessState } from "@/components/SuccessCard";
import stripe from "@/lib/stripe";
import { serverClient } from "@/sanity/lib/serverClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Order status" };

// Confirms the checkout with Stripe instead of trusting the URL
async function getSuccessState(
  sessionId: string | undefined,
  userId: string
): Promise<SuccessState> {
  if (!sessionId?.startsWith("cs_")) return { kind: "unverified" };
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderNumber = session.metadata?.orderNumber;
    if (session.metadata?.clerkUserId !== userId || !orderNumber) {
      return { kind: "unverified" };
    }
    if (session.status !== "complete") return { kind: "unverified" };
    if (session.payment_status === "unpaid") {
      return { kind: "pending", orderNumber };
    }
    const recorded = await serverClient.fetch<boolean>(
      `defined(*[_id == $orderId][0]._id)`,
      { orderId: `order-${session.id}` }
    );
    return { kind: "confirmed", orderNumber, recorded };
  } catch (error) {
    console.error("Failed to verify checkout session", error);
    return { kind: "unverified" };
  }
}

const SuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const { session_id } = await searchParams;
  const state = await getSuccessState(session_id, userId);
  return <SuccessCard state={state} />;
};

export default SuccessPage;
