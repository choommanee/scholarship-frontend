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
  FunnelIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Notification {
  notification_id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  category: 'application' | 'scholarship' | 'interview' | 'payment' | 'system' | 'allocation' | 'approval';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
  priority?: 'low' | 'medium' | 'high';
}

export default function OfficerNotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await notificationService.getOfficerNotifications();
      // setNotifications(response.notifications);

      // Mock data for officer
      setNotifications([
        {
          notification_id: 1,
          type: 'warning',
          category: 'application',
          title: 'ใบสมัครรอการตรวจสอบ',
          message: 'มีใบสมัครทุนการศึกษา 15 ฉบับ รอการตรวจสอบและอนุมัติ',
          link: '/officer/applications',
          is_read: false,
          created_at: new Date().toISOString(),
          priority: 'high'
        },
        {
          notification_id: 2,
          type: 'info',
          category: 'approval',
          title: 'รออนุมัติการจัดสรรงบประมาณ',
          message: 'การจัดสรรงบประมาณทุน "ทุนวิจัย" จำนวน 1,000,000 บาท รออนุมัติ',
          link: '/officer/allocations',
          is_read: false,
          created_at: new Date(Date.now() - 1800000).toISOString(),
          priority: 'high'
        },
        {
          notification_id: 3,
          type: 'success',
          category: 'interview',
          title: 'การสัมภาษณ์เสร็จสิ้น',
          message: 'การสัมภาษณ์ทุน "ทุนเรียนดี" รอบที่ 1 เสร็จสิ้นแล้ว กรุณาประกาศผล',
          link: '/officer/interviews',
          is_read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          priority: 'medium'
        },
        {
          notification_id: 4,
          type: 'error',
          category: 'payment',
          title: 'การจ่ายเงินล้มเหลว',
          message: 'การจ่ายเงินให้นักศึกษา 3 ราย ล้มเหลว กรุณาตรวจสอบข้อมูลบัญชีธนาคาร',
          link: '/officer/payments',
          is_read: true,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          read_at: new Date(Date.now() - 3600000).toISOString(),
          priority: 'high'
        },
        {
          notification_id: 5,
          type: 'info',
          category: 'scholarship',
          title: 'ทุนการศึกษาใกล้ปิดรับสมัคร',
          message: 'ทุน "ทุนช่วยเหลือนักศึกษา" จะปิดรับสมัครในอีก 3 วัน',
          link: '/officer/scholarships',
          is_read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          read_at: new Date(Date.now() - 43200000).toISOString(),
          priority: 'low'
        },
        {
          notification_id: 6,
          type: 'success',
          category: 'allocation',
          title: 'งบประมาณได้รับการอนุมัติ',
          message: 'การจัดสรรงบประมาณทุน "ทุนเรียนดี" จำนวน 500,000 บาท ได้รับการอนุมัติแล้ว',
          link: '/officer/allocations',
          is_read: true,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          read_at: new Date(Date.now() - 86400000).toISOString(),
          priority: 'medium'
        },
        {
          notification_id: 7,
          type: 'warning',
          category: 'system',
          title: 'กำหนดส่งรายงาน',
          message: 'รายงานการจัดสรรทุนประจำเดือนต้องส่งภายในวันที่ 30 ตุลาคม 2567',
          link: '/officer/reports',
          is_read: true,
          created_at: new Date(Date.now() - 259200000).toISOString(),
          read_at: new Date(Date.now() - 172800000).toISOString(),
          priority: 'medium'
        },
        {
          notification_id: 8,
          type: 'info',
          category: 'application',
          title: 'ใบสมัครใหม่',
          message: 'มีใบสมัครทุนการศึกษาใหม่ 8 ฉบับ วันนี้',
          link: '/officer/applications',
          is_read: true,
          created_at: new Date(Date.now() - 345600000).toISOString(),
          read_at: new Date(Date.now() - 259200000).toISOString(),
          priority: 'low'
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
      allocation: 'จัดสรรงบประมาณ',
      approval: 'อนุมัติ',
      system: 'ระบบ',
    };
    return categoryMap[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'application':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'scholarship':
        return <BanknotesIcon className="h-4 w-4" />;
      case 'interview':
        return <UserGroupIcon className="h-4 w-4" />;
      case 'payment':
        return <BanknotesIcon className="h-4 w-4" />;
      case 'allocation':
        return <BanknotesIcon className="h-4 w-4" />;
      default:
        return <BellIcon className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;

    const priorityMap: { [key: string]: { label: string; className: string } } = {
      high: { label: 'สำคัญมาก', className: 'bg-red-100 text-red-800' },
      medium: { label: 'ปานกลาง', className: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'ปกติ', className: 'bg-gray-100 text-gray-800' }
    };

    const badge = priorityMap[priority] || priorityMap.low;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;
    const matchesRead =
      filterRead === 'all' ||
      (filterRead === 'unread' && !notification.is_read) ||
      (filterRead === 'read' && notification.is_read);
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    return matchesCategory && matchesRead && matchesPriority;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="font-sarabun text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BellIcon className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 font-sarabun">การแจ้งเตือน</h1>
            <div className="flex items-center ml-4 space-x-2">
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full font-sarabun">
                  {unreadCount} ใหม่
                </span>
              )}
              {highPriorityCount > 0 && (
                <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full font-sarabun">
                  {highPriorityCount} สำคัญ
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="font-sarabun"
              >
                <EnvelopeOpenIcon className="h-4 w-4 mr-2" />
                ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="font-sarabun"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              ตัวกรอง
            </Button>
          </div>
        </div>
        <p className="text-gray-600 font-sarabun">
          ติดตามการแจ้งเตือนเกี่ยวกับใบสมัคร การอนุมัติ และการดำเนินการต่างๆ
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-sarabun">ทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-900 font-sarabun">{notifications.length}</p>
              </div>
              <BellIcon className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-sarabun">ยังไม่ได้อ่าน</p>
                <p className="text-2xl font-bold text-red-900 font-sarabun">{unreadCount}</p>
              </div>
              <EnvelopeIcon className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-sarabun">สำคัญมาก</p>
                <p className="text-2xl font-bold text-orange-900 font-sarabun">{highPriorityCount}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-sarabun">อ่านแล้ว</p>
                <p className="text-2xl font-bold text-green-900 font-sarabun">
                  {notifications.length - unreadCount}
                </p>
              </div>
              <EnvelopeOpenIcon className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  หมวดหมู่
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                >
                  <option value="all">ทุกหมวดหมู่</option>
                  <option value="application">ใบสมัคร</option>
                  <option value="approval">อนุมัติ</option>
                  <option value="allocation">จัดสรรงบประมาณ</option>
                  <option value="interview">สัมภาษณ์</option>
                  <option value="payment">การจ่ายเงิน</option>
                  <option value="scholarship">ทุนการศึกษา</option>
                  <option value="system">ระบบ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  สถานะ
                </label>
                <select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="unread">ยังไม่ได้อ่าน</option>
                  <option value="read">อ่านแล้ว</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  ความสำคัญ
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="high">สำคัญมาก</option>
                  <option value="medium">ปานกลาง</option>
                  <option value="low">ปกติ</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardBody className="p-12 text-center">
            <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 font-sarabun">
              ไม่มีการแจ้งเตือน
            </h3>
            <p className="text-gray-500 font-sarabun">
              {filterCategory !== 'all' || filterRead !== 'all' || filterPriority !== 'all'
                ? 'ลองเปลี่ยนตัวกรอง'
                : 'คุณไม่มีการแจ้งเตือนใหม่ในขณะนี้'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.notification_id}
              className={`transition-all cursor-pointer hover:shadow-lg ${
                !notification.is_read ? 'border-l-4 border-primary-600 bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardBody className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="flex-shrink-0 mr-4">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2 space-x-2">
                        <h3 className={`text-base font-semibold font-sarabun ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <EnvelopeIcon className="h-5 w-5 text-primary-600 flex-shrink-0" />
                        )}
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 font-sarabun">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-white border border-gray-200 rounded-full flex items-center font-sarabun">
                          {getCategoryIcon(notification.category)}
                          <span className="ml-1">{getCategoryLabel(notification.category)}</span>
                        </span>
                        <span className="font-sarabun">
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
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
