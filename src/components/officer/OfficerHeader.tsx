'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bars3Icon, 
  BellIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface OfficerHeaderProps {
  onMenuToggle: () => void;
}

const OfficerHeader: React.FC<OfficerHeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 lg:hidden"
              onClick={onMenuToggle}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="ml-4 lg:ml-0">
              <Link href="/officer/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-blue-700 font-sarabun">
                  ระบบเจ้าหน้าที่ทุน
                </span>
              </Link>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-sarabun"
                placeholder="ค้นหาใบสมัคร, ทุนการศึกษา..."
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={toggleNotifications}
              >
                <span className="sr-only">ดูการแจ้งเตือน</span>
                <div className="relative">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </div>
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 font-sarabun">การแจ้งเตือน</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {[1, 2, 3].map((item) => (
                        <a
                          key={item}
                          href="#"
                          className="block px-4 py-3 hover:bg-gray-50 transition ease-in-out duration-150"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                              <BellIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-3 w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 font-sarabun">ใบสมัครใหม่</p>
                              <p className="text-sm text-gray-500 font-sarabun">มีใบสมัครทุนใหม่รอการตรวจสอบ</p>
                              <p className="mt-1 text-xs text-gray-400">1 ชั่วโมงที่แล้ว</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 px-4 py-2">
                      <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 font-sarabun">
                        ดูการแจ้งเตือนทั้งหมด
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
                onClick={toggleUserMenu}
              >
                <span className="sr-only">เปิดเมนูผู้ใช้</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserCircleIcon className="h-7 w-7 text-gray-500" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 font-sarabun">
                  {user?.fullName || user?.username || "เจ้าหน้าที่"}
                </span>
              </button>

              {/* User dropdown */}
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium font-sarabun">{user?.fullName || user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs text-blue-600 font-sarabun">เจ้าหน้าที่ทุนการศึกษา</p>
                    </div>
                    <Link
                      href="/officer/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-sarabun"
                      role="menuitem"
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5 text-gray-500" />
                      โปรไฟล์
                    </Link>
                    <Link
                      href="/officer/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-sarabun"
                      role="menuitem"
                    >
                      <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-500" />
                      ตั้งค่า
                    </Link>
                    <Link
                      href="/officer/help"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-sarabun"
                      role="menuitem"
                    >
                      <QuestionMarkCircleIcon className="mr-3 h-5 w-5 text-gray-500" />
                      ช่วยเหลือ
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-sarabun"
                      role="menuitem"
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-500" />
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default OfficerHeader;
