"use client";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { emptyCart } from "@/images";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

export default function EmptyCart() {
  return (
    <div className="py-10 md:py-20 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white rounded-2xl shadow-xl p-8 gap-8 border-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
            }}
            className="relative w-48 h-48 mx-auto"
          >
            <Image
              src={emptyCart}
              alt="Empty shopping cart"
              layout="fill"
              objectFit="contain"
              className="drop-shadow-lg"
            />
            <motion.div
              animate={{
                x: [0, -10, 10, 0],
                y: [0, -5, 5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              }}
              className="absolute -top-4 -right-4 bg-blue-500 rounded-full p-2"
            >
              <ShoppingCart size={24} className="text-white" />
            </motion.div>
          </motion.div>

          <CardContent className="px-0 text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Your cart is feeling lonely
            </h2>
            <p className="text-gray-600">
              It looks like you haven&apos;t added anything to your cart yet.
              Let&apos;s change that and find some amazing products for you!
            </p>
          </CardContent>

          <CardFooter className="px-0">
            <Button
              asChild
              variant="outline"
              className="w-full h-auto bg-darkColor/5 border-darkColor/20 py-2.5 rounded-full text-sm font-semibold tracking-wide hover:border-darkColor hover:bg-darkColor hover:text-white hoverEffect"
            >
              <Link href="/">Discover Products</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
