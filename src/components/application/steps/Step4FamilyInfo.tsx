'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PlusIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

export interface FamilyMember {
  relationship: string;
  title: string;
  first_name: string;
  last_name: string;
  age: string;
  living_status: string;
  occupation: string;
  workplace: string;
  monthly_income: string;
  phone: string;
}

export interface Guardian {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  relationship: string;
  age: string;
  occupation: string;
  workplace: string;
  monthly_income: string;
  phone: string;
}

export interface Sibling {
  id: string;
  order: string;
  gender: string;
  first_name: string;
  last_name: string;
  age: string;
  school_or_workplace: string;
  education_level: string;
  is_working: boolean;
  monthly_income: string;
}

export interface FamilyInfoData {
  father: FamilyMember;
  mother: FamilyMember;
  guardians: Guardian[];
  siblings: Sibling[];
  living_with: string;
}

export interface Step4FamilyInfoProps {
  data: FamilyInfoData;
  onChange: (field: keyof FamilyInfoData, value: any) => void;
  errors: Record<string, string>;
}

const titleOptions = [
  { value: 'นาย', label: 'นาย' },
  { value: 'นาง', label: 'นาง' },
  { value: 'นางสาว', label: 'นางสาว' }
];

const livingStatusOptions = [
  { value: 'alive', label: 'มีชีวิตอยู่' },
  { value: 'deceased', label: 'เสียชีวิต' },
  { value: 'unknown', label: 'ไม่ทราบ' }
];

const relationshipOptions = [
  { value: 'grandfather', label: 'ปู่ / ตา' },
  { value: 'grandmother', label: 'ย่า / ยาย' },
  { value: 'uncle', label: 'ลุง / น้า / อา' },
  { value: 'aunt', label: 'ป้า / น้า' },
  { value: 'older_sibling', label: 'พี่' },
  { value: 'other', label: 'อื่นๆ' }
];

const genderOptions = [
  { value: 'male', label: 'ชาย' },
  { value: 'female', label: 'หญิง' }
];

const educationLevelOptions = [
  { value: 'none', label: 'ไม่ได้ศึกษา' },
  { value: 'primary', label: 'ประถมศึกษา' },
  { value: 'junior_high', label: 'มัธยมต้น' },
  { value: 'senior_high', label: 'มัธยมปลาย' },
  { value: 'vocational', label: 'ปวช./ปวส.' },
  { value: 'bachelor', label: 'ปริญญาตรี' },
  { value: 'master', label: 'ปริญญาโท' },
  { value: 'doctorate', label: 'ปริญญาเอก' }
];

const livingWithOptions = [
  { value: 'parents', label: 'อยู่กับพ่อแม่' },
  { value: 'father', label: 'อยู่กับพ่ออย่างเดียว' },
  { value: 'mother', label: 'อยู่กับแม่อย่างเดียว' },
  { value: 'guardians', label: 'อยู่กับผู้ปกครอง' },
  { value: 'relatives', label: 'อยู่กับญาติ' },
  { value: 'alone', label: 'อยู่คนเดียว' },
  { value: 'dormitory', label: 'อยู่หอพัก' },
  { value: 'other', label: 'อื่นๆ' }
];

