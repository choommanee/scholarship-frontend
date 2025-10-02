'use client';

import React, { useState } from 'react';
import { 
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CogIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationSettings {
  email: {
    applicationStatus: boolean;
    documentRequired: boolean;
    interviewScheduled: boolean;
    scholarshipAnnouncements: boolean;
    systemMaintenance: boolean;
  };
  push: {
    applicationStatus: boolean;
    documentRequired: boolean;
    interviewScheduled: boolean;
    scholarshipAnnouncements: boolean;
  };
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastPasswordChange: string;
  sessionTimeout: number; // minutes
}

const StudentSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: {
      applicationStatus: true,
      documentRequired: true,
      interviewScheduled: true,
      scholarshipAnnouncements: true,
      systemMaintenance: false,
    },
    push: {
      applicationStatus: true,
      documentRequired: true,
      interviewScheduled: true,
      scholarshipAnnouncements: false,
    },
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    emailVerified: true,
    phoneVerified: false,
    lastPasswordChange: '2024-01-15',
    sessionTimeout: 30,
  });

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('รหัสผ่านใหม่และการยืนยันไม่ตรงกัน');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('เปลี่ยนรหัสผ่านเรียบร้อย');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSecuritySettings(prev => ({
        ...prev,
        lastPasswordChange: new Date().toISOString().split('T')[0],
      }));
      
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (category: 'email' | 'push', setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev[category]],
      },
    }));
    toast.success('บันทึกการตั้งค่าแล้ว');
  };

  const handleSecurityToggle = (setting: keyof SecuritySettings) => {
    if (setting === 'twoFactorEnabled') {
      // Simulate 2FA setup
      if (!securitySettings.twoFactorEnabled) {
        toast.success('เปิดใช้งานการยืนยันตัวตน 2 ขั้นตอน');
      } else {
        toast.success('ปิดการยืนยันตัวตน 2 ขั้นตอน');
      }
    }
    
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'อ่อนแอมาก', color: 'text-red-600' };
      case 2:
        return { text: 'อ่อนแอ', color: 'text-orange-600' };
      case 3:
        return { text: 'ปานกลาง', color: 'text-yellow-600' };
      case 4:
        return { text: 'แข็งแรง', color: 'text-blue-600' };
      case 5:
        return { text: 'แข็งแรงมาก', color: 'text-green-600' };
      default:
        return { text: '', color: '' };
    }
  };

  const tabs = [
    { id: 'password', name: 'เปลี่ยนรหัสผ่าน', icon: KeyIcon },
    { id: 'notifications', name: 'การแจ้งเตือน', icon: BellIcon },
    { id: 'security', name: 'ความปลอดภัย', icon: ShieldCheckIcon },
    { id: 'preferences', name: 'ค่าเริ่มต้น', icon: CogIcon },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative">
        <Sidebar
          userRole="student"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8">
          <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                ตั้งค่า
              </h1>
              <p className="text-secondary-600 font-sarabun">
                จัดการการตั้งค่าบัญชีและความปลอดภัยของคุณ
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Settings Navigation */}
              <div className="lg:col-span-1">
                <Card>
                  <CardBody className="p-4">
                    <nav className="space-y-1">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              activeTab === tab.id
                                ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                                : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                            }`}
                          >
                            <Icon className="h-5 w-5 mr-3" />
                            <span className="font-sarabun">{tab.name}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </CardBody>
                </Card>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                {/* Password Change Tab */}
                {activeTab === 'password' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-sarabun flex items-center">
                        <KeyIcon className="h-5 w-5 mr-2 text-primary-600" />
                        เปลี่ยนรหัสผ่าน
                      </CardTitle>
                    </CardHeader>
                    <CardBody className="p-6">
                      <div className="max-w-md space-y-6">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                            รหัสผ่านปัจจุบัน <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              type={showPasswords.current ? 'text' : 'password'}
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                              placeholder="กรอกรหัสผ่านปัจจุบัน"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                            >
                              {showPasswords.current ? (
                                <EyeSlashIcon className="h-5 w-5 text-secondary-400" />
                              ) : (
                                <EyeIcon className="h-5 w-5 text-secondary-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                            รหัสผ่านใหม่ <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              type={showPasswords.new ? 'text' : 'password'}
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                              placeholder="กรอกรหัสผ่านใหม่"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            >
                              {showPasswords.new ? (
                                <EyeSlashIcon className="h-5 w-5 text-secondary-400" />
                              ) : (
                                <EyeIcon className="h-5 w-5 text-secondary-400" />
                              )}
                            </button>
                          </div>
                          {/* Password Strength Indicator */}
                          {passwordForm.newPassword && (
                            <div className="mt-2">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-secondary-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      getPasswordStrength(passwordForm.newPassword) <= 2
                                        ? 'bg-red-500'
                                        : getPasswordStrength(passwordForm.newPassword) <= 3
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                    }`}
                                    style={{
                                      width: `${(getPasswordStrength(passwordForm.newPassword) / 5) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span
                                  className={`text-xs font-medium ${
                                    getPasswordStrengthText(getPasswordStrength(passwordForm.newPassword)).color
                                  }`}
                                >
                                  {getPasswordStrengthText(getPasswordStrength(passwordForm.newPassword)).text}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                            ยืนยันรหัสผ่านใหม่ <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              type={showPasswords.confirm ? 'text' : 'password'}
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              placeholder="ยืนยันรหัสผ่านใหม่"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            >
                              {showPasswords.confirm ? (
                                <EyeSlashIcon className="h-5 w-5 text-secondary-400" />
                              ) : (
                                <EyeIcon className="h-5 w-5 text-secondary-400" />
                              )}
                            </button>
                          </div>
                          {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">รหัสผ่านไม่ตรงกัน</p>
                          )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-900 font-sarabun mb-2">
                            ข้อกำหนดรหัสผ่าน:
                          </h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• ความยาวอย่างน้อย 8 ตัวอักษร</li>
                            <li>• มีตัวอักษรพิมพ์ใหญ่และพิมพ์เล็ก</li>
                            <li>• มีตัวเลข</li>
                            <li>• มีอักขระพิเศษ (!@#$%^&*)</li>
                          </ul>
                        </div>

                        <Button
                          variant="primary"
                          onClick={handlePasswordChange}
                          loading={isLoading}
                          className="w-full font-sarabun"
                          disabled={
                            !passwordForm.currentPassword ||
                            !passwordForm.newPassword ||
                            !passwordForm.confirmPassword ||
                            passwordForm.newPassword !== passwordForm.confirmPassword
                          }
                        >
                          เปลี่ยนรหัสผ่าน
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-sarabun flex items-center">
                        <BellIcon className="h-5 w-5 mr-2 text-primary-600" />
                        การแจ้งเตือน
                      </CardTitle>
                    </CardHeader>
                    <CardBody className="p-6 space-y-6">
                      {/* Email Notifications */}
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-4 flex items-center">
                          <GlobeAltIcon className="h-5 w-5 mr-2" />
                          การแจ้งเตือนทางอีเมล
                        </h3>
                        <div className="space-y-4">
                          {Object.entries(notificationSettings.email).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-secondary-900 font-sarabun">
                                  {key === 'applicationStatus' && 'สถานะใบสมัคร'}
                                  {key === 'documentRequired' && 'เอกสารที่ต้องการ'}
                                  {key === 'interviewScheduled' && 'การนัดสัมภาษณ์'}
                                  {key === 'scholarshipAnnouncements' && 'ประกาศทุนการศึกษา'}
                                  {key === 'systemMaintenance' && 'การบำรุงรักษาระบบ'}
                                </p>
                                <p className="text-xs text-secondary-500">
                                  รับการแจ้งเตือนผ่านอีเมล {user?.email}
                                </p>
                              </div>
                              <Switch
                                checked={value}
                                onChange={() => handleNotificationChange('email', key)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Push Notifications */}
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-4 flex items-center">
                          <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
                          การแจ้งเตือนในเบราว์เซอร์
                        </h3>
                        <div className="space-y-4">
                          {Object.entries(notificationSettings.push).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-secondary-900 font-sarabun">
                                  {key === 'applicationStatus' && 'สถานะใบสมัคร'}
                                  {key === 'documentRequired' && 'เอกสารที่ต้องการ'}
                                  {key === 'interviewScheduled' && 'การนัดสัมภาษณ์'}
                                  {key === 'scholarshipAnnouncements' && 'ประกาศทุนการศึกษา'}
                                </p>
                                <p className="text-xs text-secondary-500">
                                  แจ้งเตือนผ่านเบราว์เซอร์
                                </p>
                              </div>
                              <Switch
                                checked={value}
                                onChange={() => handleNotificationChange('push', key)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-sarabun flex items-center">
                          <ShieldCheckIcon className="h-5 w-5 mr-2 text-primary-600" />
                          ความปลอดภัย
                        </CardTitle>
                      </CardHeader>
                      <CardBody className="p-6 space-y-6">
                        {/* Two-Factor Authentication */}
                        <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-secondary-900 font-sarabun">
                              การยืนยันตัวตน 2 ขั้นตอน
                            </h4>
                            <p className="text-xs text-secondary-500">
                              เพิ่มความปลอดภัยให้กับบัญชีของคุณ
                            </p>
                          </div>
                          <Switch
                            checked={securitySettings.twoFactorEnabled}
                            onChange={() => handleSecurityToggle('twoFactorEnabled')}
                          />
                        </div>

                        {/* Email Verification */}
                        <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-secondary-900 font-sarabun flex items-center">
                              ยืนยันอีเมล
                              {securitySettings.emailVerified && (
                                <CheckCircleIcon className="h-4 w-4 text-green-500 ml-2" />
                              )}
                            </h4>
                            <p className="text-xs text-secondary-500">
                              {user?.email}
                            </p>
                          </div>
                          <span className={`text-sm font-medium ${
                            securitySettings.emailVerified ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {securitySettings.emailVerified ? 'ยืนยันแล้ว' : 'รอการยืนยัน'}
                          </span>
                        </div>

                        {/* Phone Verification */}
                        <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-secondary-900 font-sarabun flex items-center">
                              ยืนยันเบอร์โทรศัพท์
                              {securitySettings.phoneVerified && (
                                <CheckCircleIcon className="h-4 w-4 text-green-500 ml-2" />
                              )}
                            </h4>
                            <p className="text-xs text-secondary-500">
                              เพิ่มเบอร์โทรศัพท์เพื่อรับการแจ้งเตือน
                            </p>
                          </div>
                          <Button
                            variant={securitySettings.phoneVerified ? 'outline' : 'primary'}
                            size="sm"
                            className="font-sarabun"
                          >
                            {securitySettings.phoneVerified ? 'จัดการ' : 'เพิ่มเบอร์'}
                          </Button>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Security Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-sarabun">สรุปความปลอดภัย</CardTitle>
                      </CardHeader>
                      <CardBody className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-sm font-medium text-green-900 font-sarabun">
                                เปลี่ยนรหัสผ่านล่าสุด
                              </span>
                            </div>
                            <p className="text-xs text-green-700 mt-1">
                              {new Date(securitySettings.lastPasswordChange).toLocaleDateString('th-TH')}
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <ComputerDesktopIcon className="h-5 w-5 text-blue-500 mr-2" />
                              <span className="text-sm font-medium text-blue-900 font-sarabun">
                                หมดเวลาเซสชัน
                              </span>
                            </div>
                            <p className="text-xs text-blue-700 mt-1">
                              {securitySettings.sessionTimeout} นาที
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-sarabun flex items-center">
                        <CogIcon className="h-5 w-5 mr-2 text-primary-600" />
                        ค่าเริ่มต้น
                      </CardTitle>
                    </CardHeader>
                    <CardBody className="p-6 space-y-6">
                      {/* Language Settings */}
                      <div>
                        <h4 className="text-sm font-medium text-secondary-900 font-sarabun mb-3">
                          ภาษาในระบบ
                        </h4>
                        <select className="w-full max-w-xs px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun">
                          <option value="th">ไทย</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      {/* Theme Settings */}
                      <div>
                        <h4 className="text-sm font-medium text-secondary-900 font-sarabun mb-3">
                          ธีมการแสดงผล
                        </h4>
                        <div className="grid grid-cols-3 gap-3 max-w-md">
                          <button className="p-3 border border-primary-500 bg-primary-50 rounded-lg text-sm font-medium text-primary-700 font-sarabun">
                            สว่าง
                          </button>
                          <button className="p-3 border border-secondary-300 rounded-lg text-sm font-medium text-secondary-700 hover:border-primary-500 hover:bg-primary-50 font-sarabun transition-colors">
                            มืด
                          </button>
                          <button className="p-3 border border-secondary-300 rounded-lg text-sm font-medium text-secondary-700 hover:border-primary-500 hover:bg-primary-50 font-sarabun transition-colors">
                            อัตโนมัติ
                          </button>
                        </div>
                      </div>

                      {/* Time Zone */}
                      <div>
                        <h4 className="text-sm font-medium text-secondary-900 font-sarabun mb-3">
                          เขตเวลา
                        </h4>
                        <select className="w-full max-w-xs px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun">
                          <option value="Asia/Bangkok">เอเชีย/กรุงเทพฯ (GMT+7)</option>
                          <option value="UTC">UTC (GMT+0)</option>
                        </select>
                      </div>

                      {/* Save Button */}
                      <div className="pt-4">
                        <Button
                          variant="primary"
                          className="font-sarabun"
                          onClick={() => toast.success('บันทึกการตั้งค่าเรียบร้อย')}
                        >
                          บันทึกการตั้งค่า
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentSettingsPage; 