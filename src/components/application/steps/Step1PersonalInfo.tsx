'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardBody } from '@/components/ui/Card';

export interface PersonalInfoData {
  prefix_th: string;
  first_name_th: string;
  last_name_th: string;
  prefix_en: string;
  first_name_en: string;
  last_name_en: string;
  citizen_id: string;
  birth_date: string;
  gender: string;
  nationality: string;
  religion: string;
  email: string;
  phone: string;
  line_id: string;
  student_id: string;
  faculty: string;
  department: string;
  major: string;
  year_level: string;
  admission_type: string;
  admission_year: string;
  admission_details: string;
}

export interface Step1PersonalInfoProps {
  data: PersonalInfoData;
  onChange: (field: keyof PersonalInfoData, value: string) => void;
  errors: Record<string, string>;
}

const prefixOptionsTH = [
  { value: 'นาย', label: 'นาย' },
  { value: 'นาง', label: 'นาง' },
  { value: 'นางสาว', label: 'นางสาว' }
];

const prefixOptionsEN = [
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Miss', label: 'Miss' }
];

const genderOptions = [
  { value: 'male', label: 'ชาย' },
  { value: 'female', label: 'หญิง' },
  { value: 'other', label: 'อื่นๆ' }
];

const yearLevelOptions = [
  { value: '1', label: 'ปี 1' },
  { value: '2', label: 'ปี 2' },
  { value: '3', label: 'ปี 3' },
  { value: '4', label: 'ปี 4' },
  { value: '5', label: 'ปี 5' },
  { value: '6', label: 'ปี 6' }
];

const admissionTypeOptions = [
  { value: 'admission', label: 'Admission' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'quota', label: 'โควตา' },
  { value: 'direct', label: 'รับตรง' },
  { value: 'transfer', label: 'ย้ายสถาบัน' },
  { value: 'other', label: 'อื่นๆ' }
];

const nationalityOptions = [
  { value: 'ไทย', label: 'ไทย' },
  { value: 'อื่นๆ', label: 'อื่นๆ' }
];

const religionOptions = [
  { value: 'พุทธ', label: 'พุทธ' },
  { value: 'คริสต์', label: 'คริสต์' },
  { value: 'อิสลาม', label: 'อิสลาม' },
  { value: 'ฮินดู', label: 'ฮินดู' },
  { value: 'ไม่นับถือศาสนา', label: 'ไม่นับถือศาสนา' },
  { value: 'อื่นๆ', label: 'อื่นๆ' }
];

