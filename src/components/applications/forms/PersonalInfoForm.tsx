'use client';

import { useState } from 'react';
import { ApplicationPersonalInfo } from '@/types/application';

interface PersonalInfoFormProps {
  data?: ApplicationPersonalInfo;
  onSave: (data: ApplicationPersonalInfo) => Promise<void>;
  onNext?: () => void;
}

export default function PersonalInfoForm({ data, onSave, onNext }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<ApplicationPersonalInfo>(data || {
    application_id: 0,
    prefix_th: '',
    first_name_th: '',
    last_name_th: '',
    prefix_en: '',
    first_name_en: '',
    last_name_en: '',
    email: '',
    phone: '',
    line_id: '',
    national_id: '',
    student_id: '',
    faculty: '',
    department: '',
    year_level: 1,
    gpa: 0,
    admission_type: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prefix_th) newErrors.prefix_th = 'กรุณาเลือกคำนำหน้า';
    if (!formData.first_name_th) newErrors.first_name_th = 'กรุณากรอกชื่อ';
    if (!formData.last_name_th) newErrors.last_name_th = 'กรุณากรอกนามสกุล';
    if (!formData.email) newErrors.email = 'กรุณากรอกอีเมล';
    if (!formData.phone) newErrors.phone = 'กรุณากรอกเบอร์โทร';
    if (!formData.student_id) newErrors.student_id = 'กรุณากรอกรหัสนักศึกษา';
    if (!formData.faculty) newErrors.faculty = 'กรุณากรอกคณะ';
    if (!formData.year_level) newErrors.year_level = 'กรุณาเลือกชั้นปี';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error('Failed to save personal info:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ApplicationPersonalInfo, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">ข้อมูลส่วนตัว</h2>

        {/* คำนำหน้า ชื่อ นามสกุล (ภาษาไทย) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              คำนำหน้า (ไทย) <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.prefix_th || ''}
              onChange={(e) => handleChange('prefix_th', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.prefix_th ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">เลือก</option>
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>
            </select>
            {errors.prefix_th && <p className="text-red-500 text-xs mt-1">{errors.prefix_th}</p>}
          </div>

          <div className="md:col-span-1.5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ (ไทย) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.first_name_th || ''}
              onChange={(e) => handleChange('first_name_th', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.first_name_th ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.first_name_th && <p className="text-red-500 text-xs mt-1">{errors.first_name_th}</p>}
          </div>

          <div className="md:col-span-1.5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              นามสกุล (ไทย) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.last_name_th || ''}
              onChange={(e) => handleChange('last_name_th', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.last_name_th ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.last_name_th && <p className="text-red-500 text-xs mt-1">{errors.last_name_th}</p>}
          </div>
        </div>

        {/* คำนำหน้า ชื่อ นามสกุล (ภาษาอังกฤษ) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              คำนำหน้า (อังกฤษ)
            </label>
            <select
              value={formData.prefix_en || ''}
              onChange={(e) => handleChange('prefix_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Miss">Miss</option>
            </select>
          </div>

          <div className="md:col-span-1.5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ (อังกฤษ)
            </label>
            <input
              type="text"
              value={formData.first_name_en || ''}
              onChange={(e) => handleChange('first_name_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="md:col-span-1.5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              นามสกุล (อังกฤษ)
            </label>
            <input
              type="text"
              value={formData.last_name_en || ''}
              onChange={(e) => handleChange('last_name_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* ข้อมูลติดต่อ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="08XXXXXXXX"
              className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line ID
            </label>
            <input
              type="text"
              value={formData.line_id || ''}
              onChange={(e) => handleChange('line_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* ข้อมูลนักศึกษา */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสนักศึกษา <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.student_id || ''}
              onChange={(e) => handleChange('student_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.student_id ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เลขบัตรประชาชน
            </label>
            <input
              type="text"
              value={formData.national_id || ''}
              onChange={(e) => handleChange('national_id', e.target.value)}
              maxLength={13}
              placeholder="1XXXXXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชั้นปี <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.year_level || ''}
              onChange={(e) => handleChange('year_level', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md ${errors.year_level ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">เลือกชั้นปี</option>
              <option value="1">ปี 1</option>
              <option value="2">ปี 2</option>
              <option value="3">ปี 3</option>
              <option value="4">ปี 4</option>
            </select>
            {errors.year_level && <p className="text-red-500 text-xs mt-1">{errors.year_level}</p>}
          </div>
        </div>

        {/* คณะ/สาขา */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              คณะ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.faculty || ''}
              onChange={(e) => handleChange('faculty', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.faculty ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.faculty && <p className="text-red-500 text-xs mt-1">{errors.faculty}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สาขาวิชา
            </label>
            <input
              type="text"
              value={formData.department || ''}
              onChange={(e) => handleChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* ข้อมูลการศึกษา */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เกรดเฉลี่ยสะสม (GPA)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={formData.gpa || ''}
              onChange={(e) => handleChange('gpa', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รอบการเข้าศึกษา
            </label>
            <select
              value={formData.admission_type || ''}
              onChange={(e) => handleChange('admission_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">เลือกรอบ</option>
              <option value="portfolio">Portfolio</option>
              <option value="quota">โควตา</option>
              <option value="admission">Admission</option>
              <option value="direct">รับตรง</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกและดำเนินการต่อ'}
        </button>
      </div>
    </form>
  );
}
