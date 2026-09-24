import { CatalogProduct } from "@/types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import PriceView from "./PriceView";
import Title from "./Title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "./AddToCartButton";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { isOutOfStock } from "@/lib/stock";

const ProductCard = ({ product }: { product: CatalogProduct }) => {
  return (
    <Card className="@container h-full text-sm gap-0 py-0 rounded-md shadow-none group bg-white overflow-hidden hover:shadow-md hoverEffect">
      <div className="relative group overflow-hidden bg-shop_light_bg">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).width(600).url()}
              alt={product?.name ?? "Product image"}
              width={500}
              height={500}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={`w-full h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg duration-500 
              ${isOutOfStock(product) ? "opacity-50" : "group-hover:scale-105"}`}
            />
          </Link>
        )}
        <ProductSideMenu product={product} />
        {product?.status === "sale" ? (
          <Badge
            variant="outline"
            className="absolute top-2 left-2 z-10 bg-white border-darkColor/50 group-hover:border-shop_light_green hover:text-shop_dark_green hoverEffect"
          >
            Sale!
          </Badge>
        ) : (
          <Link
            href={"/deal"}
            className="absolute top-2 left-2 z-10 border border-shop_orange/50 p-1 rounded-full group-hover:border-shop_orange hover:text-shop_dark_green hoverEffect"
          >
            <Flame
              size={18}
              fill="#fb6c08"
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </Link>
        )}
      </div>
      <CardContent className="p-3 flex flex-1 flex-col gap-2">
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-lightColor">
            {product.categories.map((cat) => cat).join(", ")}
          </p>
        )}
        <Title className="text-sm line-clamp-1">{product?.name}</Title>

        <p
          className={`font-medium ${isOutOfStock(product) ? "text-red-600" : "text-shop_dark_green/80"}`}
        >
          {isOutOfStock(product) ? "Out of stock" : "In stock"}
        </p>

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
          rowClassName="flex-col flex-nowrap items-start min-h-10 @[11rem]:flex-row @[11rem]:items-baseline @[11rem]:min-h-5"
        />
        <div className="mt-auto">
          <AddToCartButton
            product={product}
            className="w-full rounded-full px-2 has-[>svg]:px-2 text-xs sm:text-sm [&_svg]:hidden min-[360px]:[&_svg]:inline"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
