import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse every product at MY SHOP. Filter by category, brand and price.",
  alternates: { canonical: "/shop" },
};

const ShopPage = async () => {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getAllBrands(),
  ]);
  return (
    <div className="bg-white">
      {/* Shop reads the URL's search params on the client */}
      <Suspense>
        <Shop categories={categories} brands={brands} />
      </Suspense>
    </div>
  );
};

export default ShopPage;
