'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface RegistrationForm {
  studentId: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  faculty: string;
  department: string;
  yearLevel: number;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

const FACULTIES = [
  { value: 'medicine', label: 'คณะแพทยศาสตร์' },
  { value: 'nursing', label: 'คณะพยาบาลศาสตร์' },
  { value: 'pharmacy', label: 'คณะเภสัชศาสตร์' },
  { value: 'dentistry', label: 'คณะทันตแพทยศาสตร์' },
  { value: 'public-health', label: 'คณะสาธารณสุขศาสตร์' },
  { value: 'science', label: 'คณะวิทยาศาสตร์' },
  { value: 'engineering', label: 'คณะวิศวกรรมศาสตร์' },
  { value: 'liberal-arts', label: 'คณะศิลปศาสตร์' },
  { value: 'social-sciences', label: 'คณะสังคมศาสตร์และมนุษยศาสตร์' },
  { value: 'environment', label: 'คณะสิ่งแวดล้อมและทรัพยากรศาสตร์' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [form, setForm] = useState<RegistrationForm>({
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    faculty: '',
    department: '',
    yearLevel: 1,
  });

  const [errors, setErrors] = useState<Partial<RegistrationForm>>({});

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('ต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('ต้องมีตัวเลขอย่างน้อย 1 ตัว');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว');
    }

    return {
      score,
      feedback,
      isValid: score >= 4,
    };
  };

  const passwordStrength = checkPasswordStrength(form.password);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<RegistrationForm> = {};

    if (step === 1) {
      // Personal Information
      if (!form.firstName.trim()) {
        newErrors.firstName = 'กรุณากรอกชื่อ';
      }
      if (!form.lastName.trim()) {
        newErrors.lastName = 'กรุณากรอกนามสกุล';
      }
      if (!form.studentId.trim()) {
        newErrors.studentId = 'กรุณากรอกรหัสนักศึกษา';
      } else if (!/^\d{8}$/.test(form.studentId)) {
        newErrors.studentId = 'รหัสนักศึกษาต้องเป็นตัวเลข 8 หลัก';
      }
    }

    if (step === 2) {
      // Academic Information
      if (!form.faculty) {
        newErrors.faculty = 'กรุณาเลือกคณะ';
      }
      if (!form.department.trim()) {
        newErrors.department = 'กรุณากรอกสาขาวิชา';
      }
      if (form.yearLevel < 1 || form.yearLevel > 8) {
        newErrors.yearLevel = 'กรุณาเลือกชั้นปี';
      }
    }

    if (step === 3) {
      // Account Information
      if (!form.email.trim()) {
        newErrors.email = 'กรุณากรอกอีเมล';
      } else if (!form.email.endsWith('@student.mahidol.ac.th')) {
        newErrors.email = 'กรุณาใช้อีเมลของมหาวิทยาลัย (@student.mahidol.ac.th)';
      }
      
      if (!form.password) {
        newErrors.password = 'กรุณากรอกรหัสผ่าน';
      } else if (!passwordStrength.isValid) {
        newErrors.password = 'รหัสผ่านไม่เพียงพอ';
      }
      
      if (!form.confirmPassword) {
        newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/auth/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: form.studentId,
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          faculty: form.faculty,
          department: form.department,
          year_level: form.yearLevel,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี');
        router.push('/login?message=registration-success');
      } else {
        toast.error(data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลส่วนตัว</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="กรอกชื่อ"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="กรอกนามสกุล"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          รหัสนักศึกษา <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.studentId ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="เช่น 12345678"
          maxLength={8}
        />
        {errors.studentId && (
          <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          เบอร์โทรศัพท์
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="เช่น 0812345678"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลการศึกษา</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              คณะ <span className="text-red-500">*</span>
            </label>
            <select
              value={form.faculty}
              onChange={(e) => setForm({ ...form, faculty: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.faculty ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">เลือกคณะ</option>
              {FACULTIES.map((faculty) => (
                <option key={faculty.value} value={faculty.value}>
                  {faculty.label}
                </option>
              ))}
            </select>
            {errors.faculty && (
              <p className="mt-1 text-sm text-red-600">{errors.faculty}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สาขาวิชา <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.department ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="เช่น แพทยศาสตร์"
            />
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชั้นปี <span className="text-red-500">*</span>
            </label>
            <select
              value={form.yearLevel}
              onChange={(e) => setForm({ ...form, yearLevel: parseInt(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.yearLevel ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value={0}>เลือกชั้นปี</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((year) => (
                <option key={year} value={year}>
                  ปีที่ {year}
                </option>
              ))}
            </select>
            {errors.yearLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.yearLevel}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลบัญชี</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมลมหาวิทยาลัย <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.name@student.mahidol.ac.th"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="กรอกรหัสผ่าน"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            
            {form.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 w-6 rounded ${
                          level <= passwordStrength.score
                            ? passwordStrength.score <= 2
                              ? 'bg-red-500'
                              : passwordStrength.score <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    {passwordStrength.score <= 2 ? 'อ่อน' : passwordStrength.score <= 3 ? 'ปานกลาง' : 'แข็งแรง'}
                  </span>
                </div>
                
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <XCircleIcon className="h-3 w-3 text-red-500" />
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            
            {form.confirmPassword && form.password === form.confirmPassword && (
              <div className="mt-1 flex items-center space-x-1">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">รหัสผ่านตรงกัน</span>
              </div>
            )}
            
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ลงทะเบียนบัญชีนักศึกษา</h1>
          <p className="text-gray-600">สร้างบัญชีเพื่อสมัครทุนการศึกษา</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">ขั้นตอนที่ {currentStep} จาก 3</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    ย้อนกลับ
                  </button>
                )}
              </div>

              <div>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    ถัดไป
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}