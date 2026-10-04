# MY SHOP

An online store for phones, gadgets and home appliances, built with Next.js 16, Sanity, Clerk and Stripe.

Shoppers browse products by category, brand, price and deal, search the catalog, keep a wishlist, and check out with Stripe. Signed-in customers save delivery addresses and see their order history. The store also has a blog, a newsletter signup and a contact form. Store staff manage products, orders and content in Sanity Studio at `/studio`.

There is no application database. Sanity holds the catalog, content, addresses and orders. Clerk handles sign-in. Stripe takes payment, and its webhook is what creates orders.

## Code map

- `app/(client)/`: storefront pages (home, shop, product, category, brand, deal, blog, cart, wishlist, orders, success, and the information pages). `layout.tsx` adds Clerk, the header and the footer.
- `app/(client)/api/webhook/route.ts`: Stripe webhook. It creates the order and reduces stock in one Sanity transaction; the order ID comes from the session ID, so retries are safe.
- `app/studio/`: the embedded Sanity Studio. `app/sitemap.ts` and `app/robots.ts` are built from Sanity slugs.
- `actions/`: server actions called by client components: catalog search and filters, addresses, orders, the contact form, and `createCheckoutSession.ts`, which re-reads prices and stock from Sanity before calling Stripe.
- `components/`: UI components. `components/ui/` holds the shadcn/ui primitives and `components/shop/` the shop filters.
- `sanity/schemaTypes/`: content model. `sanity/queries/` holds the GROQ queries and the helpers that run them. `sanity/lib/` holds the clients: `live.ts` for cached reads, `serverClient.ts` for fresh reads, `backendClient.ts` for writes.
- `store.ts`: cart and favorites (Zustand, saved in localStorage). Prices stored there are for display only.
- `lib/`: Stripe client and price and stock rules. `hooks/`: client data loading and hydration helpers.
- `proxy.ts`: Clerk middleware. It protects `/orders` and `/success`.
- `constants/`: store name, contact details and navigation links.

## Local development

Requires Node.js 24 and accounts on [Sanity](https://www.sanity.io), [Clerk](https://clerk.com) and [Stripe](https://stripe.com).

```sh
npm install
cp .env.example .env.local
```

Fill in `.env.local`. The Sanity, Clerk and Stripe keys are required: the app throws on startup without them. Keep the Sanity dataset private. The site reads it with `SANITY_API_READ_TOKEN` and writes with `SANITY_API_TOKEN` (an Editor token).

To load the sample products, brands, blog posts and images:

```sh
npx sanity dataset import seed.tar.gz production
```

Start the dev server at [localhost:3000](http://localhost:3000):

```sh
npm run dev
```

Orders are only created by the Stripe webhook. To test checkout locally, forward Stripe events in a second terminal and put the signing secret it prints in `STRIPE_WEBHOOK_SECRET`:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

After changing anything in `sanity/schemaTypes/` or a query in `sanity/queries/query.ts`, regenerate the types. `schema.json` and `sanity.types.ts` are generated files; don't edit them by hand.

```sh
npm run typegen
```

## Verify and build

```sh
npm run lint
npx tsc --noEmit
npm run build
```

The project has no type errors and no lint warnings. CI (`.github/workflows/ci.yml`) runs lint and the type check on every push and pull request. It also builds when the Sanity, Clerk and Stripe secrets are set in the repository, because the build pre-renders pages from Sanity.

## Deployment

Deploy to any Next.js host, such as Vercel. Set every variable from `.env.example`, with `NEXT_PUBLIC_BASE_URL` set to the public site URL; Stripe redirects, canonical URLs and the sitemap use it. In Stripe, add a webhook endpoint at `https://<your-domain>/api/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `checkout.session.async_payment_failed`, and use its signing secret as `STRIPE_WEBHOOK_SECRET`. In Sanity, add the site URL as a CORS origin so the Studio at `/studio` can sign in.

## Credits

Made by [Abdul Alim Rakib](https://github.com/abdulalimrakib).
