'use client';

import React, { useState } from 'react';
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  EyeIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface InterviewSchedule {
  id: string;
  applicationId: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  faculty: string;
  year: number;
  gpa: number;
  scholarshipName: string;
  scholarshipAmount: number;
  date: string;
  time: string;
  duration: number;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress' | 'no_show';
  evaluationStatus: 'pending' | 'completed';
  interviewerNotes?: string;
  priority: 'high' | 'medium' | 'low';
}

export default function InterviewerSchedulesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: 'ผศ.ดร. สมปอง วิชาการดี',
    role: 'ผู้สัมภาษณ์',
    email: 'interviewer@university.ac.th',
    department: 'คณะสาธารณสุขศาสตร์'
  };

  // Mock data
  const schedules: InterviewSchedule[] = [
    {
      id: 'INT001',
      applicationId: 'APP001',
      studentName: 'นางสาว สมใจ ใจดี',
      studentId: '6388001',
      studentEmail: 'somjai.j@student.mahidol.ac.th',
      faculty: 'คณะวิทยาศาสตร์',
      year: 3,
      gpa: 3.75,
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      scholarshipAmount: 20000,
      date: '2024-01-25',
      time: '09:00',
      duration: 30,
      location: 'ห้องประชุม A',
      status: 'scheduled',
      evaluationStatus: 'pending',
      priority: 'high'
    },
    {
      id: 'INT002',
      applicationId: 'APP002',
      studentName: 'นาย วิชัย เก่งมาก',
      studentId: '6388002',
      studentEmail: 'wichai.k@student.mahidol.ac.th',
      faculty: 'คณะวิศวกรรมศาสตร์',
      year: 4,
      gpa: 3.95,
      scholarshipName: 'ทุนเรียนดี',
      scholarshipAmount: 15000,
      date: '2024-01-25',
      time: '10:30',
      duration: 30,
      location: 'ห้องประชุม A',
      status: 'completed',
      evaluationStatus: 'completed',
      priority: 'high',
      interviewerNotes: 'นักศึกษามีความรู้ความสามารถดี มีแรงจูงใจในการเรียนสูง'
    },
    {
      id: 'INT003',
      applicationId: 'APP005',
      studentName: 'นางสาว มานี ขยันเรียน',
      studentId: '6388005',
      studentEmail: 'manee.k@student.mahidol.ac.th',
      faculty: 'คณะพยาบาลศาสตร์',
      year: 3,
      gpa: 3.65,
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      scholarshipAmount: 20000,
      date: '2024-01-25',
      time: '14:00',
      duration: 30,
      location: 'ห้องประชุม B',
      status: 'scheduled',
      evaluationStatus: 'pending',
      priority: 'medium'
    },
    {
      id: 'INT004',
      applicationId: 'APP007',
      studentName: 'นาย ธนากร ดีเยี่ยม',
      studentId: '6388007',
      studentEmail: 'thanakorn.d@student.mahidol.ac.th',
      faculty: 'คณะแพทยศาสตร์',
      year: 2,
      gpa: 3.85,
      scholarshipName: 'ทุนส่งเสริมการศึกษา',
      scholarshipAmount: 25000,
      date: '2024-01-26',
      time: '09:30',
      duration: 45,
      location: 'ห้องประชุม C',
      status: 'scheduled',
      evaluationStatus: 'pending',
      priority: 'high'
    },
    {
      id: 'INT005',
      applicationId: 'APP008',
      studentName: 'นางสาว พิมพ์ใจ สุขใส',
      studentId: '6388008',
      studentEmail: 'pimjai.s@student.mahidol.ac.th',
      faculty: 'คณะเศรษฐศาสตร์',
      year: 1,
      gpa: 3.45,
      scholarshipName: 'ทุนช่วยเหลือนักศึกษา',
      scholarshipAmount: 10000,
      date: '2024-01-26',
      time: '11:00',
      duration: 30,
      location: 'ห้องประชุม A',
      status: 'no_show',
      evaluationStatus: 'pending',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200';
      case 'in_progress': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'no_show': return 'text-orange-700 bg-orange-50 border-orange-200';
      default: return 'text-purple-700 bg-purple-50 border-purple-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      case 'in_progress': return 'กำลังดำเนินการ';
      case 'no_show': return 'ไม่มาสัมภาษณ์';
      default: return 'กำหนดการ';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled': return <XCircleIcon className="h-4 w-4" />;
      case 'in_progress': return <ClockIcon className="h-4 w-4" />;
      case 'no_show': return <XCircleIcon className="h-4 w-4" />;
      default: return <CalendarDaysIcon className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.studentId.includes(searchTerm) ||
                         schedule.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || schedule.date === selectedDate;
    const matchesStatus = selectedStatus === 'all' || schedule.status === selectedStatus;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  const stats = {
    total: schedules.length,
    today: schedules.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
    scheduled: schedules.filter(s => s.status === 'scheduled').length,
    completed: schedules.filter(s => s.status === 'completed').length,
    pending: schedules.filter(s => s.evaluationStatus === 'pending').length
  };

  const groupSchedulesByDate = (schedules: InterviewSchedule[]) => {
    const grouped = schedules.reduce((acc, schedule) => {
      const date = schedule.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(schedule);
      return acc;
    }, {} as Record<string, InterviewSchedule[]>);

    // Sort schedules within each date by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.time.localeCompare(b.time));
    });

    return grouped;
  };

  const groupedSchedules = groupSchedulesByDate(filteredSchedules);

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      {/* Header - Fixed at top */}
      <Header 
        user={user}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Content Area - Flexbox layout */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar 
          userRole="interviewer"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8">
          <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-8xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              ตารางการสัมภาษณ์
            </h1>
            <p className="text-secondary-600 font-sarabun">
              จัดการและติดตามการสัมภาษณ์ทุนการศึกษา
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="font-sarabun"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              ตัวกรอง
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-600 font-sarabun">ทั้งหมด</p>
                <p className="text-2xl font-bold text-purple-900 font-sarabun">{stats.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-600 font-sarabun">วันนี้</p>
                <p className="text-2xl font-bold text-blue-900 font-sarabun">{stats.today}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-indigo-600 font-sarabun">กำหนดการ</p>
                <p className="text-2xl font-bold text-indigo-900 font-sarabun">{stats.scheduled}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-600 font-sarabun">เสร็จสิ้น</p>
                <p className="text-2xl font-bold text-green-900 font-sarabun">{stats.completed}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <PencilIcon className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-600 font-sarabun">รอประเมิน</p>
                <p className="text-2xl font-bold text-yellow-900 font-sarabun">{stats.pending}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <Input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อนักศึกษา รหัสนักศึกษา หรือชื่อทุน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-sarabun"
                />
              </div>
            </div>
            
            {showFilters && (
              <>
                <div className="w-full lg:w-48">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-sarabun"
                  />
                </div>

                <div className="w-full lg:w-48">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-sarabun"
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="scheduled">กำหนดการ</option>
                    <option value="in_progress">กำลังดำเนินการ</option>
                    <option value="completed">เสร็จสิ้น</option>
                    <option value="cancelled">ยกเลิก</option>
                    <option value="no_show">ไม่มาสัมภาษณ์</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Schedule List */}
      <div className="space-y-6">
        {Object.keys(groupedSchedules).sort().map(date => (
          <Card key={date}>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-secondary-200">
              <CardTitle className="font-sarabun flex items-center">
                <CalendarDaysIcon className="h-5 w-5 text-purple-600 mr-2" />
                {new Date(date).toLocaleDateString('th-TH', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                <span className="ml-2 text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {groupedSchedules[date].length} การสัมภาษณ์
                </span>
              </CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-secondary-200">
                {groupedSchedules[date].map((schedule) => (
                  <div key={schedule.id} className="p-6 hover:bg-secondary-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Time */}
                        <div className="text-center min-w-[80px]">
                          <div className="text-lg font-bold text-purple-600 font-sarabun">
                            {schedule.time}
                          </div>
                          <div className="text-xs text-secondary-500 font-sarabun">
                            {schedule.duration} นาที
                          </div>
                        </div>

                        {/* Student Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-secondary-900 font-sarabun">
                                {schedule.studentName}
                              </h3>
                              <p className="text-sm text-secondary-600 font-sarabun">
                                {schedule.studentId} • {schedule.faculty} • ปี {schedule.year}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm font-medium text-secondary-900 font-sarabun">
                                {schedule.scholarshipName}
                              </p>
                              <p className="text-sm text-secondary-600 font-sarabun">
                                จำนวน: {schedule.scholarshipAmount.toLocaleString()} บาท
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-secondary-600 font-sarabun flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {schedule.location}
                              </p>
                              <p className="text-sm text-secondary-600 font-sarabun">
                                GPA: {schedule.gpa}
                              </p>
                            </div>
                          </div>

                          {schedule.interviewerNotes && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-3">
                              <p className="text-sm text-blue-800 font-sarabun">
                                <strong>บันทึก:</strong> {schedule.interviewerNotes}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-sarabun ${getStatusColor(schedule.status)}`}>
                              {getStatusIcon(schedule.status)}
                              <span className="ml-1">{getStatusText(schedule.status)}</span>
                            </span>
                            
                            <span className={`text-sm font-medium font-sarabun ${getPriorityColor(schedule.priority)}`}>
                              ความสำคัญ: {schedule.priority === 'high' ? 'สูง' : schedule.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
                            </span>

                            {schedule.evaluationStatus === 'pending' && schedule.status === 'completed' && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-sarabun">
                                รอประเมินผล
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="outline" className="font-sarabun">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          ดูข้อมูล
                        </Button>

                        {schedule.status === 'scheduled' && (
                          <Button 
                            size="sm" 
                            variant="primary" 
                            className="font-sarabun"
                            onClick={() => window.location.href = `/interviewer/interview/${schedule.id}`}
                          >
                            <PlayIcon className="h-4 w-4 mr-1" />
                            เริ่มสัมภาษณ์
                          </Button>
                        )}

                        {schedule.status === 'in_progress' && (
                          <Button size="sm" variant="success" className="font-sarabun">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            เสร็จสิ้น
                          </Button>
                        )}

                        {schedule.evaluationStatus === 'pending' && schedule.status === 'completed' && (
                          <Button size="sm" variant="warning" className="font-sarabun">
                            <PencilIcon className="h-4 w-4 mr-1" />
                            ประเมินผล
                          </Button>
                        )}

                        {schedule.evaluationStatus === 'completed' && (
                          <Button size="sm" variant="outline" className="font-sarabun">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            ดูผลประเมิน
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}

        {Object.keys(groupedSchedules).length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-secondary-400" />
              <h3 className="mt-2 text-sm font-medium text-secondary-900 font-sarabun">ไม่พบการสัมภาษณ์</h3>
              <p className="mt-1 text-sm text-secondary-500 font-sarabun">
                ไม่มีการสัมภาษณ์ที่ตรงกับเงื่อนไขการค้นหา
              </p>
            </CardBody>
          </Card>
        )}
      </div>
          </div>
        </main>
      </div>
    </div>
  );
}
