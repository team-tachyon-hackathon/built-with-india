// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is an API authentication route or a test API route
  // We should skip middleware for auth API routes to avoid infinite loops
  // Also skip for api-test routes to allow testing without authentication
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api-test')) {
    return NextResponse.next();
  }
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    pathname === '/auth/signin' ||
    pathname.startsWith('/api/public') || 
    pathname.startsWith('/_next') ||
    pathname.includes('.'); // For static files
  
  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isAuthenticated = !!token;
  
  // Handle authentication redirects
  if (!isAuthenticated && !isPublicPath) {
    // Store the original URL the user was trying to access
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Redirect already authenticated users away from signin page
  if (isAuthenticated && pathname === '/auth/signin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Add user info to headers for use in server components if needed
  const response = NextResponse.next();

  // Optional: Add user info to response headers
  if (isAuthenticated && token.email) {
    response.headers.set('x-user-email', token.email as string);
    response.headers.set('x-user-id', token.sub as string);
    
    // Add auth provider info if available
    if (token.provider) {
      response.headers.set('x-auth-provider', token.provider as string);
    }
  }

  return response;
}

// Configure matcher for all routes except for specific ones
// This is more maintainable than listing all protected routes
export const config = {
  matcher: [
    '/((?!api/auth|api-test|_next|fonts|images|[\\w-]+\\.\\w+).*)',
  ],
};
