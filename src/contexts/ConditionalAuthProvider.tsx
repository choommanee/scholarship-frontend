'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';

interface ConditionalAuthProviderProps {
  children: React.ReactNode;
}

export function ConditionalAuthProvider({ children }: ConditionalAuthProviderProps) {
  const pathname = usePathname();
  
  // หน้าที่ไม่ต้องใช้ AuthProvider
  const publicPages = ['/', '/news', '/scholarships'];
  
  // ตรวจสอบว่าเป็นหน้าสาธารณะหรือไม่
  const isPublicPage = pathname && publicPages.some(page => 
    pathname === page || (page !== '/' && pathname.startsWith(page + '/'))
  );
  
  // ถ้าเป็นหน้าสาธารณะ ไม่ต้องใช้ AuthProvider
  if (isPublicPage) {
    return <>{children}</>;
  }
  
  // หน้าอื่นๆ ใช้ AuthProvider ปกติ
  return <AuthProvider>{children}</AuthProvider>;
} 