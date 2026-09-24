import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

// Re-render cached storefront pages at most once a minute so catalog
// edits in Sanity show up without a redeploy
export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    template: "%s - MY SHOP online store",
    default: "MY SHOP online store",
  },
  description:
    "MY SHOP online store: phones, gadgets and home appliances from trusted brands, delivered across the USA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ClerkProvider>
  );
}
