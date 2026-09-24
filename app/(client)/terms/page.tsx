import InfoPage from "@/components/InfoPage";
import { siteConfig } from "@/constants/site";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply when you shop at ${siteConfig.name}.`,
};

// TODO(owner): have these terms reviewed for your business and jurisdiction.
const TermsPage = () => (
  <InfoPage title="Terms & Conditions" updated="September 2026">
    <section>
      <h2>Using this site</h2>
      <p>
        By using {siteConfig.name} you agree to these terms. You need an account
        to place orders, and you are responsible for keeping your sign-in
        details secure.
      </p>
    </section>
    <section>
      <h2>Orders and pricing</h2>
      <ul>
        <li>All prices are in US dollars and are confirmed at checkout.</li>
        <li>An order is accepted once payment is completed through Stripe.</li>
        <li>
          If a product becomes unavailable after you order, we will contact you
          and refund the affected items.
        </li>
      </ul>
    </section>
    <section>
      <h2>Delivery and returns</h2>
      <p>
        See our <Link href="/help">help page</Link> for how delivery, returns
        and refunds work.
      </p>
    </section>
    <section>
      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </section>
  </InfoPage>
);

export default TermsPage;
