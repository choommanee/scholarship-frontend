'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { 
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // If not authenticated, redirect to login
        router.replace('/login');
        return;
      }

      if (user?.role) {
        // Redirect to role-specific dashboard
        switch (user.role) {
          case 'admin':
            router.replace('/admin/dashboard');
            break;
          case 'officer':
          case 'scholarship_officer':
            router.replace('/officer/dashboard');
            break;
          case 'interviewer':
            router.replace('/interviewer/dashboard');
            break;
          case 'student':
            router.replace('/student/dashboard');
            break;
          default:
            // Default to student dashboard for unknown roles
            router.replace('/student/dashboard');
            break;
        }
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  // Show loading while checking auth or redirecting
  if (isLoading || !user) {
    return <LoadingScreen message="กำลังเปลี่ยนเส้นทางไปยังหน้าแดชบอร์ด..." />;
  }

  const getRoleDisplayName = (roleName: string) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'ผู้ดูแลระบบ',
      'scholarship_officer': 'เจ้าหน้าที่จัดการทุน',
      'interviewer': 'กรรมการสัมภาษณ์',
      'student': 'นักศึกษา',
    };
    return roleMap[roleName] || roleName;
  };

  const primaryRole = user?.role || '';

  // Mock data - replace with real API calls
  const studentStats = [
    { name: 'ทุนที่เปิดรับสมัคร', value: '12', icon: AcademicCapIcon, color: 'text-blue-600' },
    { name: 'ใบสมัครของฉัน', value: '3', icon: DocumentTextIcon, color: 'text-green-600' },
    { name: 'รอการสัมภาษณ์', value: '1', icon: CalendarDaysIcon, color: 'text-yellow-600' },
    { name: 'ทุนที่ได้รับ', value: '1', icon: CheckCircleIcon, color: 'text-green-600' },
  ];

  const adminStats = [
    { name: 'ทุนทั้งหมด', value: '25', icon: AcademicCapIcon, color: 'text-blue-600' },
    { name: 'ใบสมัครใหม่', value: '48', icon: DocumentTextIcon, color: 'text-green-600' },
    { name: 'รอการพิจารณา', value: '15', icon: ClockIcon, color: 'text-yellow-600' },
    { name: 'งบประมาณคงเหลือ', value: '2.5M', icon: BanknotesIcon, color: 'text-green-600' },
  ];

  const getStatsForRole = () => {
    if (primaryRole === 'student') {
      return studentStats;
    }
    return adminStats;
  };

  const getWelcomeMessage = () => {
    const role = getRoleDisplayName(primaryRole);
    const time = new Date().getHours();
    let greeting = 'สวัสดี';
    
    if (time < 12) greeting = 'สวัสดีตอนเช้า';
    else if (time < 18) greeting = 'สวัสดีตอนบ่าย';
    else greeting = 'สวัสดีตอนเย็น';

    return `${greeting} คุณ${user?.firstName} (${role})`;
  };

  // This should not be reached due to redirect, but just in case
  return <LoadingScreen message="กำลังเปลี่ยนเส้นทาง..." />;
}