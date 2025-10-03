'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BellIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  TrashIcon,
  EnvelopeOpenIcon,
  EnvelopeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface Notification {
  notification_id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  category: 'application' | 'scholarship' | 'interview' | 'payment' | 'system';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await notificationService.getMyNotifications();
      // setNotifications(response.notifications);

      // Mock data for now
      setNotifications([
        {
          notification_id: 1,
          type: 'success',
          category: 'application',
          title: 'ใบสมัครได้รับการอนุมัติ',
          message: 'ใบสมัครทุน "ทุนเรียนดี" ของคุณได้รับการอนุมัติแล้ว กรุณารอการนัดหมายสัมภาษณ์',
          link: '/student/applications/29',
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          notification_id: 2,
          type: 'info',
          category: 'interview',
          title: 'การนัดหมายสัมภาษณ์',
          message: 'คุณมีนัดสัมภาษณ์ทุน "ทุนเรียนดี" วันที่ 15 ตุลาคม 2567 เวลา 10:00 น.',
          link: '/student/interviews',
          is_read: false,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          notification_id: 3,
          type: 'success',
          category: 'payment',
          title: 'ได้รับการจ่ายเงินทุน',
          message: 'เงินทุน "ทุนช่วยเหลือนักศึกษา" จำนวน 15,000 บาท ได้โอนเข้าบัญชีของคุณแล้ว',
          link: '/student/awards',
          is_read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          read_at: new Date(Date.now() - 43200000).toISOString()
        },
        {
          notification_id: 4,
          type: 'warning',
          category: 'application',
          title: 'ใบสมัครยังไม่สมบูรณ์',
          message: 'กรุณาเพิ่มเอกสารประกอบการสมัครทุน "ทุนวิจัย" ให้ครบถ้วน',
          link: '/student/applications/30/edit',
          is_read: true,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          read_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          notification_id: 5,
          type: 'info',
          category: 'scholarship',
          title: 'ทุนการศึกษาใหม่',
          message: 'มีทุนการศึกษา "ทุนพัฒนาทักษะดิจิทัล" เปิดรับสมัครแล้ว',
          link: '/student/scholarships/5',
          is_read: true,
          created_at: new Date(Date.now() - 259200000).toISOString(),
          read_at: new Date(Date.now() - 172800000).toISOString()
        },
        {
          notification_id: 6,
          type: 'error',
          category: 'application',
          title: 'ใบสมัครไม่ผ่านการพิจารณา',
          message: 'ใบสมัครทุน "ทุนกีฬา" ของคุณไม่ผ่านการพิจารณา เนื่องจากเกรดเฉลี่ยไม่ถึงเกณฑ์',
          is_read: true,
          created_at: new Date(Date.now() - 432000000).toISOString(),
          read_at: new Date(Date.now() - 259200000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      // TODO: Call API to mark as read
      // await notificationService.markAsRead(notificationId);

      setNotifications(prev =>
        prev.map(n =>
          n.notification_id === notificationId
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Call API to mark all as read
      // await notificationService.markAllAsRead();

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      // TODO: Call API to delete
      // await notificationService.delete(notificationId);

      setNotifications(prev => prev.filter(n => n.notification_id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getCategoryLabel = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      application: 'ใบสมัคร',
      scholarship: 'ทุนการศึกษา',
      interview: 'สัมภาษณ์',
      payment: 'การจ่ายเงิน',
      system: 'ระบบ',
    };
    return categoryMap[category] || category;
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;
    const matchesRead =
      filterRead === 'all' ||
      (filterRead === 'unread' && !notification.is_read) ||
      (filterRead === 'read' && notification.is_read);
    return matchesCategory && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 relative">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="student" />
          <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gray-50">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="student" />
        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <BellIcon className="h-8 w-8 text-primary-600 mr-3" />
                  <h1 className="text-3xl font-bold text-gray-900">การแจ้งเตือน</h1>
                  {unreadCount > 0 && (
                    <span className="ml-3 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                      {unreadCount} ใหม่
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <EnvelopeOpenIcon className="h-5 w-5 mr-2" />
                    ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
                  </button>
                )}
              </div>
              <p className="text-gray-600">รับการแจ้งเตือนเกี่ยวกับทุนการศึกษาและใบสมัครของคุณ</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center space-x-4">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">ทุกหมวดหมู่</option>
                  <option value="application">ใบสมัคร</option>
                  <option value="scholarship">ทุนการศึกษา</option>
                  <option value="interview">สัมภาษณ์</option>
                  <option value="payment">การจ่ายเงิน</option>
                  <option value="system">ระบบ</option>
                </select>

                <select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="unread">ยังไม่ได้อ่าน</option>
                  <option value="read">อ่านแล้ว</option>
                </select>
              </div>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีการแจ้งเตือน</h3>
                <p className="text-gray-500">
                  {filterCategory !== 'all' || filterRead !== 'all'
                    ? 'ลองเปลี่ยนตัวกรอง'
                    : 'คุณไม่มีการแจ้งเตือนใหม่ในขณะนี้'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className={`bg-white rounded-lg shadow-sm p-5 transition-all cursor-pointer hover:shadow-md ${
                      !notification.is_read ? 'border-l-4 border-primary-600' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className="flex-shrink-0 mr-4">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2">
                            <h3 className={`text-base font-semibold ${
                              !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <EnvelopeIcon className="h-5 w-5 ml-2 text-primary-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {getCategoryLabel(notification.category)}
                            </span>
                            <span>
                              {new Date(notification.created_at).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.notification_id);
                        }}
                        className="ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
