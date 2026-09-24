import ContactForm from "@/components/ContactForm";
import InfoPage from "@/components/InfoPage";
import { siteConfig } from "@/constants/site";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact us",
  description: `Send ${siteConfig.name} a message or find our phone number and opening hours.`,
};

const details = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
  },
  { icon: Clock, label: "Hours", value: siteConfig.hours },
  { icon: MapPin, label: "Location", value: siteConfig.address },
];

const ContactPage = () => (
  <InfoPage
    title="Contact us"
    intro="Send us a message and we'll reply by email, usually within one business day."
  >
    <div className="grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2">
        <ContactForm />
      </div>
      <ul className="!list-none !pl-0 space-y-4">
        {details.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="flex items-start gap-3">
            <Icon className="size-5 mt-0.5 text-shop_dark_green shrink-0" />
            <div>
              <p className="text-sm font-semibold">{label}</p>
              {href ? (
                <a href={href} className="text-sm">
                  {value}
                </a>
              ) : (
                <p className="text-sm text-lightColor">{value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  </InfoPage>
);

export default ContactPage;
