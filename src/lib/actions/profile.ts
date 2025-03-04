'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../supabase-types';

/**
 * Creates a profile for a user if it doesn't exist
 * This is a server action that bypasses RLS policies
 */
export async function createProfileIfNotExists(userId: string, email: string, fullName?: string, avatarUrl?: string) {
  try {
    // Create a Supabase client with admin privileges
    const supabase = createServerActionClient<Database>({ cookies });
    
    // Check if profile exists using raw SQL
    const { data: profiles, error: checkError } = await supabase
      .rpc('get_profile_by_id', { user_id: userId });
    
    if (checkError) {
      console.error('Error checking profile:', checkError);
      return { success: false, error: checkError };
    }
    
    // If profile doesn't exist, create one
    if (!profiles || profiles.length === 0) {
      console.log('Profile not found, creating one...');
      
      // Use raw SQL to insert profile
      const { error: createError } = await supabase
        .rpc('create_profile', { 
          user_id: userId,
          user_email: email,
          user_full_name: fullName || '',
          user_avatar_url: avatarUrl || ''
        });
      
      if (createError) {
        console.error('Error creating profile:', createError);
        return { success: false, error: createError };
      }
      
      console.log('Profile created successfully');
      return { success: true, message: 'Profile created successfully' };
    }
    
    return { success: true, message: 'Profile already exists', profile: profiles[0] };
  } catch (error) {
    console.error('Unexpected error in createProfileIfNotExists:', error);
    return { success: false, error };
  }
} 