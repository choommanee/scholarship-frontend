'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, LoginRequest, RegisterRequest } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
  canAccessRoute: (routePermissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is already logged in
      const storedUser = authService.getUser();
      const token = authService.getToken();
      
      console.log('Initializing auth - stored user:', storedUser);
      console.log('Initializing auth - token exists:', !!token);
      
      if (storedUser && token) {
        // Extract role properly from user_roles if available
        let userRole: 'student' | 'officer' | 'interviewer' | 'admin' = 'student'; // Default fallback
        
        if (storedUser.user_roles && Array.isArray(storedUser.user_roles) && storedUser.user_roles.length > 0) {
          // Get role from user_roles array (preferred source)
          const roleObj = storedUser.user_roles[0].role;
          if (roleObj && roleObj.role_name) {
            // Validate and cast role to expected type
            const roleName = roleObj.role_name;
            if (roleName === 'admin' || roleName === 'officer' || roleName === 'interviewer' || roleName === 'student') {
              userRole = roleName;
            }
          }
        } else if (storedUser.role) {
          // Fallback to direct role property
          if (storedUser.role === 'admin' || storedUser.role === 'officer' || 
              storedUser.role === 'interviewer' || storedUser.role === 'student') {
            userRole = storedUser.role;
          }
        }
        
        console.log('Detected user role:', userRole);
        
        // Set compatibility fields for stored user
        const compatibleUser = {
          ...storedUser,
          firstName: storedUser.first_name || storedUser.firstName,
          lastName: storedUser.last_name || storedUser.lastName,
          fullName: storedUser.fullName || `${storedUser.first_name || storedUser.firstName} ${storedUser.last_name || storedUser.lastName}`.trim(),
          id: storedUser.user_id || storedUser.id,
          role: userRole
        };
        
        console.log('Setting user from stored data:', compatibleUser);
        setUser(compatibleUser);
        
        // Try to verify token is still valid by fetching current user
        try {
          console.log('Verifying token validity...');
          // Set a timeout to prevent hanging indefinitely
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Token verification timeout')), 5000);
          });
          
          const userPromise = authService.getCurrentUser();
          
          // Race between the API call and the timeout
          const currentUser = await Promise.race([userPromise, timeoutPromise]) as any;
          
          console.log('Token valid, updating user:', currentUser);
          
          // Extract role properly from API response
          let apiUserRole: 'student' | 'officer' | 'interviewer' | 'admin' = 'student'; // Default fallback
          
          if (currentUser.user_roles && Array.isArray(currentUser.user_roles) && currentUser.user_roles.length > 0) {
            // Get role from user_roles array (preferred source)
            const roleObj = currentUser.user_roles[0].role;
            if (roleObj && roleObj.role_name) {
              // Validate and cast role to expected type
              const roleName = roleObj.role_name;
              if (roleName === 'admin' || roleName === 'officer' || roleName === 'interviewer' || roleName === 'student') {
                apiUserRole = roleName;
              }
            }
          } else if (currentUser.role) {
            // Fallback to direct role property
            if (currentUser.role === 'admin' || currentUser.role === 'officer' || 
                currentUser.role === 'interviewer' || currentUser.role === 'student') {
              apiUserRole = currentUser.role;
            }
          }
          
          console.log('API returned user role:', apiUserRole);
          
          const updatedUser = {
            ...currentUser,
            firstName: currentUser.first_name || currentUser.firstName,
            lastName: currentUser.last_name || currentUser.lastName,
            fullName: currentUser.fullName || `${currentUser.first_name || currentUser.firstName} ${currentUser.last_name || currentUser.lastName}`.trim(),
            id: currentUser.user_id || currentUser.id,
            role: apiUserRole
          };
          
          setUser(updatedUser);
        } catch (verifyError) {
          console.log('Token verification failed:', verifyError);
          
          // If token is expired or invalid, redirect to login
          if (verifyError instanceof Error && 
              (verifyError.message.includes('401') || verifyError.message.includes('403'))) {
            console.log('Token expired or unauthorized, logging out and redirecting to login');
            await authService.logout();
            setUser(null);
            
            // Redirect to login page
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return;
          }
          
          // For other errors (network issues, timeout, etc), keep the user logged in with stored data
          console.log('Using stored user data due to API error');
        }
      } else {
        console.log('No stored user or token found');
        setUser(null);
        
        // Redirect to login if on a protected page
        const isProtectedRoute = typeof window !== 'undefined' && 
          window.location.pathname !== '/' && 
          window.location.pathname !== '/login' && 
          !window.location.pathname.startsWith('/public');
          
        if (isProtectedRoute) {
          console.log('Protected route detected without auth, redirecting to login');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return;
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Don't automatically logout on initialization errors
      // Only clear if we have no stored data
      const storedUser = authService.getUser();
      const token = authService.getToken();
      
      if (!storedUser || !token) {
        await authService.logout();
        setUser(null);
      }
    } finally {
      // Always ensure loading state is reset
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      // Determine role from all possible sources
      let userRole: 'student' | 'officer' | 'interviewer' | 'admin' = 'student'; // Default fallback
      
      // Log all role-related properties for debugging
      console.log('Login response user:', response.user);
      console.log('user_roles:', response.user.user_roles);
      console.log('roles:', response.user.roles);
      console.log('role:', response.user.role);
      console.log('role_name:', response.user.role_name);
      
      // Check user_roles array (primary source from API)
      if (response.user.user_roles && Array.isArray(response.user.user_roles) && response.user.user_roles.length > 0) {
        const roleObj = response.user.user_roles[0].role;
        if (roleObj && roleObj.role_name) {
          const roleName = roleObj.role_name;
          if (roleName === 'admin' || roleName === 'officer' || roleName === 'interviewer' || roleName === 'student') {
            userRole = roleName;
            console.log('Role detected from user_roles:', userRole);
          }
        }
      }
      // Check roles array (from JWT decode)
      else if (response.user.roles && Array.isArray(response.user.roles) && response.user.roles.length > 0) {
        const roleName = response.user.roles[0];
        if (roleName === 'admin' || roleName === 'officer' || roleName === 'interviewer' || roleName === 'student') {
          userRole = roleName;
          console.log('Role detected from roles array:', userRole);
        }
      }
      // Check role property (legacy)
      else if (response.user.role) {
        if (typeof response.user.role === 'string') {
          if (response.user.role === 'admin' || response.user.role === 'officer' || 
              response.user.role === 'interviewer' || response.user.role === 'student') {
            userRole = response.user.role;
            console.log('Role detected from role string:', userRole);
          }
        } else if (typeof response.user.role === 'object' && response.user.role.role_name) {
          const roleName = response.user.role.role_name;
          if (roleName === 'admin' || roleName === 'officer' || roleName === 'interviewer' || roleName === 'student') {
            userRole = roleName;
            console.log('Role detected from role object:', userRole);
          }
        }
      }
      // Check role_name property
      else if (response.user.role_name) {
        if (response.user.role_name === 'admin' || response.user.role_name === 'officer' || 
            response.user.role_name === 'interviewer' || response.user.role_name === 'student') {
          userRole = response.user.role_name;
          console.log('Role detected from role_name:', userRole);
        }
      }
      
      console.log('Final detected role:', userRole);
      
      // Extract user data and set compatibility fields
      const userData = {
        ...response.user,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        fullName: `${response.user.first_name} ${response.user.last_name}`.trim(),
        id: response.user.user_id,
        role: userRole
      };
      
      console.log('Setting user with role:', userData);
      setUser(userData);
      
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🚀 AuthContext - Starting login');
      
      const response = await authService.login(credentials);
      console.log('✅ AuthContext - Login response user:', response.user);
      
      // Use processed user from AuthService (it already has the correct role)
      setUser(response.user);
      
      console.log('👤 AuthContext - User set with role:', response.user.role);
      
      // Redirect based on role with proper routing
      if (typeof window !== 'undefined') {
        const userRole = response.user.role;
        console.log('🎯 AuthContext - Redirecting user with role:', userRole);
        
        // Use setTimeout to ensure state is updated before redirect
        setTimeout(() => {
          switch (userRole) {
            case 'admin':
              console.log('👑 Redirecting admin to /admin/dashboard');
              window.location.href = '/admin/dashboard';
              break;
            case 'officer':
            case 'scholarship_officer':
              console.log('📋 Redirecting officer to /officer/dashboard');
              window.location.href = '/officer/dashboard';
              break;
            case 'interviewer':
              console.log('🎤 Redirecting interviewer to /interviewer/dashboard');
              window.location.href = '/interviewer/dashboard';
              break;
            case 'student':
            default:
              console.log('🎓 Redirecting student to /student/dashboard');
              window.location.href = '/student/dashboard';
              break;
          }
        }, 100);
      }
    } catch (error) {
      console.error('❌ AuthContext - Login error:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
    } catch (error) {
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
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout locally even if server call fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Refresh user error:', error);
      await logout();
    }
  };

  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission);
  };

  const hasRole = (role: string | string[]): boolean => {
    return authService.hasRole(role);
  };

  const canAccessRoute = (routePermissions: string[]): boolean => {
    return authService.canAccessRoute(routePermissions);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    hasPermission,
    hasRole,
    canAccessRoute
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
  requiredPermissions: string[] = []
) => {
  const AuthorizedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, canAccessRoute, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
    
    if (requiredPermissions.length > 0 && !canAccessRoute(requiredPermissions)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">ไม่มีสิทธิ์เข้าถึง</h1>
            <p className="text-gray-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
  
  AuthorizedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AuthorizedComponent;
};

// Hook for role-based components
export const usePermissions = () => {
  const { hasPermission, hasRole, canAccessRoute } = useAuth();
  
  return {
    hasPermission,
    hasRole,
    canAccessRoute,
    isStudent: hasRole('student'),
    isOfficer: hasRole('officer'),
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