import BlogCard from "@/components/BlogCard";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { getBlogsPage } from "@/sanity/queries";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Blog",
  description: "Product guides, tips and news from MY SHOP.",
  alternates: { canonical: "/blog" },
};

const BlogPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const { blogs, total } = await getBlogsPage(page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) notFound();

  return (
    <div className="pb-10">
      <Container>
        <Title as="h1">Blog</Title>
        {blogs.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 md:mt-10">
            {blogs.map((blog) => (
              <BlogCard key={blog?._id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-lightColor">No posts yet. Check back soon!</p>
        )}
        {totalPages > 1 && (
          <nav
            aria-label="Blog pagination"
            className="mt-10 flex items-center justify-center gap-3"
          >
            {page > 1 ? (
              <Button asChild variant="outline" className="text-darkColor">
                <Link href={page === 2 ? "/blog" : `/blog?page=${page - 1}`}>
                  <ChevronLeft /> Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="text-darkColor">
                <ChevronLeft /> Previous
              </Button>
            )}
            <span className="text-sm text-lightColor">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Button asChild variant="outline" className="text-darkColor">
                <Link href={`/blog?page=${page + 1}`}>
                  Next <ChevronRight />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="text-darkColor">
                Next <ChevronRight />
              </Button>
            )}
          </nav>
        )}
      </Container>
    </div>
  );
};

export default BlogPage;
