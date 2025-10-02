'use client';

import React, { useState } from 'react';
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  BellIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ServerIcon,
  CloudIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SystemSettings {
  general: {
    siteName: string;
    siteUrl: string;
    supportEmail: string;
    timezone: string;
    language: string;
    dateFormat: string;
  };
  scholarship: {
    applicationStartDate: string;
    applicationEndDate: string;
    maxApplicationsPerStudent: number;
    requireDocumentVerification: boolean;
    autoApproveThreshold: number;
  };
  notification: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminAlerts: boolean;
    studentAlerts: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  system: {
    maintenanceMode: boolean;
    debugMode: boolean;
    cacheEnabled: boolean;
    sessionTimeout: number;
    maxUploadSize: number;
    allowedFileTypes: string[];
  };
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'scholarship' | 'notification' | 'email' | 'system'>('general');
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'ระบบทุนการศึกษา มหาวิทยาลัย',
      siteUrl: 'https://scholarship.university.ac.th',
      supportEmail: 'support@university.ac.th',
      timezone: 'Asia/Bangkok',
      language: 'th',
      dateFormat: 'DD/MM/YYYY'
    },
    scholarship: {
      applicationStartDate: '2024-01-01',
      applicationEndDate: '2024-12-31',
      maxApplicationsPerStudent: 5,
      requireDocumentVerification: true,
      autoApproveThreshold: 80
    },
    notification: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true,
      studentAlerts: true
    },
    email: {
      smtpHost: 'smtp.university.ac.th',
      smtpPort: 587,
      smtpUser: 'noreply@university.ac.th',
      smtpPassword: '••••••••',
      fromEmail: 'scholarship@university.ac.th',
      fromName: 'ระบบทุนการศึกษา'
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      cacheEnabled: true,
      sessionTimeout: 30,
      maxUploadSize: 10,
      allowedFileTypes: ['pdf', 'jpg', 'png', 'doc', 'docx']
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('บันทึกการตั้งค่าเรียบร้อยแล้ว');
  };

  const updateSetting = <K extends keyof SystemSettings>(
    category: K,
    field: keyof SystemSettings[K],
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              ตั้งค่าระบบ
            </h1>
            <p className="text-secondary-600 font-sarabun">
              กำหนดค่าและจัดการการตั้งค่าระบบทุนการศึกษา
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="font-sarabun">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              รีเซ็ต
            </Button>
            <Button
              variant="primary"
              className="font-sarabun"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              {isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-secondary-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'general', name: 'ทั่วไป', icon: Cog6ToothIcon },
              { id: 'scholarship', name: 'ทุนการศึกษา', icon: AcademicCapIcon },
              { id: 'notification', name: 'การแจ้งเตือน', icon: BellIcon },
              { id: 'email', name: 'อีเมล', icon: EnvelopeIcon },
              { id: 'system', name: 'ระบบ', icon: ServerIcon }
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
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">ข้อมูลเว็บไซต์</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    ชื่อเว็บไซต์
                  </label>
                  <Input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    URL เว็บไซต์
                  </label>
                  <Input
                    type="text"
                    value={settings.general.siteUrl}
                    onChange={(e) => updateSetting('general', 'siteUrl', e.target.value)}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    อีเมลสนับสนุน
                  </label>
                  <Input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                    className="font-sarabun"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">การตั้งค่าภูมิภาค</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    เขตเวลา
                  </label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
                  >
                    <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
                    <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    ภาษา
                  </label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => updateSetting('general', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
                  >
                    <option value="th">ไทย (Thai)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    รูปแบบวันที่
                  </label>
                  <select
                    value={settings.general.dateFormat}
                    onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'scholarship' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">ช่วงเวลาสมัครทุน</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    วันเริ่มต้นรับสมัคร
                  </label>
                  <Input
                    type="date"
                    value={settings.scholarship.applicationStartDate}
                    onChange={(e) => updateSetting('scholarship', 'applicationStartDate', e.target.value)}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    วันสิ้นสุดรับสมัคร
                  </label>
                  <Input
                    type="date"
                    value={settings.scholarship.applicationEndDate}
                    onChange={(e) => updateSetting('scholarship', 'applicationEndDate', e.target.value)}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    จำนวนการสมัครสูงสุดต่อนักศึกษา
                  </label>
                  <Input
                    type="number"
                    value={settings.scholarship.maxApplicationsPerStudent}
                    onChange={(e) => updateSetting('scholarship', 'maxApplicationsPerStudent', parseInt(e.target.value))}
                    className="font-sarabun"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">การอนุมัติอัตโนมัติ</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-900 font-sarabun">
                      ต้องมีการตรวจสอบเอกสาร
                    </p>
                    <p className="text-xs text-secondary-500 font-sarabun">
                      บังคับให้มีการตรวจสอบเอกสารก่อนอนุมัติ
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.scholarship.requireDocumentVerification}
                      onChange={(e) => updateSetting('scholarship', 'requireDocumentVerification', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    คะแนนขั้นต่ำสำหรับอนุมัติอัตโนมัติ (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.scholarship.autoApproveThreshold}
                    onChange={(e) => updateSetting('scholarship', 'autoApproveThreshold', parseInt(e.target.value))}
                    className="font-sarabun"
                  />
                  <p className="text-xs text-secondary-500 font-sarabun mt-1">
                    ใบสมัครที่มีคะแนนเกินกว่าค่านี้จะได้รับการพิจารณาอัตโนมัติ
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'notification' && (
        <Card>
          <CardHeader className="border-b border-secondary-200">
            <CardTitle className="text-lg font-sarabun">การตั้งค่าการแจ้งเตือน</CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 font-sarabun">
                      การแจ้งเตือนทางอีเมล
                    </p>
                    <p className="text-xs text-blue-600 font-sarabun">
                      ส่งการแจ้งเตือนผ่านอีเมล
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notification.emailNotifications}
                    onChange={(e) => updateSetting('notification', 'emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <BellIcon className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-900 font-sarabun">
                      Push Notifications
                    </p>
                    <p className="text-xs text-green-600 font-sarabun">
                      แจ้งเตือนผ่านเบราว์เซอร์
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notification.pushNotifications}
                    onChange={(e) => updateSetting('notification', 'pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-purple-900 font-sarabun">
                      การแจ้งเตือนสำหรับผู้ดูแลระบบ
                    </p>
                    <p className="text-xs text-purple-600 font-sarabun">
                      แจ้งเตือนเหตุการณ์สำคัญให้ผู้ดูแลระบบ
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notification.adminAlerts}
                    onChange={(e) => updateSetting('notification', 'adminAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center">
                  <UserGroupIcon className="h-6 w-6 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-orange-900 font-sarabun">
                      การแจ้งเตือนสำหรับนักศึกษา
                    </p>
                    <p className="text-xs text-orange-600 font-sarabun">
                      แจ้งเตือนสถานะการสมัครและข่าวสาร
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notification.studentAlerts}
                    onChange={(e) => updateSetting('notification', 'studentAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">การตั้งค่า SMTP</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    SMTP Host
                  </label>
                  <Input
                    type="text"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    SMTP Port
                  </label>
                  <Input
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    SMTP Username
                  </label>
                  <Input
                    type="text"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    SMTP Password
                  </label>
                  <Input
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                    className="font-sarabun"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">ข้อมูลผู้ส่ง</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    From Email
                  </label>
                  <Input
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    From Name
                  </label>
                  <Input
                    type="text"
                    value={settings.email.fromName}
                    onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                    className="font-sarabun"
                  />
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full font-sarabun">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    ส่งอีเมลทดสอบ
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">โหมดการทำงาน</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <Cog6ToothIcon className="h-6 w-6 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900 font-sarabun">
                        โหมดปิดปรับปรุง
                      </p>
                      <p className="text-xs text-yellow-600 font-sarabun">
                        ปิดการเข้าถึงระบบชั่วคราว
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.system.maintenanceMode}
                      onChange={(e) => updateSetting('system', 'maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <ServerIcon className="h-6 w-6 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-red-900 font-sarabun">
                        Debug Mode
                      </p>
                      <p className="text-xs text-red-600 font-sarabun">
                        แสดงข้อมูล debug (เฉพาะ development)
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.system.debugMode}
                      onChange={(e) => updateSetting('system', 'debugMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <CloudIcon className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-900 font-sarabun">
                        Cache System
                      </p>
                      <p className="text-xs text-green-600 font-sarabun">
                        เปิดใช้งานระบบแคช
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.system.cacheEnabled}
                      onChange={(e) => updateSetting('system', 'cacheEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun">การจัดการไฟล์</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    ขนาดไฟล์สูงสุด (MB)
                  </label>
                  <Input
                    type="number"
                    value={settings.system.maxUploadSize}
                    onChange={(e) => updateSetting('system', 'maxUploadSize', parseInt(e.target.value))}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    Session Timeout (นาที)
                  </label>
                  <Input
                    type="number"
                    value={settings.system.sessionTimeout}
                    onChange={(e) => updateSetting('system', 'sessionTimeout', parseInt(e.target.value))}
                    className="font-sarabun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 font-sarabun mb-2">
                    ประเภทไฟล์ที่อนุญาต
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                    {settings.system.allowedFileTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 font-sarabun"
                      >
                        .{type}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-secondary-500 font-sarabun mt-1">
                    ไฟล์ที่สามารถอัพโหลดได้
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
