"use client";
import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import { useSearchParams } from "next/navigation";
import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./ProductCardSkeleton";
import { Button } from "./ui/button";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
}
const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParams ? [categoryParams] : [],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    brandParams ? [brandParams] : [],
  );
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const priceRanges = selectedPrices.map((value) => {
        const [min, max] = value.split("-").map(Number);
        return { min, max };
      });
      // Options within a group are OR-ed; the groups themselves are AND-ed
      const query = `
      *[_type == 'product' 
        && (count($categories) == 0 || count((categories[]->slug.current)[@ in $categories]) > 0)
        && (count($brands) == 0 || brand->slug.current in $brands)
        && (count($priceRanges) == 0 || count($priceRanges[^.price >= min && ^.price <= max]) > 0)
      ] 
      | order(name asc) {
        ...,"categories": categories[]->title
      }
    `;
      const data = await client.fetch(
        query,
        {
          categories: selectedCategories,
          brands: selectedBrands,
          priceRanges,
        },
        { next: { revalidate: 0 } },
      );
      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, selectedBrands, selectedPrices]);
  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5">
          <div className="flex items-center justify-between">
            <Title className="text-lg uppercase tracking-wide">
              Get the products as your needs
            </Title>
            {(selectedCategories.length > 0 ||
              selectedBrands.length > 0 ||
              selectedPrices.length > 0) && (
              <Button
                variant="link"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setSelectedPrices([]);
                }}
                className="h-auto p-0 text-shop_dark_green underline text-sm mt-2 font-medium hover:text-darkRed hoverEffect"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
            <CategoryList
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <BrandList
              brands={brands}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
            />
            <PriceList
              selectedPrices={selectedPrices}
              setSelectedPrices={setSelectedPrices}
            />
          </div>
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <ProductGridSkeleton
                  count={8}
                  className="md:grid-cols-3 lg:grid-cols-4"
                />
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
