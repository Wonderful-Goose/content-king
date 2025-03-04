'use client';

import { useAuth as useAuthContext } from './AuthContext';

// Re-export the useAuth hook from AuthContext for convenience
export const useAuth = useAuthContext; 