export function Step4FamilyInfo({ data, onChange, errors }: Step4FamilyInfoProps) {
  const [activeTab, setActiveTab] = useState<'parents' | 'guardians' | 'siblings'>('parents');

  const updateFather = (field: keyof FamilyMember, value: string) => {
    onChange('father', { ...data.father, [field]: value });
  };

  const updateMother = (field: keyof FamilyMember, value: string) => {
    onChange('mother', { ...data.mother, [field]: value });
  };

  const addGuardian = () => {
    const newGuardian: Guardian = {
      id: Date.now().toString(),
      title: '',
      first_name: '',
      last_name: '',
      relationship: '',
      age: '',
      occupation: '',
      workplace: '',
      monthly_income: '',
      phone: ''
    };
    onChange('guardians', [...data.guardians, newGuardian]);
  };

  const removeGuardian = (id: string) => {
    onChange('guardians', data.guardians.filter(g => g.id !== id));
  };

  const updateGuardian = (id: string, field: keyof Guardian, value: string) => {
    onChange('guardians', data.guardians.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const addSibling = () => {
    const newSibling: Sibling = {
      id: Date.now().toString(),
      order: '',
      gender: '',
      first_name: '',
      last_name: '',
      age: '',
      school_or_workplace: '',
      education_level: '',
      is_working: false,
      monthly_income: ''
    };
    onChange('siblings', [...data.siblings, newSibling]);
  };

  const removeSibling = (id: string) => {
    onChange('siblings', data.siblings.filter(s => s.id !== id));
  };

  const updateSibling = (id: string, field: keyof Sibling, value: any) => {
    onChange('siblings', data.siblings.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const renderParentForm = (
    parent: FamilyMember,
    parentType: 'father' | 'mother',
    updateFunc: (field: keyof FamilyMember, value: string) => void
  ) => {
    const prefix = parentType === 'father' ? 'father' : 'mother';
    const label = parentType === 'father' ? 'บิดา' : 'มารดา';

    return (
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">{label}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สถานะ <span className="text-red-500">*</span>
            </label>
            <Select
              value={parent.living_status}
              onChange={(e) => updateFunc('living_status', e.target.value)}
              options={livingStatusOptions}
              placeholder="เลือกสถานะ"
              error={errors[`${prefix}.living_status`]}
              required
            />
          </div>

          {parent.living_status === 'alive' && (
            <>
              <div className="md:col-span-2 grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    คำนำหน้า <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={parent.title}
                    onChange={(e) => updateFunc('title', e.target.value)}
                    options={titleOptions}
                    placeholder="เลือก"
                    error={errors[`${prefix}.title`]}
                    required
                  />
                </div>
                <div className="col-span-5">
                  <Input
                    label="ชื่อ"
                    value={parent.first_name}
                    onChange={(e) => updateFunc('first_name', e.target.value)}
                    placeholder="กรอกชื่อ"
                    error={errors[`${prefix}.first_name`]}
                    required
                  />
                </div>
                <div className="col-span-5">
                  <Input
                    label="นามสกุล"
                    value={parent.last_name}
                    onChange={(e) => updateFunc('last_name', e.target.value)}
                    placeholder="กรอกนามสกุล"
                    error={errors[`${prefix}.last_name`]}
                    required
                  />
                </div>
              </div>

              <Input
                label="อายุ"
                type="text"
                value={parent.age}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                  updateFunc('age', value);
                }}
                placeholder="เช่น 45"
                maxLength={3}
                error={errors[`${prefix}.age`]}
                required
              />

              <Input
                label="อาชีพ"
                value={parent.occupation}
                onChange={(e) => updateFunc('occupation', e.target.value)}
                placeholder="เช่น เกษตรกร, รับจ้าง"
                error={errors[`${prefix}.occupation`]}
                required
              />

              <Input
                label="สถานที่ทำงาน"
                value={parent.workplace}
                onChange={(e) => updateFunc('workplace', e.target.value)}
                placeholder="เช่น บริษัท ABC, ทำนา"
                error={errors[`${prefix}.workplace`]}
              />

              <Input
                label="รายได้ต่อเดือน (บาท)"
                type="text"
                value={parent.monthly_income}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  updateFunc('monthly_income', value);
                }}
                placeholder="เช่น 15000"
                error={errors[`${prefix}.monthly_income`]}
                required
              />

              <Input
                label="เบอร์โทรศัพท์"
                type="tel"
                value={parent.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  updateFunc('phone', value);
                }}
                placeholder="0812345678"
                maxLength={10}
                error={errors[`${prefix}.phone`]}
              />
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <UserGroupIcon className="h-6 w-6 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">ข้อมูลครอบครัว</h3>
      </div>

      {/* Living With Selection */}
      <Card>
        <CardBody>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ปัจจุบันอาศัยอยู่กับ <span className="text-red-500">*</span>
          </label>
          <Select
            value={data.living_with}
            onChange={(e) => onChange('living_with', e.target.value)}
            options={livingWithOptions}
            placeholder="เลือก"
            error={errors.living_with}
            required
          />
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'parents', label: 'บิดา-มารดา' },
            { key: 'guardians', label: 'ผู้ปกครอง' },
            { key: 'siblings', label: 'พี่น้อง' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'parents' && (
          <div className="space-y-6">
            <Card>
              <CardBody>
                {renderParentForm(data.father, 'father', updateFather)}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                {renderParentForm(data.mother, 'mother', updateMother)}
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === 'guardians' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                กรุณากรอกข้อมูลผู้ปกครอง (กรณีที่ไม่ได้อยู่กับบิดามารดา)
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={addGuardian}
                leftIcon={<PlusIcon className="h-4 w-4" />}
              >
                เพิ่มผู้ปกครอง
              </Button>
            </div>

            {data.guardians.length === 0 ? (
              <Card>
                <CardBody>
                  <p className="text-center text-gray-500 py-8">
                    ยังไม่มีข้อมูลผู้ปกครอง (เพิ่มได้หากจำเป็น)
                  </p>
                </CardBody>
              </Card>
            ) : (
              data.guardians.map((guardian, index) => (
                <Card key={guardian.id}>
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">
                        ผู้ปกครองคนที่ {index + 1}
                      </h4>
                      <button
                        onClick={() => removeGuardian(guardian.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ความสัมพันธ์ <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={guardian.relationship}
                          onChange={(e) => updateGuardian(guardian.id, 'relationship', e.target.value)}
                          options={relationshipOptions}
                          placeholder="เลือกความสัมพันธ์"
                          required
                        />
                      </div>

                      <div className="md:col-span-2 grid grid-cols-12 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            คำนำหน้า <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={guardian.title}
                            onChange={(e) => updateGuardian(guardian.id, 'title', e.target.value)}
                            options={titleOptions}
                            placeholder="เลือก"
                            required
                          />
                        </div>
                        <div className="col-span-5">
                          <Input
                            label="ชื่อ"
                            value={guardian.first_name}
                            onChange={(e) => updateGuardian(guardian.id, 'first_name', e.target.value)}
                            placeholder="กรอกชื่อ"
                            required
                          />
                        </div>
                        <div className="col-span-5">
                          <Input
                            label="นามสกุล"
                            value={guardian.last_name}
                            onChange={(e) => updateGuardian(guardian.id, 'last_name', e.target.value)}
                            placeholder="กรอกนามสกุล"
                            required
                          />
                        </div>
                      </div>

                      <Input
                        label="อายุ"
                        value={guardian.age}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                          updateGuardian(guardian.id, 'age', value);
                        }}
                        placeholder="เช่น 50"
                        required
                      />

                      <Input
                        label="อาชีพ"
                        value={guardian.occupation}
                        onChange={(e) => updateGuardian(guardian.id, 'occupation', e.target.value)}
                        placeholder="เช่น เกษตรกร"
                        required
                      />

                      <Input
                        label="สถานที่ทำงาน"
                        value={guardian.workplace}
                        onChange={(e) => updateGuardian(guardian.id, 'workplace', e.target.value)}
                        placeholder="เช่น บริษัท ABC"
                      />

                      <Input
                        label="รายได้ต่อเดือน (บาท)"
                        value={guardian.monthly_income}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          updateGuardian(guardian.id, 'monthly_income', value);
                        }}
                        placeholder="เช่น 15000"
                        required
                      />

                      <Input
                        label="เบอร์โทรศัพท์"
                        value={guardian.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          updateGuardian(guardian.id, 'phone', value);
                        }}
                        placeholder="0812345678"
                      />
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'siblings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                กรุณากรอกข้อมูลพี่น้องทั้งหมด (ไม่รวมตัวเอง)
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={addSibling}
                leftIcon={<PlusIcon className="h-4 w-4" />}
              >
                เพิ่มพี่น้อง
              </Button>
            </div>

            {data.siblings.length === 0 ? (
              <Card>
                <CardBody>
                  <p className="text-center text-gray-500 py-8">
                    ยังไม่มีข้อมูลพี่น้อง (กดปุ่ม "เพิ่มพี่น้อง" เพื่อเพิ่มข้อมูล)
                  </p>
                </CardBody>
              </Card>
            ) : (
              data.siblings.map((sibling, index) => (
                <Card key={sibling.id}>
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">
                        พี่น้องคนที่ {index + 1}
                      </h4>
                      <button
                        onClick={() => removeSibling(sibling.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="ลำดับที่ (ในพี่น้อง)"
                        value={sibling.order}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                          updateSibling(sibling.id, 'order', value);
                        }}
                        placeholder="เช่น 1, 2, 3"
                        helperText="ลำดับเกิดของพี่น้อง"
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          เพศ <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={sibling.gender}
                          onChange={(e) => updateSibling(sibling.id, 'gender', e.target.value)}
                          options={genderOptions}
                          placeholder="เลือกเพศ"
                          required
                        />
                      </div>

                      <Input
                        label="ชื่อ"
                        value={sibling.first_name}
                        onChange={(e) => updateSibling(sibling.id, 'first_name', e.target.value)}
                        placeholder="กรอกชื่อ"
                        required
                      />

                      <Input
                        label="นามสกุล"
                        value={sibling.last_name}
                        onChange={(e) => updateSibling(sibling.id, 'last_name', e.target.value)}
                        placeholder="กรอกนามสกุล"
                        required
                      />

                      <Input
                        label="อายุ"
                        value={sibling.age}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                          updateSibling(sibling.id, 'age', value);
                        }}
                        placeholder="เช่น 20"
                        required
                      />

                      <Input
                        label="สถานศึกษา / สถานที่ทำงาน"
                        value={sibling.school_or_workplace}
                        onChange={(e) => updateSibling(sibling.id, 'school_or_workplace', e.target.value)}
                        placeholder="เช่น มหาวิทยาลัยมหิดล"
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ระดับการศึกษา <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={sibling.education_level}
                          onChange={(e) => updateSibling(sibling.id, 'education_level', e.target.value)}
                          options={educationLevelOptions}
                          placeholder="เลือกระดับการศึกษา"
                          required
                        />
                      </div>

                      <div className="flex items-center pt-6">
                        <input
                          type="checkbox"
                          id={`working-${sibling.id}`}
                          checked={sibling.is_working}
                          onChange={(e) => updateSibling(sibling.id, 'is_working', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`working-${sibling.id}`} className="ml-2 block text-sm text-gray-900">
                          ทำงาน / มีรายได้
                        </label>
                      </div>

                      {sibling.is_working && (
                        <Input
                          label="รายได้ต่อเดือน (บาท)"
                          value={sibling.monthly_income}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            updateSibling(sibling.id, 'monthly_income', value);
                          }}
                          placeholder="เช่น 10000"
                          required
                        />
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
