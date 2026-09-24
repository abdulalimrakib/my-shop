import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getCategories } from "@/sanity/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug?.current === slug);
  if (!category) return {};
  return {
    title: category.title ?? "Category",
    description:
      category.description ??
      `Shop ${category.title} at MY SHOP. ${category.productCount} products available.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

const CategoryPage = async ({ params }: Props) => {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug?.current === slug);
  if (!category) notFound();

  return (
    <div className="py-10">
      <Container>
        <Title as="h1">
          Products by Category:{" "}
          <span className="font-bold text-shop_dark_green capitalize tracking-wide">
            {category.title}
          </span>
        </Title>
        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;
