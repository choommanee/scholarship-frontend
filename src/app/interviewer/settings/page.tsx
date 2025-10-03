'use client';

import React, { useState } from 'react';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  ChevronRightIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';

interface InterviewerSettings {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interviewerId: string;
  department: string;
  position: string;
  expertise: string[];
  avatar?: string;

  // Notification Settings
  emailNotifications: boolean;
  interviewScheduleNotifications: boolean;
  evaluationReminders: boolean;
  systemNotifications: boolean;

  // Display Settings
  theme: 'light' | 'dark' | 'auto';
  language: 'th' | 'en';
  itemsPerPage: number;
  dateFormat: 'thai' | 'international';

  // Security Settings
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
}

export default function InterviewerSettingsPage() {
  const { toasts, removeToast, success, error, warning } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'display' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [settings, setSettings] = useState<InterviewerSettings>({
    firstName: 'ดร.สมศักดิ์',
    lastName: 'วิทยากร',
    email: 'somsak.wittaya@university.ac.th',
    phone: '082-345-6789',
    interviewerId: 'INT-2024-001',
    department: 'คณะวิศวกรรมศาสตร์',
    position: 'ผู้ช่วยศาสตราจารย์',
    expertise: ['วิศวกรรมคอมพิวเตอร์', 'ปัญญาประดิษฐ์', 'วิทยาการข้อมูล'],
    emailNotifications: true,
    interviewScheduleNotifications: true,
    evaluationReminders: true,
    systemNotifications: false,
    theme: 'light',
    language: 'th',
    itemsPerPage: 20,
    dateFormat: 'thai',
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true
  });

  const [editedSettings, setEditedSettings] = useState(settings);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSettings(editedSettings);
      setIsEditing(false);
      success('บันทึกสำเร็จ', 'บันทึกการตั้งค่าเรียบร้อยแล้ว');
    } catch (err) {
      console.error('Failed to save settings:', err);
      error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกการตั้งค่าได้');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('รหัสผ่านไม่ตรงกัน', 'กรุณายืนยันรหัสผ่านให้ถูกต้อง');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      warning('รหัสผ่านสั้นเกินไป', 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      success('เปลี่ยนรหัสผ่านสำเร็จ', 'รหัสผ่านของคุณถูกเปลี่ยนแล้ว');
    } catch (err) {
      console.error('Failed to change password:', err);
      error('เกิดข้อผิดพลาด', 'ไม่สามารถเปลี่ยนรหัสผ่านได้');
    }
  };

  const addExpertise = () => {
    const newExpertise = prompt('เพิ่มความเชี่ยวชาญ:');
    if (newExpertise && newExpertise.trim()) {
      setEditedSettings({
        ...editedSettings,
        expertise: [...editedSettings.expertise, newExpertise.trim()]
      });
    }
  };

  const removeExpertise = (index: number) => {
    setEditedSettings({
      ...editedSettings,
      expertise: editedSettings.expertise.filter((_, i) => i !== index)
    });
  };

  const tabs = [
    { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: UserCircleIcon },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: BellIcon },
    { id: 'display', label: 'การแสดงผล', icon: PaintBrushIcon },
    { id: 'security', label: 'ความปลอดภัย', icon: ShieldCheckIcon }
  ];

  return (
    <div>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-sarabun mb-2">
          ตั้งค่า
        </h1>
        <p className="text-gray-600 font-sarabun">
          จัดการข้อมูลส่วนตัวและการตั้งค่าระบบผู้สัมภาษณ์
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setIsEditing(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors font-sarabun ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 mr-3 ${
                          activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        {tab.label}
                      </div>
                      {activeTab === tab.id && (
                        <ChevronRightIcon className="h-4 w-4 text-primary-600" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </CardBody>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-sarabun">ข้อมูลส่วนตัว</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditedSettings(settings);
                        setIsEditing(true);
                      }}
                      className="font-sarabun"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      แก้ไข
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditedSettings(settings);
                          setIsEditing(false);
                        }}
                        className="font-sarabun"
                      >
                        <XCircleIcon className="h-4 w-4 mr-2" />
                        ยกเลิก
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="font-sarabun"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardBody className="p-6">
                {/* Avatar */}
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                      {settings.firstName.charAt(0)}{settings.lastName.charAt(0)}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                        <CameraIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-gray-900 font-sarabun">
                      {settings.firstName} {settings.lastName}
                    </h3>
                    <p className="text-gray-600 font-sarabun">{settings.position}</p>
                    <p className="text-sm text-gray-500 font-sarabun mt-1">
                      รหัสผู้สัมภาษณ์: {settings.interviewerId}
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editedSettings.firstName : settings.firstName}
                      onChange={(e) => setEditedSettings({ ...editedSettings, firstName: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      นามสกุล
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editedSettings.lastName : settings.lastName}
                      onChange={(e) => setEditedSettings({ ...editedSettings, lastName: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      อีเมล
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={isEditing ? editedSettings.email : settings.email}
                        onChange={(e) => setEditedSettings({ ...editedSettings, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      เบอร์โทรศัพท์
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={isEditing ? editedSettings.phone : settings.phone}
                        onChange={(e) => setEditedSettings({ ...editedSettings, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      คณะ/หน่วยงาน
                    </label>
                    <div className="relative">
                      <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={isEditing ? editedSettings.department : settings.department}
                        onChange={(e) => setEditedSettings({ ...editedSettings, department: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      ตำแหน่ง
                    </label>
                    <div className="relative">
                      <IdentificationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={isEditing ? editedSettings.position : settings.position}
                        onChange={(e) => setEditedSettings({ ...editedSettings, position: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Expertise */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 font-sarabun">
                      ความเชี่ยวชาญ
                    </label>
                    {isEditing && (
                      <button
                        onClick={addExpertise}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium font-sarabun"
                      >
                        + เพิ่มความเชี่ยวชาญ
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? editedSettings.expertise : settings.expertise).map((exp, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 font-sarabun"
                      >
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        {exp}
                        {isEditing && (
                          <button
                            onClick={() => removeExpertise(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="font-sarabun">การตั้งค่าการแจ้งเตือน</CardTitle>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 font-sarabun">
                        การแจ้งเตือนทางอีเมล
                      </h4>
                      <p className="text-sm text-gray-500 font-sarabun">
                        รับการแจ้งเตือนผ่านอีเมล
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedSettings.emailNotifications}
                        onChange={(e) => setEditedSettings({ ...editedSettings, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 font-sarabun">
                        การแจ้งเตือนตารางสัมภาษณ์
                      </h4>
                      <p className="text-sm text-gray-500 font-sarabun">
                        แจ้งเตือนเมื่อมีการจัดตารางสัมภาษณ์
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedSettings.interviewScheduleNotifications}
                        onChange={(e) => setEditedSettings({ ...editedSettings, interviewScheduleNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 font-sarabun">
                        การแจ้งเตือนการประเมิน
                      </h4>
                      <p className="text-sm text-gray-500 font-sarabun">
                        แจ้งเตือนเมื่อต้องทำการประเมิน
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedSettings.evaluationReminders}
                        onChange={(e) => setEditedSettings({ ...editedSettings, evaluationReminders: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 font-sarabun">
                        การแจ้งเตือนระบบ
                      </h4>
                      <p className="text-sm text-gray-500 font-sarabun">
                        แจ้งเตือนเกี่ยวกับการอัพเดทระบบ
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedSettings.systemNotifications}
                        onChange={(e) => setEditedSettings({ ...editedSettings, systemNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="font-sarabun"
                  >
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="font-sarabun">การตั้งค่าการแสดงผล</CardTitle>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      ธีม
                    </label>
                    <select
                      value={editedSettings.theme}
                      onChange={(e) => setEditedSettings({ ...editedSettings, theme: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      <option value="light">สว่าง</option>
                      <option value="dark">มืด</option>
                      <option value="auto">อัตโนมัติ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      ภาษา
                    </label>
                    <select
                      value={editedSettings.language}
                      onChange={(e) => setEditedSettings({ ...editedSettings, language: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      <option value="th">ไทย</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      จำนวนรายการต่อหน้า
                    </label>
                    <select
                      value={editedSettings.itemsPerPage}
                      onChange={(e) => setEditedSettings({ ...editedSettings, itemsPerPage: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      รูปแบบวันที่
                    </label>
                    <select
                      value={editedSettings.dateFormat}
                      onChange={(e) => setEditedSettings({ ...editedSettings, dateFormat: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      <option value="thai">ไทย (31 ต.ค. 2567)</option>
                      <option value="international">สากล (31 Oct 2024)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="font-sarabun"
                  >
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="font-sarabun">ความปลอดภัย</CardTitle>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="pb-6 border-b border-gray-200">
                    <h4 className="text-base font-medium text-gray-900 mb-2 font-sarabun">
                      เปลี่ยนรหัสผ่าน
                    </h4>
                    <p className="text-sm text-gray-500 mb-4 font-sarabun">
                      แนะนำให้เปลี่ยนรหัสผ่านทุก 3 เดือน
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordModal(true)}
                      className="font-sarabun"
                    >
                      <KeyIcon className="h-4 w-4 mr-2" />
                      เปลี่ยนรหัสผ่าน
                    </Button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 font-sarabun">
                        การยืนยันตัวตนแบบ 2 ขั้นตอน
                      </h4>
                      <p className="text-sm text-gray-500 font-sarabun">
                        เพิ่มความปลอดภัยด้วย OTP
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedSettings.twoFactorEnabled}
                        onChange={(e) => setEditedSettings({ ...editedSettings, twoFactorEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  {/* Session Timeout */}
                  <div className="pb-6 border-b border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                      หมดเวลาเซสชันอัตโนมัติ (นาที)
                    </label>
                    <select
                      value={editedSettings.sessionTimeout}
                      onChange={(e) => setEditedSettings({ ...editedSettings, sessionTimeout: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      <option value={15}>15 นาที</option>
                      <option value={30}>30 นาที</option>
                      <option value={60}>1 ชั่วโมง</option>
                      <option value={120}>2 ชั่วโมง</option>
                    </select>
                  </div>

                  {/* Login Notifications */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 font-sarabun">
                        แจ้งเตือนการเข้าสู่ระบบ
                      </h4>
                      <p className="text-sm text-gray-500 font-sarabun">
                        แจ้งเตือนเมื่อมีการเข้าสู่ระบบ
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedSettings.loginNotifications}
                        onChange={(e) => setEditedSettings({ ...editedSettings, loginNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="font-sarabun"
                  >
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 font-sarabun">
                เปลี่ยนรหัสผ่าน
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  รหัสผ่านปัจจุบัน
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  รหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="font-sarabun"
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleChangePassword}
                className="font-sarabun"
              >
                เปลี่ยนรหัสผ่าน
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
