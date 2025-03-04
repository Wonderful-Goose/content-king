import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  console.log('Auth callback received with code:', code ? 'Code exists' : 'No code');

  if (code) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        // Redirect to login with error
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
        );
      }
      
      console.log('Session established successfully:', data.session ? 'Session exists' : 'No session');
      
      // URL to redirect to after sign in process completes
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      console.error('Exception in auth callback:', error);
      // Redirect to login with error
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
      );
    }
  }

  // No code provided, redirect to login
  console.log('No code provided in auth callback, redirecting to login');
  return NextResponse.redirect(new URL('/auth/login', request.url));
} 