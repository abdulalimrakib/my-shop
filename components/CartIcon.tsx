"use client";
import useStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "./ui/badge";

const CartIcon = () => {
  const { items } = useStore();
  return (
    <Link href={"/cart"} className="group relative">
      <ShoppingBag className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
      <Badge className="absolute -top-1 -right-1 h-3.5 min-w-3.5 px-0.5 bg-shop_dark_green text-white text-xs font-semibold tabular-nums">
        {items?.length ? items?.length : 0}
      </Badge>
    </Link>
  );
};

export default CartIcon;
