'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface InterviewerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const InterviewerSidebar: React.FC<InterviewerSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = [
    {
      name: 'แดชบอร์ด',
      href: '/interviewer/dashboard',
      icon: HomeIcon,
      description: 'ภาพรวมการสัมภาษณ์'
    },
    {
      name: 'ตารางการสัมภาษณ์',
      href: '/interviewer/schedule',
      icon: CalendarDaysIcon,
      description: 'รายการนัดหมายสัมภาษณ์'
    },
    {
      name: 'ประเมินผลการสัมภาษณ์',
      href: '/interviewer/evaluations',
      icon: ClipboardDocumentCheckIcon,
      description: 'บันทึกผลการประเมิน'
    },
    {
      name: 'รายการผู้สมัคร',
      href: '/interviewer/applicants',
      icon: UserGroupIcon,
      description: 'ข้อมูลผู้สมัครที่ต้องสัมภาษณ์'
    },
    {
      name: 'ข่าวสารและประกาศ',
      href: '/interviewer/news',
      icon: BellIcon,
      description: 'ข่าวสารสำหรับผู้สัมภาษณ์'
    },
    {
      name: 'รายงานการสัมภาษณ์',
      href: '/interviewer/reports',
      icon: ChartBarIcon,
      description: 'สถิติและรายงาน'
    }
  ];

  const isActive = (href: string) => {
    return pathname === href || (pathname && pathname.startsWith(href + '/'));
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-secondary-600 bg-opacity-75 transition-opacity lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ClipboardDocumentCheckIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold font-sarabun">ระบบผู้สัมภาษณ์</h1>
              <p className="text-sm text-purple-100 font-sarabun">Interviewer Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-purple-200 hover:text-white hover:bg-purple-500 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-purple-600 font-sarabun">
                  {user?.firstName?.charAt(0) || 'I'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-secondary-900 font-sarabun">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-secondary-500 font-sarabun">ผู้สัมภาษณ์</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  ${active 
                    ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-500' 
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }
                `}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <Icon className={`
                  flex-shrink-0 w-5 h-5 mr-3 transition-colors
                  ${active ? 'text-purple-600' : 'text-secondary-400 group-hover:text-secondary-500'}
                `} />
                <div className="flex-1">
                  <div className={`font-sarabun ${active ? 'font-semibold' : ''}`}>
                    {item.name}
                  </div>
                  <div className="text-xs text-secondary-400 font-sarabun mt-0.5">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-secondary-200">
          <Link
            href="/interviewer/settings"
            className="group flex items-center px-3 py-2 text-sm font-medium text-secondary-600 rounded-lg hover:bg-secondary-50 hover:text-secondary-900 transition-colors font-sarabun"
          >
            <Cog6ToothIcon className="flex-shrink-0 w-5 h-5 mr-3 text-secondary-400 group-hover:text-secondary-500" />
            ตั้งค่า
          </Link>
        </div>
      </div>
    </>
  );
};

export default InterviewerSidebar;
