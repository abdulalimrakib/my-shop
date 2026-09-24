"use client";

import { getMyOrderCount } from "@/actions/orders";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Logs } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SignIn from "./SignIn";
import { Badge } from "./ui/badge";

// The signed-in parts of the header. Kept on the client so the header
// (and therefore every page) doesn't need per-request server rendering.
const HeaderAccount = () => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [orderCount, setOrderCount] = useState<number | null>(null);

  // Refresh on navigation so the count updates after a checkout
  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    getMyOrderCount()
      .then((count) => {
        if (!cancelled) setOrderCount(count);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, pathname]);

  return (
    <ClerkLoaded>
      <SignedIn>
        <Link
          href={"/orders"}
          aria-label={`Orders, ${orderCount ?? 0}`}
          // On phones the Orders link lives in the side menu to keep the header narrow
          className="group relative hidden sm:inline-flex hover:text-shop_light_green hoverEffect"
        >
          <Logs />
          <Badge className="absolute -top-1 -right-1 h-3.5 min-w-3.5 px-0.5 bg-shop_btn_dark_green text-white text-xs font-semibold tabular-nums">
            {orderCount ?? 0}
          </Badge>
        </Link>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </ClerkLoaded>
  );
};

export default HeaderAccount;
