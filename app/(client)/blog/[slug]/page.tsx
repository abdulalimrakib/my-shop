import Container from "@/components/Container";
import Title from "@/components/Title";
import { OTHERS_BLOG_QUERY_RESULT } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import {
  getBlogCategories,
  getOthersBlog,
  getSingleBlog,
} from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar, ChevronLeftIcon, Pencil } from "lucide-react";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import React from "react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getSingleBlog(slug);
  if (!blog) return {};
  const image = blog.mainImage
    ? urlFor(blog.mainImage).width(1200).height(630).url()
    : undefined;
  return {
    title: blog.title,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: blog.title,
      publishedTime: blog.publishedAt,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
  };
}

const SingleBlogPage = async ({ params }: Props) => {
  const { slug } = await params;
  const blog = await getSingleBlog(slug);
  if (!blog) return notFound();

  return (
    <div className="py-10">
      <Container className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="md:col-span-3">
          {blog?.mainImage && (
            <Image
              src={urlFor(blog?.mainImage).width(1200).url()}
              alt={blog.title || "Blog Image"}
              width={800}
              height={800}
              priority
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="w-full max-h-[500px] object-cover rounded-lg"
            />
          )}
          <div>
            <div className="text-xs flex items-center gap-5 my-7">
              <div className="flex items-center relative group cursor-pointer">
                {blog?.blogcategories?.map((item, index) => (
                  <p
                    key={index}
                    className="font-semibold text-shop_dark_green tracking-wider"
                  >
                    {item?.title}
                  </p>
                ))}
                <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hover:cursor-pointer hoverEffect" />
              </div>
              <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
                <Pencil size={15} /> {blog?.author?.name}
                <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
              </p>
              <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
                <Calendar size={15} />{" "}
                {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
              </p>
            </div>
            <h1 className="text-2xl font-bold my-5">{blog?.title}</h1>
            <div className="flex flex-col">
              <div className="text-lightColor">
                <div>
                  {blog.body && (
                    <PortableText
                      value={blog.body}
                      components={{
                        block: {
                          normal: ({ children }) => (
                            <p className="my-5 text-base/8 first:mt-0 last:mb-0">
                              {children}
                            </p>
                          ),
                          h2: ({ children }) => (
                            <h2 className="my-5 text-2xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="my-5 text-xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0">
                              {children}
                            </h3>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="my-5 border-l-2 border-l-gray-300 pl-6 text-base/8 text-gray-950 first:mt-0 last:mb-0">
                              {children}
                            </blockquote>
                          ),
                        },
                        types: {
                          image: ({ value }) => (
                            <Image
                              alt={value.alt || ""}
                              src={urlFor(value).width(2000).url()}
                              className="w-full rounded-2xl"
                              width={1400}
                              height={1000}
                            />
                          ),
                          separator: ({ value }) => {
                            switch (value.style) {
                              case "line":
                                return (
                                  <hr className="my-5 border-t border-gray-200" />
                                );
                              case "space":
                                return <div className="my-5" />;
                              default:
                                return null;
                            }
                          },
                        },
                        list: {
                          bullet: ({ children }) => (
                            <ul className="list-disc pl-4 text-base/8 marker:text-gray-400">
                              {children}
                            </ul>
                          ),
                          number: ({ children }) => (
                            <ol className="list-decimal pl-4 text-base/8 marker:text-gray-400">
                              {children}
                            </ol>
                          ),
                        },
                        listItem: {
                          bullet: ({ children }) => {
                            return (
                              <li className="my-2 pl-2 has-[br]:mb-8">
                                {children}
                              </li>
                            );
                          },
                          number: ({ children }) => {
                            return (
                              <li className="my-2 pl-2 has-[br]:mb-8">
                                {children}
                              </li>
                            );
                          },
                        },
                        marks: {
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-950">
                              {children}
                            </strong>
                          ),
                          code: ({ children }) => (
                            <>
                              <span aria-hidden>`</span>
                              <code className="text-[15px]/8 font-semibold text-gray-950">
                                {children}
                              </code>
                              <span aria-hidden>`</span>
                            </>
                          ),
                          link: ({ value, children }) => {
                            // A link mark without a URL renders as plain text
                            if (!value?.href) return <>{children}</>;
                            return (
                              <Link
                                href={value.href}
                                className="font-medium text-gray-950 underline decoration-gray-400 underline-offset-4 data-[hover]:decoration-gray-600"
                              >
                                {children}
                              </Link>
                            );
                          },
                        },
                      }}
                    />
                  )}
                  <div className="mt-10">
                    <Link href="/blog" className="flex items-center gap-1">
                      <ChevronLeftIcon className="size-5" />
                      <span className="text-sm font-semibold">
                        Back to blog
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BlogLeft slug={slug} />
      </Container>
    </div>
  );
};

const BlogLeft = async ({ slug }: { slug: string }) => {
  const categories = await getBlogCategories();
  const blogs = await getOthersBlog(slug, 5);

  return (
    <div>
      <div className="border border-lightColor p-5 rounded-md">
        <Title className="text-base">Blog Categories</Title>
        <div className="space-y-2 mt-2">
          {categories?.map((category) => (
            <div
              key={category._id}
              className="text-lightColor flex items-center justify-between text-sm font-medium"
            >
              <p>{category.title}</p>
              <p className="text-darkColor font-semibold">{`(${category.count})`}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="border border-lightColor p-5 rounded-md mt-10">
        <Title className="text-base">Latest Blogs</Title>
        <div className="space-y-4 mt-4">
          {blogs?.map(
            (blog: OTHERS_BLOG_QUERY_RESULT[number], index: number) => (
              <Link
                href={`/blog/${blog?.slug?.current}`}
                key={index}
                className="flex items-center gap-2 group"
              >
                {blog?.mainImage && (
                  <Image
                    src={urlFor(blog?.mainImage).width(128).url()}
                    alt=""
                    width={100}
                    height={100}
                    className="w-16 h-16 rounded-full object-cover border-[1px] border-shop_dark_green/10 group-hover:border-shop_dark_green hoverEffect"
                  />
                )}
                <p className="line-clamp-2 text-sm text-lightColor group-hover:text-shop_dark_green hoverEffect">
                  {blog?.title}
                </p>
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
