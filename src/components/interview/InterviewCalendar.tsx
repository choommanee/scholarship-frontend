"use client";

import React, { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { th } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { interviewService } from '@/services/interview.service';

// Setup the localizer for react-big-calendar
const locales = {
  'th': th,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface InterviewSlot {
  id: string;
  title: string;
  start: Date;
  end: Date;
  scholarshipName: string;
  location: string;
  maxApplicants: number;
  currentApplicants: number;
  status: 'available' | 'full' | 'past';
  interviewers: string[];
}

export interface BookingRequest {
  slot_id: string;
  application_id: string;
  notes?: string;
}

interface InterviewCalendarProps {
  userRole: 'student' | 'officer' | 'interviewer';
  studentId?: string;
  onSlotSelect?: (slot: InterviewSlot) => void;
}

export default function InterviewCalendar({ 
  userRole, 
  studentId, 
  onSlotSelect 
}: InterviewCalendarProps) {
  const [availableSlots, setAvailableSlots] = useState<InterviewSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviewSlots();
  }, [userRole, studentId]);

  const fetchInterviewSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (userRole === 'student') {
        response = await interviewService.getAvailableSlots();
      } else if (userRole === 'interviewer') {
        response = await interviewService.getInterviewerSlots();
      } else {
        response = await interviewService.getAllSlots();
      }
      
      // Transform API response to calendar events
      const slots: InterviewSlot[] = response.map((slot: any) => ({
        id: slot.id,
        title: `${slot.scholarship_name} (${slot.current_applicants}/${slot.max_applicants})`,
        start: new Date(slot.start_time),
        end: new Date(slot.end_time),
        scholarshipName: slot.scholarship_name,
        location: slot.location,
        maxApplicants: slot.max_applicants,
        currentApplicants: slot.current_applicants,
        status: slot.current_applicants >= slot.max_applicants ? 'full' : 
                new Date(slot.start_time) < new Date() ? 'past' : 'available',
        interviewers: slot.interviewers || []
      }));
      
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Failed to fetch interview slots:', error);
      setError('ไม่สามารถโหลดข้อมูลการสัมภาษณ์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot: InterviewSlot) => {
    setSelectedSlot(slot);
    if (onSlotSelect) {
      onSlotSelect(slot);
    }
  };

  const handleBookSlot = async (slotId: string) => {
    if (!studentId) return;
    
    try {
      await interviewService.bookSlot(slotId, studentId);
      toast.success('จองช่วงเวลาสัมภาษณ์เรียบร้อยแล้ว');
      fetchInterviewSlots(); // Refresh the slots
      setSelectedSlot(null);
    } catch (error) {
      console.error('Failed to book slot:', error);
      toast.error('ไม่สามารถจองช่วงเวลาได้');
    }
  };

  const eventStyleGetter = (event: InterviewSlot) => {
    let backgroundColor = '#3174ad';
    
    if (event.status === 'full') {
      backgroundColor = '#dc2626'; // Red for full slots
    } else if (event.status === 'past') {
      backgroundColor = '#6b7280'; // Gray for past slots
    } else if (event.status === 'available') {
      backgroundColor = '#059669'; // Green for available slots
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchInterviewSlots}>ลองใหม่</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ปฏิทินการสัมภาษณ์
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>ว่าง</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span>เต็ม</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span>ผ่านไปแล้ว</span>
            </div>
          </div>
        </div>
        
        <div style={{ height: '500px' }}>
          <Calendar
            localizer={localizer}
            events={availableSlots}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleSlotClick}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            defaultView="week"
            culture="th"
            messages={{
              next: "ถัดไป",
              previous: "ก่อนหน้า",
              today: "วันนี้",
              month: "เดือน",
              week: "สัปดาห์",
              day: "วัน",
              agenda: "กำหนดการ",
              date: "วันที่",
              time: "เวลา",
              event: "กิจกรรม",
              noEventsInRange: "ไม่มีการสัมภาษณ์ในช่วงนี้",
              showMore: (count) => `+ ดูเพิ่มเติม (${count})`
            }}
          />
        </div>
      </Card>

      {/* Slot Details Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              รายละเอียดการสัมภาษณ์
            </h3>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className="font-medium text-gray-700">ทุนการศึกษา:</span>
                <p className="text-gray-900">{selectedSlot.scholarshipName}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">วันที่และเวลา:</span>
                <p className="text-gray-900">
                  {format(selectedSlot.start, 'dd/MM/yyyy HH:mm', { locale: th })} - 
                  {format(selectedSlot.end, 'HH:mm', { locale: th })} น.
                </p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">สถานที่:</span>
                <p className="text-gray-900">{selectedSlot.location}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">จำนวนที่รับ:</span>
                <p className="text-gray-900">
                  {selectedSlot.currentApplicants}/{selectedSlot.maxApplicants} คน
                </p>
              </div>
              
              {selectedSlot.interviewers.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">ผู้สัมภาษณ์:</span>
                  <p className="text-gray-900">{selectedSlot.interviewers.join(', ')}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedSlot(null)}
                className="flex-1"
              >
                ปิด
              </Button>
              
              {userRole === 'student' && selectedSlot.status === 'available' && studentId && (
                <Button
                  onClick={() => handleBookSlot(selectedSlot.id)}
                  className="flex-1"
                >
                  จองเวลา
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 