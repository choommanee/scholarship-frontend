'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  UserIcon, 
  LockClosedIcon, 
  AcademicCapIcon,
  KeyIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface LoginFormData {
  userType: 'student' | 'officer' | 'interviewer' | 'admin';
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    userType: 'student',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Show token expired message if redirected from expired session
  useEffect(() => {
    console.log(searchParams);
    if (searchParams?.get('expired') === '1') {
      toast.error('เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่');
    }
  }, [searchParams]);

  const userTypes = [
    {
      value: 'student',
      label: 'นักศึกษา',
      description: 'สำหรับนักศึกษาที่ต้องการสมัครทุนการศึกษา',
      icon: AcademicCapIcon,
      placeholder: 'อีเมลนักศึกษา (student@tu.ac.th)',
      color: 'from-blue-600 to-blue-700'
    },
    {
      value: 'officer',
      label: 'เจ้าหน้าที่ทุน',
      description: 'สำหรับเจ้าหน้าที่จัดการและพิจารณาทุนการศึกษา',
      icon: UserIcon,
      placeholder: 'อีเมลเจ้าหน้าที่ (officer@econ.tu.ac.th)',
      color: 'from-green-600 to-green-700'
    },
    {
      value: 'interviewer',
      label: 'ผู้สัมภาษณ์',
      description: 'สำหรับอาจารย์และผู้ทำการสัมภาษณ์นักศึกษา',
      icon: ShieldCheckIcon,
      placeholder: 'อีเมลผู้สัมภาษณ์ (interviewer@econ.tu.ac.th)',
      color: 'from-purple-600 to-purple-700'
    },
    {
      value: 'admin',
      label: 'ผู้ดูแลระบบ',
      description: 'สำหรับผู้ดูแลและจัดการระบบโดยรวม',
      icon: KeyIcon,
      placeholder: 'อีเมลผู้ดูแลระบบ (admin@econ.tu.ac.th)',
      color: 'from-red-600 to-red-700'
    }
  ];

  const selectedUserType = userTypes.find(type => type.value === formData.userType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      toast.error('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    try {
      // Login will automatically redirect via AuthContext
      await login({
        email: formData.email,
        password: formData.password
      });
      
    } catch (err: any) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header with Mahidol-style branding */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold font-sarabun">ทุน</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold font-sarabun">
                  ระบบจัดการทุนการศึกษา
                </h1>
                <p className="text-primary-100 font-inter text-sm">
                  Scholarship Management System
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <BuildingLibraryIcon className="h-8 w-8 text-yellow-300" />
              <div className="text-right">
                <p className="text-sm text-primary-100 font-sarabun">คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์</p>
                <p className="text-xs text-primary-200 font-inter">Faculty of Economics, Thammasat University</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main login content */}
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Welcome message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 font-sarabun">
              เข้าสู่ระบบ
            </h2>
            <p className="text-secondary-600 mt-2 font-sarabun">
              กรุณาเลือกประเภทผู้ใช้งานและกรอกข้อมูลเข้าสู่ระบบ
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center border-b border-secondary-100 bg-gradient-to-r from-primary-50 to-secondary-50">
              <CardTitle className="text-xl font-sarabun text-secondary-900">
                เลือกประเภทผู้ใช้งาน
              </CardTitle>
            </CardHeader>
            
            <CardBody className="space-y-6">
              {/* User type selection with icons */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-4">
                  {userTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.userType === type.value;
                    
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('userType', type.value as any)}
                        className={`
                          flex flex-col items-center transition-all duration-200
                          ${isSelected ? 'transform scale-110' : ''}
                        `}
                        title={type.description}
                      >
                        <div className={`
                          p-4 rounded-full bg-gradient-to-br ${type.color} transition-transform duration-200
                          ${isSelected ? 'ring-4 ring-primary-200' : 'opacity-70 hover:opacity-100'}
                          mb-2 shadow-lg
                        `}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className={`
                          text-sm font-medium font-sarabun transition-colors duration-200 text-center
                          ${isSelected ? 'text-primary-700 font-semibold' : 'text-secondary-600'}
                        `}>
                          {type.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected user type description */}
              {selectedUserType && (
                <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl p-4 border border-secondary-200">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedUserType.color}`}>
                      <selectedUserType.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 font-sarabun">
                        {selectedUserType.label}
                      </h3>
                      <p className="text-sm text-secondary-600 font-sarabun mt-1">
                        {selectedUserType.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email field */}
                <Input
                  label="อีเมล"
                  type="email"
                  placeholder={selectedUserType?.placeholder}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  leftIcon={<UserIcon className="h-5 w-5" />}
                  required
                />

                {/* Password field */}
                <div className="relative">
                  <Input
                    label="รหัสผ่าน"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="กรอกรหัสผ่าน"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    leftIcon={<LockClosedIcon className="h-5 w-5" />}
                    showPasswordToggle
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464l1.414-1.414M9.878 9.878l-1.415 1.414m4.243 4.243L8.464 15.536l1.414 1.414m4.243-4.243l1.414 1.414" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-700 font-sarabun">
                      จดจำการเข้าสู่ระบบ
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-primary-600 hover:text-primary-700 font-sarabun transition-colors"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm font-sarabun">
                    {error}
                  </div>
                )}

                {/* Login button */}
                <Button
                  type="submit"
                  variant="thammasat"
                  size="lg"
                  className="w-full font-sarabun"
                  loading={isLoading}
                  disabled={!formData.email || !formData.password}
                >
                  {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-secondary-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-secondary-500 font-sarabun">หรือ</span>
                  </div>
                </div>

                {/* SSO Login button */}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full font-sarabun"
                  disabled
                >
                  เข้าสู่ระบบด้วย Thammasat SSO
                  <span className="text-xs ml-2 opacity-60">(เร็วๆ นี้)</span>
                </Button>
              </form>

              {/* Test accounts */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="text-sm text-gray-500">
                  <p className="font-medium mb-2 font-sarabun">บัญชีทดสอบ:</p>
                  <div className="space-y-1 font-sarabun">
                    <p>Admin: admin@university.ac.th / password123</p>
                    <p>Officer: officer@university.ac.th / password123</p>
                    <p>Interviewer: interviewer@university.ac.th / password123</p>
                    <p>Student: student1@university.ac.th / password123</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Additional info */}
          <div className="mt-8 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 shadow-lg">
              <h3 className="font-semibold text-secondary-900 mb-3 font-sarabun">
                ต้องการความช่วยเหลือ?
              </h3>
              <div className="space-y-2 text-sm text-secondary-600 font-sarabun">
                <p className="flex items-center justify-center space-x-2">
                  <span>📞</span>
                  <span>โทร: 02-564-3021-9</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span>📧</span>
                  <span>อีเมล: scholarship@econ.tu.ac.th</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span>🕐</span>
                  <span>เวลาทำการ: จันทร์-ศุกร์ 8:30-16:30 น.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-sarabun opacity-80">
            © 2024 คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ | ระบบจัดการทุนการศึกษา
          </p>
          <p className="text-xs text-secondary-400 mt-1 font-inter">
            Faculty of Economics, Thammasat University | Scholarship Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
