"use client";

import useStore from "@/store";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Home, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const SuccessPageContent = () => {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    if (orderNumber) {
      resetCart();
    }
  }, [orderNumber, resetCart]);
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
              className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Check className="text-white w-10 h-10" />
            </motion.div>

            <CardTitle className="text-3xl font-bold text-gray-900">
              Order Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4 text-left">
            <p className="text-gray-700">
              Thank you for your purchase. We&apos;re processing your order and
              will ship it soon. A confirmation email with your order details
              will be sent to your inbox shortly.
            </p>
            <p className="text-gray-700">
              Order Number:{" "}
              <span className="text-black font-semibold break-all">
                {orderNumber}
              </span>
            </p>
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
              className="h-12 rounded-lg bg-lightGreen text-black border border-lightGreen font-semibold shadow-md hover:bg-gray-100"
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
              <Link href="/">
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

const SuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center gap-2 py-20">
          <Spinner className="size-6" /> Loading...
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;
