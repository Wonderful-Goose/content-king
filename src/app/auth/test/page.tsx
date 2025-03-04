'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TestAuth() {
  const [authData, setAuthData] = useState<any>(null);
  const [clientAuthData, setClientAuthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create a Supabase client for client components
  const supabase = createClientComponentClient();

  // Check client-side auth
  useEffect(() => {
    async function checkClientAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Client auth error:', error);
          return;
        }
        setClientAuthData({
          authenticated: !!data.session,
          session: data.session
        });
      } catch (error) {
        console.error('Client auth exception:', error);
      }
    }
    
    checkClientAuth();
  }, [supabase.auth]);

  // Check server-side auth
  async function checkAuth() {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/test');
      const data = await response.json();
      
      setAuthData(data);
    } catch (error: any) {
      console.error('Auth test error:', error);
      setError(error.message || 'Failed to check authentication');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Test</h1>
      
      <Button onClick={checkAuth} disabled={loading} className="mb-4">
        {loading ? 'Checking...' : 'Check Authentication'}
      </Button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Server-Side Authentication</h2>
          <p className="mb-2">
            <span className="font-semibold">Authenticated:</span>{' '}
            {authData?.authenticated ? (
              <span className="text-green-600">Yes</span>
            ) : (
              <span className="text-red-600">No</span>
            )}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Client-Side Authentication</h2>
          <p className="mb-2">
            <span className="font-semibold">Authenticated:</span>{' '}
            {clientAuthData?.authenticated ? (
              <span className="text-green-600">Yes</span>
            ) : (
              <span className="text-red-600">No</span>
            )}
          </p>
        </div>
      </div>
      
      {authData && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Server Session Data</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(authData.session, null, 2)}
          </pre>
        </div>
      )}
      
      {clientAuthData && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Client Session Data</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(clientAuthData.session, null, 2)}
          </pre>
        </div>
      )}
      
      {authData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Cookies</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(authData.cookies, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 