"use client";

import useStore from "@/store";
import { useState } from "react";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
  };

  const handleResetWishlist = () => {
    resetFavorite();
    toast.success("Wishlist reset successfully");
  };

  return (
    <Container>
      {favoriteProduct?.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow className="bg-black/5 hover:bg-black/5">
                <TableHead className="font-semibold">Image</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">
                  Category
                </TableHead>
                <TableHead className="font-semibold hidden md:table-cell">
                  Type
                </TableHead>
                <TableHead className="font-semibold hidden md:table-cell">
                  Status
                </TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold text-center md:text-left">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {favoriteProduct
                ?.slice(0, visibleProducts)
                ?.map((product: Product) => (
                  <TableRow key={product?._id}>
                    <TableCell className="px-2 py-4 flex items-center gap-2 whitespace-normal">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Remove from wishlist"
                        onClick={() => {
                          removeFromFavorite(product?._id);
                          toast.success("Product removed from wishlist");
                        }}
                        className="hover:text-red-600 hoverEffect"
                      >
                        <X size={18} />
                      </Button>
                      {product?.images && (
                        <Link
                          href={`/product/${product?.slug?.current}`}
                          className="border rounded-md group hidden md:inline-flex"
                        >
                          <Image
                            src={urlFor(product?.images[0]).url()}
                            alt={"product image"}
                            width={80}
                            height={80}
                            className="rounded-md group-hover:scale-105 hoverEffect h-20 w-20 object-contain"
                          />
                        </Link>
                      )}
                      <p className="line-clamp-1">{product?.name}</p>
                    </TableCell>
                    <TableCell className="p-2 capitalize hidden md:table-cell">
                      {product?.categories && (
                        <p className="uppercase line-clamp-1 text-xs font-medium">
                          {product.categories.map((cat) => cat).join(", ")}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="p-2 capitalize hidden md:table-cell">
                      {product?.variant}
                    </TableCell>
                    <TableCell
                      className={`p-2 w-24 ${
                        (product?.stock as number) > 0
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium text-sm hidden md:table-cell`}
                    >
                      {(product?.stock as number) > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </TableCell>
                    <TableCell className="p-2">
                      <PriceFormatter amount={product?.price} />
                    </TableCell>
                    <TableCell className="p-2 min-w-40">
                      <AddToCartButton product={product} className="w-full" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="flex items-center gap-2">
            {visibleProducts < favoriteProduct?.length && (
              <div className="my-5">
                <Button variant="outline" onClick={loadMore}>
                  Load More
                </Button>
              </div>
            )}
            {visibleProducts > 10 && (
              <div className="my-5">
                <Button
                  onClick={() => setVisibleProducts(10)}
                  variant="outline"
                >
                  Load Less
                </Button>
              </div>
            )}
          </div>
          {favoriteProduct?.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="mb-5 font-semibold"
                  variant="destructive"
                  size="lg"
                >
                  Reset Wishlist
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset your wishlist?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes every product from your wishlist. This
                    can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetWishlist}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Reset Wishlist
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </>
      ) : (
        <Empty className="min-h-[400px]">
          <EmptyHeader>
            <EmptyMedia className="relative">
              <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20" />
              <Heart
                className="h-12 w-12 text-muted-foreground"
                strokeWidth={1.5}
              />
            </EmptyMedia>
            <EmptyTitle className="text-2xl font-semibold tracking-tight">
              Your wishlist is empty
            </EmptyTitle>
            <EmptyDescription>
              Items added to your wishlist will appear here
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </Container>
  );
};

export default WishListProducts;
