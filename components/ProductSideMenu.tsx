"use client";
import { cn } from "@/lib/utils";
import { CatalogProduct } from "@/types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: CatalogProduct;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<CatalogProduct | null>(null);
  useEffect(() => {
    const availableProduct = favoriteProduct?.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableProduct || null);
  }, [product, favoriteProduct]);
  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct
            ? "Product removed successfully!"
            : "Product added successfully!"
        );
      });
    }
  };
  return (
    <div className={cn("absolute top-2 right-2", className)}>
      <button
        type="button"
        onClick={handleFavorite}
        aria-label={
          existingProduct ? "Remove from favorites" : "Add to favorites"
        }
        aria-pressed={!!existingProduct}
        className={`p-2.5 rounded-full hover:cursor-pointer hover:bg-shop_dark_green/80 hover:text-white hoverEffect ${existingProduct ? "bg-shop_dark_green/80 text-white" : "bg-lightColor/10"}`}
      >
        <Heart size={15} fill={existingProduct ? "currentColor" : "none"} />
      </button>
    </div>
  );
};

export default ProductSideMenu;
