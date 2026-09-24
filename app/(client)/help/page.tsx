import InfoPage from "@/components/InfoPage";
import { siteConfig } from "@/constants/site";
import Link from "next/link";

export const metadata = {
  title: "Help",
  description: "How ordering, payment, delivery and returns work at MY SHOP.",
};

const HelpPage = () => (
  <InfoPage
    title="Help center"
    intro="Everything you need to know about ordering from us."
  >
    <section id="ordering">
      <h2>Placing an order</h2>
      <ul>
        <li>Sign in, add products to your cart and open the cart page.</li>
        <li>Choose a saved delivery address or add a new one.</li>
        <li>Select “Proceed to Checkout” to pay securely with Stripe.</li>
        <li>
          After payment you&apos;ll see your order number, and the order appears
          on your Orders page.
        </li>
      </ul>
    </section>
    <section id="delivery">
      <h2>Delivery</h2>
      <p>
        We deliver within the United States. You can follow your order&apos;s
        status on the <Link href="/orders">Orders page</Link>.
      </p>
    </section>
    <section id="returns">
      <h2>Returns and refunds</h2>
      <p>
        If something isn&apos;t right with your order,{" "}
        <Link href="/contact">contact us</Link> with your order number and
        we&apos;ll help you arrange a return or refund.
      </p>
    </section>
    <section id="contact">
      <h2>Still need help?</h2>
      <p>
        Email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>, see
        our <Link href="/faqs">FAQs</Link>, or use the{" "}
        <Link href="/contact">contact form</Link>.
      </p>
    </section>
  </InfoPage>
);

export default HelpPage;
