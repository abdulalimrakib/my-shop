import React from "react";
import Title from "./Title";
import { CATEGORIES_QUERY_RESULT } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";

const HomeCategories = ({ categories }: { categories: CATEGORIES_QUERY_RESULT }) => {
  return (
    <div className="bg-white border border-shop_light_green/20 my-10 md:my-20 p-5 lg:p-7 rounded-md">
      <Title className="border-b pb-3">Popular Categories</Title>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories?.map((category) => (
          <Link
            key={category?._id}
            href={`/category/${category?.slug?.current}`}
            className="group"
          >
            <Card className="py-0 rounded-md border-transparent shadow-none bg-shop_light_bg group-hover:border-shop_orange/30 group-hover:shadow-md hoverEffect">
              <CardContent className="p-5 flex items-center gap-3">
                {category?.image && (
                  <div className="overflow-hidden border border-shop_orange/30 group-hover:border-shop_orange hoverEffect w-20 h-20 p-1">
                    <Image
                      src={urlFor(category?.image).width(160).url()}
                      alt={category?.title ?? "Category"}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-base font-semibold group-hover:text-shop_dark_green hoverEffect">
                    {category?.title}
                  </h3>
                  <p className="text-sm">
                    <span className="font-bold text-shop_dark_green">{`(${category?.productCount})`}</span>{" "}
                    items Available
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
