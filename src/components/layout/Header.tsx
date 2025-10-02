'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BellIcon, 
  UserCircleIcon, 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from '@/components/notification/NotificationCenter';

interface HeaderProps {
  user?: {
    name: string;
    role: string;
    email?: string;
    avatar?: string;
  };
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  user,
  onMenuToggle,
  showMenuButton = true 
}) => {
  const { logout, user: authUser } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Use auth user if available, fallback to props
  const currentUser = authUser || user;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowUserMenu(false);
      
      // Show loading toast
      const loadingToast = toast.loading('กำลังออกจากระบบ...');
      
      await logout();
      
      toast.dismiss(loadingToast);
      toast.success('ออกจากระบบเรียบร้อย');
      
      // Redirect will be handled by AuthContext
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการออกจากระบบ');
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserRole = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'ผู้ดูแลระบบ';
      case 'officer':
      case 'scholarship_officer':
        return 'เจ้าหน้าที่ทุน';
      case 'interviewer':
        return 'ผู้สัมภาษณ์';
      case 'student':
        return 'นักศึกษา';
      default:
        return role || 'ผู้ใช้';
    }
  };

  const getProfilePath = () => {
    if (!currentUser?.role) return '/profile';
    
    switch (currentUser.role) {
      case 'admin':
        return '/admin/profile';
      case 'officer':
      case 'scholarship_officer':
        return '/officer/profile';
      case 'interviewer':
        return '/interviewer/profile';
      case 'student':
      default:
        return '/student/profile';
    }
  };

  const getSettingsPath = () => {
    if (!currentUser?.role) return '/settings';
    
    switch (currentUser.role) {
      case 'admin':
        return '/admin/settings';
      case 'officer':
      case 'scholarship_officer':
        return '/officer/settings';
      case 'interviewer':
        return '/interviewer/settings';
      case 'student':
      default:
        return '/student/settings';
    }
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu') && !target.closest('.notifications-menu')) {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-secondary-200 shadow-header sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left section - Logo and title */}
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </Button>
          )}
          
          {/* Mahidol-style Logo and System Name */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-gradient-to-br from-primary-700 to-primary-900 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl font-sarabun">ทุน</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-secondary-900 font-sarabun">
                ระบบจัดการทุนการศึกษา
              </h1>
              <p className="text-sm text-secondary-500 font-inter">
                Scholarship Management System
              </p>
            </div>
          </Link>
        </div>

        {/* Center section - Search (Mahidol style) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="ค้นหาทุนการศึกษา, ใบสมัคร, เอกสาร..."
              className="block w-full pl-10 pr-3 py-2.5 border border-secondary-300 rounded-lg leading-5 bg-white placeholder-secondary-500 focus:outline-none focus:placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm font-sarabun transition-all duration-200"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Search button for mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </Button>

          {/* Real-time Notifications */}
          <NotificationCenter 
            userId={currentUser?.email}
            className="notifications-menu"
          />

          {/* User menu with Mahidol styling */}
          {currentUser && (
            <div className="relative user-menu">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-3 h-12 px-3 hover:bg-primary-50 rounded-lg"
                disabled={isLoggingOut}
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-9 w-9 rounded-full border-2 border-primary-200"
                  />
                ) : (
                  <div className="h-9 w-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-secondary-900 font-sarabun">{currentUser.name}</p>
                  <p className="text-xs text-secondary-500 font-sarabun">{getUserRole(currentUser.role)}</p>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-secondary-400" />
              </Button>

              {/* User dropdown with Mahidol styling */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-secondary-200 z-50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                    <p className="font-semibold font-sarabun">{currentUser.name}</p>
                    <p className="text-xs opacity-90">{currentUser.email}</p>
                    <p className="text-xs opacity-75 mt-1">{getUserRole(currentUser.role)}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href={getProfilePath()}
                      className="flex items-center px-4 py-3 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors font-sarabun"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserCircleIcon className="h-5 w-5 mr-3 text-secondary-400" />
                      ข้อมูลส่วนตัว
                    </Link>
                    <Link
                      href={getSettingsPath()}
                      className="flex items-center px-4 py-3 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors font-sarabun"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="h-5 w-5 mr-3 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      ตั้งค่า
                    </Link>
                    <Link
                      href="/help"
                      className="flex items-center px-4 py-3 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors font-sarabun"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="h-5 w-5 mr-3 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ช่วยเหลือ
                    </Link>
                    <div className="border-t border-secondary-100 my-1"></div>
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-danger-600 hover:bg-danger-50 transition-colors font-sarabun disabled:opacity-50"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {isLoggingOut ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;