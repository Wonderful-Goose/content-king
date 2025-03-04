import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/verification',
  '/auth/callback',
  '/auth/test', // Add test page
  '/api/auth/login', // Add our new API route
  '/api/auth/test', // Add test API route
  '/api/auth/logout', // Add logout API route
];

export async function middleware(request: NextRequest) {
  console.log('Middleware running for path:', request.nextUrl.pathname);
  
  // Create a response to modify
  let response = NextResponse.next();
  
  try {
    // Check if the route is public
    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    );

    // If it's a public route, allow access
    if (isPublicRoute) {
      console.log('Public route accessed, allowing access');
      return response;
    }

    // Create a Supabase client for the middleware
    const supabase = createMiddlewareClient({ 
      req: request, 
      res: response 
    });

    // Get the session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log('Session check result:', session ? 'User is authenticated' : 'No session found');
    
    if (session) {
      console.log('User ID:', session.user.id);
      console.log('Session expires at:', new Date(session.expires_at! * 1000).toISOString());
    }

    // If no session and trying to access a protected route, redirect to login
    if (!session) {
      console.log('No session, redirecting to login');
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // User is authenticated, allow access to protected route
    console.log('User is authenticated, allowing access to protected route');
    return response;
  } catch (error) {
    console.error('Error in middleware:', error);
    // In case of error, allow the request to proceed to avoid blocking the application
    return response;
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 