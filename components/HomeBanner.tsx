import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { banner_1 } from "@/images";

const HomeBanner = () => {
  return (
    <div className="py-12 md:py-8 lg:py-0 bg-shop_light_pink rounded-lg px-6 sm:px-10 lg:px-24 flex items-center justify-between gap-6">
      <div className="space-y-5">
        <Title className="text-2xl sm:text-3xl lg:text-4xl">
          Grab Upto 50% off on <br className="hidden lg:inline" />
          Selected headphone
        </Title>
        <Link
          href={"/shop"}
          className="inline-block bg-shop_dark_green/90 text-white/90 px-5 py-2 rounded-md text-sm font-semibold hover:text-white hover:bg-shop_dark_green hoverEffect"
        >
          Buy Now
        </Link>
      </div>
      <div>
        <Image
          src={banner_1}
          alt="Wireless headphones on sale"
          priority
          className="hidden md:inline-flex w-72 lg:w-96"
        />
      </div>
    </div>
  );
};

export default HomeBanner;
