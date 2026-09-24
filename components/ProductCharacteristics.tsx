import { CatalogProduct } from "@/types";
import { isOutOfStock } from "@/lib/stock";
import Link from "next/link";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const ProductCharacteristics = ({
  product,
}: {
  product:
    | (CatalogProduct & { brandName?: string | null; brandSlug?: string | null })
    | null
    | undefined;
}) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{product?.name}: Characteristics</AccordionTrigger>
        <AccordionContent className="space-y-1">
          {product?.brandName && (
            <p className="flex items-center justify-between">
              Brand:{" "}
              {product.brandSlug ? (
                <Link
                  href={`/brand/${product.brandSlug}`}
                  className="font-semibold tracking-wide hover:text-shop_dark_green hoverEffect"
                >
                  {product.brandName}
                </Link>
              ) : (
                <span className="font-semibold tracking-wide">
                  {product.brandName}
                </span>
              )}
            </p>
          )}
          {product?.variant && (
            <p className="flex items-center justify-between">
              Type:{" "}
              <span className="font-semibold tracking-wide capitalize">
                {product.variant}
              </span>
            </p>
          )}
          <p className="flex items-center justify-between">
            Stock:{" "}
            <span className="font-semibold tracking-wide">
              {isOutOfStock(product) ? "Out of Stock" : "Available"}
            </span>
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;
