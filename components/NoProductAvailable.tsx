"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Spinner } from "./ui/spinner";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";

const NoProductAvailable = ({
  selectedTab,
  className,
}: {
  selectedTab?: string;
  className?: string;
}) => {
  return (
    <Empty
      className={cn(
        "py-10 md:py-10 min-h-80 gap-4 bg-gray-100 rounded-lg w-full mt-10",
        className,
      )}
    >
      <EmptyHeader className="max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EmptyTitle className="text-2xl font-bold text-gray-800">
            No Product Available
          </EmptyTitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <EmptyDescription className="text-gray-600">
            We&apos;re sorry, but there are no products matching on{" "}
            <span className="text-base font-semibold text-darkColor">
              {selectedTab}
            </span>{" "}
            criteria at the moment.
          </EmptyDescription>
        </motion.div>
      </EmptyHeader>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="flex items-center space-x-2 text-shop_dark_green"
      >
        <Spinner className="size-5" />
        <span>We&apos;re restocking shortly</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-sm text-gray-500"
      >
        Please check back later or explore our other product categories.
      </motion.p>
    </Empty>
  );
};

export default NoProductAvailable;
