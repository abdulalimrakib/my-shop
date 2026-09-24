import { cn } from "@/lib/utils";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

// Placeholder with the same shape as ProductCard, shown while products load
export const ProductCardSkeleton = () => {
  return (
    <Card className="gap-0 py-0 rounded-md shadow-none border-darkBlue/20 overflow-hidden">
      <Skeleton className="h-64 w-full rounded-none bg-shop_light_bg" />
      <CardContent className="p-3 flex flex-col gap-2.5">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-9 w-36 rounded-full" />
      </CardContent>
    </Card>
  );
};

const ProductGridSkeleton = ({
  count = 10,
  className,
}: {
  count?: number;
  className?: string;
}) => {
  return (
    <div className={cn("grid grid-cols-2 gap-2.5", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
