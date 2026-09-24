"use client";

import useStore from "@/store";
import { useEffect } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Check,
  Clock,
  Home,
  Package,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type SuccessState =
  | { kind: "confirmed"; orderNumber: string; recorded: boolean }
  | { kind: "pending"; orderNumber: string }
  | { kind: "unverified" };

const SuccessCard = ({ state }: { state: SuccessState }) => {
  const resetCart = useStore((s) => s.resetCart);
  const paid = state.kind === "confirmed" || state.kind === "pending";

  // Only empty the cart once Stripe has confirmed this checkout
  useEffect(() => {
    if (paid) resetCart();
  }, [paid, resetCart]);

  const icon =
    state.kind === "confirmed" ? (
      <Check className="text-white w-10 h-10" />
    ) : state.kind === "pending" ? (
      <Clock className="text-white w-10 h-10" />
    ) : (
      <AlertTriangle className="text-white w-10 h-10" />
    );

  return (
    <div className="py-5 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full"
      >
        <Card className="bg-white rounded-2xl gap-8 shadow-2xl p-6 text-center">
          <CardHeader className="px-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${state.kind === "unverified" ? "bg-shop_orange" : "bg-black"}`}
            >
              {icon}
            </motion.div>

            <CardTitle className="text-3xl font-bold text-gray-900">
              {state.kind === "confirmed" && "Order Confirmed!"}
              {state.kind === "pending" && "Payment Processing"}
              {state.kind === "unverified" && "We couldn't find this order"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4 text-left">
            {state.kind === "confirmed" && (
              <p className="text-gray-700">
                Thank you for your purchase. We&apos;re processing your order
                and will ship it soon.
                {!state.recorded &&
                  " It can take a minute to appear on your orders page."}
              </p>
            )}
            {state.kind === "pending" && (
              <p className="text-gray-700">
                Thank you! Your payment is still being processed. Your order
                will appear on your orders page once the payment clears.
              </p>
            )}
            {state.kind === "unverified" && (
              <p className="text-gray-700">
                We couldn&apos;t confirm a completed payment for this link. If
                you were charged, check your orders page or contact us.
              </p>
            )}
            {state.kind !== "unverified" && (
              <p className="text-gray-700">
                Order Number:{" "}
                <span className="text-black font-semibold break-all">
                  {state.orderNumber}
                </span>
              </p>
            )}
          </CardContent>
          <CardFooter className="px-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-lg bg-black text-white font-semibold shadow-md hover:bg-gray-800"
            >
              <Link href="/">
                <Home className="size-5" />
                Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-lg bg-shop_light_green text-white border border-shop_light_green font-semibold shadow-md hover:bg-shop_dark_green"
            >
              <Link href="/orders">
                <Package className="size-5" />
                Orders
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-lg bg-black text-white font-semibold shadow-md hover:bg-gray-800"
            >
              <Link href="/shop">
                <ShoppingBag className="size-5" />
                Shop
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessCard;
