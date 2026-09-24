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
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      <div className="flex flex-col md:min-w-40 border">
        {categories?.map((item) => (
          <Button
            onClick={() => handleCategoryChange(item?.slug?.current as string)}
            key={item?._id}
            aria-current={
              item?.slug?.current === currentSlug ? "page" : undefined
            }
            className={`bg-transparent border-0 p-0  rounded-none text-darkColor shadow-none hover:bg-shop_orange hover:text-white font-semibold hoverEffect border-b last:border-b-0 transition-colors capitalize ${item?.slug?.current === currentSlug && "bg-shop_orange text-white border-shop_orange"}`}
          >
            <p className="w-full text-left px-2">{item?.title}</p>
          </Button>
        ))}
      </div>
      <div className="flex-1">
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
