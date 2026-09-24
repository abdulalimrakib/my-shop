import InfoPage from "@/components/InfoPage";
import { siteConfig } from "@/constants/site";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects and uses your personal information.`,
};

// TODO(owner): have this policy reviewed for your business and jurisdiction.
const PrivacyPage = () => (
  <InfoPage title="Privacy Policy" updated="September 2026">
    <section>
      <h2>What we collect</h2>
      <ul>
        <li>Account details (name and email) when you sign in.</li>
        <li>Delivery addresses you save to your account.</li>
        <li>Order details: the products you buy, totals and invoices.</li>
        <li>Your email address if you subscribe to our newsletter.</li>
        <li>Messages you send through our contact form.</li>
      </ul>
    </section>
    <section>
      <h2>Who processes your data</h2>
      <ul>
        <li>Clerk handles sign-in and account management.</li>
        <li>Stripe processes payments. We never receive your card number.</li>
        <li>Sanity stores our catalog, your orders and saved addresses.</li>
      </ul>
    </section>
    <section>
      <h2>How we use it</h2>
      <p>
        We use your information to process and deliver orders, show your order
        history, answer your messages and, if you subscribed, send our
        newsletter. We don&apos;t sell your personal information.
      </p>
    </section>
    <section>
      <h2>Your choices</h2>
      <p>
        To access, correct or delete your data, or to unsubscribe, email{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </section>
  </InfoPage>
);

export default PrivacyPage;
