import InfoPage from "@/components/InfoPage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export const metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about orders, payment, delivery and returns.",
};

const faqs = [
  {
    q: "Do I need an account to order?",
    a: "Yes. Signing in lets us keep your cart, delivery addresses and order history together, and lets you track your orders.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept major credit and debit cards through Stripe's secure checkout. Your card details go straight to Stripe and never touch our servers.",
  },
  {
    q: "Can I use a promo code?",
    a: "Yes. If you have a promotion code, enter it on the Stripe payment page before you pay.",
  },
  {
    q: "Where do you deliver?",
    a: "We currently deliver to addresses in the United States.",
  },
  {
    q: "How do I check my order status?",
    a: "Open the Orders page from the header while signed in. Select an order to see its items, total and invoice.",
  },
  {
    q: "What if an item is out of stock?",
    a: "Out-of-stock items can't be added to your cart. Stock is checked again when you check out, so you'll never be charged for something we can't send.",
  },
];

const FaqsPage = () => (
  <InfoPage title="Frequently asked questions">
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.q} value={`faq-${index}`}>
          <AccordionTrigger className="text-base font-semibold">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-base text-lightColor">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    <p>
      Still stuck? <Link href="/contact">Send us a message</Link>.
    </p>
  </InfoPage>
);

export default FaqsPage;
