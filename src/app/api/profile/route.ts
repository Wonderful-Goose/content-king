import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { action } = requestData;
    
    // Create a regular Supabase client to check auth
    // Use cookies() properly by awaiting it
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check if user exists
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error checking user:', userError);
      return NextResponse.json(
        { error: userError.message },
        { status: 500 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Create a Supabase admin client with service role to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Handle different actions
    if (action === 'testConnection') {
      return await handleTestConnection(user, supabaseAdmin);
    } else {
      // Default profile creation/update
      const { userId = user.id, email = user.email, fullName, avatarUrl } = requestData;
      
      if (!userId || !email) {
        return NextResponse.json(
          { error: 'User ID and email are required' },
          { status: 400 }
        );
      }
      
      return await handleProfileUpdate(userId, email, fullName, avatarUrl, supabaseAdmin);
    }
  } catch (error) {
    console.error('Unexpected error in profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle test connection action
async function handleTestConnection(user: any, supabaseAdmin: any) {
  try {
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking profile:', checkError);
      return NextResponse.json(
        { success: false, error: checkError.message },
        { status: 500 }
      );
    }
    
    // Create profile if it doesn't exist
    if (!existingProfile) {
      const { error: createError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || ''
        });
      
      if (createError) {
        console.error('Error creating profile:', createError);
        return NextResponse.json(
          { success: false, error: createError.message },
          { status: 500 }
        );
      }
    }
    
    // Test 1: Fetch tags
    const { data: tags, error: tagsError } = await supabaseAdmin
      .from('tags')
      .select('*')
      .eq('user_id', user.id);
    
    if (tagsError) {
      console.error('Error fetching tags:', tagsError);
      return NextResponse.json(
        { success: false, error: tagsError },
        { status: 500 }
      );
    }
    
    // Test 2: Create a test tag
    const testTag = {
      user_id: user.id,
      name: `Test Tag ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
      color: '#0040e6' // Using our deep blue primary-600 color
    };
    
    const { data: newTag, error: createError } = await supabaseAdmin
      .from('tags')
      .insert(testTag)
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating tag:', createError);
      return NextResponse.json(
        { success: false, error: createError },
        { status: 500 }
      );
    }
    
    // Success!
    return NextResponse.json({
      success: true, 
      tags: tags || [], 
      newTag 
    });
  } catch (error) {
    console.error('Test connection failed:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// Handle profile update action
async function handleProfileUpdate(userId: string, email: string, fullName: string | undefined, avatarUrl: string | undefined, supabaseAdmin: any) {
  // First check if profile exists
  const { data: existingProfile, error: checkError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  
  if (checkError) {
    console.error('Error checking profile:', checkError);
    return NextResponse.json(
      { error: checkError.message },
      { status: 500 }
    );
  }
  
  let result;
  
  if (!existingProfile) {
    // Create new profile
    result = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        full_name: fullName || '',
        avatar_url: avatarUrl || ''
      });
  } else {
    // Update existing profile
    result = await supabaseAdmin
      .from('profiles')
      .update({
        email: email,
        full_name: fullName || '',
        avatar_url: avatarUrl || ''
      })
      .eq('id', userId);
  }
  
  if (result.error) {
    console.error('Error with profile:', result.error);
    return NextResponse.json(
      { error: result.error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ 
    success: true, 
    message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully' 
  });
} 