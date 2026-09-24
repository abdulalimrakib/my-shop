"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

// Uses the native share sheet where available, otherwise copies the link
const ShareButton = ({ title }: { title?: string }) => {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // The user closed the share sheet
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 text-sm text-black hover:text-shop_dark_green hoverEffect"
    >
      <Share2 className="size-4" />
      Share
    </button>
  );
};

export default ShareButton;
