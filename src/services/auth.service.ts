import { apiClient } from '@/utils/api';
import Cookies from 'js-cookie';

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'officer' | 'interviewer';
  studentId?: string;
  department?: string;
  faculty?: string;
  phone?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'admin' | 'student' | 'officer' | 'interviewer' | 'scholarship_officer';
  permissions: string[];
  department?: string;
  faculty?: string;
  studentId?: string;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🚀 Auth Service - Starting login process');
      
      // Clear any existing auth data first
      this.clearAllStorage();
      
      console.log('🌐 Using real API');
      const apiCredentials = {
        email: credentials.email || credentials.username || '',
        password: credentials.password || ''
      };
      
      const response = await apiClient.post<AuthResponse>('/auth/login', apiCredentials);
      
      console.log('✅ Login API response received:', response);
      
      // Enhanced user processing
      const processedUser = this.processUserData(response.user, response.token);
      
      // Store enhanced user and token
      this.storeAuthData(response.token, processedUser);
      
      return {
        ...response,
        user: processedUser
      };
    } catch (error) {
      this.clearAllStorage();
      throw this.handleAuthError(error);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      // Process and store user data
      const processedUser = this.processUserData(response.user, response.token);
      this.storeAuthData(response.token, processedUser);
      
      return {
        ...response,
        user: processedUser
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout API if available
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAllStorage();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh');
      
      const processedUser = this.processUserData(response.user, response.token);
      this.storeAuthData(response.token, processedUser);
      
      return {
        ...response,
        user: processedUser
      };
    } catch (error) {
      this.clearAllStorage();
      throw this.handleAuthError(error);
    }
  }

  // Synchronous method to get current user from storage
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      return this.processUserData(user);
    } catch (error) {
      console.warn('Failed to parse user data:', error);
      this.clearAllStorage();
      return null;
    }
  }

  // Async method to get current user from API
  async getCurrentUserFromAPI(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      
      // Update stored user info
      const processedUser = this.processUserData(response);
      localStorage.setItem(this.USER_KEY, JSON.stringify(processedUser));
      
      return processedUser;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === requiredRole;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || user?.permissions?.includes('full_access') || false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return roles.includes(user?.role || '');
  }

  private processUserData(user: any, token?: string): User {
    return {
      id: user.id || user.user_id || '',
      username: user.username || user.email?.split('@')[0] || '',
      email: user.email || '',
      firstName: user.firstName || user.first_name || '',
      lastName: user.lastName || user.last_name || '',
      fullName: user.fullName || `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim(),
      role: user.role || 'student',
      permissions: user.permissions || this.getDefaultPermissions(user.role || 'student'),
      department: user.department,
      faculty: user.faculty,
      studentId: user.studentId || user.student_id,
      createdAt: user.createdAt || user.created_at,
      lastLogin: user.lastLogin || user.last_login,
      isActive: user.isActive !== undefined ? user.isActive : true
    };
  }

  private getDefaultPermissions(role: string): string[] {
    const defaultPermissions: Record<string, string[]> = {
      admin: ['full_access', 'manage_users', 'system_settings', 'view_reports', 'system_admin'],
      officer: ['manage_applications', 'review_documents', 'schedule_interviews', 'manage_scholarships'],
      scholarship_officer: ['manage_applications', 'review_documents', 'schedule_interviews', 'manage_scholarships'],
      interviewer: ['conduct_interviews', 'submit_evaluations', 'view_applications'],
      student: ['view_scholarships', 'apply_scholarships', 'manage_documents', 'view_applications']
    };
    
    return defaultPermissions[role] || defaultPermissions.student;
  }

  private storeAuthData(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearAllStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  private handleAuthError(error: any): Error {
    console.error('Auth Service Error:', error);
    
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.status === 401) {
      return new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
    
    if (error.response?.status === 403) {
      return new Error('ไม่มีสิทธิ์เข้าใช้งานระบบ');
    }
    
    if (error.response?.status === 422) {
      return new Error('ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่');
    }
    
    if (error.response?.status >= 500) {
      return new Error('เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง');
    }
    
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
    }
    
    return new Error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
  }
}

export const authService = new AuthService();