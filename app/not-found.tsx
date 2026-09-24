import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-32">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo />
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Looking for something?
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;re sorry. The web address you entered is not a functioning
            page on our site.
          </p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Go to MY SHOP&apos;s home page</Link>
          </Button>
          <Button asChild variant="outline" className="w-full text-shop_dark_green">
            <Link href="/shop">Browse all products</Link>
          </Button>
        </div>
        <p className="text-center text-sm text-gray-600">
          Need help? Visit the{" "}
          <Link
            href="/help"
            className="font-medium text-shop_dark_green underline underline-offset-2"
          >
            Help section
          </Link>{" "}
          or{" "}
          <Link
            href="/contact"
            className="font-medium text-shop_dark_green underline underline-offset-2"
          >
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
