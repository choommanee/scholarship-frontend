'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/utils/api';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  LockClosedIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AdminProfile {
  user_id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  is_active: boolean;
  sso_provider?: string | null;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
  roles: Array<{
    role_id: number;
    role_name: string;
    role_description: string;
    assigned_at: string;
  }>;
}

const AdminProfilePage: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Action loading states
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: AdminProfile }>('/admin/profile');
      setProfile(response.data);
      setEditForm({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        phone: response.data.phone || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const response = await apiClient.put<{ success: boolean; data: AdminProfile }>('/admin/profile', editForm);
      setProfile(response.data);
      setEditMode(false);
      toast.success('อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('ไม่สามารถอัปเดตข้อมูลได้');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast.error('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    setPasswordLoading(true);

    try {
      await apiClient.put('/admin/profile/password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });

      setPasswordMode(false);
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      toast.success('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('ไม่สามารถเปลี่ยนรหัสผ่านได้');
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = () => {
    const firstName = profile?.first_name || profile?.username || '';
    const lastName = profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'AD';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-sarabun">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="p-8 text-center">
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary-900 font-sarabun mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-secondary-600 font-sarabun mb-4">ไม่พบข้อมูลโปรไฟล์</p>
            <Button onClick={loadProfile} variant="primary" className="font-sarabun">
              ลองอีกครั้ง
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <span className="text-2xl font-bold text-white">
                  {getInitials()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold font-sarabun">
                  โปรไฟล์ผู้ดูแลระบบ
                </h1>
                <p className="text-red-100 mt-1 font-sarabun">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <Cog6ToothIcon className="h-12 w-12 text-red-200" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                  <div className="inline-flex p-2 rounded-lg bg-blue-50 mr-3">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  ข้อมูลส่วนตัว
                </CardTitle>
                {!editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(true)}
                    className="font-sarabun"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    แก้ไข
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-6">
              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                        ชื่อ
                      </label>
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                        นามสกุล
                      </label>
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      placeholder="0xx-xxx-xxxx"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={updateLoading}
                      className="font-sarabun flex-1"
                    >
                      {updateLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditMode(false);
                        setEditForm({
                          first_name: profile.first_name || '',
                          last_name: profile.last_name || '',
                          phone: profile.phone || '',
                        });
                      }}
                      className="font-sarabun flex-1"
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-sm text-secondary-500 mb-1 font-sarabun">
                        <UserIcon className="h-4 w-4 mr-1" />
                        ชื่อ
                      </div>
                      <p className="text-secondary-900 font-medium font-sarabun">
                        {profile.first_name || '-'}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-secondary-500 mb-1 font-sarabun">
                        <UserIcon className="h-4 w-4 mr-1" />
                        นามสกุล
                      </div>
                      <p className="text-secondary-900 font-medium font-sarabun">
                        {profile.last_name || '-'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-secondary-500 mb-1 font-sarabun">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      อีเมล
                    </div>
                    <p className="text-secondary-900 font-medium font-sarabun">
                      {profile.email}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-secondary-500 mb-1 font-sarabun">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      เบอร์โทรศัพท์
                    </div>
                    <p className="text-secondary-900 font-medium font-sarabun">
                      {profile.phone || 'ยังไม่ได้ระบุ'}
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Security */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                  <div className="inline-flex p-2 rounded-lg bg-purple-50 mr-3">
                    <LockClosedIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  ความปลอดภัย
                </CardTitle>
                {!passwordMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPasswordMode(true)}
                    className="font-sarabun"
                  >
                    <KeyIcon className="h-4 w-4 mr-1" />
                    เปลี่ยนรหัสผ่าน
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-6">
              {passwordMode ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      รหัสผ่านปัจจุบัน
                    </label>
                    <input
                      type="password"
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      รหัสผ่านใหม่
                    </label>
                    <input
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      required
                      minLength={8}
                    />
                    <p className="mt-1 text-xs text-secondary-500 font-sarabun">
                      รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ยืนยันรหัสผ่านใหม่
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={passwordLoading}
                      className="font-sarabun flex-1"
                    >
                      {passwordLoading ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPasswordMode(false);
                        setPasswordForm({
                          current_password: '',
                          new_password: '',
                          confirm_password: '',
                        });
                      }}
                      className="font-sarabun flex-1"
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex p-4 rounded-full bg-purple-50 mb-4">
                    <KeyIcon className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-secondary-600 font-sarabun">
                    คลิกปุ่ม "เปลี่ยนรหัสผ่าน" เพื่อเปลี่ยนรหัสผ่านของคุณ
                  </p>
                  <p className="text-sm text-secondary-500 mt-2 font-sarabun">
                    แนะนำให้เปลี่ยนรหัสผ่านเป็นประจำทุก 3 เดือน
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Roles Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                บทบาท
              </CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-2">
                {profile.roles && profile.roles.length > 0 ? (
                  profile.roles.map((role) => (
                    <div
                      key={role.role_id}
                      className="flex items-start space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-green-900 font-medium font-sarabun capitalize">
                          {role.role_name === 'admin' ? 'ผู้ดูแลระบบ' : role.role_name}
                        </p>
                        {role.role_description && (
                          <p className="text-sm text-green-700 font-sarabun mt-0.5">
                            {role.role_description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-secondary-500 text-sm font-sarabun">ไม่มีบทบาท</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Account Info */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                ข้อมูลบัญชี
              </CardTitle>
            </CardHeader>
            <CardBody className="p-6 space-y-4">
              <div>
                <div className="flex items-center text-sm text-secondary-500 mb-1 font-sarabun">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  สร้างเมื่อ
                </div>
                <p className="text-secondary-900 font-medium font-sarabun text-sm">
                  {formatDate(profile.created_at)}
                </p>
              </div>
              <div>
                <div className="flex items-center text-sm text-secondary-500 mb-1 font-sarabun">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  อัปเดตล่าสุด
                </div>
                <p className="text-secondary-900 font-medium font-sarabun text-sm">
                  {formatDate(profile.updated_at)}
                </p>
              </div>
              <div>
                <div className="flex items-center text-sm text-secondary-500 mb-1 font-sarabun">
                  <UserIcon className="h-4 w-4 mr-1" />
                  ชื่อผู้ใช้
                </div>
                <p className="text-secondary-900 font-medium font-sarabun text-sm">
                  {profile.username}
                </p>
              </div>
              <div className="pt-4 border-t border-secondary-200">
                <div className="flex items-center text-sm text-secondary-500 mb-1 font-sarabun">
                  <UserIcon className="h-4 w-4 mr-1" />
                  User ID
                </div>
                <p className="text-secondary-900 font-mono text-xs break-all bg-secondary-50 px-2 py-1 rounded">
                  {profile.user_id}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
