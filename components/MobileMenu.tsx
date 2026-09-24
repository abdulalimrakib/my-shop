"use client";
import { AlignLeft } from "lucide-react";
import React from "react";
import SideMenu from "./SideMenu";
import { Sheet, SheetTrigger } from "./ui/sheet";

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="Open menu" className="md:hidden">
          <AlignLeft className="hover:text-darkColor hoverEffect hover:cursor-pointer" />
        </button>
      </SheetTrigger>
      <SideMenu />
    </Sheet>
  );
};

export default MobileMenu;
