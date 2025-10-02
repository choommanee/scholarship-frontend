'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        console.log('🚪 Performing logout...');
        await logout();
      } catch (error) {
        console.error('💥 Logout error:', error);
        // Force redirect to login even if logout fails
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    };

    performLogout();
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-secondary-600 font-sarabun">กำลังออกจากระบบ...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
