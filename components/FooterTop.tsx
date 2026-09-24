import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import { siteConfig } from "@/constants/site";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: siteConfig.address,
    icon: (
      <MapPin className="h-6 w-6 shrink-0 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Call Us",
    subtitle: siteConfig.phone,
    icon: (
      <Phone className="h-6 w-6 shrink-0 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Working Hours",
    subtitle: siteConfig.hours,
    icon: (
      <Clock className="h-6 w-6 shrink-0 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Email Us",
    subtitle: siteConfig.email,
    icon: (
      <Mail className="h-6 w-6 shrink-0 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2 py-4 border-b">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 group hover:bg-gray-50 p-3 sm:p-4 transition-colors hoverEffect min-w-0"
        >
          {item?.icon}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 group-hover:text-black hoverEffect">
              {item?.title}
            </p>
            <p className="text-gray-600 text-sm mt-1 break-words group-hover:text-gray-900 hoverEffect">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;
