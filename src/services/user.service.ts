import { apiClient } from '@/utils/api';

export interface User {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  role?: string;
  student_id?: string;
  employee_id?: string;
  faculty?: string;
  department?: string;
  address?: string;
  notes?: string;
  sso_provider?: string;
  sso_user_id?: string;
  created_at: string;
  updated_at?: string;
  last_login_at?: string;
  roles?: Role[] | string;
  scholarship_applications?: any[];
}

export interface Role {
  role_id: number;
  role_name: string;
  role_description: string;
  assigned_at: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: string;
  student_id?: string;
  employee_id?: string;
  faculty?: string;
  department?: string;
  address?: string;
  notes?: string;
  sso_provider?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
  student_id?: string;
  employee_id?: string;
  faculty?: string;
  department?: string;
  address?: string;
  notes?: string;
  is_active?: boolean;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  is_active?: boolean;
  faculty?: string;
  department?: string;
}

export interface PaginatedUsers {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface AssignRoleRequest {
  role_id: number;
}

class UserService {
  async getUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());

      const response = await apiClient.get<PaginatedUsers>(`/users?${params.toString()}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUser(userId: string): Promise<User> {
    try {
      const response = await apiClient.get<{data: User}>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await apiClient.post<{message: string, data: User}>('/users', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<void> {
    try {
      await apiClient.put(`/users/${userId}`, userData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deactivateUser(userId: string): Promise<void> {
    try {
      await apiClient.post(`/users/${userId}/deactivate`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async reactivateUser(userId: string): Promise<void> {
    try {
      await apiClient.post(`/users/${userId}/reactivate`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      const response = await apiClient.get<{data: Role[]}>('/users/roles');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async assignRole(userId: string, roleData: AssignRoleRequest): Promise<void> {
    try {
      await apiClient.post(`/users/${userId}/roles`, roleData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}/roles/${roleId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Helper methods for client-side
  formatFullName(user: User): string {
    return `${user.first_name} ${user.last_name}`;
  }

  getStatusColor(isActive: boolean): string {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'ใช้งานได้' : 'ไม่ใช้งาน';
  }

  formatLastLogin(lastLogin?: string): string {
    if (!lastLogin) return 'ยังไม่เคยเข้าสู่ระบบ';
    
    const login = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - login.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'เมื่อสักครู่';
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;
    
    return login.toLocaleDateString('th-TH');
  }

  formatRoles(roles?: Role[] | string): string {
    if (!roles) return 'ไม่มีบทบาท';
    if (typeof roles === 'string') return roles;
    if (Array.isArray(roles)) {
      return roles.map(role => role.role_name).join(', ');
    }
    return 'ไม่มีบทบาท';
  }

  private handleError(error: any): Error {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    
    if (error.response?.status === 401) {
      return new Error('ไม่มีสิทธิ์เข้าถึง');
    }
    
    if (error.response?.status === 403) {
      return new Error('ไม่มีสิทธิ์ในการดำเนินการ');
    }
    
    if (error.response?.status === 404) {
      return new Error('ไม่พบผู้ใช้งาน');
    }
    
    if (error.response?.status >= 500) {
      return new Error('เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง');
    }
    
    return new Error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  }
}

export const userService = new UserService();
