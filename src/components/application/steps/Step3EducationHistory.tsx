'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PlusIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export interface EducationRecord {
  id: string;
  level: string;
  school_name: string;
  province: string;
  gpa: string;
  graduation_year: string;
}

export interface EducationHistoryData {
  education_records: EducationRecord[];
}

export interface Step3EducationHistoryProps {
  data: EducationHistoryData;
  onChange: (records: EducationRecord[]) => void;
  errors: Record<string, string>;
}

const educationLevelOptions = [
  { value: 'primary', label: 'ประถมศึกษา' },
  { value: 'junior_high', label: 'มัธยมศึกษาตอนต้น' },
  { value: 'senior_high', label: 'มัธยมศึกษาตอนปลาย' },
  { value: 'vocational_cert', label: 'ประกาศนียบัตรวิชาชีพ (ปวช.)' },
  { value: 'vocational_diploma', label: 'ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)' },
  { value: 'bachelor', label: 'ปริญญาตรี' },
  { value: 'other', label: 'อื่นๆ' }
];

export function Step3EducationHistory({ data, onChange, errors }: Step3EducationHistoryProps) {
  const addEducationRecord = () => {
    const newRecord: EducationRecord = {
      id: Date.now().toString(),
      level: '',
      school_name: '',
      province: '',
      gpa: '',
      graduation_year: ''
    };
    onChange([...data.education_records, newRecord]);
  };

  const removeEducationRecord = (id: string) => {
    if (data.education_records.length <= 1) {
      alert('ต้องมีประวัติการศึกษาอย่างน้อย 1 รายการ');
      return;
    }
    onChange(data.education_records.filter(record => record.id !== id));
  };

  const updateEducationRecord = (id: string, field: keyof EducationRecord, value: string) => {
    onChange(
      data.education_records.map(record =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  // Initialize with at least one record
  React.useEffect(() => {
    if (data.education_records.length === 0) {
      addEducationRecord();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AcademicCapIcon className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">ประวัติการศึกษา</h3>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={addEducationRecord}
          leftIcon={<PlusIcon className="h-4 w-4" />}
        >
          เพิ่มประวัติการศึกษา
        </Button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        กรุณากรอกประวัติการศึกษาของท่าน เริ่มจากระดับมัธยมศึกษาขึ้นไป (หรือเทียบเท่า)
      </p>

      {data.education_records.map((record, index) => (
        <Card key={record.id}>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">
                การศึกษาที่ {index + 1}
              </h4>
              {data.education_records.length > 1 && (
                <button
                  onClick={() => removeEducationRecord(record.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="ลบรายการ"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ระดับการศึกษา <span className="text-red-500">*</span>
                </label>
                <Select
                  value={record.level}
                  onChange={(e) => updateEducationRecord(record.id, 'level', e.target.value)}
                  options={educationLevelOptions}
                  placeholder="เลือกระดับการศึกษา"
                  error={errors[`education_records.${index}.level`]}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="ชื่อสถาบันการศึกษา"
                  type="text"
                  value={record.school_name}
                  onChange={(e) => updateEducationRecord(record.id, 'school_name', e.target.value)}
                  placeholder="เช่น โรงเรียนมหิดลวิทยานุสรณ์"
                  error={errors[`education_records.${index}.school_name`]}
                  required
                />
              </div>

              <Input
                label="จังหวัด"
                type="text"
                value={record.province}
                onChange={(e) => updateEducationRecord(record.id, 'province', e.target.value)}
                placeholder="เช่น นครปฐม"
                error={errors[`education_records.${index}.province`]}
                required
              />

              <Input
                label="เกรดเฉลี่ย (GPA)"
                type="text"
                value={record.gpa}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow numbers and one decimal point
                  if (/^\d*\.?\d*$/.test(value) || value === '') {
                    const numValue = parseFloat(value);
                    if (value === '' || (numValue >= 0 && numValue <= 4)) {
                      updateEducationRecord(record.id, 'gpa', value);
                    }
                  }
                }}
                placeholder="0.00 - 4.00"
                error={errors[`education_records.${index}.gpa`]}
                helperText="ระบุเป็นทศนิยม 2 ตำแหน่ง"
                required
              />

              <Input
                label="ปีที่จบการศึกษา (พ.ศ.)"
                type="text"
                value={record.graduation_year}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  updateEducationRecord(record.id, 'graduation_year', value);
                }}
                placeholder="2567"
                maxLength={4}
                error={errors[`education_records.${index}.graduation_year`]}
                required
              />
            </div>
          </CardBody>
        </Card>
      ))}

      {/* Helper Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">คำแนะนำ</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>กรุณากรอกประวัติการศึกษาตั้งแต่ระดับมัธยมศึกษาขึ้นไป หรือเทียบเท่า</li>
                <li>ระบุเกรดเฉลี่ยในระบบ 4.00 (หากเป็นระบบอื่น กรุณาแปลงเป็นระบบ 4.00)</li>
                <li>สามารถเพิ่มประวัติการศึกษาได้หลายรายการ กรณีที่มีการศึกษาหลายระดับ</li>
                <li>กรุณาตรวจสอบข้อมูลให้ถูกต้อง เนื่องจากจะใช้ในการพิจารณาทุนการศึกษา</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
