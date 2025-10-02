'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import interviewService, { InterviewBooking } from '@/services/interview.service';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function InterviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [booking, setBooking] = useState<InterviewBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      loadBooking();
    }
  }, [id]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const response = await interviewService.getInterviewBooking(parseInt(id));
      setBooking(response.data);
      setNotes(response.data.officer_notes || '');
    } catch (error: any) {
      console.warn('Failed to load booking, using mock data:', error.message);
      // Mock data fallback
      setBooking({
        id: parseInt(id),
        slot_id: 1,
        application_id: 1,
        student_id: 'STU001',
        booking_status: 'confirmed',
        booked_at: '2024-12-01T10:00:00Z',
        confirmed_at: '2024-12-01T11:00:00Z',
        officer_notes: 'นักศึกษามีผลการเรียนดีมาก',
        student_notes: 'พร้อมนำเอกสารมาแสดง',
        created_at: '2024-12-01T10:00:00Z',
        updated_at: '2024-12-01T11:00:00Z',
        slot: {
          id: 1,
          scholarship_id: 1,
          interviewer_id: 'INT001',
          interview_date: '2024-12-15',
          start_time: '09:00:00',
          end_time: '10:00:00',
          location: 'อาคาร 1',
          building: 'อาคารอำนวยการ',
          floor: 'ชั้น 3',
          room: 'ห้อง 301',
          max_capacity: 1,
          current_bookings: 1,
          is_available: false,
          slot_type: 'individual',
          duration_minutes: 60,
          preparation_time: 15,
          notes: 'กรุณามาถึงก่อนเวลา 15 นาที',
          created_by: 'ADMIN',
          created_at: '2024-12-01T08:00:00Z',
          updated_at: '2024-12-01T08:00:00Z',
          scholarship: {
            scholarship_name: 'ทุนเรียนดี'
          },
          interviewer: {
            first_name: 'สมชาย',
            last_name: 'ใจดี',
            email: 'somchai@university.ac.th'
          }
        },
        application: {
          id: 1,
          scholarship_id: 1,
          student_id: 'STU001',
          gpa: 3.85,
          faculty: 'คณะวิศวกรรมศาสตร์',
          year: 3,
          family_income: 180000
        },
        student: {
          id: 'STU001',
          student_id: '6388001',
          first_name: 'สมหญิง',
          last_name: 'รักดี',
          email: 'somying@university.ac.th',
          phone: '081-234-5678',
          faculty: 'คณะวิศวกรรมศาสตร์',
          year: 3
        }
      });
      setNotes('นักศึกษามีผลการเรียนดีมาก');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!booking) return;
    try {
      setSaving(true);
      await interviewService.confirmInterviewBooking(booking.id);
      toast.success('ยืนยันการนัดสัมภาษณ์เรียบร้อยแล้ว');
      await loadBooking();
    } catch (error) {
      console.error('Failed to confirm:', error);
      toast.error('ไม่สามารถยืนยันการนัดได้');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    const reason = prompt('เหตุผลในการยกเลิก:');
    if (!reason) return;

    try {
      setSaving(true);
      await interviewService.cancelInterviewBooking(booking.id, reason);
      toast.success('ยกเลิกการนัดสัมภาษณ์เรียบร้อยแล้ว');
      await loadBooking();
    } catch (error) {
      console.error('Failed to cancel:', error);
      toast.error('ไม่สามารถยกเลิกการนัดได้');
    } finally {
      setSaving(false);
    }
  };

  const handleCheckIn = async () => {
    if (!booking) return;
    try {
      setSaving(true);
      await interviewService.checkInInterview(booking.id);
      toast.success('เช็คอินเรียบร้อยแล้ว');
      await loadBooking();
    } catch (error) {
      console.error('Failed to check in:', error);
      toast.error('ไม่สามารถเช็คอินได้');
    } finally {
      setSaving(false);
    }
  };

  const handleCheckOut = async () => {
    if (!booking) return;
    try {
      setSaving(true);
      await interviewService.checkOutInterview(booking.id);
      toast.success('เช็คเอาต์เรียบร้อยแล้ว');
      await loadBooking();
    } catch (error) {
      console.error('Failed to check out:', error);
      toast.error('ไม่สามารถเช็คเอาต์ได้');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!booking) return;
    try {
      setSaving(true);
      await interviewService.updateInterviewBooking(booking.id, {
        officer_notes: notes
      });
      toast.success('บันทึกหมายเหตุเรียบร้อยแล้ว');
      setIsEditingNotes(false);
      await loadBooking();
    } catch (error) {
      console.error('Failed to save notes:', error);
      toast.error('ไม่สามารถบันทึกหมายเหตุได้');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString?.substring(0, 5) || '';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'booked': 'bg-blue-100 text-blue-800 border-blue-200',
      'confirmed': 'bg-green-100 text-green-800 border-green-200',
      'completed': 'bg-purple-100 text-purple-800 border-purple-200',
      'cancelled': 'bg-gray-100 text-gray-800 border-gray-200',
      'no_show': 'bg-red-100 text-red-800 border-red-200',
      'rescheduled': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'booked': 'จองแล้ว',
      'confirmed': 'ยืนยันแล้ว',
      'completed': 'เสร็จสิ้น',
      'cancelled': 'ยกเลิก',
      'no_show': 'ไม่มา',
      'rescheduled': 'เลื่อนนัด'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-sarabun">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="p-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2 font-sarabun">
              ไม่พบข้อมูล
            </h3>
            <p className="text-secondary-600 font-sarabun mb-4">
              ไม่พบการนัดสัมภาษณ์ที่ระบุ
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/interviews')}
              className="font-sarabun"
            >
              กลับหน้ารายการ
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/interviews')}
            className="font-sarabun mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            กลับ
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                รายละเอียดการสัมภาษณ์
              </h1>
              <p className="text-secondary-600 font-sarabun">
                รหัสการจอง: #{booking.id}
              </p>
            </div>
            <Badge className={`${getStatusColor(booking.booking_status)} text-lg px-4 py-2 font-sarabun`}>
              {getStatusText(booking.booking_status)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interview Schedule */}
            <Card>
              <CardHeader className="border-b border-secondary-200">
                <CardTitle className="text-lg font-sarabun flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-2 text-primary-600" />
                  กำหนดการสัมภาษณ์
                </CardTitle>
              </CardHeader>
              <CardBody className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      วันที่
                    </label>
                    <div className="flex items-center text-secondary-900">
                      <CalendarDaysIcon className="h-5 w-5 mr-2 text-secondary-500" />
                      <span className="font-sarabun">{formatDate(booking.slot?.interview_date || '')}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      เวลา
                    </label>
                    <div className="flex items-center text-secondary-900">
                      <ClockIcon className="h-5 w-5 mr-2 text-secondary-500" />
                      <span className="font-sarabun">
                        {formatTime(booking.slot?.start_time || '')} - {formatTime(booking.slot?.end_time || '')}
                      </span>
                      <span className="ml-2 text-sm text-secondary-500 font-sarabun">
                        ({booking.slot?.duration_minutes} นาที)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      สถานที่
                    </label>
                    <div className="flex items-center text-secondary-900">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2 text-secondary-500" />
                      <div>
                        <p className="font-sarabun">{booking.slot?.building}</p>
                        <p className="text-sm text-secondary-600 font-sarabun">
                          {booking.slot?.floor} {booking.slot?.room}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ผู้สัมภาษณ์
                    </label>
                    <div className="flex items-center text-secondary-900">
                      <UserGroupIcon className="h-5 w-5 mr-2 text-secondary-500" />
                      <div>
                        <p className="font-sarabun">
                          {booking.slot?.interviewer?.first_name} {booking.slot?.interviewer?.last_name}
                        </p>
                        <p className="text-sm text-secondary-600 font-sarabun">
                          {booking.slot?.interviewer?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.slot?.notes && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 font-sarabun">
                      <strong>หมายเหตุ:</strong> {booking.slot.notes}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Student Information */}
            <Card>
              <CardHeader className="border-b border-secondary-200">
                <CardTitle className="text-lg font-sarabun flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
                  ข้อมูลนักศึกษา
                </CardTitle>
              </CardHeader>
              <CardBody className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ชื่อ-นามสกุล
                    </label>
                    <p className="text-lg font-bold text-secondary-900 font-sarabun">
                      {booking.student?.first_name} {booking.student?.last_name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      รหัสนักศึกษา
                    </label>
                    <p className="text-secondary-900 font-sarabun">{booking.student?.student_id}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      อีเมล
                    </label>
                    <div className="flex items-center text-secondary-900">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-secondary-500" />
                      <a href={`mailto:${booking.student?.email}`} className="text-blue-600 hover:underline font-sarabun">
                        {booking.student?.email}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      เบอร์โทร
                    </label>
                    <div className="flex items-center text-secondary-900">
                      <PhoneIcon className="h-4 w-4 mr-2 text-secondary-500" />
                      <a href={`tel:${booking.student?.phone}`} className="text-blue-600 hover:underline font-sarabun">
                        {booking.student?.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      คณะ
                    </label>
                    <p className="text-secondary-900 font-sarabun">{booking.student?.faculty}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ชั้นปี
                    </label>
                    <p className="text-secondary-900 font-sarabun">ปี {booking.student?.year}</p>
                  </div>

                  {booking.application && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                          GPA
                        </label>
                        <p className="text-lg font-bold text-green-600 font-sarabun">
                          {booking.application.gpa}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                          รายได้ครอบครัว
                        </label>
                        <p className="text-secondary-900 font-sarabun">
                          {formatCurrency(booking.application.family_income)}/ปี
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader className="border-b border-secondary-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-sarabun flex items-center">
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-2 text-primary-600" />
                    หมายเหตุ
                  </CardTitle>
                  {!isEditingNotes && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingNotes(true)}
                      className="font-sarabun"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      แก้ไข
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody className="p-6">
                {booking.student_notes && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-1 font-sarabun">
                      หมายเหตุจากนักศึกษา:
                    </p>
                    <p className="text-sm text-blue-800 font-sarabun">{booking.student_notes}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                    หมายเหตุจากเจ้าหน้าที่:
                  </label>
                  {isEditingNotes ? (
                    <div>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
                        placeholder="เพิ่มหมายเหตุ..."
                      />
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="primary"
                          onClick={handleSaveNotes}
                          disabled={saving}
                          className="font-sarabun"
                        >
                          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditingNotes(false);
                            setNotes(booking.officer_notes || '');
                          }}
                          className="font-sarabun"
                        >
                          ยกเลิก
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                      <p className="text-sm text-secondary-700 font-sarabun">
                        {booking.officer_notes || 'ยังไม่มีหมายเหตุ'}
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Actions & Timeline */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader className="border-b border-secondary-200">
                <CardTitle className="text-lg font-sarabun">การดำเนินการ</CardTitle>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-3">
                  {booking.booking_status === 'booked' && (
                    <Button
                      variant="success"
                      onClick={handleConfirm}
                      disabled={saving}
                      className="w-full font-sarabun"
                    >
                      {saving ? (
                        <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                      )}
                      ยืนยันการนัด
                    </Button>
                  )}

                  {booking.booking_status === 'confirmed' && (
                    <Button
                      variant="info"
                      onClick={handleCheckIn}
                      disabled={saving}
                      className="w-full font-sarabun"
                    >
                      {saving ? (
                        <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ClockIcon className="h-4 w-4 mr-2" />
                      )}
                      เช็คอิน
                    </Button>
                  )}

                  {booking.check_in_time && !booking.check_out_time && (
                    <Button
                      variant="success"
                      onClick={handleCheckOut}
                      disabled={saving}
                      className="w-full font-sarabun"
                    >
                      {saving ? (
                        <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                      )}
                      เช็คเอาต์
                    </Button>
                  )}

                  {(booking.booking_status === 'booked' || booking.booking_status === 'confirmed') && (
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={saving}
                      className="w-full font-sarabun text-red-600 hover:bg-red-50"
                    >
                      {saving ? (
                        <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 mr-2" />
                      )}
                      ยกเลิกการนัด
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => router.push(`/admin/applications/${booking.application_id}`)}
                    className="w-full font-sarabun"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    ดูใบสมัคร
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Scholarship Info */}
            <Card>
              <CardHeader className="border-b border-secondary-200">
                <CardTitle className="text-lg font-sarabun flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-primary-600" />
                  ทุนการศึกษา
                </CardTitle>
              </CardHeader>
              <CardBody className="p-6">
                <p className="font-bold text-lg text-secondary-900 font-sarabun mb-2">
                  {booking.slot?.scholarship?.scholarship_name}
                </p>
              </CardBody>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="border-b border-secondary-200">
                <CardTitle className="text-lg font-sarabun">ประวัติการดำเนินการ</CardTitle>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm font-medium text-secondary-900 font-sarabun">จองเวลาสัมภาษณ์</p>
                      <p className="text-xs text-secondary-500 font-sarabun">
                        {formatDateTime(booking.booked_at)}
                      </p>
                    </div>
                  </div>

                  {booking.confirmed_at && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 font-sarabun">ยืนยันการนัด</p>
                        <p className="text-xs text-secondary-500 font-sarabun">
                          {formatDateTime(booking.confirmed_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.check_in_time && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 font-sarabun">เช็คอิน</p>
                        <p className="text-xs text-secondary-500 font-sarabun">
                          {formatDateTime(booking.check_in_time)}
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.check_out_time && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 font-sarabun">เช็คเอาต์</p>
                        <p className="text-xs text-secondary-500 font-sarabun">
                          {formatDateTime(booking.check_out_time)}
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.cancelled_at && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-red-500"></div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 font-sarabun">ยกเลิกการนัด</p>
                        <p className="text-xs text-secondary-500 font-sarabun">
                          {formatDateTime(booking.cancelled_at)}
                        </p>
                        {booking.cancellation_reason && (
                          <p className="text-xs text-red-600 font-sarabun mt-1">
                            เหตุผล: {booking.cancellation_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
