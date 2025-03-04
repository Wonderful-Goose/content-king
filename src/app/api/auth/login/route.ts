import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get credentials from request body
    const { email, password, redirectTo } = await request.json();
    
    // Create a Supabase client using the route handler client with the correct pattern for Next.js 15
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookies() 
    });

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Successful login
    const destination = redirectTo || '/dashboard';
    
    // Return success response with redirect URL
    return NextResponse.json({ 
      success: true, 
      redirectTo: destination,
      user: data.user
    });
    
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 