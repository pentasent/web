import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
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
