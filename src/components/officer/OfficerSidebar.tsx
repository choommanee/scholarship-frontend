'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  BellIcon,
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface OfficerSidebarProps {
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

const OfficerSidebar: React.FC<OfficerSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    { name: 'แดชบอร์ด', href: '/officer/dashboard', icon: HomeIcon, description: 'ภาพรวมงาน' },
    { 
      name: 'จัดการใบสมัคร', 
      href: '/officer/applications', 
      icon: DocumentTextIcon, 
      description: 'ตรวจสอบและจัดการใบสมัครทุน',
      badge: 12
    },
    { 
      name: 'จัดการทุนการศึกษา', 
      href: '/officer/scholarships', 
      icon: AcademicCapIcon, 
      description: 'จัดการข้อมูลทุนการศึกษา' 
    },
    { 
      name: 'การสัมภาษณ์', 
      href: '/officer/interviews', 
      icon: CalendarDaysIcon, 
      description: 'จัดตารางและจัดการสัมภาษณ์' 
    },
    {
      name: 'ตรวจสอบเอกสาร',
      href: '/officer/documents',
      icon: DocumentCheckIcon,
      description: 'ตรวจสอบความถูกต้องของเอกสาร'
    },
    {
      name: 'เกณฑ์การประเมิน',
      href: '/officer/evaluation-criteria',
      icon: DocumentMagnifyingGlassIcon,
      description: 'จัดการเกณฑ์การประเมินการสัมภาษณ์'
    },
    {
      name: 'รายงานและสถิติ',
      href: '/officer/reports',
      icon: ChartBarIcon,
      description: 'รายงานการดำเนินงาน'
    },
    { 
      name: 'จัดสรรทุน', 
      href: '/officer/allocations', 
      icon: ClipboardDocumentListIcon, 
      description: 'จัดสรรทุนให้นักศึกษา' 
    },
    {
      name: 'การแจ้งเตือน',
      href: '/officer/notifications',
      icon: BellIcon,
      description: 'จัดการการแจ้งเตือน'
    },
    {
      name: 'ข้อมูลส่วนตัว',
      href: '/officer/profile',
      icon: UserCircleIcon,
      description: 'จัดการข้อมูลส่วนตัว'
    },
    {
      name: 'ตั้งค่า',
      href: '/officer/settings',
      icon: Cog6ToothIcon,
      description: 'ตั้งค่าระบบ'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/officer/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href) || false;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <Link href="/officer/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-white font-sarabun">
              เจ้าหน้าที่ทุน
            </span>
          </Link>
          <button
            type="button"
            className="text-white hover:text-gray-200 lg:hidden"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1 h-full overflow-y-auto pb-4">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out font-sarabun
                  ${active 
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <item.icon 
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    active ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 font-sarabun">
              ระบบจัดการทุนการศึกษา
            </p>
            <p className="text-xs text-gray-400 font-sarabun">
              เจ้าหน้าที่ทุนการศึกษา
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfficerSidebar;
