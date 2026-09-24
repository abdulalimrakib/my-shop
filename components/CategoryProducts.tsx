"use client";
import { Category } from "@/sanity.types";
import { useRouter } from "next/navigation";
import React from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { Button } from "./ui/button";
import { getProductsByCategory } from "@/actions/catalog";
import { AnimatePresence, motion } from "motion/react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./ProductCardSkeleton";
interface Props {
  categories: Category[];
  slug: string;
}

const CategoryProducts = ({ categories, slug: currentSlug }: Props) => {
  const { data, loading } = useAsyncData(currentSlug, getProductsByCategory);
  const products = data ?? [];
  const router = useRouter();
  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    // The page re-renders with the new slug, which refetches below
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  return (
    <div className="py-5 flex flex-col md:flex-row md:items-start gap-5">
      <nav
        aria-label="Categories"
        className="flex md:flex-col gap-2 md:gap-0 overflow-x-auto scrollbar-hide md:overflow-visible md:min-w-40 md:border -mx-4 px-4 md:mx-0 md:px-0"
      >
        {categories?.map((item) => (
          <Button
            onClick={() => handleCategoryChange(item?.slug?.current as string)}
            key={item?._id}
            aria-current={
              item?.slug?.current === currentSlug ? "page" : undefined
            }
            className={`shrink-0 bg-transparent p-0 text-darkColor shadow-none hover:bg-shop_orange hover:text-white font-semibold hoverEffect transition-colors capitalize rounded-full border border-darkColor/15 md:rounded-none md:border-0 md:border-b md:last:border-b-0 ${item?.slug?.current === currentSlug ? "bg-shop_orange text-white border-shop_orange" : ""}`}
          >
            <span className="w-full text-left px-3 md:px-2">{item?.title}</span>
          </Button>
        ))}
      </nav>
      <div className="flex-1 min-w-0 w-full">
        {loading ? (
          <ProductGridSkeleton className="md:grid-cols-3 lg:grid-cols-5" />
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products?.map((product) => (
              <AnimatePresence key={product._id}>
                <motion.div>
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductAvailable
            selectedTab={currentSlug}
            className="mt-0 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
