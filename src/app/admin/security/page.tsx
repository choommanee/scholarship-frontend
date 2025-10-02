'use client';

import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  KeyIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  BellAlertIcon,
  ShieldExclamationIcon,
  FireIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SecurityEvent {
  id: string;
  type: 'login_failed' | 'suspicious_activity' | 'unauthorized_access' | 'password_reset' | 'account_locked';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  ipAddress: string;
  location: string;
  details: string;
}

interface ActiveSession {
  id: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  loginTime: string;
  lastActivity: string;
  isCurrentSession: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordExpiry: number;
  sessionTimeout: number;
  ipWhitelist: boolean;
  loginAttempts: number;
  accountLockDuration: number;
}

export default function AdminSecurityPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'sessions' | 'settings'>('overview');
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    ipWhitelist: false,
    loginAttempts: 5,
    accountLockDuration: 30
  });

  // Mock data
  const securityStats = {
    totalEvents: 127,
    criticalEvents: 3,
    activeSessions: 45,
    blockedAttempts: 23,
    lastScan: '2024-12-06T14:30:00'
  };

  const securityEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login_failed',
      severity: 'high',
      timestamp: '2024-12-06T14:30:00',
      user: {
        id: 'user-1',
        email: 'suspicious@example.com',
        name: 'นางสาวทดสอบ ระบบ'
      },
      ipAddress: '103.45.67.89',
      location: 'ต่างประเทศ (Unknown)',
      details: 'พยายามเข้าสู่ระบบล้มเหลว 5 ครั้งติดต่อกัน'
    },
    {
      id: '2',
      type: 'unauthorized_access',
      severity: 'critical',
      timestamp: '2024-12-06T14:15:00',
      user: {
        id: 'user-2',
        email: 'hacker@malicious.com',
        name: 'Unknown'
      },
      ipAddress: '45.142.212.61',
      location: 'รัสเซีย',
      details: 'พยายามเข้าถึง API endpoint ที่ไม่ได้รับอนุญาต'
    },
    {
      id: '3',
      type: 'suspicious_activity',
      severity: 'medium',
      timestamp: '2024-12-06T14:00:00',
      user: {
        id: 'user-3',
        email: 'student@university.ac.th',
        name: 'นายนักศึกษา ทดสอบ'
      },
      ipAddress: '192.168.1.150',
      location: 'ไทย',
      details: 'เข้าสู่ระบบจากอุปกรณ์ใหม่'
    },
    {
      id: '4',
      type: 'account_locked',
      severity: 'high',
      timestamp: '2024-12-06T13:45:00',
      user: {
        id: 'user-4',
        email: 'test@university.ac.th',
        name: 'นางสาวทดสอบ ล็อค'
      },
      ipAddress: '192.168.1.151',
      location: 'ไทย',
      details: 'บัญชีถูกล็อคเนื่องจากพยายามเข้าสู่ระบบล้มเหลวหลายครั้ง'
    },
    {
      id: '5',
      type: 'password_reset',
      severity: 'low',
      timestamp: '2024-12-06T13:30:00',
      user: {
        id: 'user-5',
        email: 'officer@university.ac.th',
        name: 'นายเจ้าหน้าที่ ทดสอบ'
      },
      ipAddress: '192.168.1.100',
      location: 'ไทย',
      details: 'ขอรีเซ็ตรหัสผ่าน'
    }
  ];

  const activeSessions: ActiveSession[] = [
    {
      id: 'session-1',
      user: {
        id: 'admin-1',
        email: 'admin@university.ac.th',
        name: 'สมชาย ใจดี',
        role: 'admin'
      },
      ipAddress: '192.168.1.100',
      device: 'MacBook Pro',
      browser: 'Chrome 120.0',
      location: 'กรุงเทพฯ, ไทย',
      loginTime: '2024-12-06T09:00:00',
      lastActivity: '2024-12-06T14:30:00',
      isCurrentSession: true
    },
    {
      id: 'session-2',
      user: {
        id: 'officer-1',
        email: 'officer@university.ac.th',
        name: 'สมหญิง รักดี',
        role: 'officer'
      },
      ipAddress: '192.168.1.101',
      device: 'Windows PC',
      browser: 'Firefox 121.0',
      location: 'กรุงเทพฯ, ไทย',
      loginTime: '2024-12-06T08:30:00',
      lastActivity: '2024-12-06T14:25:00',
      isCurrentSession: false
    },
    {
      id: 'session-3',
      user: {
        id: 'student-1',
        email: 'student@university.ac.th',
        name: 'นายนักศึกษา ทดสอบ',
        role: 'student'
      },
      ipAddress: '192.168.1.150',
      device: 'iPhone 15',
      browser: 'Safari 17.2',
      location: 'เชียงใหม่, ไทย',
      loginTime: '2024-12-06T10:00:00',
      lastActivity: '2024-12-06T14:20:00',
      isCurrentSession: false
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'วิกฤต';
      case 'high':
        return 'สูง';
      case 'medium':
        return 'ปานกลาง';
      case 'low':
        return 'ต่ำ';
      default:
        return severity;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'login_failed':
        return LockClosedIcon;
      case 'suspicious_activity':
        return ExclamationTriangleIcon;
      case 'unauthorized_access':
        return ShieldExclamationIcon;
      case 'password_reset':
        return KeyIcon;
      case 'account_locked':
        return LockClosedIcon;
      default:
        return ShieldCheckIcon;
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'login_failed':
        return 'เข้าสู่ระบบล้มเหลว';
      case 'suspicious_activity':
        return 'กิจกรรมน่าสงสัย';
      case 'unauthorized_access':
        return 'การเข้าถึงที่ไม่ได้รับอนุญาต';
      case 'password_reset':
        return 'รีเซ็ตรหัสผ่าน';
      case 'account_locked':
        return 'บัญชีถูกล็อค';
      default:
        return type;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSettingChange = (key: keyof SecuritySettings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              ความปลอดภัย
            </h1>
            <p className="text-secondary-600 font-sarabun">
              ตรวจสอบและจัดการความปลอดภัยของระบบ
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="font-sarabun">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              รีเฟรช
            </Button>
            <Button variant="primary" className="font-sarabun">
              <BellAlertIcon className="h-4 w-4 mr-2" />
              ตั้งค่าแจ้งเตือน
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 font-sarabun mb-1">
                  เหตุการณ์วิกฤต
                </p>
                <p className="text-2xl font-bold text-red-900 font-sarabun">
                  {securityStats.criticalEvents}
                </p>
              </div>
              <FireIcon className="h-12 w-12 text-red-600 opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 font-sarabun mb-1">
                  ความพยายามที่ถูกบล็อค
                </p>
                <p className="text-2xl font-bold text-orange-900 font-sarabun">
                  {securityStats.blockedAttempts}
                </p>
              </div>
              <ShieldExclamationIcon className="h-12 w-12 text-orange-600 opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 font-sarabun mb-1">
                  เซสชันที่ใช้งานอยู่
                </p>
                <p className="text-2xl font-bold text-blue-900 font-sarabun">
                  {securityStats.activeSessions}
                </p>
              </div>
              <UserIcon className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 font-sarabun mb-1">
                  เหตุการณ์ทั้งหมด
                </p>
                <p className="text-2xl font-bold text-green-900 font-sarabun">
                  {securityStats.totalEvents}
                </p>
              </div>
              <ShieldCheckIcon className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-secondary-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'ภาพรวม', icon: ShieldCheckIcon },
              { id: 'events', name: 'เหตุการณ์ความปลอดภัย', icon: ExclamationTriangleIcon },
              { id: 'sessions', name: 'เซสชันที่ใช้งาน', icon: ComputerDesktopIcon },
              { id: 'settings', name: 'การตั้งค่า', icon: Cog6ToothIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm font-sarabun transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Status */}
          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">สถานะความปลอดภัย</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-900 font-sarabun">
                        ระบบปลอดภัย
                      </p>
                      <p className="text-xs text-green-600 font-sarabun">
                        ไม่พบภัยคุกคามที่เป็นอันตราย
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-secondary-700 font-sarabun">
                        Two-Factor Authentication
                      </span>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <LockClosedIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-secondary-700 font-sarabun">
                        Password Encryption
                      </span>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <GlobeAltIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-secondary-700 font-sarabun">
                        SSL Certificate
                      </span>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FireIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-secondary-700 font-sarabun">
                        Firewall Active
                      </span>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">เหตุการณ์ล่าสุด</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-secondary-200">
                {securityEvents.slice(0, 5).map((event) => {
                  const EventIcon = getEventTypeIcon(event.type);
                  return (
                    <div key={event.id} className="p-4 hover:bg-secondary-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <EventIcon className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border font-sarabun ${getSeverityColor(event.severity)}`}>
                              {getSeverityText(event.severity)}
                            </span>
                            <span className="text-xs text-secondary-500 font-sarabun">
                              {formatDateTime(event.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-secondary-900 font-sarabun">
                            {event.details}
                          </p>
                          <p className="text-xs text-secondary-500 font-sarabun mt-1">
                            {event.user.email} • {event.ipAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'events' && (
        <Card>
          <CardHeader className="border-b border-secondary-200">
            <CardTitle className="text-lg font-sarabun">
              เหตุการณ์ความปลอดภัย ({securityEvents.length})
            </CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-secondary-200">
              {securityEvents.map((event) => {
                const EventIcon = getEventTypeIcon(event.type);
                return (
                  <div key={event.id} className="p-6 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <EventIcon className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-sarabun ${getSeverityColor(event.severity)}`}>
                              {getSeverityText(event.severity)}
                            </span>
                            <span className="text-sm text-secondary-600 font-sarabun">
                              {getEventTypeName(event.type)}
                            </span>
                          </div>
                          <span className="text-xs text-secondary-500 font-sarabun">
                            {formatDateTime(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-secondary-900 font-sarabun mb-3">
                          {event.details}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-xs font-sarabun">
                          <div>
                            <span className="text-secondary-500">ผู้ใช้:</span>{' '}
                            <span className="text-secondary-700">{event.user.email}</span>
                          </div>
                          <div>
                            <span className="text-secondary-500">IP:</span>{' '}
                            <span className="text-secondary-700">{event.ipAddress}</span>
                          </div>
                          <div>
                            <span className="text-secondary-500">ชื่อ:</span>{' '}
                            <span className="text-secondary-700">{event.user.name}</span>
                          </div>
                          <div>
                            <span className="text-secondary-500">ที่ตั้ง:</span>{' '}
                            <span className="text-secondary-700">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'sessions' && (
        <Card>
          <CardHeader className="border-b border-secondary-200">
            <CardTitle className="text-lg font-sarabun">
              เซสชันที่ใช้งานอยู่ ({activeSessions.length})
            </CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      ผู้ใช้
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      อุปกรณ์
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      ที่ตั้ง
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      เข้าสู่ระบบ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      กิจกรรมล่าสุด
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      การกระทำ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {activeSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-secondary-900 font-sarabun">
                            {session.user.name}
                          </div>
                          <div className="text-xs text-secondary-500 font-sarabun">
                            {session.user.email}
                          </div>
                          {session.isCurrentSession && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 font-sarabun mt-1">
                              เซสชันปัจจุบัน
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-secondary-900 font-sarabun">
                          {session.device}
                        </div>
                        <div className="text-xs text-secondary-500 font-sarabun">
                          {session.browser}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-secondary-900 font-sarabun">
                          {session.location}
                        </div>
                        <div className="text-xs text-secondary-500 font-sarabun">
                          {session.ipAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-900 font-sarabun">
                        {formatDateTime(session.loginTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-900 font-sarabun">
                        {formatDateTime(session.lastActivity)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {!session.isCurrentSession && (
                          <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 font-sarabun">
                            ยกเลิกเซสชัน
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">การตั้งค่าการยืนยันตัวตน</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-900 font-sarabun">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-secondary-500 font-sarabun">
                      เปิดใช้งานการยืนยันตัวตนแบบสองขั้นตอน
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    รหัสผ่านหมดอายุภายใน (วัน)
                  </label>
                  <Input
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    Session Timeout (นาที)
                  </label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    className="font-sarabun"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">การป้องกันบัญชี</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    จำนวนครั้งที่พยายามเข้าสู่ระบบล้มเหลว
                  </label>
                  <Input
                    type="number"
                    value={settings.loginAttempts}
                    onChange={(e) => handleSettingChange('loginAttempts', parseInt(e.target.value))}
                    className="font-sarabun"
                  />
                  <p className="text-xs text-secondary-500 font-sarabun mt-1">
                    บัญชีจะถูกล็อคหลังจากพยายามเข้าสู่ระบบล้มเหลวตามจำนวนครั้งที่กำหนด
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    ระยะเวลาล็อคบัญชี (นาที)
                  </label>
                  <Input
                    type="number"
                    value={settings.accountLockDuration}
                    onChange={(e) => handleSettingChange('accountLockDuration', parseInt(e.target.value))}
                    className="font-sarabun"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-900 font-sarabun">
                      IP Whitelist
                    </p>
                    <p className="text-xs text-secondary-500 font-sarabun">
                      อนุญาตเฉพาะ IP ที่กำหนดเท่านั้น
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.ipWhitelist}
                      onChange={(e) => handleSettingChange('ipWhitelist', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="pt-4">
                  <Button variant="primary" className="w-full font-sarabun">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    บันทึกการตั้งค่า
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
