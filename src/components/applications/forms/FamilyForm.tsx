'use client';

import { useState } from 'react';
import {
  ApplicationFamilyMember,
  ApplicationGuardian,
  ApplicationSibling,
  ApplicationLivingSituation,
} from '@/types/application';

interface FamilyFormProps {
  data?: {
    members?: ApplicationFamilyMember[];
    guardians?: ApplicationGuardian[];
    siblings?: ApplicationSibling[];
    living_situation?: ApplicationLivingSituation;
  };
  onSave: (data: {
    members: ApplicationFamilyMember[];
    guardians: ApplicationGuardian[];
    siblings: ApplicationSibling[];
    living_situation: ApplicationLivingSituation | null;
  }) => Promise<void>;
  onNext?: () => void;
  onBack?: () => void;
}

export default function FamilyForm({ data, onSave, onNext, onBack }: FamilyFormProps) {
  const [members, setMembers] = useState<ApplicationFamilyMember[]>(data?.members || []);
  const [guardians, setGuardians] = useState<ApplicationGuardian[]>(data?.guardians || []);
  const [siblings, setSiblings] = useState<ApplicationSibling[]>(data?.siblings || []);
  const [livingSituation, setLivingSituation] = useState<ApplicationLivingSituation | null>(
    data?.living_situation || {
      application_id: 0,
      living_with: '',
      housing_type: '',
      housing_ownership: '',
    }
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ members, guardians, siblings, living_situation: livingSituation });
      if (onNext) onNext();
    } catch (error) {
      console.error('Failed to save family info:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const addMember = () => {
    setMembers([
      ...members,
      {
        application_id: 0,
        relationship: '',
        name: '',
        age: 0,
        occupation: '',
        monthly_income: 0,
      },
    ]);
  };

  const addSibling = () => {
    setSiblings([
      ...siblings,
      {
        application_id: 0,
        name: '',
        gender: '',
        age: 0,
        occupation: '',
        education_level: '',
      },
    ]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Family Members */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">ข้อมูลบิดา-มารดา/ผู้ปกครอง</h3>
          <button
            type="button"
            onClick={addMember}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + เพิ่มสมาชิก
          </button>
        </div>

        {members.map((member, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ความสัมพันธ์</label>
                <select
                  value={member.relationship || ''}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index].relationship = e.target.value;
                    setMembers(newMembers);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">เลือก</option>
                  <option value="บิดา">บิดา</option>
                  <option value="มารดา">มารดา</option>
                  <option value="ผู้ปกครอง">ผู้ปกครอง</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={member.name || ''}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index].name = e.target.value;
                    setMembers(newMembers);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อายุ</label>
                <input
                  type="number"
                  value={member.age || ''}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index].age = parseInt(e.target.value);
                    setMembers(newMembers);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อาชีพ</label>
                <input
                  type="text"
                  value={member.occupation || ''}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index].occupation = e.target.value;
                    setMembers(newMembers);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายได้/เดือน</label>
                <input
                  type="number"
                  value={member.monthly_income || ''}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index].monthly_income = parseFloat(e.target.value);
                    setMembers(newMembers);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setMembers(members.filter((_, i) => i !== index))}
                  className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Siblings */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">ข้อมูลพี่น้อง</h3>
          <button
            type="button"
            onClick={addSibling}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + เพิ่มพี่น้อง
          </button>
        </div>

        {siblings.map((sibling, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={sibling.name || ''}
                  onChange={(e) => {
                    const newSiblings = [...siblings];
                    newSiblings[index].name = e.target.value;
                    setSiblings(newSiblings);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เพศ</label>
                <select
                  value={sibling.gender || ''}
                  onChange={(e) => {
                    const newSiblings = [...siblings];
                    newSiblings[index].gender = e.target.value;
                    setSiblings(newSiblings);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">เลือก</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อายุ</label>
                <input
                  type="number"
                  value={sibling.age || ''}
                  onChange={(e) => {
                    const newSiblings = [...siblings];
                    newSiblings[index].age = parseInt(e.target.value);
                    setSiblings(newSiblings);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อาชีพ/กำลังศึกษา</label>
                <input
                  type="text"
                  value={sibling.occupation || ''}
                  onChange={(e) => {
                    const newSiblings = [...siblings];
                    newSiblings[index].occupation = e.target.value;
                    setSiblings(newSiblings);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ระดับการศึกษา</label>
                <input
                  type="text"
                  value={sibling.education_level || ''}
                  onChange={(e) => {
                    const newSiblings = [...siblings];
                    newSiblings[index].education_level = e.target.value;
                    setSiblings(newSiblings);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setSiblings(siblings.filter((_, i) => i !== index))}
                  className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Living Situation */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">สภาพการอยู่อาศัย</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อยู่กับ</label>
            <input
              type="text"
              value={livingSituation?.living_with || ''}
              onChange={(e) =>
                setLivingSituation({ ...livingSituation!, living_with: e.target.value })
              }
              placeholder="เช่น บิดา-มารดา, ผู้ปกครอง, อยู่คนเดียว"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทที่พัก</label>
            <select
              value={livingSituation?.housing_type || ''}
              onChange={(e) =>
                setLivingSituation({ ...livingSituation!, housing_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">เลือก</option>
              <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
              <option value="ทาวน์เฮ้าส์">ทาวน์เฮ้าส์</option>
              <option value="คอนโด">คอนโด</option>
              <option value="หอพัก">หอพัก</option>
              <option value="บ้านเช่า">บ้านเช่า</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">กรรมสิทธิ์</label>
            <select
              value={livingSituation?.housing_ownership || ''}
              onChange={(e) =>
                setLivingSituation({ ...livingSituation!, housing_ownership: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">เลือก</option>
              <option value="เป็นของตนเอง">เป็นของตนเอง</option>
              <option value="เช่า">เช่า</option>
              <option value="อาศัยผู้อื่น">อาศัยผู้อื่น</option>
            </select>
          </div>
        </div>
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
