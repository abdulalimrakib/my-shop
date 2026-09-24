"use client";
import { BRANDS_QUERYResult, Category } from "@/sanity.types";
import { CatalogProduct } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BrandList from "./shop/BrandList";
import PriceList, { parsePriceRange } from "./shop/PriceList";
import { getFilteredProducts, ProductFilters } from "@/actions/catalog";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./ProductCardSkeleton";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { SlidersHorizontal } from "lucide-react";

type Sort = ProductFilters["sort"];

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

// Filters live in the URL (?category=a,b&brand=x&price=0-100&sort=price-asc)
// so they survive refreshes, can be shared, and work with the back button.
type FilterKey = "category" | "brand" | "price";

const readList = (params: URLSearchParams, key: FilterKey) =>
  params.get(key)?.split(",").filter(Boolean) ?? [];

interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
}
const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategories = readList(searchParams, "category");
  const selectedBrands = readList(searchParams, "brand");
  const selectedPrices = readList(searchParams, "price");
  const sortParam = searchParams.get("sort");
  const sort: Sort = SORT_OPTIONS.some((o) => o.value === sortParam)
    ? (sortParam as Sort)
    : "name-asc";
  const hasFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedPrices.length > 0;

  const updateParams = useCallback(
    (changes: Partial<Record<FilterKey | "sort", string | null>>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  // Adapts a URL param to the setState-style API the filter lists use
  const listSetter =
    (
      key: FilterKey,
      current: string[],
    ): React.Dispatch<React.SetStateAction<string[]>> =>
    (action) => {
      const next = typeof action === "function" ? action(current) : action;
      updateParams({ [key]: next.join(",") || null });
    };

  const filterKey = searchParams.toString();
  useEffect(() => {
    const params = new URLSearchParams(filterKey);
    const filters: ProductFilters = {
      categories: readList(params, "category"),
      brands: readList(params, "brand"),
      priceRanges: readList(params, "price")
        .map(parsePriceRange)
        .filter((range) => range !== null),
      sort,
    };
    let cancelled = false;
    setLoading(true);
    getFilteredProducts(filters)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((error) => {
        console.error("Shop product fetching error", error);
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filterKey, sort]);

  const filterLists = (
    <>
      <CategoryList
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={listSetter("category", selectedCategories)}
      />
      <BrandList
        brands={brands}
        selectedBrands={selectedBrands}
        setSelectedBrands={listSetter("brand", selectedBrands)}
      />
      <PriceList
        selectedPrices={selectedPrices}
        setSelectedPrices={listSetter("price", selectedPrices)}
      />
    </>
  );

  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + selectedPrices.length;

  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Title as="h1" className="text-lg uppercase tracking-wide">
            Shop all products
          </Title>
          <div className="flex items-center gap-3">
            {hasFilters && (
              <Button
                variant="link"
                onClick={() =>
                  updateParams({ category: null, brand: null, price: null })
                }
                className="h-auto p-0 text-shop_dark_green underline text-sm font-medium hover:text-red-600 hoverEffect"
              >
                Reset Filters
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="md:hidden bg-white text-darkColor font-medium"
                >
                  <SlidersHorizontal />
                  Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto gap-0">
                <SheetTitle className="px-5 pt-5">Filters</SheetTitle>
                <SheetDescription className="sr-only">
                  Filter products by category, brand and price
                </SheetDescription>
                {filterLists}
              </SheetContent>
            </Sheet>
            <Select
              value={sort}
              onValueChange={(value) =>
                updateParams({ sort: value === "name-asc" ? null : value })
              }
            >
              <SelectTrigger
                aria-label="Sort products"
                className="w-44 bg-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          <div className="hidden md:block md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
            {filterLists}
          </div>
          <div className="flex-1 pt-5 pb-10">
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
      </Container>
    </div>
  );
};

export default Shop;
