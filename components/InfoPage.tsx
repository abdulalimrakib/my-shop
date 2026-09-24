import React from "react";
import Container from "./Container";
import Title from "./Title";

// Shared layout for the static content pages (about, legal, help...)
const InfoPage = ({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}) => {
  return (
    <Container className="py-10 md:py-16">
      <div className="max-w-3xl">
        <Title as="h1" className="text-3xl font-bold text-shop_dark_green">
          {title}
        </Title>
        {updated && (
          <p className="mt-2 text-sm text-lightColor">
            Last updated: {updated}
          </p>
        )}
        {intro && <p className="mt-4 text-lg text-lightColor">{intro}</p>}
        <div className="mt-8 space-y-8 text-darkColor/90 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-darkColor [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-shop_dark_green [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </Container>
  );
};

export default InfoPage;
