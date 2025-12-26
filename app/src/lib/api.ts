// API Service for Biodaat
// Handles all communication with PHP backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://biodaat.local/api';

// Generic API response type
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Types
export interface User {
  id: number;
  phone: string;
  name?: string;
  email?: string;
  created_at: string;
}

export interface Template {
  id: number;
  name: string;
  slug: string;
  thumbnail?: string;
  description?: string;
  is_premium: boolean;
  field_schema: FieldSchema[];
}

export interface FieldSchema {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'file';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface Biodata {
  id: number;
  user_id: number;
  template_id: number;
  template_name?: string;
  name: string;
  data: Record<string, string | string[]>;
  file_path?: string;
  share_token?: string;
  download_token?: string;
  created_at: string;
  updated_at: string;
}

// API Error class
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 400) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Base fetch helper
async function apiFetch<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}/${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include', // For cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new ApiError(data.message || 'Request failed', response.status);
  }

  return data.data as T;
}

// ============================================
// Auth API
// ============================================

export const authApi = {
  /**
   * Send OTP to phone number
   */
  sendOtp: async (phone: string): Promise<{ message: string }> => {
    return apiFetch('auth-send-otp.php', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  /**
   * Verify OTP and get auth token
   */
  verifyOtp: async (phone: string, otp: string): Promise<User> => {
    return apiFetch('auth-verify-otp.php', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },

  /**
   * Get current authenticated user
   */
  me: async (): Promise<User> => {
    return apiFetch('auth-me.php');
  },

  /**
   * Check if user is authenticated
   */
  check: async (): Promise<{ authenticated: boolean; user?: User }> => {
    try {
      const user = await apiFetch<User>('auth-check.php');
      return { authenticated: true, user };
    } catch {
      return { authenticated: false };
    }
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    await apiFetch('auth-logout.php', { method: 'POST' });
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: { name?: string; email?: string }): Promise<User> => {
    return apiFetch('auth-update.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// Templates API
// ============================================

export const templatesApi = {
  /**
   * Get all active templates
   */
  list: async (): Promise<Template[]> => {
    return apiFetch('templates.php');
  },

  /**
   * Get single template with full field schema
   */
  get: async (id: number): Promise<Template> => {
    return apiFetch(`template.php?id=${id}`);
  },
};

// ============================================
// Biodatas API
// ============================================

export const biodatasApi = {
  /**
   * Get user's biodatas
   */
  list: async (): Promise<Biodata[]> => {
    return apiFetch('my-biodatas.php');
  },

  /**
   * Generate PDF biodata
   */
  generate: async (data: {
    template_id: number;
    name: string;
    biodata_data: Record<string, unknown>;
  }): Promise<{ biodata: Biodata; download_url: string }> => {
    return apiFetch('generate-pdf.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Regenerate download token for a biodata
   */
  regenerateToken: async (biodataId: number): Promise<{ download_token: string }> => {
    return apiFetch('regenerate-token.php', {
      method: 'POST',
      body: JSON.stringify({ biodata_id: biodataId }),
    });
  },

  /**
   * Check if download token is valid
   */
  checkToken: async (token: string): Promise<{ valid: boolean; expires_at?: string }> => {
    return apiFetch(`check-token.php?token=${token}`);
  },

  /**
   * Get download URL for a biodata
   */
  getDownloadUrl: (token: string): string => {
    return `${API_BASE}/download.php?token=${token}`;
  },

  /**
   * Get preview URL for a biodata
   */
  getPreviewUrl: (token: string): string => {
    return `${API_BASE}/preview.php?token=${token}`;
  },
};

// ============================================
// Export all
// ============================================

const api = {
  auth: authApi,
  templates: templatesApi,
  biodatas: biodatasApi,
};

export default api;
