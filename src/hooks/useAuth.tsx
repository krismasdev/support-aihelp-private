import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useLocalStorage } from './useLocalStorage';
import { AuthData, UserProfile } from '@/types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData, removeAuthData] = useLocalStorage<AuthData>('auth_data', {
    user: null,
    token: null,
    expiresAt: null,
  });

  useEffect(() => {
    // Check localStorage first for existing auth
    if (authData.token && authData.expiresAt && Date.now() < authData.expiresAt) {
      setUser(authData.user as any);
      setLoading(false);
      return;
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at,
        };

        const authDataToStore: AuthData = {
          user: userProfile,
          token: session.access_token,
          expiresAt: session.expires_at ? session.expires_at * 1000 : null,
        };

        setAuthData(authDataToStore);
        setUser(session.user);
      } else {
        removeAuthData();
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (session?.user) {
        const userProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at,
        };

        const authDataToStore: AuthData = {
          user: userProfile,
          token: session.access_token,
          expiresAt: session.expires_at ? session.expires_at * 1000 : null,
        };

        setAuthData(authDataToStore);
        setUser(session.user);
        
        // If this is an email confirmation, redirect to dashboard
        if (event === 'SIGNED_IN' && window.location.pathname !== '/dashboard') {
          window.location.href = '/dashboard';
        }
      } else {
        removeAuthData();
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    removeAuthData();
  };

  const isAuthenticated = () => {
    return !!(authData.token && authData.expiresAt && Date.now() < authData.expiresAt);
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated,
    authData: authData.user,
  };
};