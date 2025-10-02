'use client';

import { useState } from 'react';
import { ApplicationActivity, ApplicationReference } from '@/types/application';

interface ActivitiesFormProps {
  data?: {
    activities?: ApplicationActivity[];
    references?: ApplicationReference[];
  };
  onSave: (data: { activities: ApplicationActivity[]; references: ApplicationReference[] }) => Promise<void>;
  onNext?: () => void;
  onBack?: () => void;
}

export default function ActivitiesForm({ data, onSave, onNext, onBack }: ActivitiesFormProps) {
  const [activities, setActivities] = useState<ApplicationActivity[]>(data?.activities || []);
  const [references, setReferences] = useState<ApplicationReference[]>(data?.references || []);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ activities, references });
      if (onNext) onNext();
    } catch (error) {
      console.error('Failed to save activities:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const addActivity = () => {
    setActivities([
      ...activities,
      {
        application_id: 0,
        activity_type: '',
        activity_name: '',
        role: '',
        year: new Date().getFullYear(),
      },
    ]);
  };

  const addReference = () => {
    setReferences([
      ...references,
      {
        application_id: 0,
        name: '',
        relationship: '',
        occupation: '',
        phone: '',
      },
    ]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Activities */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">กิจกรรมและความสามารถพิเศษ</h3>
          <button
            type="button"
            onClick={addActivity}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + เพิ่มกิจกรรม
          </button>
        </div>

        {activities.map((activity, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทกิจกรรม</label>
                <select
                  value={activity.activity_type || ''}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].activity_type = e.target.value;
                    setActivities(newActivities);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">เลือกประเภท</option>
                  <option value="กีฬา">กีฬา</option>
                  <option value="ดนตรี">ดนตรี/นาฏศิลป์</option>
                  <option value="จิตอาสา">จิตอาสา</option>
                  <option value="ชุมนุม">ชุมนุม/ชมรม</option>
                  <option value="ความสามารถพิเศษ">ความสามารถพิเศษ</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อกิจกรรม</label>
                <input
                  type="text"
                  value={activity.activity_name || ''}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].activity_name = e.target.value;
                    setActivities(newActivities);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="เช่น ทีมฟุตบอลคณะ, ชมรมดนตรี"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">บทบาท/ตำแหน่ง</label>
                <input
                  type="text"
                  value={activity.role || ''}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].role = e.target.value;
                    setActivities(newActivities);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="เช่น หัวหน้าชุมนุม, สมาชิก"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ปี พ.ศ.</label>
                <input
                  type="number"
                  value={activity.year || ''}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].year = parseInt(e.target.value);
                    setActivities(newActivities);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
              <textarea
                value={activity.description || ''}
                onChange={(e) => {
                  const newActivities = [...activities];
                  newActivities[index].description = e.target.value;
                  setActivities(newActivities);
                }}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="อธิบายกิจกรรมและผลงานที่ได้รับ"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActivities(activities.filter((_, i) => i !== index))}
                className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
              >
                ลบกิจกรรมนี้
              </button>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-gray-500 text-center py-8">ยังไม่มีข้อมูลกิจกรรม คลิก "เพิ่มกิจกรรม" เพื่อเริ่มต้น</p>
        )}
      </div>

      {/* References */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">บุคคลอ้างอิง</h3>
          <button
            type="button"
            onClick={addReference}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + เพิ่มบุคคลอ้างอิง
          </button>
        </div>

        {references.map((reference, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  value={reference.name || ''}
                  onChange={(e) => {
                    const newReferences = [...references];
                    newReferences[index].name = e.target.value;
                    setReferences(newReferences);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ความสัมพันธ์
                </label>
                <input
                  type="text"
                  value={reference.relationship || ''}
                  onChange={(e) => {
                    const newReferences = [...references];
                    newReferences[index].relationship = e.target.value;
                    setReferences(newReferences);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="เช่น อาจารย์ที่ปรึกษา, หัวหน้างาน"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อาชีพ/ตำแหน่ง
                </label>
                <input
                  type="text"
                  value={reference.occupation || ''}
                  onChange={(e) => {
                    const newReferences = [...references];
                    newReferences[index].occupation = e.target.value;
                    setReferences(newReferences);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={reference.phone || ''}
                  onChange={(e) => {
                    const newReferences = [...references];
                    newReferences[index].phone = e.target.value;
                    setReferences(newReferences);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="08XXXXXXXX"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                <textarea
                  value={reference.address || ''}
                  onChange={(e) => {
                    const newReferences = [...references];
                    newReferences[index].address = e.target.value;
                    setReferences(newReferences);
                  }}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setReferences(references.filter((_, i) => i !== index))}
                  className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                >
                  ลบบุคคลอ้างอิง
                </button>
              </div>
            </div>
          </div>
        ))}

        {references.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            ยังไม่มีบุคคลอ้างอิง คลิก "เพิ่มบุคคลอ้างอิง" เพื่อเริ่มต้น
          </p>
        )}
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
