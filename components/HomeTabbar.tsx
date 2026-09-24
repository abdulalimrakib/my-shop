"use client";
import { productType } from "@/constants/data";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center gap-3 justify-between">
      {/* Scrolls sideways on narrow screens instead of overflowing the page */}
      <div className="flex min-w-0 items-center gap-1.5 md:gap-3 text-sm font-semibold overflow-x-auto scrollbar-hide -mx-1 px-1 py-1">
        {productType?.map((item) => (
          <Button
            key={item?.title}
            variant="outline"
            onClick={() => onTabSelect(item?.title)}
            aria-pressed={selectedTab === item?.title}
            className={cn(
              "h-auto shrink-0 rounded-full border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 font-semibold shadow-none hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect",
              selectedTab === item?.title
                ? "bg-shop_light_green text-white border-shop_light_green"
                : "bg-shop_light_green/10"
            )}
          >
            {item?.title}
          </Button>
        ))}
      </div>
      <Button
        asChild
        variant="outline"
        className="h-auto shrink-0 rounded-full border-darkColor bg-transparent px-4 py-1 font-normal shadow-none hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect"
      >
        <Link href={"/shop"}>See all</Link>
      </Button>
    </div>
  );
};

export default HomeTabbar;
