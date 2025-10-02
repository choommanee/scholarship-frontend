import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private readonly TOKEN_KEY = 'token';

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - simple error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401 - immediately logout, no retry
        if (error.response?.status === 401) {
          console.log('🚪 401 Unauthorized - logging out immediately');
          this.handleAuthFailure();
          return Promise.reject(new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่'));
        }

        // Handle network errors
        if (!error.response) {
          console.error('Network error:', error.message);
          return Promise.reject(new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'));
        }

        // For other errors, just reject
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user');
  }

  private handleAuthFailure(): void {
    this.clearAuth();
    
    // Check if we're on a public page - don't redirect
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const publicPages = ['/', '/news', '/scholarships', '/login', '/register'];
      
      const isPublicPage = publicPages.some(page => 
        pathname === page || (page !== '/' && pathname.startsWith(page + '/'))
      );
      
      // If on public page, don't redirect
      if (isPublicPage) {
        console.log('🏠 On public page, not redirecting to login');
        return;
      }
      
      // Only redirect if on protected page
      const redirecting = sessionStorage.getItem('redirecting');
      if (!redirecting) {
        sessionStorage.setItem('redirecting', 'true');
        setTimeout(() => {
          sessionStorage.removeItem('redirecting');
          window.location.replace('/login?expired=1');
        }, 100);
      }
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // File upload method
  async uploadFile<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Public method to clear auth (for logout)
  public clearAuthData(): void {
    this.clearAuth();
  }
}

export const apiClient = new ApiClient();