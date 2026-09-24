"use client";

import { SearchProduct } from "@/types";
import { searchProducts } from "@/actions/catalog";
import { urlFor } from "@/sanity/lib/image";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import PriceView from "./PriceView";
import { Spinner } from "./ui/spinner";

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Sanity's `match` works on word prefixes, so highlight the search words
// wherever they start a word in the text.
const buildMatcher = (term: string) => {
  const words = term.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (!words.length) return null;
  return new RegExp(
    `(?<![\\p{L}\\p{N}])(${words.map(escapeRegExp).join("|")})`,
    "giu",
  );
};

const Highlight = ({
  text,
  matcher,
}: {
  text: string;
  matcher: RegExp | null;
}) => {
  if (!matcher) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(matcher)) {
    const start = match.index ?? 0;
    parts.push(text.slice(lastIndex, start));
    parts.push(
      <strong key={start} className="font-extrabold text-shop_dark_green">
        {match[0]}
      </strong>,
    );
    lastIndex = start + match[0].length;
  }
  parts.push(text.slice(lastIndex));
  return <>{parts}</>;
};

const hasMatch = (text: string | null | undefined, matcher: RegExp | null) =>
  !!text && !!matcher && text.search(matcher) !== -1;

// A short slice of the description around the first match
const descriptionSnippet = (text: string, matcher: RegExp) => {
  const index = text.search(matcher);
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + 80);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
};

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = search.trim();
    if (!term) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    // Debounce so we don't query Sanity on every keystroke
    const timer = setTimeout(async () => {
      try {
        const data = await searchProducts(term);
        if (!cancelled) setProducts(data);
      } catch (error) {
        console.error("Product search failed:", error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) setSearch("");
  };

  const term = search.trim();
  const matcher = buildMatcher(term);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button aria-label="Search products">
          <Search className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
        </button>
      </DialogTrigger>
      <DialogContent className="top-[10%] translate-y-0 sm:max-w-2xl min-h-[50vh] max-h-[85vh] flex flex-col overflow-hidden bg-white">
        <DialogTitle className="text-shop_dark_green">
          Product Searchbar
        </DialogTitle>
        <DialogDescription className="sr-only">
          Search products by name, description, category or brand
        </DialogDescription>
        <div className="relative">
          <Input
            placeholder="Search your product here..."
            className="flex-1 rounded-md py-5 pr-20 font-semibold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {search && (
            <button
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="absolute right-12 top-1/2 -translate-y-1/2 hover:text-red-600 hoverEffect"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="absolute right-0 top-0 h-full w-10 flex items-center justify-center rounded-tr-md rounded-br-md bg-shop_dark_green/10 text-shop_dark_green">
            <Search className="w-5 h-5" />
          </span>
        </div>

        <div className="flex-1 overflow-y-auto border rounded-md">
          {loading ? (
            <p className="flex items-center justify-center gap-2 px-6 py-10 text-center text-shop_dark_green font-semibold">
              <Spinner className="size-5" />
              Searching...
            </p>
          ) : products.length ? (
            products.map((product) => (
              <Link
                key={product._id}
                href={`/product/${product.slug?.current}`}
                onClick={() => handleOpenChange(false)}
                className="flex items-center gap-4 p-3 border-b last:border-b-0 hover:bg-shop_light_bg hoverEffect"
              >
                {product.images?.[0] && (
                  <div className="w-20 h-20 shrink-0 bg-shop_light_bg rounded-md overflow-hidden border">
                    <Image
                      src={urlFor(product.images[0]).width(160).url()}
                      alt={product.name ?? "productImage"}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-normal line-clamp-1 text-darkColor">
                    <Highlight text={product.name ?? ""} matcher={matcher} />
                  </h3>
                  {product.categories && (
                    <p className="text-xs uppercase text-lightColor line-clamp-1">
                      <Highlight
                        text={product.categories.join(", ")}
                        matcher={matcher}
                      />
                    </p>
                  )}
                  {product.brandTitle && (
                    <p className="text-xs text-lightColor line-clamp-1">
                      Brand:{" "}
                      <Highlight text={product.brandTitle} matcher={matcher} />
                    </p>
                  )}
                  {matcher &&
                    product.description &&
                    !hasMatch(product.name, matcher) &&
                    !hasMatch(product.categories?.join(" "), matcher) &&
                    !hasMatch(product.brandTitle, matcher) &&
                    hasMatch(product.description, matcher) && (
                      <p className="text-xs text-lightColor line-clamp-2">
                        <Highlight
                          text={descriptionSnippet(
                            product.description,
                            matcher,
                          )}
                          matcher={matcher}
                        />
                      </p>
                    )}
                  <PriceView
                    price={product.price}
                    discount={product.discount}
                    className="text-sm"
                  />
                </div>
              </Link>
            ))
          ) : (
            <p className="px-6 py-10 text-center text-sm text-lightColor">
              {term ? (
                <>
                  Nothing matches{" "}
                  <span className="font-semibold text-darkColor">
                    &quot;{term}&quot;
                  </span>
                  . Please try something else.
                </>
              ) : (
                "Search and explore your products from MY SHOP."
              )}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