export function Step1PersonalInfo({ data, onChange, errors }: Step1PersonalInfoProps) {
  return (
    <div className="space-y-6">
      {/* ข้อมูลส่วนตัว (ภาษาไทย) */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลส่วนตัว (ภาษาไทย)</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                คำนำหน้า <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.prefix_th}
                onChange={(e) => onChange('prefix_th', e.target.value)}
                options={prefixOptionsTH}
                placeholder="เลือก"
                error={errors.prefix_th}
                required
              />
            </div>

            <div className="md:col-span-5">
              <Input
                label="ชื่อ"
                type="text"
                value={data.first_name_th}
                onChange={(e) => onChange('first_name_th', e.target.value)}
                placeholder="กรอกชื่อภาษาไทย"
                error={errors.first_name_th}
                required
              />
            </div>

            <div className="md:col-span-5">
              <Input
                label="นามสกุล"
                type="text"
                value={data.last_name_th}
                onChange={(e) => onChange('last_name_th', e.target.value)}
                placeholder="กรอกนามสกุลภาษาไทย"
                error={errors.last_name_th}
                required
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ข้อมูลส่วนตัว (ภาษาอังกฤษ) */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลส่วนตัว (ภาษาอังกฤษ)</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.prefix_en}
                onChange={(e) => onChange('prefix_en', e.target.value)}
                options={prefixOptionsEN}
                placeholder="Select"
                error={errors.prefix_en}
                required
              />
            </div>

            <div className="md:col-span-5">
              <Input
                label="First Name"
                type="text"
                value={data.first_name_en}
                onChange={(e) => onChange('first_name_en', e.target.value)}
                placeholder="Enter first name"
                error={errors.first_name_en}
                required
              />
            </div>

            <div className="md:col-span-5">
              <Input
                label="Last Name"
                type="text"
                value={data.last_name_en}
                onChange={(e) => onChange('last_name_en', e.target.value)}
                placeholder="Enter last name"
                error={errors.last_name_en}
                required
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ข้อมูลพื้นฐาน */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="เลขประจำตัวประชาชน"
              type="text"
              value={data.citizen_id}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                onChange('citizen_id', value);
              }}
              placeholder="0000000000000"
              maxLength={13}
              error={errors.citizen_id}
              required
            />

            <Input
              label="วันเดือนปีเกิด"
              type="date"
              value={data.birth_date}
              onChange={(e) => onChange('birth_date', e.target.value)}
              error={errors.birth_date}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เพศ <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.gender}
                onChange={(e) => onChange('gender', e.target.value)}
                options={genderOptions}
                placeholder="เลือกเพศ"
                error={errors.gender}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                สัญชาติ <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.nationality}
                onChange={(e) => onChange('nationality', e.target.value)}
                options={nationalityOptions}
                placeholder="เลือกสัญชาติ"
                error={errors.nationality}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ศาสนา <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.religion}
                onChange={(e) => onChange('religion', e.target.value)}
                options={religionOptions}
                placeholder="เลือกศาสนา"
                error={errors.religion}
                required
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ข้อมูลติดต่อ */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลติดต่อ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="อีเมล"
              type="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="your.name@student.mahidol.ac.th"
              error={errors.email}
              required
            />

            <Input
              label="เบอร์โทรศัพท์"
              type="tel"
              value={data.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                onChange('phone', value);
              }}
              placeholder="0812345678"
              maxLength={10}
              error={errors.phone}
              required
            />

            <Input
              label="Line ID"
              type="text"
              value={data.line_id}
              onChange={(e) => onChange('line_id', e.target.value)}
              placeholder="กรอก Line ID"
              error={errors.line_id}
            />
          </div>
        </CardBody>
      </Card>

      {/* ข้อมูลการศึกษา */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลการศึกษา</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="รหัสนักศึกษา"
              type="text"
              value={data.student_id}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                onChange('student_id', value);
              }}
              placeholder="6412345678"
              maxLength={10}
              error={errors.student_id}
              required
            />

            <Input
              label="คณะ"
              type="text"
              value={data.faculty}
              onChange={(e) => onChange('faculty', e.target.value)}
              placeholder="เช่น คณะวิทยาศาสตร์"
              error={errors.faculty}
              required
            />

            <Input
              label="ภาควิชา / สาขาวิชา"
              type="text"
              value={data.department}
              onChange={(e) => onChange('department', e.target.value)}
              placeholder="เช่น ภาควิชาวิทยาการคอมพิวเตอร์"
              error={errors.department}
              required
            />

            <Input
              label="วิชาเอก"
              type="text"
              value={data.major}
              onChange={(e) => onChange('major', e.target.value)}
              placeholder="เช่น วิทยาการคอมพิวเตอร์"
              error={errors.major}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชั้นปี <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.year_level}
                onChange={(e) => onChange('year_level', e.target.value)}
                options={yearLevelOptions}
                placeholder="เลือกชั้นปี"
                error={errors.year_level}
                required
              />
            </div>

            <Input
              label="ปีที่เข้าศึกษา"
              type="text"
              value={data.admission_year}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                onChange('admission_year', value);
              }}
              placeholder="2567"
              maxLength={4}
              error={errors.admission_year}
              required
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ช่องทางเข้าศึกษา <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.admission_type}
                onChange={(e) => onChange('admission_type', e.target.value)}
                options={admissionTypeOptions}
                placeholder="เลือกช่องทางเข้าศึกษา"
                error={errors.admission_type}
                required
              />
            </div>

            {data.admission_type === 'other' && (
              <div className="md:col-span-2">
                <Input
                  label="ระบุช่องทางเข้าศึกษา"
                  type="text"
                  value={data.admission_details}
                  onChange={(e) => onChange('admission_details', e.target.value)}
                  placeholder="กรุณาระบุ"
                  error={errors.admission_details}
                />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
