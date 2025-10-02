'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  BellIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ChartPieIcon,
  ClipboardIcon,
  KeyIcon,
  BuildingOfficeIcon,
  DocumentIcon,
  ChartBarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  UserGroupIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
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

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    { name: 'แดชบอร์ด', href: '/admin/dashboard', icon: HomeIcon, description: 'ภาพรวมระบบ' },
    {
      name: 'ทุนการศึกษา',
      href: '/admin/scholarships',
      icon: AcademicCapIcon,
      description: 'จัดการทุนการศึกษา'
    },
    {
      name: 'ใบสมัคร',
      href: '/admin/applications',
      icon: DocumentTextIcon,
      description: 'ตรวจสอบใบสมัคร'
    },
    {
      name: 'การสัมภาษณ์',
      href: '/admin/interviews',
      icon: CalendarDaysIcon,
      description: 'จัดการสัมภาษณ์'
    },
    {
      name: 'งบประมาณ',
      href: '/admin/budget',
      icon: BanknotesIcon,
      description: 'จัดการการเงิน'
    },
    {
      name: 'ข่าวสาร',
      href: '/admin/news',
      icon: MegaphoneIcon,
      description: 'จัดการข่าวประชาสัมพันธ์'
    },
    {
      name: 'ผู้ใช้',
      href: '/admin/users',
      icon: UsersIcon,
      description: 'จัดการบัญชีผู้ใช้'
    },
    {
      name: 'บทบาทและสิทธิ์',
      href: '/admin/roles',
      icon: ShieldCheckIcon,
      description: 'ควบคุมการเข้าถึง'
    },
    {
      name: 'รายงาน',
      href: '/admin/reports',
      icon: ChartPieIcon,
      description: 'รายงานและสถิติ'
    },
    {
      name: 'บันทึกกิจกรรม',
      href: '/admin/logs',
      icon: ClipboardIcon,
      description: 'ประวัติการใช้งาน'
    },
    {
      name: 'ความปลอดภัย',
      href: '/admin/security',
      icon: KeyIcon,
      description: 'การรักษาความปลอดภัย'
    },
    {
      name: 'ตั้งค่าระบบ',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
      description: 'การกำหนดค่าระบบ'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
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
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl font-sarabun">
                ผ
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold font-sarabun text-red-700">
                ผู้ดูแลระบบ
              </h2>
              <p className="text-sm text-gray-600 font-inter">
                Admin Portal
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
                        ? 'bg-red-50 text-red-700 border-r-4 border-current shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`h-5 w-5 ${active ? 'text-current' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      <div>
                        <div className="font-sarabun">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500 group-hover:text-gray-600">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`
                        inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full
                        ${active ? 'bg-white text-current' : 'bg-red-500 text-white'}
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
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-sm text-gray-600 font-sarabun">
              <p className="font-semibold">System Version</p>
              <p className="text-xs mt-1">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
