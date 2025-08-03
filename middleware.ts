import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([  //specifying routes requiring authentication
  '/dashboard(.*)', 
  '/api/posts(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) { 
    auth.protect();    // forces auth on specified routes
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};