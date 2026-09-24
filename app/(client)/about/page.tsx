import InfoPage from "@/components/InfoPage";
import { siteConfig } from "@/constants/site";
import Link from "next/link";

export const metadata = {
  title: "About us",
  description: `Learn about ${siteConfig.name} and how we pick the products we sell.`,
};

const AboutPage = () => (
  <InfoPage
    title="About us"
    intro={`${siteConfig.name} is an online store for phones, gadgets and home appliances from brands you already trust.`}
  >
    <section>
      <h2>What we sell</h2>
      <p>
        From smartphones and headphones to refrigerators, washing machines and
        kitchen appliances, we stock products from well-known brands and keep
        our catalog up to date with current models.
      </p>
    </section>
    <section>
      <h2>How we work</h2>
      <ul>
        <li>
          Secure checkout powered by Stripe. We never see your card details.
        </li>
        <li>Your orders and delivery addresses are stored in your account.</li>
        <li>Real people answer every message sent through our contact page.</li>
      </ul>
    </section>
    <section>
      <h2>Get in touch</h2>
      <p>
        Questions about a product or an order? Visit our{" "}
        <Link href="/help">help page</Link> or{" "}
        <Link href="/contact">contact us</Link>.
      </p>
    </section>
  </InfoPage>
);

export default AboutPage;
