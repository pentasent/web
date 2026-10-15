/**
 * Pentasent Unified Frontend API Client
 * Connects frontend client components and server hooks to the backend modular monolith.
 * Uses credentials: 'include' for HttpOnly session cookie transmission.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.pentasent.com/api/v1';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    unreadCount?: number;
    [key: string]: unknown;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly details?: unknown;
  public readonly status: number;

  constructor(message: string, code = 'API_ERROR', status = 500, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('pentasent_session_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Send & receive HttpOnly cookies
  };

  try {
    const res = await fetch(url, config);
    const data: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      error: { code: 'INVALID_JSON', message: 'Invalid response from server' },
      data: null as unknown as T,
    }));

    if (!res.ok || !data.success) {
      if (res.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('pentasent_auth_user');
        localStorage.removeItem('pentasent_session_token');
        window.dispatchEvent(new CustomEvent('pentasent:unauthorized'));
      }

      throw new ApiError(
        data.error?.message || `Request failed with status ${res.status}`,
        data.error?.code || 'UNKNOWN_ERROR',
        res.status,
        data.error?.details
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      (error as Error).message || 'Network request failed',
      'NETWORK_ERROR',
      0
    );
  }
}
