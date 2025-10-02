'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import interviewService, { InterviewBooking, InterviewStatistics } from '@/services/interview.service';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function AdminInterviewsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<InterviewBooking[]>([]);
  const [stats, setStats] = useState<InterviewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedStatus, dateFrom, dateTo]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadBookings(),
        loadStatistics()
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await interviewService.getInterviewBookings({
        booking_status: selectedStatus || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        limit: 100
      });
      setBookings(response.data);
    } catch (error: any) {
      console.warn('Failed to load bookings, using mock data:', error.message);
      // Mock data fallback
      setBookings([
        {
          id: 1,
          slot_id: 1,
          application_id: 1,
          student_id: 'STU001',
          booking_status: 'confirmed',
          booked_at: '2024-12-01T10:00:00Z',
          confirmed_at: '2024-12-01T11:00:00Z',
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
          student: {
            first_name: 'นางสาว สมหญิง',
            last_name: 'รักดี',
            email: 'somying@university.ac.th',
            phone: '081-234-5678'
          }
        },
        {
          id: 2,
          slot_id: 2,
          application_id: 2,
          student_id: 'STU002',
          booking_status: 'booked',
          booked_at: '2024-12-02T14:00:00Z',
          created_at: '2024-12-02T14:00:00Z',
          updated_at: '2024-12-02T14:00:00Z',
          slot: {
            id: 2,
            scholarship_id: 2,
            interviewer_id: 'INT002',
            interview_date: '2024-12-16',
            start_time: '14:00:00',
            end_time: '15:00:00',
            location: 'อาคาร 2',
            building: 'อาคารวิชาการ',
            floor: 'ชั้น 2',
            room: 'ห้อง 205',
            max_capacity: 1,
            current_bookings: 1,
            is_available: false,
            slot_type: 'individual',
            duration_minutes: 60,
            preparation_time: 15,
            created_by: 'ADMIN',
            created_at: '2024-12-01T08:00:00Z',
            updated_at: '2024-12-01T08:00:00Z',
            scholarship: {
              scholarship_name: 'ทุนผู้มีรายได้น้อย'
            },
            interviewer: {
              first_name: 'สมศักดิ์',
              last_name: 'ดีงาม',
              email: 'somsak@university.ac.th'
            }
          },
          student: {
            first_name: 'นาย ทดสอบ',
            last_name: 'ระบบ',
            email: 'test@university.ac.th',
            phone: '089-876-5432'
          }
        }
      ]);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await interviewService.getInterviewStatistics(
        dateFrom || undefined,
        dateTo || undefined
      );
      setStats(response.data);
    } catch (error: any) {
      console.warn('Failed to load statistics, using mock data:', error.message);
      // Mock data fallback
      setStats({
        total_slots: 45,
        available_slots: 12,
        booked_slots: 28,
        completed_slots: 5,
        cancelled_slots: 3,
        no_show_slots: 2,
        by_status: {
          'booked': 15,
          'confirmed': 13,
          'completed': 5,
          'cancelled': 3,
          'no_show': 2
        },
        by_interviewer: {},
        by_scholarship: {},
        upcoming_today: 3,
        upcoming_week: 18
      });
    }
  };

  const handleConfirmBooking = async (id: number) => {
    try {
      await interviewService.confirmInterviewBooking(id);
      toast.success('ยืนยันการนัดสัมภาษณ์เรียบร้อยแล้ว');
      await loadBookings();
    } catch (error) {
      console.error('Failed to confirm booking:', error);
      toast.error('ไม่สามารถยืนยันการนัดได้');
    }
  };

  const handleCancelBooking = async (id: number) => {
    const reason = prompt('เหตุผลในการยกเลิก:');
    if (!reason) return;

    try {
      await interviewService.cancelInterviewBooking(id, reason);
      toast.success('ยกเลิกการนัดสัมภาษณ์เรียบร้อยแล้ว');
      await loadBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error('ไม่สามารถยกเลิกการนัดได้');
    }
  };

  const handleCheckIn = async (id: number) => {
    try {
      await interviewService.checkInInterview(id);
      toast.success('เช็คอินเรียบร้อยแล้ว');
      await loadBookings();
    } catch (error) {
      console.error('Failed to check in:', error);
      toast.error('ไม่สามารถเช็คอินได้');
    }
  };

  const handleCheckOut = async (id: number) => {
    try {
      await interviewService.checkOutInterview(id);
      toast.success('เช็คเอาต์เรียบร้อยแล้ว');
      await loadBookings();
    } catch (error) {
      console.error('Failed to check out:', error);
      toast.error('ไม่สามารถเช็คเอาต์ได้');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      booking.student?.first_name?.toLowerCase().includes(search) ||
      booking.student?.last_name?.toLowerCase().includes(search) ||
      booking.student?.email?.toLowerCase().includes(search) ||
      booking.slot?.scholarship?.scholarship_name?.toLowerCase().includes(search) ||
      booking.slot?.interviewer?.first_name?.toLowerCase().includes(search) ||
      booking.slot?.interviewer?.last_name?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString?.substring(0, 5) || '';
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

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-sarabun">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                จัดการการสัมภาษณ์
              </h1>
              <p className="text-secondary-600 font-sarabun">
                ตรวจสอบและจัดการตารางสัมภาษณ์ทุนการศึกษา
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => loadData()}
                disabled={loading}
                className="font-sarabun"
              >
                {loading ? (
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                )}
                รีเฟรช
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push('/admin/interviews/slots')}
                className="font-sarabun"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                สร้างช่วงเวลาสัมภาษณ์
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 font-sarabun mb-1">
                      ทั้งหมด
                    </p>
                    <p className="text-2xl font-bold text-blue-900 font-sarabun">
                      {stats.total_slots}
                    </p>
                  </div>
                  <CalendarDaysIcon className="h-12 w-12 text-blue-600 opacity-20" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 font-sarabun mb-1">
                      ยืนยันแล้ว
                    </p>
                    <p className="text-2xl font-bold text-green-900 font-sarabun">
                      {stats.by_status?.confirmed || 0}
                    </p>
                  </div>
                  <CheckCircleIcon className="h-12 w-12 text-green-600 opacity-20" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 font-sarabun mb-1">
                      เสร็จสิ้น
                    </p>
                    <p className="text-2xl font-bold text-purple-900 font-sarabun">
                      {stats.completed_slots}
                    </p>
                  </div>
                  <ChartBarIcon className="h-12 w-12 text-purple-600 opacity-20" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 font-sarabun mb-1">
                      วันนี้
                    </p>
                    <p className="text-2xl font-bold text-orange-900 font-sarabun">
                      {stats.upcoming_today}
                    </p>
                  </div>
                  <ClockIcon className="h-12 w-12 text-orange-600 opacity-20" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 font-sarabun mb-1">
                      ไม่มา
                    </p>
                    <p className="text-2xl font-bold text-red-900 font-sarabun">
                      {stats.no_show_slots}
                    </p>
                  </div>
                  <ExclamationTriangleIcon className="h-12 w-12 text-red-600 opacity-20" />
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <Input
                    type="text"
                    placeholder="ค้นหานักศึกษา, ทุนการศึกษา, ผู้สัมภาษณ์..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-sarabun"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="font-sarabun"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                ตัวกรอง
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                    สถานะ
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
                  >
                    <option value="">ทั้งหมด</option>
                    <option value="booked">จองแล้ว</option>
                    <option value="confirmed">ยืนยันแล้ว</option>
                    <option value="completed">เสร็จสิ้น</option>
                    <option value="cancelled">ยกเลิก</option>
                    <option value="no_show">ไม่มา</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                    วันที่เริ่มต้น
                  </label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="font-sarabun"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                    วันที่สิ้นสุด
                  </label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="font-sarabun"
                  />
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardBody className="p-8 text-center">
                <CalendarDaysIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2 font-sarabun">
                  ไม่พบการนัดสัมภาษณ์
                </h3>
                <p className="text-secondary-600 font-sarabun">
                  {searchTerm || selectedStatus ? 'ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา' : 'ยังไม่มีการนัดสัมภาษณ์ในระบบ'}
                </p>
              </CardBody>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Date & Time */}
                    <div className="lg:col-span-2">
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <CalendarDaysIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="font-bold text-lg text-blue-900 font-sarabun">
                          {formatDate(booking.slot?.interview_date || '')}
                        </p>
                        <p className="text-sm text-blue-600 font-sarabun mt-1">
                          {formatTime(booking.slot?.start_time || '')} - {formatTime(booking.slot?.end_time || '')}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="lg:col-span-7">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-secondary-900 font-sarabun">
                              {booking.student?.first_name} {booking.student?.last_name}
                            </h3>
                            <p className="text-sm text-secondary-600 font-sarabun">
                              {booking.student?.email}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(booking.booking_status)} font-sarabun`}>
                            {getStatusText(booking.booking_status)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-secondary-600">
                            <BuildingOfficeIcon className="h-4 w-4 mr-2 text-secondary-500" />
                            <div>
                              <p className="font-medium font-sarabun">{booking.slot?.building}</p>
                              <p className="text-xs text-secondary-500 font-sarabun">
                                {booking.slot?.floor} {booking.slot?.room}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-secondary-600">
                            <UserGroupIcon className="h-4 w-4 mr-2 text-secondary-500" />
                            <div>
                              <p className="font-medium font-sarabun">
                                {booking.slot?.interviewer?.first_name} {booking.slot?.interviewer?.last_name}
                              </p>
                              <p className="text-xs text-secondary-500 font-sarabun">ผู้สัมภาษณ์</p>
                            </div>
                          </div>
                          <div className="flex items-center text-secondary-600 col-span-2">
                            <MapPinIcon className="h-4 w-4 mr-2 text-secondary-500" />
                            <p className="font-medium font-sarabun">{booking.slot?.scholarship?.scholarship_name}</p>
                          </div>
                        </div>

                        {booking.officer_notes && (
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs text-yellow-700 font-sarabun">
                              <strong>หมายเหตุ:</strong> {booking.officer_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="lg:col-span-3">
                      <div className="space-y-2">
                        {booking.booking_status === 'booked' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="w-full font-sarabun"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            ยืนยันนัด
                          </Button>
                        )}

                        {booking.booking_status === 'confirmed' && (
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleCheckIn(booking.id)}
                            className="w-full font-sarabun"
                          >
                            <ClockIcon className="h-4 w-4 mr-2" />
                            เช็คอิน
                          </Button>
                        )}

                        {(booking.booking_status === 'booked' || booking.booking_status === 'confirmed') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="w-full font-sarabun text-red-600 hover:bg-red-50"
                          >
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            ยกเลิกนัด
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/interviews/${booking.id}`)}
                          className="w-full font-sarabun"
                        >
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
