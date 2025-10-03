'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PlusIcon, TrashIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline';

export interface ScholarshipHistory {
  id: string;
  scholarship_name: string;
  amount: string;
  year: string;
  status: string;
}

export interface Activity {
  id: string;
  activity_type: string;
  name: string;
  role: string;
  duration: string;
  description: string;
}

export interface ReferencePerson {
  title: string;
  first_name: string;
  last_name: string;
  relationship: string;
  position: string;
  organization: string;
  phone: string;
  email: string;
}

export interface HealthIssue {
  has_health_issue: boolean;
  description: string;
  severity: string;
  treatment: string;
}

export interface ActivitiesSkillsData {
  scholarship_history: ScholarshipHistory[];
  activities: Activity[];
  skills: string;
  special_abilities: string;
  awards: string;
  reference_person: ReferencePerson;
  health_issue: HealthIssue;
}

export interface Step6ActivitiesSkillsProps {
  data: ActivitiesSkillsData;
  onChange: (field: keyof ActivitiesSkillsData, value: any) => void;
  errors: Record<string, string>;
}

const activityTypeOptions = [
  { value: 'extracurricular', label: 'กิจกรรมนักศึกษา' },
  { value: 'volunteer', label: 'อาสาสมัคร /봉사활동' },
  { value: 'sports', label: 'กีฬา' },
  { value: 'arts', label: 'ศิลปะ / ดนตรี' },
  { value: 'academic', label: 'วิชาการ' },
  { value: 'social', label: 'บริการสังคม' },
  { value: 'other', label: 'อื่นๆ' }
];

const scholarshipStatusOptions = [
  { value: 'completed', label: 'ได้รับครบแล้ว' },
  { value: 'ongoing', label: 'กำลังรับอยู่' },
  { value: 'cancelled', label: 'ยกเลิก' }
];

const severityOptions = [
  { value: 'mild', label: 'เล็กน้อย' },
  { value: 'moderate', label: 'ปานกลาง' },
  { value: 'severe', label: 'รุนแรง' }
];

