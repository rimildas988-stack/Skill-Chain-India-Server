import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cache the client instance so we don't recreate it on every call
let supabaseInstance: SupabaseClient | null = null;
let warningLogged = false;

/**
 * Checks if the Supabase environment variables are properly configured.
 */
export const isSupabaseConfigured = (): boolean => {
  const url = (import.meta as any).env.VITE_SUPABASE_URL;
  const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
  return !!(url && anonKey && url !== 'https://your-project-ref.supabase.co' && anonKey !== 'your-anon-key');
};

/**
 * Lazy getter for the Supabase Client.
 * Prevents module-load crashes if keys are not configured.
 * 
 * @returns The initialized Supabase Client or throws a clean error if unconfigured.
 */
export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const url = (import.meta as any).env.VITE_SUPABASE_URL;
  const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured()) {
    const errorMsg = 
      'Supabase is not configured yet. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment secrets or .env file.';
    
    if (!warningLogged) {
      console.warn(`[Supabase Connection Warning] ${errorMsg}`);
      warningLogged = true;
    }
    
    // Create a dummy client or throw error depending on strictness.
    // For maximum resilience, we'll throw a clean error when developers try to use the client,
    // rather than crashing on module-import time.
    throw new Error(errorMsg);
  }

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    return supabaseInstance;
  } catch (error) {
    console.error('[Supabase Init Error]', error);
    throw error;
  }
};
