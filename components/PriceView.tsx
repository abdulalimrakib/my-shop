import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";
import { originalPrice } from "@/lib/price";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}
const PriceView = ({ price, discount, className }: Props) => {
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <PriceFormatter
          amount={price}
          className={cn("text-shop_dark_green", className)}
        />
        {price && discount ? (
          <PriceFormatter
            amount={originalPrice(price, discount)}
            className={cn(
              "line-through text-xs font-normal text-zinc-500",
              className
            )}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PriceView;
