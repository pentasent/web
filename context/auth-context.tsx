'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  isVerified: boolean;
  hasCompletedOnboarding: boolean;
  prefix?: string;
  displayName?: string;
  avatarUrl?: string;
  name?: string;
  avatar?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  isPremium?: boolean;
  isVip?: boolean;
  interests?: string[];
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface UpdateProfileInput {
  prefix?: string | null;
  displayName?: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  isPremium?: boolean;
  isVip?: boolean;
}

export interface CompleteOnboardingInput {
  type: 'profile' | 'organization' | 'explore';
  profile?: {
    prefix?: string;
    displayName?: string;
    headline?: string;
    location?: string;
    bio?: string;
    website?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
    interests?: string[];
    gender?: string;
    dateOfBirth?: string;
  };
  organization?: {
    name?: string;
    type?: string;
    location?: string;
    website?: string;
    description?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  status: AuthStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkEmail: (email: string) => Promise<{ exists: boolean }>;
  loginWithPassword: (email: string, password: string) => Promise<AuthUser>;
  registerWithPassword: (email: string, password: string) => Promise<AuthUser>;
  sendOtp: (email: string) => Promise<{ message: string }>;
  verifyOtp: (email: string, otp: string) => Promise<AuthUser>;
  requestPasswordReset: (email: string) => Promise<{ message: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ message: string }>;
  completeOnboarding: (data: CompleteOnboardingInput) => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<AuthUser>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_CACHE_KEY = 'pentasent_auth_user';
const SESSION_TOKEN_KEY = 'pentasent_session_token';

const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(AUTH_CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached) as AuthUser;
  } catch {
    return null;
  }
};

const setStoredUser = (user: AuthUser | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_CACHE_KEY);
    }
  } catch (e) {
    console.error('Failed to update localStorage auth cache:', e);
  }
};

const setStoredToken = (token?: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
  } catch (e) {
    console.error('Failed to update localStorage session token:', e);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Synchronized state setter: updates both React state and localStorage cache
  const setUser = useCallback((value: React.SetStateAction<AuthUser | null>) => {
    setUserState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      setStoredUser(next);
      if (!next) {
        setStoredToken(null);
      }
      return next;
    });
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const res = await apiClient<{ user: AuthUser; sessionToken?: string; expiresAt: string }>('/auth/session');
      if (res.data?.user) {
        if (res.data.sessionToken) {
          setStoredToken(res.data.sessionToken);
        }
        setUser(res.data.user);
        setStatus('authenticated');
      } else {
        setStoredToken(null);
        setUser(null);
        setStatus('unauthenticated');
      }
    } catch {
      setStoredToken(null);
      setUser(null);
      setStatus('unauthenticated');
    }
  }, [setUser]);

  // Cache-first initial session bootstrap with background server verification
  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      await Promise.resolve();
      if (!isMounted) return;

      // 1. Optimistically display cached user to prevent layout flicker
      const cachedUser = getStoredUser();
      if (cachedUser) {
        setUserState(cachedUser);
        setStatus('authenticated');
      }

      // 2. Verify with backend and ensure session token is synced
      try {
        const res = await apiClient<{ user: AuthUser; sessionToken?: string; expiresAt: string }>('/auth/session');
        if (!isMounted) return;
        if (res.data?.user) {
          if (res.data.sessionToken) {
            setStoredToken(res.data.sessionToken);
          }
          setUser(res.data.user);
          setStatus('authenticated');
        } else {
          setStoredToken(null);
          setUser(null);
          setStatus('unauthenticated');
        }
      } catch {
        if (!isMounted) return;
        setStoredToken(null);
        setUser(null);
        setStatus('unauthenticated');
      }
    };

    void bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [setUser]);

  // Multi-tab synchronization: keep all tabs updated if user updates profile or logs out
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_CACHE_KEY) {
        if (e.newValue) {
          try {
            const updated = JSON.parse(e.newValue);
            setUserState(updated);
            setStatus('authenticated');
          } catch {
            // ignore JSON parse error
          }
        } else {
          setUserState(null);
          setStatus('unauthenticated');
        }
      }
    };

    const handleUnauthorized = () => {
      setUserState(null);
      setStatus('unauthenticated');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('pentasent:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('pentasent:unauthorized', handleUnauthorized);
    };
  }, []);

  const checkEmail = async (email: string) => {
    const res = await apiClient<{ exists: boolean }>('/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return res.data;
  };

  const loginWithPassword = async (email: string, password: string) => {
    const res = await apiClient<{ user: AuthUser; sessionToken?: string; expiresAt: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.sessionToken) {
      setStoredToken(res.data.sessionToken);
    }
    setUser(res.data.user);
    setStatus('authenticated');
    return res.data.user;
  };

  const registerWithPassword = async (email: string, password: string) => {
    const res = await apiClient<{ user: AuthUser; sessionToken?: string; expiresAt: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.sessionToken) {
      setStoredToken(res.data.sessionToken);
    }
    setUser(res.data.user);
    setStatus('authenticated');
    return res.data.user;
  };

  const sendOtp = async (email: string) => {
    const res = await apiClient<{ message: string }>('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return res.data;
  };

  const verifyOtp = async (email: string, otp: string) => {
    const res = await apiClient<{ user: AuthUser; sessionToken?: string; expiresAt: string }>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    if (res.data?.sessionToken) {
      setStoredToken(res.data.sessionToken);
    }
    setUser(res.data.user);
    setStatus('authenticated');
    return res.data.user;
  };

  const requestPasswordReset = async (email: string) => {
    const res = await apiClient<{ message: string }>('/auth/password/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return res.data;
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const res = await apiClient<{ message: string }>('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
    return res.data;
  };

  const completeOnboarding = async (data: CompleteOnboardingInput) => {
    const res = await apiClient<{ user: AuthUser }>('/auth/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify({ ...data, email: user?.email }),
    });
    if (res.data?.user) {
      setUser(res.data.user);
    } else {
      setUser((prev) => (prev ? { ...prev, hasCompletedOnboarding: true } : null));
    }
  };

  const updateProfile = async (data: UpdateProfileInput) => {
    const res = await apiClient<AuthUser>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (res.data) {
      setUser(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Failed to update profile');
  };

  const loginWithGoogle = async (idToken: string) => {
    const res = await apiClient<{ user: AuthUser; sessionToken?: string; expiresAt: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    if (res.data?.sessionToken) {
      setStoredToken(res.data.sessionToken);
    }
    setUser(res.data.user);
    setStatus('authenticated');
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } finally {
      setStoredToken(null);
      setUser(null);
      setStatus('unauthenticated');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isLoading: status === 'loading',
        isAuthenticated: status === 'authenticated',
        checkEmail,
        loginWithPassword,
        registerWithPassword,
        sendOtp,
        verifyOtp,
        requestPasswordReset,
        resetPassword,
        completeOnboarding,
        updateProfile,
        loginWithGoogle,
        logout,
        refreshSession,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
