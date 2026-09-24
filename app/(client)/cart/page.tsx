"use client";

import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { getMyAddresses, UserAddress } from "@/actions/address";
import AddressDialog from "@/components/AddressDialog";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth } from "@clerk/nextjs";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  const [checkingOut, setCheckingOut] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[] | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    getMyAddresses()
      .then((data) => {
        if (cancelled) return;
        setAddresses(data);
        // Addresses come back default-first
        setSelectedAddressId((current) => current || data[0]?._id || "");
      })
      .catch((error) => {
        console.error("Addresses fetching error:", error);
        if (!cancelled) setAddresses([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  const handleAddressCreated = (address: UserAddress) => {
    setAddresses((prev) => [
      address,
      ...(prev ?? []).map((a) =>
        address.default ? { ...a, default: false } : a,
      ),
    ]);
    setSelectedAddressId(address._id);
  };

  const handleResetCart = () => {
    resetCart();
    toast.success("Cart reset successfully!");
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please add or select a delivery address.");
      return;
    }
    setCheckingOut(true);
    try {
      const result = await createCheckoutSession({
        items: groupedItems.map(({ product, quantity }) => ({
          productId: product._id,
          quantity,
        })),
        addressId: selectedAddressId,
      });
      if (result.ok) {
        window.location.href = result.url;
        return; // keep the button disabled while the browser navigates
      }
      toast.error(result.error);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Couldn't start checkout. Please try again.");
    }
    setCheckingOut(false);
  };

  const orderSummary = (className?: string) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>SubTotal</span>
          <PriceFormatter amount={getSubTotalPrice()} />
        </div>
        <div className="flex items-center justify-between">
          <span>Discount</span>
          <PriceFormatter amount={getSubTotalPrice() - getTotalPrice()} />
        </div>
        <Separator />
        <div className="flex items-center justify-between font-semibold text-lg">
          <span>Total</span>
          <PriceFormatter
            amount={getTotalPrice()}
            className="text-lg font-bold text-black"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
          size="lg"
          disabled={checkingOut || !selectedAddressId}
          onClick={handleCheckout}
        >
          {checkingOut ? (
            <>
              <Spinner /> Please wait...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="bg-gray-50 pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title as="h1">Shopping Cart</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  <Card className="gap-0 py-0 rounded-md shadow-none bg-white">
                    {groupedItems?.map(({ product }) => {
                      const itemCount = getItemCount(product?._id);
                      return (
                        <div
                          key={product?._id}
                          className="border-b p-2.5 last:border-b-0 flex items-start justify-between gap-3 md:gap-5"
                        >
                          <div className="flex flex-1 min-w-0 items-start gap-2 min-h-28 md:h-44">
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md
                                 overflow-hidden group"
                              >
                                <Image
                                  src={urlFor(product?.images[0]).width(320).url()}
                                  alt={product?.name ?? "Product image"}
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className="w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 object-contain group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}
                            <div className="h-full flex flex-1 min-w-0 flex-col justify-between gap-2 py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product?.name}
                                </h2>
                                <p className="text-sm capitalize">
                                  Variant:{" "}
                                  <span className="font-semibold">
                                    {product?.variant}
                                  </span>
                                </p>
                                <p className="text-sm capitalize">
                                  Status:{" "}
                                  <span className="font-semibold">
                                    {product?.status}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>
                                      <ProductSideMenu
                                        product={product}
                                        className="relative top-0 right-0"
                                      />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="font-bold">
                                    Add to Favorite
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      aria-label="Delete product"
                                      onClick={() => {
                                        deleteCartProduct(product?._id);
                                        toast.success(
                                          "Product deleted successfully!",
                                        );
                                      }}
                                      className="text-gray-500 hover:text-red-600 hover:bg-red-50 hoverEffect"
                                    >
                                      <Trash className="w-4 h-4 md:w-5 md:h-5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="font-bold bg-red-600">
                                    Delete product
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 self-stretch min-h-28 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter
                              amount={(product?.price as number) * itemCount}
                              className="font-bold text-lg"
                            />
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      );
                    })}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="m-5 w-fit font-semibold"
                          variant="destructive"
                        >
                          Reset Cart
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset your cart?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes every product from your cart. This
                            can&apos;t be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleResetCart}
                            className="bg-destructive text-white hover:bg-destructive/90"
                          >
                            Reset Cart
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </Card>
                </div>
                <div className="lg:col-span-1 flex flex-col gap-5 mt-5 lg:mt-0">
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle>Delivery Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {addresses === null ? (
                        <p className="flex items-center gap-2 text-sm text-lightColor">
                          <Spinner /> Loading your addresses…
                        </p>
                      ) : addresses.length === 0 ? (
                        <p className="text-sm text-lightColor">
                          You haven&apos;t saved an address yet. Add one to
                          check out.
                        </p>
                      ) : (
                        <RadioGroup
                          value={selectedAddressId}
                          onValueChange={setSelectedAddressId}
                          aria-label="Delivery address"
                        >
                          {addresses.map((address) => (
                            <div
                              key={address._id}
                              className={`flex items-center space-x-2 mb-4 ${selectedAddressId === address._id ? "text-shop_dark_green" : ""}`}
                            >
                              <RadioGroupItem
                                value={address._id}
                                id={`address-${address._id}`}
                              />
                              <Label
                                htmlFor={`address-${address._id}`}
                                className="grid gap-1.5 flex-1 cursor-pointer"
                              >
                                <span className="font-semibold">
                                  {address.name}
                                  {address.default && (
                                    <span className="ml-2 text-xs font-normal text-lightColor">
                                      (Default)
                                    </span>
                                  )}
                                </span>
                                <span className="text-sm text-black/60">
                                  {address.address}, {address.city},{" "}
                                  {address.state} {address.zip}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      <AddressDialog onCreated={handleAddressCreated} />
                    </CardContent>
                  </Card>
                  {orderSummary("w-full bg-white")}
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartPage;
