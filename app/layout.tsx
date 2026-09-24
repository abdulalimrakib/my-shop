import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/constants/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins-loaded",
  display: "swap",
});

// Base for resolving relative canonical and Open Graph URLs
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  openGraph: { siteName: siteConfig.name, type: "website" },
};
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins antialiased">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
};
export default RootLayout;
