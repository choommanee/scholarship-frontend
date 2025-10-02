'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  AcademicCapIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface StudentProfile {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  
  // Academic Information
  faculty: string;
  department: string;
  yearLevel: number;
  gpa: number;
  admissionYear: number;
  graduationYear: number;
  
  // System Information
  avatar?: string;
  lastLogin?: string;
  memberSince: string;
  totalApplications: number;
  approvedApplications: number;
}

const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState<StudentProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentId: '',
    dateOfBirth: '',
    nationality: 'ไทย',
    address: '',
    faculty: '',
    department: '',
    yearLevel: 1,
    gpa: 0.00,
    admissionYear: 2024,
    graduationYear: 2028,
    memberSince: '2024-01-01',
    totalApplications: 0,
    approvedApplications: 0,
  });

  const [editedProfile, setEditedProfile] = useState<StudentProfile>(profile);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      
      // Load user information first (for personal data)
      let userProfile: any = null;
      try {
        const userResponse = await fetch('/api/v1/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          userProfile = userData.data;
        }
      } catch (userError) {
        console.log('User profile API not available');
      }

      // Load student-specific information
      let studentData: any = null;
      try {
        const studentResponse = await fetch('/api/v1/student/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (studentResponse.ok) {
          const data = await studentResponse.json();
          studentData = data.data;
        } else if (studentResponse.status === 404) {
          // Student profile doesn't exist yet, this is okay
          console.log('Student profile not found, will create new one');
        }
      } catch (apiError) {
        console.log('Student profile API not available');
      }

      // Load application history for statistics
      let applicationStats = { totalApplications: 0, approvedApplications: 0 };
      try {
        const historyResponse = await fetch('/api/v1/student/application-history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          console.log('Application history loaded:', historyData);
          applicationStats.totalApplications = historyData.data?.length || 0;
          applicationStats.approvedApplications = historyData.data?.filter((app: any) => 
            app.application_status === 'approved' || app.allocation_status === 'allocated'
          ).length || 0;
        } else {
          console.log('Application history response not ok:', historyResponse.status);
        }
      } catch (historyError) {
        console.log('Application history API not available:', historyError);
      }

      // Combine all data
      const combinedProfile = {
        // Personal information from user profile or fallback to auth user
        firstName: userProfile?.first_name || user?.first_name || user?.firstName || '',
        lastName: userProfile?.last_name || user?.last_name || user?.lastName || '',
        email: userProfile?.email || user?.email || '',
        phone: userProfile?.phone || '',
        dateOfBirth: userProfile?.date_of_birth || '',
        nationality: 'ไทย', // Default
        address: userProfile?.address || '',
        
        // Academic information from student profile
        studentId: studentData?.student_id || '',
        faculty: studentData?.faculty_code || '',
        department: studentData?.department_code || '',
        yearLevel: studentData?.year_level || 1,
        gpa: studentData?.gpa || 0.00,
        admissionYear: studentData?.admission_year || new Date().getFullYear(),
        graduationYear: studentData?.graduation_year || new Date().getFullYear() + 4,
        
        // System information
        avatar: user?.profileImage || userProfile?.avatar_url,
        memberSince: userProfile?.created_at?.split('T')[0] || user?.createdAt?.split('T')[0] || '2024-01-01',
        totalApplications: applicationStats.totalApplications,
        approvedApplications: applicationStats.approvedApplications,
      };

      setProfile(combinedProfile);
      setEditedProfile(combinedProfile);
      
      console.log('Final combined profile:', {
        userProfile,
        studentData,
        applicationStats,
        user: user ? { id: user.id, email: user.email } : null
      });

    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to user data from context
      if (user) {
        const fallbackProfile = {
          firstName: user.first_name || user.firstName || '',
          lastName: user.last_name || user.lastName || '',
          email: user.email || '',
          phone: '',
          studentId: '',
          dateOfBirth: '',
          nationality: 'ไทย',
          address: '',
          faculty: '',
          department: '',
          yearLevel: 1,
          gpa: 0.00,
          admissionYear: new Date().getFullYear(),
          graduationYear: new Date().getFullYear() + 4,
          avatar: user.profileImage,
          memberSince: '2024-01-01',
          totalApplications: 0,
          approvedApplications: 0,
        };
        setProfile(fallbackProfile);
        setEditedProfile(fallbackProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!editedProfile.firstName || !editedProfile.lastName || !editedProfile.email) {
        toast.error('กรุณากรอกข้อมูลที่จำเป็น');
        return;
      }

      // Validate required fields for student profile
      if (editedProfile.studentId && editedProfile.faculty && editedProfile.department) {
        // Validate student ID format (should be numbers)
        if (!/^\d+$/.test(editedProfile.studentId)) {
          toast.error('รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น');
          return;
        }

        // Validate GPA range
        if (editedProfile.gpa < 0 || editedProfile.gpa > 4) {
          toast.error('เกรดเฉลีย์ต้องอยู่ระหว่าง 0.00 - 4.00');
          return;
        }

        // Validate year level
        if (editedProfile.yearLevel < 1 || editedProfile.yearLevel > 8) {
          toast.error('ชั้นปีต้องอยู่ระหว่าง 1 - 8');
          return;
        }

        // Validate graduation year should be after admission year
        if (editedProfile.graduationYear <= editedProfile.admissionYear) {
          toast.error('ปีที่คาดว่าจะจบต้องมากกว่าปีที่เข้าศึกษา');
          return;
        }
      }

      let success = false;

      // Update user profile (personal information)
      try {
        const userProfileData = {
          first_name: editedProfile.firstName,
          last_name: editedProfile.lastName,
          phone: editedProfile.phone,
          avatar_url: editedProfile.avatar,
        };

        const userResponse = await fetch('/api/v1/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(userProfileData),
        });

        if (userResponse.ok) {
          console.log('User profile updated successfully');
          success = true;
        } else {
          console.log('User profile update failed');
        }
      } catch (userError) {
        console.log('User profile API not available');
      }

      // Update student profile (academic information)
      if (editedProfile.studentId && 
          (editedProfile.faculty || editedProfile.department || 
           editedProfile.yearLevel || editedProfile.gpa)) {
        
        try {
          const studentProfileData = {
            student_id: editedProfile.studentId,
            faculty_code: editedProfile.faculty,
            department_code: editedProfile.department,
            year_level: editedProfile.yearLevel,
            gpa: editedProfile.gpa,
            admission_year: editedProfile.admissionYear,
            graduation_year: editedProfile.graduationYear,
          };

          const studentResponse = await fetch('/api/v1/student/profile', {
            method: 'POST', // API uses POST for both create and update
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(studentProfileData),
          });

          if (studentResponse.ok) {
            console.log('Student profile updated successfully');
            success = true;
          } else {
            const error = await studentResponse.json();
            console.log('Student profile update failed:', error);
            if (studentResponse.status === 400 && error.error) {
              toast.error(`ข้อผิดพลาด: ${error.error}`);
              return;
            }
          }
        } catch (studentError) {
          console.log('Student profile API not available:', studentError);
        }
      }

      if (success) {
        setProfile(editedProfile);
        setIsEditing(false);
        toast.success('บันทึกข้อมูลเรียบร้อย');
        
        // Reload profile data to get fresh data from server
        await loadProfile();
      } else {
        // Fallback: save locally
        setProfile(editedProfile);
        setIsEditing(false);
        toast.success('บันทึกข้อมูลเรียบร้อย (บันทึกในเครื่อง)');
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof StudentProfile, value: string | number) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const facultyOptions = [
    { value: 'ENG', label: 'คณะวิศวกรรมศาสตร์' },
    { value: 'SCI', label: 'คณะวิทยาศาสตร์' },
    { value: 'MED', label: 'คณะแพทยศาสตร์' },
    { value: 'DENT', label: 'คณะทันตแพทยศาสตร์' },
    { value: 'PHARM', label: 'คณะเภสัชศาสตร์' },
    { value: 'NURSE', label: 'คณะพยาบาลศาสตร์' },
    { value: 'PUB', label: 'คณะสาธารณสุขศาสตร์' },
    { value: 'VET', label: 'คณะสัตวแพทยศาสตร์' },
    { value: 'TROP', label: 'คณะเขตร้อน' },
    { value: 'ENV', label: 'คณะสิ่งแวดล้อมและทรัพยากรศาสตร์' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-sarabun">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                    ข้อมูลส่วนตัว
                  </h1>
                  <p className="text-secondary-600 font-sarabun">
                    จัดการข้อมูลส่วนตัวและข้อมูลการศึกษาของคุณ
                  </p>
                </div>
                <div className="flex space-x-3">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="font-sarabun"
                      >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        ยกเลิก
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSave}
                        loading={isSaving}
                        className="font-sarabun"
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setIsEditing(true)}
                      className="font-sarabun"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      แก้ไขข้อมูล
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <div className="lg:col-span-1">
                <Card>
                  <CardBody className="p-6 text-center">
                    <div className="relative inline-block mb-6">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          className="h-32 w-32 rounded-full border-4 border-primary-200 mx-auto"
                        />
                      ) : (
                        <div className="h-32 w-32 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto">
                          <UserCircleIcon className="h-20 w-20 text-white" />
                        </div>
                      )}
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                          <CameraIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-secondary-900 font-sarabun mb-2">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-secondary-600 font-sarabun mb-4">นักศึกษา</p>
                    
                    <div className="space-y-3 text-sm text-secondary-600">
                      <div className="flex items-center justify-center space-x-2">
                        <IdentificationIcon className="h-4 w-4" />
                        <span>{profile.studentId || 'ไม่ระบุ'}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CalendarDaysIcon className="h-4 w-4" />
                        <span>สมาชิกตั้งแต่ {new Date(profile.memberSince).toLocaleDateString('th-TH')}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 pt-6 border-t border-secondary-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary-600">{profile.totalApplications}</p>
                          <p className="text-xs text-secondary-500 font-sarabun">ใบสมัครทั้งหมด</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-success-600">{profile.approvedApplications}</p>
                          <p className="text-xs text-secondary-500 font-sarabun">ได้รับการอนุมัติ</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-sarabun">ข้อมูลส่วนตัว</CardTitle>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          ชื่อ <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="กรอกชื่อ"
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">{profile.firstName || '-'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          นามสกุล <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="กรอกนามสกุล"
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">{profile.lastName || '-'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          รหัสนักศึกษา
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.studentId}
                            onChange={(e) => handleInputChange('studentId', e.target.value)}
                            placeholder="กรอกรหัสนักศึกษา"
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">{profile.studentId || '-'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          อีเมล <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={editedProfile.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="กรอกอีเมล"
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">{profile.email || '-'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          เบอร์โทรศัพท์
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="กรอกเบอร์โทรศัพท์"
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">{profile.phone || '-'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          วันเกิด
                        </label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editedProfile.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">
                            {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('th-TH') : '-'}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          ที่อยู่
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editedProfile.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="กรอกที่อยู่"
                            rows={3}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">{profile.address || '-'}</p>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Academic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-sarabun flex items-center">
                      <AcademicCapIcon className="h-5 w-5 mr-2 text-primary-600" />
                      ข้อมูลการศึกษา
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          คณะ
                        </label>
                        {isEditing ? (
                          <select
                            value={editedProfile.faculty}
                            onChange={(e) => handleInputChange('faculty', e.target.value)}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                          >
                            <option value="">เลือกคณะ</option>
                            {facultyOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-secondary-900 py-2">
                            {facultyOptions.find(f => f.value === profile.faculty)?.label || profile.faculty || '-'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          สาขาวิชา
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            placeholder="กรอกสาขาวิชา"
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">{profile.department || '-'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          ชั้นปี
                        </label>
                        {isEditing ? (
                          <select
                            value={editedProfile.yearLevel}
                            onChange={(e) => handleInputChange('yearLevel', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                          >
                            <option value={1}>ปี 1</option>
                            <option value={2}>ปี 2</option>
                            <option value={3}>ปี 3</option>
                            <option value={4}>ปี 4</option>
                            <option value={5}>ปี 5</option>
                            <option value={6}>ปี 6</option>
                          </select>
                        ) : (
                          <p className="text-secondary-900 py-2">ปี {profile.yearLevel}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          เกรดเฉลีย์
                        </label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            value={editedProfile.gpa}
                            onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">{profile.gpa.toFixed(2)}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          ปีที่เข้าศึกษา
                        </label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedProfile.admissionYear}
                            onChange={(e) => handleInputChange('admissionYear', parseInt(e.target.value) || 2024)}
                            placeholder="2024"
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">{profile.admissionYear}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                          ปีที่คาดว่าจะจบ
                        </label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedProfile.graduationYear}
                            onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value) || 2028)}
                            placeholder="2028"
                          />
                        ) : (
                          <p className="text-secondary-900 py-2">{profile.graduationYear}</p>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProfilePage; 