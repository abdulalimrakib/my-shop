"use client";

import React, { useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { getProductsByVariant } from "@/actions/catalog";
import NoProductAvailable from "./NoProductAvailable";
import Container from "./Container";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants/data";
import ProductGridSkeleton from "./ProductCardSkeleton";

const ProductGrid = () => {
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  const { data, loading } = useAsyncData(selectedTab, getProductsByVariant);
  const products = data ?? [];

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      {loading ? (
        <ProductGridSkeleton className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10" />
      ) : products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
          <>
            {products?.map((product) => (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard key={product?._id} product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </>
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;
