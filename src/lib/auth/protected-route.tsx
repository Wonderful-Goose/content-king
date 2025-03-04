'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';

// Higher-order component for route protection
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      // If not loading and no user, redirect to login
      if (!isLoading && !user) {
        // Store the current path to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', pathname);
        router.push('/auth/login');
      }
    }, [user, isLoading, router, pathname]);

    // Show nothing while loading or redirecting
    if (isLoading || !user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // If user is authenticated, render the component
    return <Component {...props} />;
  };
}

// Component for protected pages
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      // Store the current path to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.push('/auth/login');
    }
  }, [user, isLoading, router, pathname]);

  // Show nothing while loading or redirecting
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated, render the children
  return <>{children}</>;
} 