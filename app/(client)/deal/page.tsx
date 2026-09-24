import Container from "@/components/Container";
import NoProductAvailable from "@/components/NoProductAvailable";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { getDealProducts } from "@/sanity/queries";
import React from "react";

export const metadata = {
  title: "Hot deals",
  description: "This week's hottest deals on phones, gadgets and appliances.",
};

const DealPage = async () => {
  const products = await getDealProducts();
  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <Title as="h1" className="mb-5 underline underline-offset-4 decoration-[1px] text-base uppercase tracking-wide">
          Hot Deals of the Week
        </Title>
        {products?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products.map((product) => (
              <ProductCard key={product?._id} product={product} />
            ))}
          </div>
        ) : (
          <NoProductAvailable selectedTab="hot deal" className="mt-0 bg-white" />
        )}
      </Container>
    </div>
  );
};

export default DealPage;
