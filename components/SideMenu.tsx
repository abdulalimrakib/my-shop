import React from "react";
import Logo from "./Logo";
import { X } from "lucide-react";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "./ui/sheet";

// Rendered inside the <Sheet> owned by MobileMenu
const SideMenu = () => {
  const pathname = usePathname();
  return (
    <SheetContent
      side="left"
      showCloseButton={false}
      className="md:hidden w-full min-w-72 max-w-96 sm:max-w-96 bg-black text-white/70 p-10 border-r-shop_light_green gap-6"
    >
      <SheetTitle className="sr-only">Menu</SheetTitle>
      <SheetDescription className="sr-only">Site navigation</SheetDescription>
      <div className="flex items-center justify-between gap-5">
        <Logo className="text-white" spanDesign="group-hover:text-white" />
        <SheetClose className="hover:text-shop_light_green hoverEffect">
          <X />
          <span className="sr-only">Close</span>
        </SheetClose>
      </div>

      <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
        {headerData?.map((item) => (
          <SheetClose asChild key={item?.title}>
            <Link
              href={item?.href}
              className={`hover:text-shop_light_green hoverEffect ${
                pathname === item?.href && "text-white"
              }`}
            >
              {item?.title}
            </Link>
          </SheetClose>
        ))}
      </div>
      <SocialMedia />
    </SheetContent>
  );
};

export default SideMenu;
