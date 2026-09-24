import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Next 16 "proxy" (formerly middleware). Protects pages that only make sense
// for a signed-in user. The pages also check auth themselves; this makes sure
// a new page under these paths is covered too.
const isProtectedRoute = createRouteMatcher(["/orders(.*)", "/success(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
