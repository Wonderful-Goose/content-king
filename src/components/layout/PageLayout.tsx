import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared page layout component used across all content pages
 * Provides consistent padding and scrolling behavior
 */
export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full">
      <div className="w-full overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
} 