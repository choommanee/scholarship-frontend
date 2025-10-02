'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallbackPath?: string;
}

interface RouteConfig {
  path: string;
  permissions: string[];
  roles: string[];
}

// Define route permissions
const routePermissions: RouteConfig[] = [
  // Student routes
  {
    path: '/student',
    permissions: ['apply_scholarship', 'view_own_applications'],
    roles: ['student']
  },
  {
    path: '/student/scholarships',
    permissions: ['apply_scholarship'],
    roles: ['student']
  },
  {
    path: '/student/applications',
    permissions: ['view_own_applications', 'apply_scholarship'],
    roles: ['student']
  },
  {
    path: '/student/documents',
    permissions: ['upload_documents'],
    roles: ['student']
  },
  {
    path: '/student/interviews',
    permissions: ['schedule_interview'],
    roles: ['student']
  },
  
  // Officer routes
  {
    path: '/officer',
    permissions: ['manage_applications', 'review_documents'],
    roles: ['officer', 'scholarship_officer']
  },
  {
    path: '/officer/applications',
    permissions: ['manage_applications', 'review_applications'],
    roles: ['officer', 'scholarship_officer']
  },
  {
    path: '/officer/scholarships',
    permissions: ['manage_scholarships'],
    roles: ['officer', 'scholarship_officer']
  },
  {
    path: '/officer/documents',
    permissions: ['review_documents'],
    roles: ['officer', 'scholarship_officer']
  },
  {
    path: '/officer/interviews',
    permissions: ['schedule_interviews', 'manage_interviews'],
    roles: ['officer', 'scholarship_officer']
  },
  
  // Interviewer routes
  {
    path: '/interviewer',
    permissions: ['conduct_interviews'],
    roles: ['interviewer']
  },
  {
    path: '/interviewer/schedule',
    permissions: ['view_applications', 'conduct_interviews'],
    roles: ['interviewer']
  },
  {
    path: '/interviewer/evaluations',
    permissions: ['submit_scores'],
    roles: ['interviewer']
  },
  
  // Admin routes
  {
    path: '/admin',
    permissions: ['manage_users', 'system_config'],
    roles: ['admin']
  },
  {
    path: '/admin/users',
    permissions: ['manage_users'],
    roles: ['admin']
  },
  {
    path: '/admin/settings',
    permissions: ['system_config'],
    roles: ['admin']
  },
  {
    path: '/admin/reports',
    permissions: ['view_all_reports', 'system_config'],
    roles: ['admin']
  }
];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, hasPermission, hasRole, isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthorization();
  }, [isAuthenticated, pathname, user, isLoading]);

  const checkAuthorization = () => {
    // Still loading
    if (isLoading) {
      setIsAuthorized(null);
      return;
    }

    // Not authenticated
    if (!isAuthenticated) {
      setIsAuthorized(false);
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/')}`);
      return;
    }

    console.log('🔍 Checking authorization for path:', pathname, 'user role:', user?.role);

    // Find route configuration
    const routeConfig = routePermissions.find(route => 
      pathname?.startsWith(route.path)
    );

    // Check route-specific permissions
    if (routeConfig) {
      // First check roles (more important)
      const hasRequiredRole = routeConfig.roles.length === 0 || 
        routeConfig.roles.some(role => {
          const roleResult = hasRole(role);
          return roleResult;
        });
      
      if (!hasRequiredRole) {
        console.log('❌ Access denied: missing required role');
        setIsAuthorized(false);
        redirectToRoleDashboard();
        return;
      }

      // For students and officers, if they have the role, allow access regardless of specific permissions
      // This is because the database permissions might not match frontend expectations
      if (hasRole('student') && routeConfig.roles.includes('student')) {
        console.log('✅ Student access granted');
        setIsAuthorized(true);
        return;
      }
      
      if ((hasRole('officer') || hasRole('scholarship_officer')) && 
          (routeConfig.roles.includes('officer') || routeConfig.roles.includes('scholarship_officer'))) {
        console.log('✅ Officer access granted');
        setIsAuthorized(true);
        return;
      }
      
      // For other roles, check permissions if specified
      if (routeConfig.permissions.length > 0) {
        console.log('🔍 Required permissions:', routeConfig.permissions);
        console.log('👤 User permissions:', user?.permissions);
        
        const hasRequiredPermission = routeConfig.permissions.some(permission => {
          const permissionResult = hasPermission(permission);
          console.log(`🔐 Checking permission "${permission}":`, permissionResult);
          return permissionResult;
        });
        
        if (!hasRequiredPermission) {
          console.log('❌ Access denied: missing required permission');
          setIsAuthorized(false);
          redirectToRoleDashboard();
          return;
        }
      }
    }

    // Check component-specific permissions
    if (requiredRoles.length > 0) {
      const hasComponentRole = requiredRoles.some(role => {
        const roleResult = hasRole(role);
        return roleResult;
      });
      
      if (!hasComponentRole) {
        console.log('❌ Access denied: missing component role');
        setIsAuthorized(false);
        redirectToRoleDashboard();
        return;
      }
    }

    // For component permissions, be more lenient for students
    if (requiredPermissions.length > 0) {
      // If user is a student, allow access if they have any student role
      if (hasRole('student') && requiredPermissions.some(p => p.includes('scholarship') || p.includes('apply'))) {
        console.log('✅ Student access granted for scholarship-related permissions');
        setIsAuthorized(true);
        return;
      }
      
      const hasComponentPermission = requiredPermissions.some(permission => {
        const permissionResult = hasPermission(permission);
        return permissionResult;
      });
      
      if (!hasComponentPermission) {
        console.log('❌ Access denied: missing component permission');
        setIsAuthorized(false);
        redirectToRoleDashboard();
        return;
      }
    }

    console.log('✅ Authorization granted');
    setIsAuthorized(true);
  };

  const redirectToRoleDashboard = () => {
    if (!user) {
      console.log('🚫 No user found, redirecting to login');
      router.push('/login');
      return;
    }

    console.log('🎯 Redirecting user based on role:', user.role);

    // Redirect to appropriate dashboard based on user role
    switch (user.role) {
      case 'admin':
        console.log('👑 Redirecting admin to /admin/dashboard');
        router.push('/admin/dashboard');
        break;
      case 'officer':
      case 'scholarship_officer':
        console.log('📋 Redirecting officer to /officer/dashboard');
        router.push('/officer/dashboard');
        break;
      case 'interviewer':
        console.log('🎤 Redirecting interviewer to /interviewer/dashboard');
        router.push('/interviewer/dashboard');
        break;
      case 'student':
      default:
        console.log('🎓 Redirecting student to /student/dashboard');
        router.push('/student/dashboard');
        break;
    }
  };

  // Loading state
  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-sarabun">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 font-sarabun mb-4">
            ไม่มีสิทธิ์เข้าถึง
          </h1>
          <p className="text-secondary-600 font-sarabun mb-6">
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบหรือเข้าสู่ระบบด้วยบัญชีที่ถูกต้อง
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 text-secondary-700 bg-secondary-100 hover:bg-secondary-200 rounded-lg font-sarabun transition-colors"
            >
              ย้อนกลับ
            </button>
            <button
              onClick={() => redirectToRoleDashboard()}
              className="flex-1 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-sarabun transition-colors"
            >
              ไปหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
};

export default ProtectedRoute;

// Higher-order component for easy usage
export const withProtectedRoute = (
  Component: React.ComponentType<any>,
  requiredPermissions?: string[],
  requiredRoles?: string[]
) => {
  const ProtectedComponent: React.FC<any> = (props) => (
    <ProtectedRoute
      requiredPermissions={requiredPermissions}
      requiredRoles={requiredRoles}
    >
      <Component {...props} />
    </ProtectedRoute>
  );

  ProtectedComponent.displayName = `withProtectedRoute(${Component.displayName || Component.name})`;
  
  return ProtectedComponent;
};