export function Step6ActivitiesSkills({ data, onChange, errors }: Step6ActivitiesSkillsProps) {
  const addScholarship = () => {
    const newScholarship: ScholarshipHistory = {
      id: Date.now().toString(),
      scholarship_name: '',
      amount: '',
      year: '',
      status: ''
    };
    onChange('scholarship_history', [...data.scholarship_history, newScholarship]);
  };

  const removeScholarship = (id: string) => {
    onChange('scholarship_history', data.scholarship_history.filter(s => s.id !== id));
  };

  const updateScholarship = (id: string, field: keyof ScholarshipHistory, value: string) => {
    onChange('scholarship_history', data.scholarship_history.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addActivity = () => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      activity_type: '',
      name: '',
      role: '',
      duration: '',
      description: ''
    };
    onChange('activities', [...data.activities, newActivity]);
  };

  const removeActivity = (id: string) => {
    onChange('activities', data.activities.filter(a => a.id !== id));
  };

  const updateActivity = (id: string, field: keyof Activity, value: string) => {
    onChange('activities', data.activities.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const updateReferencePerson = (field: keyof ReferencePerson, value: string) => {
    onChange('reference_person', { ...data.reference_person, [field]: value });
  };

  const updateHealthIssue = (field: keyof HealthIssue, value: any) => {
    onChange('health_issue', { ...data.health_issue, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Scholarship History */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="h-6 w-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">ประวัติการได้รับทุนการศึกษา</h3>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={addScholarship}
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              เพิ่มทุน
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            กรุณาระบุทุนการศึกษาที่เคยได้รับในอดีต (ถ้ามี)
          </p>

          {data.scholarship_history.length === 0 ? (
            <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
              ไม่เคยได้รับทุนการศึกษา (ข้ามขั้นตอนนี้ได้)
            </div>
          ) : (
            <div className="space-y-4">
              {data.scholarship_history.map((scholarship, index) => (
                <div key={scholarship.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">ทุนที่ {index + 1}</h4>
                    <button
                      onClick={() => removeScholarship(scholarship.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="ชื่อทุนการศึกษา"
                        value={scholarship.scholarship_name}
                        onChange={(e) => updateScholarship(scholarship.id, 'scholarship_name', e.target.value)}
                        placeholder="เช่น ทุนการศึกษามูลนิธิ ABC"
                        required
                      />
                    </div>

                    <Input
                      label="จำนวนเงิน (บาท)"
                      value={scholarship.amount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        updateScholarship(scholarship.id, 'amount', value);
                      }}
                      placeholder="เช่น 10000"
                      required
                    />

                    <Input
                      label="ปีการศึกษาที่ได้รับ"
                      value={scholarship.year}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        updateScholarship(scholarship.id, 'year', value);
                      }}
                      placeholder="เช่น 2567"
                      required
                    />

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        สถานะ <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={scholarship.status}
                        onChange={(e) => updateScholarship(scholarship.id, 'status', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      >
                        <option value="">เลือกสถานะ</option>
                        {scholarshipStatusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Activities */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <StarIcon className="h-6 w-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">กิจกรรมและผลงาน</h3>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={addActivity}
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              เพิ่มกิจกรรม
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            กรุณาระบุกิจกรรมที่เคยเข้าร่วม ผลงาน หรือรางวัลที่เคยได้รับ
          </p>

          {data.activities.length === 0 ? (
            <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
              ยังไม่มีข้อมูลกิจกรรม (กดปุ่ม "เพิ่มกิจกรรม" เพื่อเพิ่ม)
            </div>
          ) : (
            <div className="space-y-4">
              {data.activities.map((activity, index) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">กิจกรรมที่ {index + 1}</h4>
                    <button
                      onClick={() => removeActivity(activity.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ประเภทกิจกรรม <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={activity.activity_type}
                        onChange={(e) => updateActivity(activity.id, 'activity_type', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      >
                        <option value="">เลือกประเภท</option>
                        {activityTypeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        label="ชื่อกิจกรรม / ผลงาน"
                        value={activity.name}
                        onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
                        placeholder="เช่น ประธานชมรมคอมพิวเตอร์"
                        required
                      />
                    </div>

                    <Input
                      label="บทบาท / ตำแหน่ง"
                      value={activity.role}
                      onChange={(e) => updateActivity(activity.id, 'role', e.target.value)}
                      placeholder="เช่น ประธาน, สมาชิก"
                      required
                    />

                    <Input
                      label="ระยะเวลา"
                      value={activity.duration}
                      onChange={(e) => updateActivity(activity.id, 'duration', e.target.value)}
                      placeholder="เช่น 2566-2567, 6 เดือน"
                      required
                    />

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        รายละเอียด <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={activity.description}
                        onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                        placeholder="อธิบายกิจกรรมและผลงานโดยย่อ"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Skills and Abilities */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ทักษะและความสามารถพิเศษ</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ทักษะที่มี
              </label>
              <Textarea
                value={data.skills}
                onChange={(e) => onChange('skills', e.target.value)}
                placeholder="เช่น การเขียนโปรแกรม, ภาษาอังกฤษ, กีฬา, ดนตรี"
                rows={3}
                error={errors.skills}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ความสามารถพิเศษ
              </label>
              <Textarea
                value={data.special_abilities}
                onChange={(e) => onChange('special_abilities', e.target.value)}
                placeholder="เช่น ได้รับรางวัล, ความสามารถโดดเด่น"
                rows={3}
                error={errors.special_abilities}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รางวัลและเกียรติบัตร
              </label>
              <Textarea
                value={data.awards}
                onChange={(e) => onChange('awards', e.target.value)}
                placeholder="เช่น รางวัลนักศึกษาดีเด่น, เหรียญทอง การแข่งขัน..."
                rows={3}
                error={errors.awards}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Reference Person */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">บุคคลอ้างอิง</h3>
          <p className="text-sm text-gray-600 mb-4">
            กรุณาระบุข้อมูลบุคคลที่สามารถให้ข้อมูลอ้างอิงได้ (เช่น อาจารย์ที่ปรึกษา, หัวหน้างาน)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 grid grid-cols-12 gap-4">
              <div className="col-span-2">
                <Input
                  label="คำนำหน้า"
                  value={data.reference_person.title}
                  onChange={(e) => updateReferencePerson('title', e.target.value)}
                  placeholder="ดร."
                />
              </div>
              <div className="col-span-5">
                <Input
                  label="ชื่อ"
                  value={data.reference_person.first_name}
                  onChange={(e) => updateReferencePerson('first_name', e.target.value)}
                  placeholder="กรอกชื่อ"
                />
              </div>
              <div className="col-span-5">
                <Input
                  label="นามสกุล"
                  value={data.reference_person.last_name}
                  onChange={(e) => updateReferencePerson('last_name', e.target.value)}
                  placeholder="กรอกนามสกุล"
                />
              </div>
            </div>

            <Input
              label="ความสัมพันธ์"
              value={data.reference_person.relationship}
              onChange={(e) => updateReferencePerson('relationship', e.target.value)}
              placeholder="เช่น อาจารย์ที่ปรึกษา"
            />

            <Input
              label="ตำแหน่ง"
              value={data.reference_person.position}
              onChange={(e) => updateReferencePerson('position', e.target.value)}
              placeholder="เช่น ผู้ช่วยศาสตราจารย์"
            />

            <div className="md:col-span-2">
              <Input
                label="หน่วยงาน"
                value={data.reference_person.organization}
                onChange={(e) => updateReferencePerson('organization', e.target.value)}
                placeholder="เช่น มหาวิทยาลัยมหิดล"
              />
            </div>

            <Input
              label="เบอร์โทรศัพท์"
              type="tel"
              value={data.reference_person.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                updateReferencePerson('phone', value);
              }}
              placeholder="0812345678"
            />

            <Input
              label="อีเมล"
              type="email"
              value={data.reference_person.email}
              onChange={(e) => updateReferencePerson('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
        </CardBody>
      </Card>

      {/* Health Issues */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลสุขภาพ (ถ้ามี)</h3>

          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="has_health_issue"
                checked={data.health_issue.has_health_issue}
                onChange={(e) => updateHealthIssue('has_health_issue', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="has_health_issue" className="ml-2 block text-sm text-gray-900">
                มีปัญหาสุขภาพ / โรคประจำตัว
              </label>
            </div>
          </div>

          {data.health_issue.has_health_issue && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อธิบายปัญหาสุขภาพ <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={data.health_issue.description}
                  onChange={(e) => updateHealthIssue('description', e.target.value)}
                  placeholder="โปรดระบุโรคหรือปัญหาสุขภาพ"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ระดับความรุนแรง <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.health_issue.severity}
                    onChange={(e) => updateHealthIssue('severity', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="">เลือกระดับ</option>
                    {severityOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="การรักษาปัจจุบัน"
                  value={data.health_issue.treatment}
                  onChange={(e) => updateHealthIssue('treatment', e.target.value)}
                  placeholder="เช่น รับประทานยาประจำ"
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
