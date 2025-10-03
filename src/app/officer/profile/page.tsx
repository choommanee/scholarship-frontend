'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface OfficerProfile {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  dateOfBirth: string;

  // Work Information
  department: string;
  position: string;
  hireDate: string;
  yearsOfService: number;

  // System Information
  avatar?: string;
  lastLogin?: string;
  memberSince: string;

  // Statistics
  totalApplicationsReviewed: number;
  totalApproved: number;
  totalRejected: number;
  totalScholarshipsManaged: number;
  totalBudgetManaged: number;
}

export default function OfficerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState<OfficerProfile>({
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    email: 'somchai.jaidee@university.ac.th',
    phone: '081-234-5678',
    employeeId: 'EMP-2024-001',
    dateOfBirth: '1985-05-15',
    department: 'งานทุนการศึกษา',
    position: 'เจ้าหน้าที่บริหารทุนการศึกษา',
    hireDate: '2020-01-01',
    yearsOfService: 4,
    memberSince: '2020-01-01',
    lastLogin: new Date().toISOString(),
    totalApplicationsReviewed: 245,
    totalApproved: 180,
    totalRejected: 65,
    totalScholarshipsManaged: 15,
    totalBudgetManaged: 5000000
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      // TODO: Call API to load profile
      // const response = await officerService.getProfile();
      // setProfile(response.data);

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to save profile
      // await officerService.updateProfile(editedProfile);

      setProfile(editedProfile);
      setIsEditing(false);
      alert('บันทึกข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const approvalRate = profile.totalApplicationsReviewed > 0
    ? ((profile.totalApproved / profile.totalApplicationsReviewed) * 100).toFixed(1)
    : '0';

  if (isLoading) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-sarabun mb-2">
              ข้อมูลส่วนตัว
            </h1>
            <p className="text-gray-600 font-sarabun">
              ข้อมูลส่วนตัวและสถิติการทำงาน
            </p>
          </div>
          {!isEditing ? (
            <Button
              variant="primary"
              onClick={() => {
                setEditedProfile(profile);
                setIsEditing(true);
              }}
              className="font-sarabun"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              แก้ไขข้อมูล
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="font-sarabun"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
                className="font-sarabun"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:bg-gray-50">
                      <CameraIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-sarabun mt-4">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-gray-600 font-sarabun">{profile.position}</p>
                <p className="text-sm text-gray-500 font-sarabun mt-1">
                  {profile.employeeId}
                </p>
              </div>

              {/* Quick Info */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 font-sarabun">{profile.department}</span>
                </div>
                <div className="flex items-center text-sm">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 font-sarabun">{profile.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 font-sarabun">{profile.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 font-sarabun">
                    อายุ {calculateAge(profile.dateOfBirth)} ปี
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 font-sarabun">
                    อายุงาน {profile.yearsOfService} ปี
                  </span>
                </div>
              </div>

              {/* Last Login */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-sarabun">เข้าสู่ระบบล่าสุด</span>
                  <span className="font-sarabun">
                    {profile.lastLogin && new Date(profile.lastLogin).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Details and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun">ข้อมูลส่วนตัว</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                    ชื่อ
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editedProfile.firstName : profile.firstName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                    นามสกุล
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editedProfile.lastName : profile.lastName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={isEditing ? editedProfile.email : profile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    value={isEditing ? editedProfile.phone : profile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                    วันเกิด
                  </label>
                  <input
                    type="date"
                    value={isEditing ? editedProfile.dateOfBirth : profile.dateOfBirth}
                    onChange={(e) => setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                    รหัสพนักงาน
                  </label>
                  <input
                    type="text"
                    value={profile.employeeId}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md font-sarabun bg-gray-50"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Work Information */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun">ข้อมูลการทำงาน</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                    หน่วยงาน
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editedProfile.department : profile.department}
                    onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                    ตำแหน่ง
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editedProfile.position : profile.position}
                    onChange={(e) => setEditedProfile({ ...editedProfile, position: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                    วันที่เริ่มงาน
                  </label>
                  <input
                    type="text"
                    value={new Date(profile.hireDate).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md font-sarabun bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                    อายุงาน
                  </label>
                  <input
                    type="text"
                    value={`${profile.yearsOfService} ปี`}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md font-sarabun bg-gray-50"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun">สถิติการทำงาน</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-600 font-sarabun mb-1">ใบสมัครที่ตรวจสอบ</p>
                  <p className="text-2xl font-bold text-blue-900 font-sarabun">
                    {profile.totalApplicationsReviewed}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CheckIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-green-600 font-sarabun mb-1">อนุมัติ</p>
                  <p className="text-2xl font-bold text-green-900 font-sarabun">
                    {profile.totalApproved}
                  </p>
                  <p className="text-xs text-green-700 font-sarabun mt-1">
                    {approvalRate}%
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <XMarkIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-sm text-red-600 font-sarabun mb-1">ไม่อนุมัติ</p>
                  <p className="text-2xl font-bold text-red-900 font-sarabun">
                    {profile.totalRejected}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrophyIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-600 font-sarabun mb-1">ทุนที่ดูแล</p>
                  <p className="text-2xl font-bold text-purple-900 font-sarabun">
                    {profile.totalScholarshipsManaged}
                  </p>
                </div>
              </div>

              {/* Budget Managed */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-sarabun mb-2">งบประมาณที่บริหาร</p>
                      <p className="text-3xl font-bold text-orange-900 font-sarabun">
                        {(profile.totalBudgetManaged / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-sm text-orange-700 font-sarabun mt-1">บาท</p>
                    </div>
                    <ChartBarIcon className="h-16 w-16 text-orange-400 opacity-50" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
