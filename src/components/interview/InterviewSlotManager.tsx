'use client';

import React, { useState } from 'react';
import { 
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface InterviewSlot {
  id: number;
  scholarship_id: number;
  interviewer_id: string;
  interview_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  building?: string;
  floor?: string;
  room?: string;
  max_capacity: number;
  current_bookings: number;
  is_available: boolean;
  slot_type: 'individual' | 'group';
  duration_minutes: number;
  preparation_time: number;
  notes?: string;
  scholarship?: {
    scholarship_name: string;
  };
  interviewer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface CreateSlotForm {
  scholarship_id: number;
  interviewer_id: string;
  interview_date: string;
  start_time: string;
  end_time: string;
  location: string;
  building: string;
  floor: string;
  room: string;
  max_capacity: number;
  slot_type: 'individual' | 'group';
  duration_minutes: number;
  preparation_time: number;
  notes: string;
}

interface Props {
  slots: InterviewSlot[];
  scholarships: any[];
  interviewers: any[];
  onCreateSlot: (slot: CreateSlotForm) => void;
  onUpdateSlot: (id: number, updates: Partial<InterviewSlot>) => void;
  onDeleteSlot: (id: number) => void;
}

const InterviewSlotManager: React.FC<Props> = ({
  slots,
  scholarships,
  interviewers,
  onCreateSlot,
  onUpdateSlot,
  onDeleteSlot
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<InterviewSlot | null>(null);
  const [formData, setFormData] = useState<CreateSlotForm>({
    scholarship_id: 0,
    interviewer_id: '',
    interview_date: '',
    start_time: '09:00',
    end_time: '09:30',
    location: '',
    building: '',
    floor: '',
    room: '',
    max_capacity: 1,
    slot_type: 'individual',
    duration_minutes: 30,
    preparation_time: 5,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlot) {
      onUpdateSlot(editingSlot.id, formData);
      setEditingSlot(null);
    } else {
      onCreateSlot(formData);
    }
    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      scholarship_id: 0,
      interviewer_id: '',
      interview_date: '',
      start_time: '09:00',
      end_time: '09:30',
      location: '',
      building: '',
      floor: '',
      room: '',
      max_capacity: 1,
      slot_type: 'individual',
      duration_minutes: 30,
      preparation_time: 5,
      notes: ''
    });
  };

  const handleEdit = (slot: InterviewSlot) => {
    setEditingSlot(slot);
    setFormData({
      scholarship_id: slot.scholarship_id,
      interviewer_id: slot.interviewer_id,
      interview_date: slot.interview_date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      location: slot.location || '',
      building: slot.building || '',
      floor: slot.floor || '',
      room: slot.room || '',
      max_capacity: slot.max_capacity,
      slot_type: slot.slot_type,
      duration_minutes: slot.duration_minutes,
      preparation_time: slot.preparation_time,
      notes: slot.notes || ''
    });
    setShowCreateModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary-900 font-sarabun">
          จัดการช่วงเวลาสัมภาษณ์
        </h2>
        <Button
          onClick={() => {
            setEditingSlot(null);
            resetForm();
            setShowCreateModal(true);
          }}
          className="font-sarabun"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          เพิ่มช่วงเวลา
        </Button>
      </div>

      {/* Slots List */}
      <div className="space-y-4">
        {slots.map((slot) => (
          <Card key={slot.id}>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm font-medium font-sarabun">
                        {formatDate(slot.interview_date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm font-sarabun">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm font-sarabun">
                        {slot.interviewer?.first_name} {slot.interviewer?.last_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="font-sarabun">
                        {slot.building} {slot.room} {slot.location}
                      </span>
                    </div>
                    <span className="font-sarabun">
                      ความจุ: {slot.current_bookings}/{slot.max_capacity}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-sarabun ${
                      slot.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {slot.is_available ? 'เปิดให้จอง' : 'ปิดการจอง'}
                    </span>
                  </div>

                  <div className="mt-2">
                    <span className="text-sm text-secondary-700 font-sarabun">
                      {slot.scholarship?.scholarship_name}
                    </span>
                  </div>

                  {slot.notes && (
                    <div className="mt-2 p-2 bg-secondary-50 rounded text-sm text-secondary-600 font-sarabun">
                      {slot.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(slot)}
                    className="font-sarabun"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('ต้องการลบช่วงเวลานี้หรือไม่?')) {
                        onDeleteSlot(slot.id);
                      }
                    }}
                    className="font-sarabun text-red-600 border-red-300 hover:bg-red-50"
                    disabled={slot.current_bookings > 0}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-secondary-900 font-sarabun">
                  {editingSlot ? 'แก้ไขช่วงเวลาสัมภาษณ์' : 'เพิ่มช่วงเวลาสัมภาษณ์'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingSlot(null);
                  }}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      ทุนการศึกษา *
                    </label>
                    <select
                      value={formData.scholarship_id}
                      onChange={(e) => setFormData({...formData, scholarship_id: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      required
                    >
                      <option value={0}>เลือกทุนการศึกษา</option>
                      {scholarships.map(scholarship => (
                        <option key={scholarship.scholarship_id} value={scholarship.scholarship_id}>
                          {scholarship.scholarship_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      ผู้สัมภาษณ์ *
                    </label>
                    <select
                      value={formData.interviewer_id}
                      onChange={(e) => setFormData({...formData, interviewer_id: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      required
                    >
                      <option value="">เลือกผู้สัมภาษณ์</option>
                      {interviewers.map(interviewer => (
                        <option key={interviewer.user_id} value={interviewer.user_id}>
                          {interviewer.first_name} {interviewer.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      วันที่สัมภาษณ์ *
                    </label>
                    <input
                      type="date"
                      value={formData.interview_date}
                      onChange={(e) => setFormData({...formData, interview_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      ประเภทการสัมภาษณ์
                    </label>
                    <select
                      value={formData.slot_type}
                      onChange={(e) => setFormData({...formData, slot_type: e.target.value as 'individual' | 'group'})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      <option value="individual">รายบุคคล</option>
                      <option value="group">กลุ่ม</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      เวลาเริ่ม *
                    </label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      เวลาสิ้นสุด *
                    </label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      อาคาร
                    </label>
                    <input
                      type="text"
                      value={formData.building}
                      onChange={(e) => setFormData({...formData, building: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      placeholder="เช่น อาคารศูนย์การเรียนรู้"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      ห้อง
                    </label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => setFormData({...formData, room: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      placeholder="เช่น ห้อง 301"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      จำนวนที่นั่ง
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.max_capacity}
                      onChange={(e) => setFormData({...formData, max_capacity: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      ระยะเวลา (นาที)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="180"
                      step="15"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                    สถานที่
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับสถานที่"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                    หมายเหตุ
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    placeholder="หมายเหตุสำหรับการสัมภาษณ์..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingSlot(null);
                    }}
                    className="flex-1 font-sarabun"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 font-sarabun"
                  >
                    {editingSlot ? 'บันทึกการแก้ไข' : 'สร้างช่วงเวลา'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSlotManager; 