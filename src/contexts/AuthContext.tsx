'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, LoginRequest, RegisterRequest } from '@/services/auth.service';
import { apiClient } from '@/utils/api';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      initializeAuth();
    }
  }, [hasInitialized]);

  const initializeAuth = async () => {
    try {
      console.log('🔄 Initializing auth...');
      
      // Check if user is already logged in
      const storedUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      console.log('👤 Stored user:', storedUser);
      console.log('🔑 Token exists:', !!token);
      
      // Simple rule: Have both token and user = logged in, otherwise = logged out
      if (storedUser && token) {
        console.log('✅ Auth data found - user is logged in');
        setUser(storedUser);
      } else {
        console.log('❌ No complete auth data - clearing storage only');
        // Just clear storage, don't call logout API
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // NO API calls, NO redirects
      }
      
    } catch (error) {
      console.error('💥 Auth initialization error:', error);
      // Just clear storage on error
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
      setHasInitialized(true);
      console.log('✅ Auth initialization complete');
    }
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🚀 AuthContext - Starting login');
      
      const response = await authService.login(credentials);
      console.log('✅ AuthContext - Login successful');
      
      setUser(response.user);
      
      // Redirect based on role
      if (typeof window !== 'undefined') {
        const userRole = response.user.role;
        console.log('🎯 Redirecting user with role:', userRole);
        
        // Use replace to prevent back button issues
        setTimeout(() => {
          switch (userRole) {
            case 'admin':
              window.location.replace('/admin/dashboard');
              break;
            case 'officer':
            case 'scholarship_officer':
              window.location.replace('/officer/dashboard');
              break;
            case 'interviewer':
              window.location.replace('/interviewer/dashboard');
              break;
            case 'student':
            default:
              window.location.replace('/student/dashboard');
              break;
          }
        }, 100);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      setUser(response.user);
      
      // Redirect to appropriate dashboard
      if (typeof window !== 'undefined') {
        window.location.replace('/student/dashboard');
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🚪 Logging out');
      
      // Clear auth data immediately to prevent UI issues
      setUser(null);
      apiClient.clearAuthData();
      
      // Try to call logout API
      try {
        await authService.logout();
      } catch (error) {
        // Ignore logout API errors
        console.warn('Logout API error (ignored):', error);
      }
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    } catch (error) {
      console.error('💥 Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
      apiClient.clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Clear data but don't redirect
        setUser(null);
        apiClient.clearAuthData();
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
      apiClient.clearAuthData();
    }
  };

  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission);
  };

  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return authService.hasAnyRole(roles);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,  // Simple check - just if user exists
    login,
    register,
    logout,
    refreshUser,
    hasPermission,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protecting routes
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRoles: string[] = []
) => {
  const AuthorizedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, hasAnyRole, isLoading, user } = useAuth();
    
    if (isLoading) {
      return <LoadingScreen message="กำลังตรวจสอบสิทธิ์..." />;
    }
    
    if (!isAuthenticated) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
      return null;
    }
    
    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">ไม่มีสิทธิ์เข้าถึง</h1>
            <p className="text-gray-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
            <p className="text-sm text-gray-500 mt-2">บทบาทของคุณ: {user?.role}</p>
          </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
  
  AuthorizedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AuthorizedComponent;
};

// Hook for role-based permissions
export const usePermissions = () => {
  const { hasPermission, hasRole, hasAnyRole, user } = useAuth();
  
  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    user,
    isStudent: hasRole('student'),
    isOfficer: hasRole('officer') || hasRole('scholarship_officer'),
    isInterviewer: hasRole('interviewer'),
    isAdmin: hasRole('admin'),
    canManageApplications: hasPermission('manage_applications'),
    canReviewDocuments: hasPermission('review_documents'),
    canScheduleInterviews: hasPermission('schedule_interviews'),
    canManageScholarships: hasPermission('manage_scholarships'),
    canManageUsers: hasPermission('manage_users'),
    canViewReports: hasPermission('view_reports')
  };
};
