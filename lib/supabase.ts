import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Custom fetch wrapper to prevent infinite hanging when browser connections 
// become zombies after OS sleep, circumventing the aggressive Next.js fetch patches.
const customFetch = async (url: RequestInfo | URL, options?: RequestInit) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000); // 15 second hard timeout

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        return response;
    } catch (err: any) {
        if (err.name === 'AbortError') {
            throw new Error('Network request timed out. Please check your connection and try again.');
        }
        throw err;
    } finally {
        clearTimeout(id);
    }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
    },
    // Force standard timeout
    global: {
        fetch: customFetch,
    }
});

// Restart auth auto-refresh on window focus to fix sleep/wake staleness
if (typeof window !== 'undefined') {
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            supabase.auth.startAutoRefresh();
        } else {
            supabase.auth.stopAutoRefresh();
        }
    });
}
