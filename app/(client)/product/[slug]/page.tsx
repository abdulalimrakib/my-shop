import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { getProductBySlug } from "@/sanity/queries";
import { CornerDownLeft, Truck } from "lucide-react";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import { siteConfig } from "@/constants/site";
import React from "react";
import { isOutOfStock } from "@/lib/stock";
import { FaRegQuestionCircle } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const image = product.images?.[0]
    ? urlFor(product.images[0]).width(1200).height(630).fit("fill").bg("ffffff").url()
    : undefined;
  return {
    title: product.name,
    description:
      product.description ?? `Buy ${product.name} at ${siteConfig.name}.`,
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
  };
}

const SingleProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }
  // Structured data for search engines (no ratings: there are no real reviews yet)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.map((image) => urlFor(image).width(1200).url()),
    brand: product.brandName
      ? { "@type": "Brand", name: product.brandName }
      : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: isOutOfStock(product)
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: `${siteConfig.url}/product/${slug}`,
    },
  };
  return (
    <Container className="flex flex-col md:flex-row gap-10 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {product?.images && (
        <ImageView
          images={product?.images}
          isStock={product?.stock}
          name={product?.name}
        />
      )}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{product?.name}</h1>
          <p className="text-sm text-gray-600 tracking-wide">
            {product?.description}
          </p>
        </div>
        <div className="space-y-2 border-t border-b border-gray-200 py-5">
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-lg font-bold"
          />
          <p
            className={`px-4 py-1.5 text-sm text-center inline-block font-semibold rounded-lg ${isOutOfStock(product) ? "bg-red-100 text-red-600" : "text-green-600 bg-green-100"}`}
          >
            {isOutOfStock(product) ? "Out of Stock" : "In Stock"}
          </p>
        </div>
        <div className="flex items-center gap-2.5 lg:gap-3">
          <AddToCartButton product={product} />
          <FavoriteButton showProduct={true} product={product} />
        </div>
        <ProductCharacteristics product={product} />
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
          <Link
            href={`/contact`}
            className="flex items-center gap-2 text-sm text-black hover:text-shop_dark_green hoverEffect"
          >
            <FaRegQuestionCircle className="text-lg" />
            Ask a question
          </Link>
          <Link
            href="/help#delivery"
            className="flex items-center gap-2 text-sm text-black hover:text-shop_dark_green hoverEffect"
          >
            <TbTruckDelivery className="text-lg" />
            Delivery &amp; Return
          </Link>
          <ShareButton title={product?.name} />
        </div>
        <div className="flex flex-col">
          <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
            <Truck size={30} className="text-shop_orange" />
            <div>
              <p className="text-base font-semibold text-black">
                Free Delivery
              </p>
              <p className="text-sm text-gray-500">
                Free delivery on every order within the USA.
              </p>
            </div>
          </div>
          <div className="border border-lightColor/25 p-3 flex items-center gap-2.5">
            <CornerDownLeft size={30} className="text-shop_orange" />
            <div>
              <p className="text-base font-semibold text-black">
                Easy Returns
              </p>
              <p className="text-sm text-gray-500">
                Problem with your order? We&apos;ll help.{" "}
                <Link
                  href="/help#returns"
                  className="underline underline-offset-2 hover:text-shop_dark_green"
                >
                  Details
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SingleProductPage;
