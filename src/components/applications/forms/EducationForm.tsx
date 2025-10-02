'use client';

import { useState } from 'react';
import { ApplicationEducationHistory } from '@/types/application';

interface EducationFormProps {
  data?: ApplicationEducationHistory[];
  onSave: (data: ApplicationEducationHistory[]) => Promise<void>;
  onNext?: () => void;
  onBack?: () => void;
}

export default function EducationForm({ data, onSave, onNext, onBack }: EducationFormProps) {
  const [educationHistory, setEducationHistory] = useState<ApplicationEducationHistory[]>(
    data && data.length > 0
      ? data
      : [
          {
            application_id: 0,
            education_level: 'มัธยมศึกษาตอนต้น',
            institution_name: '',
            province: '',
            gpa: 0,
            graduation_year: new Date().getFullYear() - 3,
          },
          {
            application_id: 0,
            education_level: 'มัธยมศึกษาตอนปลาย',
            institution_name: '',
            province: '',
            gpa: 0,
            graduation_year: new Date().getFullYear(),
          },
        ]
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(educationHistory);
      if (onNext) onNext();
    } catch (error) {
      console.error('Failed to save education:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: keyof ApplicationEducationHistory, value: any) => {
    const newHistory = [...educationHistory];
    newHistory[index] = { ...newHistory[index], [field]: value };
    setEducationHistory(newHistory);
  };

  const addEducation = () => {
    setEducationHistory([
      ...educationHistory,
      {
        application_id: 0,
        education_level: '',
        institution_name: '',
        province: '',
        gpa: 0,
        graduation_year: new Date().getFullYear(),
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationHistory(educationHistory.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">ประวัติการศึกษา</h2>
          <button
            type="button"
            onClick={addEducation}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + เพิ่มประวัติการศึกษา
          </button>
        </div>

        {educationHistory.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-md font-medium">ประวัติการศึกษาที่ {index + 1}</h3>
              {educationHistory.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ลบ
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ระดับการศึกษา <span className="text-red-500">*</span>
                </label>
                <select
                  value={edu.education_level || ''}
                  onChange={(e) => handleChange(index, 'education_level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">เลือกระดับ</option>
                  <option value="ประถมศึกษา">ประถมศึกษา</option>
                  <option value="มัธยมศึกษาตอนต้น">มัธยมศึกษาตอนต้น</option>
                  <option value="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย</option>
                  <option value="ปวช.">ปวช.</option>
                  <option value="ปวส.">ปวส.</option>
                  <option value="ปริญญาตรี">ปริญญาตรี</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อสถานศึกษา <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={edu.institution_name || ''}
                  onChange={(e) => handleChange(index, 'institution_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  จังหวัด <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={edu.province || ''}
                  onChange={(e) => handleChange(index, 'province', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เกรดเฉลี่ย <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={edu.gpa || ''}
                  onChange={(e) => handleChange(index, 'gpa', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ปีที่จบการศึกษา <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1950"
                  max={new Date().getFullYear() + 10}
                  value={edu.graduation_year || ''}
                  onChange={(e) => handleChange(index, 'graduation_year', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">หลักสูตร</label>
                <input
                  type="text"
                  value={edu.major || ''}
                  onChange={(e) => handleChange(index, 'major', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="เช่น วิทย์-คณิต, ศิลป์-ภาษา"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ย้อนกลับ
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 ml-auto"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกและดำเนินการต่อ'}
        </button>
      </div>
    </form>
  );
}
