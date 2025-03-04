import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Create a Supabase client with the correct pattern for Next.js 15
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookies() 
    });

    // Get the session
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Return session data
    return NextResponse.json({ 
      authenticated: !!data.session,
      session: data.session,
      cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])),
    });
    
  } catch (error: any) {
    console.error('Auth test API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 