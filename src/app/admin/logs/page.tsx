'use client';

import React, { useState } from 'react';
import {
  ClipboardDocumentListIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  UserIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  KeyIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ActivityLog {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  category: 'auth' | 'user' | 'scholarship' | 'application' | 'system' | 'security' | 'document';
  level: 'info' | 'warning' | 'error' | 'success';
  description: string;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
}

export default function AdminLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('today');

  // Mock data
  const logs: ActivityLog[] = [
    {
      id: '1',
      timestamp: '2024-12-06T14:30:00',
      user: {
        id: 'admin-1',
        name: 'สมชาย ใจดี',
        email: 'somchai@university.ac.th',
        role: 'admin'
      },
      action: 'CREATE_SCHOLARSHIP',
      category: 'scholarship',
      level: 'success',
      description: 'สร้างทุนการศึกษาใหม่ "ทุนเรียนดีประจำปี 2568"',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: {
        scholarshipId: 'sch-001',
        scholarshipName: 'ทุนเรียนดีประจำปี 2568',
        budget: 3000000
      }
    },
    {
      id: '2',
      timestamp: '2024-12-06T14:15:00',
      user: {
        id: 'officer-1',
        name: 'สมหญิง รักดี',
        email: 'somying@university.ac.th',
        role: 'officer'
      },
      action: 'APPROVE_APPLICATION',
      category: 'application',
      level: 'success',
      description: 'อนุมัติใบสมัครทุนการศึกษาของ นายทดสอบ ระบบ',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: {
        applicationId: 'app-001',
        studentName: 'นายทดสอบ ระบบ',
        scholarshipName: 'ทุนเรียนดี'
      }
    },
    {
      id: '3',
      timestamp: '2024-12-06T14:00:00',
      user: {
        id: 'system',
        name: 'System',
        email: 'system@university.ac.th',
        role: 'system'
      },
      action: 'BACKUP_DATABASE',
      category: 'system',
      level: 'info',
      description: 'สำรองข้อมูลฐานข้อมูลอัตโนมัติ',
      ipAddress: 'localhost',
      userAgent: 'System Process',
      details: {
        backupSize: '245 MB',
        duration: '2.5 seconds'
      }
    },
    {
      id: '4',
      timestamp: '2024-12-06T13:45:00',
      user: {
        id: 'student-1',
        name: 'นางสาวทดสอบ ระบบ',
        email: 'student@university.ac.th',
        role: 'student'
      },
      action: 'FAILED_LOGIN',
      category: 'security',
      level: 'warning',
      description: 'เข้าสู่ระบบล้มเหลว - รหัสผ่านไม่ถูกต้อง (ครั้งที่ 3)',
      ipAddress: '192.168.1.150',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      details: {
        reason: 'Invalid password',
        attemptCount: 3
      }
    },
    {
      id: '5',
      timestamp: '2024-12-06T13:30:00',
      user: {
        id: 'admin-1',
        name: 'สมชาย ใจดี',
        email: 'somchai@university.ac.th',
        role: 'admin'
      },
      action: 'UPDATE_USER_ROLE',
      category: 'user',
      level: 'warning',
      description: 'เปลี่ยนบทบาทของผู้ใช้ จาก student เป็น officer',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: {
        userId: 'user-001',
        oldRole: 'student',
        newRole: 'officer'
      }
    },
    {
      id: '6',
      timestamp: '2024-12-06T13:15:00',
      user: {
        id: 'officer-2',
        name: 'นายทดสอบ เจ้าหน้าที่',
        email: 'officer@university.ac.th',
        role: 'officer'
      },
      action: 'DELETE_DOCUMENT',
      category: 'document',
      level: 'error',
      description: 'พยายามลบเอกสารที่ไม่มีสิทธิ์เข้าถึง',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: {
        documentId: 'doc-001',
        reason: 'Permission denied'
      }
    },
    {
      id: '7',
      timestamp: '2024-12-06T13:00:00',
      user: {
        id: 'student-2',
        name: 'นายนักศึกษา ทดสอบ',
        email: 'student2@university.ac.th',
        role: 'student'
      },
      action: 'SUBMIT_APPLICATION',
      category: 'application',
      level: 'success',
      description: 'ส่งใบสมัครทุนการศึกษา "ทุนผู้มีรายได้น้อย"',
      ipAddress: '192.168.1.151',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: {
        applicationId: 'app-002',
        scholarshipName: 'ทุนผู้มีรายได้น้อย'
      }
    },
    {
      id: '8',
      timestamp: '2024-12-06T12:45:00',
      user: {
        id: 'admin-1',
        name: 'สมชาย ใจดี',
        email: 'somchai@university.ac.th',
        role: 'admin'
      },
      action: 'UPDATE_SYSTEM_SETTINGS',
      category: 'system',
      level: 'warning',
      description: 'เปลี่ยนแปลงการตั้งค่าระบบ - เปิดใช้งาน 2FA',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: {
        setting: 'two_factor_auth',
        oldValue: false,
        newValue: true
      }
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return KeyIcon;
      case 'user':
        return UserGroupIcon;
      case 'scholarship':
        return AcademicCapIcon;
      case 'application':
        return DocumentTextIcon;
      case 'system':
        return Cog6ToothIcon;
      case 'security':
        return ShieldCheckIcon;
      case 'document':
        return ClipboardDocumentListIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'user':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'scholarship':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'application':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'system':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'security':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'document':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return CheckCircleIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      case 'error':
        return XCircleIcon;
      case 'info':
        return InformationCircleIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'auth':
        return 'การยืนยันตัวตน';
      case 'user':
        return 'ผู้ใช้';
      case 'scholarship':
        return 'ทุนการศึกษา';
      case 'application':
        return 'ใบสมัคร';
      case 'system':
        return 'ระบบ';
      case 'security':
        return 'ความปลอดภัย';
      case 'document':
        return 'เอกสาร';
      default:
        return category;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};
    logs.forEach(log => {
      counts[log.category] = (counts[log.category] || 0) + 1;
    });
    return counts;
  };

  const getLevelCounts = () => {
    const counts: Record<string, number> = {};
    logs.forEach(log => {
      counts[log.level] = (counts[log.level] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();
  const levelCounts = getLevelCounts();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              บันทึกกิจกรรมระบบ
            </h1>
            <p className="text-secondary-600 font-sarabun">
              ติดตามและตรวจสอบกิจกรรมของผู้ใช้ในระบบ
            </p>
          </div>
          <Button variant="outline" className="font-sarabun">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            ส่งออกบันทึก
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 font-sarabun mb-1">
                  กิจกรรมทั้งหมด
                </p>
                <p className="text-2xl font-bold text-blue-900 font-sarabun">
                  {logs.length}
                </p>
              </div>
              <ClipboardDocumentListIcon className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 font-sarabun mb-1">
                  สำเร็จ
                </p>
                <p className="text-2xl font-bold text-green-900 font-sarabun">
                  {levelCounts.success || 0}
                </p>
              </div>
              <CheckCircleIcon className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 font-sarabun mb-1">
                  คำเตือน
                </p>
                <p className="text-2xl font-bold text-yellow-900 font-sarabun">
                  {levelCounts.warning || 0}
                </p>
              </div>
              <ExclamationTriangleIcon className="h-12 w-12 text-yellow-600 opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 font-sarabun mb-1">
                  ข้อผิดพลาด
                </p>
                <p className="text-2xl font-bold text-red-900 font-sarabun">
                  {levelCounts.error || 0}
                </p>
              </div>
              <XCircleIcon className="h-12 w-12 text-red-600 opacity-20" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="ค้นหากิจกรรม ผู้ใช้ หรือรายละเอียด..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-sarabun"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" />
                </div>
              </div>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
              >
                <option value="all">หมวดหมู่ทั้งหมด</option>
                <option value="auth">การยืนยันตัวตน</option>
                <option value="user">ผู้ใช้</option>
                <option value="scholarship">ทุนการศึกษา</option>
                <option value="application">ใบสมัคร</option>
                <option value="system">ระบบ</option>
                <option value="security">ความปลอดภัย</option>
                <option value="document">เอกสาร</option>
              </select>
            </div>

            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
              >
                <option value="all">ระดับทั้งหมด</option>
                <option value="success">สำเร็จ</option>
                <option value="info">ข้อมูล</option>
                <option value="warning">คำเตือน</option>
                <option value="error">ข้อผิดพลาด</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Activity Logs */}
      <Card>
        <CardHeader className="border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-sarabun">
              บันทึกล่าสุด ({filteredLogs.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-secondary-400" />
              <span className="text-sm text-secondary-600 font-sarabun">
                อัพเดทแบบเรียลไทม์
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-secondary-200">
            {filteredLogs.map((log) => {
              const CategoryIcon = getCategoryIcon(log.category);
              const LevelIcon = getLevelIcon(log.level);

              return (
                <div key={log.id} className="p-6 hover:bg-secondary-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Level Icon */}
                    <div className={`flex-shrink-0 ${getLevelColor(log.level)}`}>
                      <LevelIcon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-sarabun ${getCategoryColor(log.category)}`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {getCategoryName(log.category)}
                          </span>
                          <span className="text-xs text-secondary-500 font-sarabun">
                            {log.action}
                          </span>
                        </div>
                        <span className="text-xs text-secondary-500 font-sarabun">
                          {formatDateTime(log.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm text-secondary-900 font-sarabun mb-2">
                        {log.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-secondary-500 font-sarabun">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {log.user.name} ({log.user.role})
                        </div>
                        <div>
                          IP: {log.ipAddress}
                        </div>
                      </div>

                      {/* Details */}
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-3 bg-secondary-50 rounded-lg p-3 border border-secondary-200">
                          <p className="text-xs font-medium text-secondary-700 font-sarabun mb-2">
                            รายละเอียดเพิ่มเติม:
                          </p>
                          <div className="space-y-1">
                            {Object.entries(log.details).map(([key, value]) => (
                              <div key={key} className="flex items-start text-xs font-sarabun">
                                <span className="text-secondary-500 min-w-[100px]">
                                  {key}:
                                </span>
                                <span className="text-secondary-700 font-medium">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-secondary-400" />
              <h3 className="mt-2 text-sm font-medium text-secondary-900 font-sarabun">
                ไม่พบบันทึกกิจกรรม
              </h3>
              <p className="mt-1 text-sm text-secondary-500 font-sarabun">
                ไม่มีบันทึกที่ตรงกับเงื่อนไขการค้นหา
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
