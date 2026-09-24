import { CatalogProduct } from "@/types";
import useStore from "@/store";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { canAddMore, isOutOfStock } from "@/lib/stock";

interface Props {
  product: CatalogProduct;
  className?: string;
}
const QuantityButtons = ({ product, className }: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const outOfStock = isOutOfStock(product);

  const handleRemoveProduct = () => {
    removeItem(product?._id);
    if (itemCount === 1) {
      toast.success(`${product?.name?.substring(0, 12)}... removed from cart`);
    }
  };

  const handleAddToCart = () => {
    if (canAddMore(product, itemCount)) {
      addItem(product);
    } else {
      toast.error("Can not add more than available stock");
    }
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0}
        aria-label="Decrease quantity"
        className="w-6 h-6 border-[1px] hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Minus />
      </Button>
      <span
        aria-live="polite"
        aria-label={`Quantity ${itemCount}`}
        className="font-semibold text-sm w-6 text-center text-darkColor"
      >
        {itemCount}
      </span>
      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={outOfStock}
        aria-label="Increase quantity"
        className="w-6 h-6 border-[1px] hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
