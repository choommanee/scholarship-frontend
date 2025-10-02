'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { newsService } from '@/services/news.service';
import { 
  HomeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  DocumentIcon,
  CalendarDaysIcon,
  TrophyIcon,
  UserIcon,
  BellIcon,
  CogIcon,
  ChartBarIcon,
  UsersIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  DocumentCheckIcon,
  ClockIcon,
  Cog6ToothIcon,
  ChartPieIcon,
  ClipboardIcon,
  DocumentMagnifyingGlassIcon,
  UserGroupIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  userRole: 'student' | 'officer' | 'interviewer' | 'admin' | 'scholarship_officer';
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  description?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, isOpen, onClose }) => {
  const pathname = usePathname();
  const [unreadNewsCount, setUnreadNewsCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnreadNewsCount = async () => {
      try {
        const count = await newsService.getUnreadNewsCount();
        setUnreadNewsCount(count);
      } catch (error) {
        console.error('Failed to fetch unread news count:', error);
      }
    };

    fetchUnreadNewsCount();

    // Refresh unread count every 5 minutes
    const intervalId = setInterval(fetchUnreadNewsCount, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const getNavigationItems = (): NavigationItem[] => {
    switch (userRole) {
      case 'student':
        return [
          { name: 'หน้าแรก', href: '/student/dashboard', icon: HomeIcon, description: 'ภาพรวมและสถานะ' },
          { name: 'ทุนการศึกษา', href: '/student/scholarships', icon: AcademicCapIcon, description: 'ทุนที่เปิดรับสมัคร' },
          { name: 'ใบสมัครของฉัน', href: '/student/applications', icon: DocumentTextIcon, badge: 2, description: 'ใบสมัครทั้งหมด' },
          { name: 'เอกสาร', href: '/student/documents', icon: DocumentIcon, description: 'เอกสารประกอบ' },
          { name: 'การสัมภาษณ์', href: '/student/interviews', icon: CalendarDaysIcon, description: 'ตารางสัมภาษณ์' },
          { name: 'ประวัติการได้ทุน', href: '/student/awards', icon: TrophyIcon, description: 'ประวัติรับทุน' },
          { name: 'ข้อมูลส่วนตัว', href: '/student/profile', icon: UserIcon, description: 'จัดการโปรไฟล์' },
          { name: 'ข่าวสาร', href: '/news', icon: BellIcon, badge: unreadNewsCount > 0 ? unreadNewsCount : undefined, description: 'ข่าวสารและประกาศ' },
          { name: 'การแจ้งเตือน', href: '/student/notifications', icon: BellIcon, badge: 3, description: 'ข้อความแจ้งเตือน' }
        ];
      
      case 'officer':
        return [
          { name: 'หน้าแรก', href: '/officer/dashboard', icon: HomeIcon, description: 'ภาพรวมระบบ' },
          { name: 'ข่าวสาร', href: '/news', icon: BellIcon, badge: unreadNewsCount > 0 ? unreadNewsCount : undefined, description: 'ข่าวสารและประกาศ' },
          { name: 'จัดการทุน', href: '/officer/scholarships', icon: AcademicCapIcon, description: 'สร้างและจัดการทุน' },
          { name: 'ตรวจสอบใบสมัคร', href: '/officer/applications', icon: ClipboardDocumentCheckIcon, badge: 15, description: 'อนุมัติใบสมัคร' },
          { name: 'ตรวจสอบเอกสาร', href: '/officer/documents', icon: DocumentCheckIcon, badge: 8, description: 'ยืนยันเอกสาร' },
          { name: 'จัดการสัมภาษณ์', href: '/officer/interviews', icon: CalendarDaysIcon, description: 'จัดตารางสัมภาษณ์' },
          { name: 'จัดสรรทุน', href: '/officer/allocations', icon: BanknotesIcon, description: 'จัดสรรงบประมาณ' },
          { name: 'รายงาน', href: '/officer/reports', icon: ChartBarIcon, description: 'รายงานสถิติ' },
          { name: 'ส่งการแจ้งเตือน', href: '/officer/notifications', icon: BellIcon, description: 'แจ้งเตือนนักศึกษา' },
          { name: 'ตั้งค่าทุน', href: '/officer/settings', icon: CogIcon, description: 'การตั้งค่า' }
        ];
      
      case 'interviewer':
        return [
          { name: 'แดชบอร์ด', href: '/interviewer/dashboard', icon: HomeIcon, description: 'ภาพรวมการสัมภาษณ์' },
          { name: 'ตารางการสัมภาษณ์', href: '/interviewer/schedule', icon: CalendarDaysIcon, description: 'รายการนัดหมายสัมภาษณ์' },
          { name: 'ประเมินผลการสัมภาษณ์', href: '/interviewer/evaluations', icon: ClipboardIcon, description: 'บันทึกผลการประเมิน' },
          { name: 'รายการผู้สมัคร', href: '/interviewer/applicants', icon: UserGroupIcon, description: 'ข้อมูลผู้สมัครที่ต้องสัมภาษณ์' },
          { name: 'สรุปการสัมภาษณ์', href: '/interviewer/scholarship-summary', icon: ChartBarIcon, description: 'สรุปผลการสัมภาษณ์ทุนการศึกษา' },
          { name: 'เกณฑ์การประเมิน', href: '/interviewer/evaluation-criteria', icon: DocumentMagnifyingGlassIcon, description: 'หลักเกณฑ์การให้คะแนน' },
          { name: 'ข่าวสารและประกาศ', href: '/interviewer/news', icon: BellIcon, description: 'ข่าวสารสำหรับผู้สัมภาษณ์' },
          { name: 'รายงานการสัมภาษณ์', href: '/interviewer/reports', icon: ChartPieIcon, description: 'สถิติและรายงาน' }
        ];
      
      case 'admin':
        return [
          { name: 'หน้าแรก', href: '/admin/dashboard', icon: HomeIcon, description: 'ภาพรวมระบบ' },
          { name: 'จัดการผู้ใช้', href: '/admin/users', icon: UsersIcon, description: 'จัดการบัญชีผู้ใช้' },
          { name: 'จัดการบทบาท', href: '/admin/roles', icon: ShieldCheckIcon, description: 'จัดการบทบาทและสิทธิ์' },
          { name: 'จัดการทุนการศึกษา', href: '/admin/scholarships', icon: AcademicCapIcon, description: 'จัดการทุนทั้งหมด' },
          { name: 'สรุปทุนการศึกษา', href: '/admin/scholarships/summary', icon: ChartBarIcon, description: 'สถิติและผู้ได้รับทุน' },
          { name: 'กฎเกณฑ์การจัดสรร', href: '/admin/scholarships/allocation-rules', icon: CogIcon, description: 'กฎการจัดสรรและจ่ายเงิน' },
          { name: 'จัดการข่าวสาร', href: '/admin/news', icon: BellIcon, badge: unreadNewsCount > 0 ? unreadNewsCount : undefined, description: 'จัดการข่าวประชาสัมพันธ์' },
          { name: 'ตั้งค่าระบบ', href: '/admin/config', icon: Cog6ToothIcon, description: 'การกำหนดค่าระบบ' },
          { name: 'รายงานรวม', href: '/admin/reports', icon: ChartPieIcon, description: 'รายงานครอบคลุม' },
          { name: 'บันทึกกิจกรรม', href: '/admin/logs', icon: ClipboardIcon, description: 'ประวัติการใช้งาน' },
          { name: 'ความปลอดภัย', href: '/admin/security', icon: KeyIcon, description: 'การรักษาความปลอดภัย' },
          { name: 'สำรองข้อมูล', href: '/admin/backup', icon: BuildingOfficeIcon, description: 'การสำรองและกู้คืน' },
          { name: 'ติดตามระบบ', href: '/admin/monitoring', icon: ChartBarIcon, description: 'ติดตามสถานะระบบ' }
        ];
      
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleInfo = () => {
    const roleMap = {
      student: { 
        title: 'นักศึกษา', 
        subtitle: 'Student Portal',
        color: 'from-blue-600 to-blue-700',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
      },
      officer: { 
        title: 'เจ้าหน้าที่ทุน', 
        subtitle: 'Officer Portal',
        color: 'from-green-600 to-green-700',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700'
      },
      interviewer: { 
        title: 'ผู้สัมภาษณ์', 
        subtitle: 'Interviewer Portal',
        color: 'from-purple-600 to-purple-700',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700'
      },
      admin: { 
        title: 'ผู้ดูแลระบบ', 
        subtitle: 'Admin Portal',
        color: 'from-red-600 to-red-700',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700'
      },
      scholarship_officer: { 
        title: 'เจ้าหน้าที่ทุน', 
        subtitle: 'Officer Portal',
        color: 'from-green-600 to-green-700',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700'
      }
    };
    return roleMap[userRole];
  };

  const roleInfo = getRoleInfo();

  const isActive = (href: string) => {
    if (href === `/${userRole}/dashboard`) {
      return pathname === href;
    }
    return pathname?.startsWith(href) || false;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className={`${roleInfo.bgColor} p-6 border-b border-secondary-200`}>
          <div className="flex items-center space-x-3">
            <div className={`h-12 w-12 bg-gradient-to-br ${roleInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-xl font-sarabun">
                {userRole === 'student' && 'ศ'}
                {userRole === 'officer' && 'ท'}
                {userRole === 'scholarship_officer' && 'ท'}
                {userRole === 'interviewer' && 'ส'}
                {userRole === 'admin' && 'ผ'}
              </span>
            </div>
            <div>
              <h2 className={`text-lg font-bold font-sarabun ${roleInfo.textColor}`}>
                {roleInfo.title}
              </h2>
              <p className="text-sm text-secondary-600 font-inter">
                {roleInfo.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => onClose()}
                    className={`
                      group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${active
                        ? `${roleInfo.bgColor} ${roleInfo.textColor} border-r-4 border-current shadow-sm`
                        : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`h-5 w-5 ${active ? 'text-current' : 'text-secondary-400 group-hover:text-secondary-600'}`} />
                      <div>
                        <div className="font-sarabun">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-secondary-500 group-hover:text-secondary-600">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`
                        inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full
                        ${active ? 'bg-white text-current' : 'bg-danger-500 text-white'}
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-secondary-200">
          <div className="bg-secondary-50 rounded-xl p-4 text-center">
            <div className="text-sm text-secondary-600 font-sarabun">
              <p className="font-semibold">ต้องการความช่วยเหลือ?</p>
              <p className="text-xs mt-1">กด F1 หรือติดต่อ IT Support</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;