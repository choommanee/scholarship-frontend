'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface InterviewerHeaderProps {
  onMenuToggle: () => void;
}

const InterviewerHeader: React.FC<InterviewerHeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 lg:pl-80">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="w-full max-w-lg lg:max-w-xs">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="text"
                  placeholder="ค้นหาผู้สมัคร, การสัมภาษณ์..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md leading-5 bg-white placeholder-secondary-500 focus:outline-none focus:placeholder-secondary-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm font-sarabun"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600 font-sarabun">
                      {user?.firstName?.charAt(0) || 'I'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-secondary-900 font-sarabun">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-secondary-500 font-sarabun">ผู้สัมภาษณ์</p>
                  </div>
                </div>
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-900 font-sarabun">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-secondary-500 font-sarabun">{user?.email}</p>
                    </div>
                    
                    <Link
                      href="/interviewer/profile"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 font-sarabun"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserCircleIcon className="mr-3 h-4 w-4" />
                      โปรไฟล์
                    </Link>
                    
                    <Link
                      href="/interviewer/settings"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 font-sarabun"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Cog6ToothIcon className="mr-3 h-4 w-4" />
                      ตั้งค่า
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 font-sarabun"
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
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

export default InterviewerHeader;
