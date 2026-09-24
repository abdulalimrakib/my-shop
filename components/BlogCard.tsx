import { LATEST_BLOG_QUERY_RESULT } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "./ui/card";

type BlogCardData = Pick<
  LATEST_BLOG_QUERY_RESULT[number],
  "slug" | "mainImage" | "blogcategories" | "publishedAt" | "title"
>;

const BlogCard = ({
  blog,
  className,
}: {
  blog: BlogCardData;
  className?: string;
}) => {
  const href = `/blog/${blog?.slug?.current}`;
  return (
    <Card
      className={cn(
        "gap-0 py-0 rounded-lg overflow-hidden border-0 shadow-none group hover:shadow-md hoverEffect",
        className
      )}
    >
      {blog?.mainImage && (
        <Link href={href} className="overflow-hidden">
          <Image
            src={urlFor(blog?.mainImage).width(800).url()}
            alt={blog?.title ?? "Blog post image"}
            width={500}
            height={500}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="w-full max-h-80 object-cover group-hover:scale-105 hoverEffect"
          />
        </Link>
      )}
      <CardContent className="bg-shop_light_bg p-5 flex-1">
        <div className="text-xs flex items-center gap-5">
          <div className="flex items-center gap-2 relative group/category cursor-pointer">
            {blog?.blogcategories?.map((item, index) => (
              <p
                key={index}
                className="font-semibold text-shop_dark_green tracking-wider"
              >
                {item?.title}
              </p>
            ))}
            <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover/category:bg-shop_dark_green hoverEffect" />
          </div>
          <p className="flex items-center gap-1 text-lightColor relative group/date hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
            <Calendar size={15} />{" "}
            {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
            <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover/date:bg-shop_dark_green hoverEffect" />
          </p>
        </div>
        <Link
          href={href}
          className="text-base font-semibold tracking-wide mt-5 line-clamp-2 hover:text-shop_dark_green hoverEffect"
        >
          {blog?.title}
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
