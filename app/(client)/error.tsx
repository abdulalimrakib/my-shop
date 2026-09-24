"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24 text-center max-w-lg">
      <h1 className="text-3xl font-bold text-darkColor">
        Something went wrong
      </h1>
      <p className="mt-3 text-lightColor">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline" className="text-darkColor">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </Container>
  );
};

export default ErrorPage;
