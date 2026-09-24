import Container from "@/components/Container";
import NoProductAvailable from "@/components/NoProductAvailable";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import { getBrandBySlug } from "@/sanity/queries";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: brand.title ?? "Brand",
    description:
      brand.description ?? `Shop ${brand.title} products at MY SHOP.`,
    alternates: { canonical: `/brand/${slug}` },
  };
}

const BrandPage = async ({ params }: Props) => {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  return (
    <Container className="py-10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
        {brand.image && (
          <div className="bg-white border rounded-md w-40 h-24 flex items-center justify-center shrink-0">
            <Image
              src={urlFor(brand.image).width(320).url()}
              alt={brand.title ?? "Brand logo"}
              width={160}
              height={96}
              className="w-32 h-20 object-contain"
            />
          </div>
        )}
        <div>
          <Title as="h1" className="text-3xl font-bold text-shop_dark_green">
            {brand.title}
          </Title>
          {brand.description && (
            <p className="mt-2 text-lightColor max-w-2xl">
              {brand.description}
            </p>
          )}
          <Link
            href={{ pathname: "/shop", query: { brand: slug } }}
            className="mt-2 inline-block text-sm font-medium text-shop_dark_green underline underline-offset-2"
          >
            Filter this brand in the shop
          </Link>
        </div>
      </div>
      {brand.products?.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {brand.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <NoProductAvailable selectedTab={brand.title ?? slug} className="mt-0" />
      )}
    </Container>
  );
};

export default BrandPage;
