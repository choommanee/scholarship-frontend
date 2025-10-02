export interface User {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  sso_provider?: string;
  sso_user_id?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  user_roles: UserRole[];
  student?: Student;
}

export interface Role {
  role_id: number;
  role_name: string;
  role_description: string;
  permissions: string;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role_id: number;
  assigned_at: string;
  assigned_by?: string;
  is_active: boolean;
  role: Role;
}

export interface Student {
  student_id: string;
  user_id: string;
  faculty_code: string;
  department_code: string;
  year_level: number;
  gpa: number;
  admission_year: number;
  graduation_year: number;
  student_status: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  student_id?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expires_at: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}