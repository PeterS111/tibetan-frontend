import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// We added "/", "/support", "/pricing", "/privacy", and "/terms" to public routes.
// /chat is NOT here, meaning Clerk will automatically protect it!
const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/support(.*)",
  "/pricing(.*)",
  "/privacy(.*)",
  "/terms(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};