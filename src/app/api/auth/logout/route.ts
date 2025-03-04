import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create a Supabase client with the correct pattern for Next.js 15
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookies() 
    });

    // Sign out
    await supabase.auth.signOut();

    // Return success response
    return NextResponse.json({ 
      success: true
    });
    
  } catch (error: any) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 