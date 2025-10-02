'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface InterviewSchedule {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  scholarshipName: string;
  scholarshipAmount: number;
  date: string;
  time: string;
  duration: number;
  location: string;
  building?: string;
  floor?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  interviewers: Interviewer[];
  studentGpa: number;
  studentFaculty: string;
  studentYear: number;
  priority: 'high' | 'medium' | 'low';
  scheduledBy: string;
  scheduledDate: string;
  lastUpdate: string;
  notes?: string;
  result?: InterviewResult;
  preparationNotes?: string;
  requirements?: string[];
}

interface Interviewer {
  id: string;
  name: string;
  title: string;
  department: string;
  email?: string;
  phone?: string;
  role: 'primary' | 'secondary';
}

interface InterviewResult {
  overallScore: number;
  maxScore: number;
  recommendation: 'highly_recommended' | 'recommended' | 'not_recommended';
  feedback: string;
  submittedDate: string;
  submittedBy: string;
  criteria: {
    academic: number;
    motivation: number;
    communication: number;
    potential: number;
    financial_need: number;
  };
}

const OfficerInterviewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterviews, setSelectedInterviews] = useState<string[]>([]);


  const interviews: InterviewSchedule[] = [
    {
      id: 'INT001',
      applicationId: 'APP001',
      studentId: '6388001',
      studentName: 'นางสาว สมใจ ใจดี',
      studentEmail: 'somjai.j@student.mahidol.ac.th',
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      scholarshipAmount: 20000,
      date: '2024-12-18',
      time: '14:00',
      duration: 30,
      location: 'ห้อง SC 301',
      building: 'อาคารศูนย์การเรียนรู้',
      floor: 'ชั้น 3',
      status: 'confirmed',
      studentGpa: 3.75,
      studentFaculty: 'คณะสาธารณสุขศาสตร์',
      studentYear: 3,
      priority: 'high',
      scheduledBy: 'วิไลวรรณ จัดการดี',
      scheduledDate: '2024-12-10',
      lastUpdate: '2024-12-12',
      interviewers: [
        {
          id: 'INT_001',
          name: 'ผศ.ดร. สมปอง วิชาการดี',
          title: 'ผู้อำนวยการกองทุน',
          department: 'คณะสาธารณสุขศาสตร์',
          email: 'sompong.w@mahidol.ac.th',
          phone: '02-441-9000 ต่อ 1234',
          role: 'primary'
        },
        {
          id: 'INT_002',
          name: 'อ.ดร. วิไลวรรณ จัดการดี',
          title: 'เจ้าหน้าที่ทุนการศึกษา',
          department: 'งานกิจการนักศึกษา',
          email: 'wilaiwan.j@mahidol.ac.th',
          role: 'secondary'
        }
      ],
      preparationNotes: 'นักศึกษามีผลการเรียนดีและมีกิจกรรมเสริมหลากหลาย ควรสอบถามเกี่ยวกับแผนการใช้ทุน',
      requirements: [
        'บัตรประชาชนหรือบัตรนักศึกษา',
        'สำเนาใบแสดงผลการเรียนล่าสุด',
        'แผนการใช้ทุนการศึกษา (1 หน้า)'
      ]
    },
    {
      id: 'INT002',
      applicationId: 'APP002',
      studentId: '6388002',
      studentName: 'นายสมชาย ขยันเรียน',
      studentEmail: 'somchai.k@student.mahidol.ac.th',
      scholarshipName: 'ทุนเรียนดี',
      scholarshipAmount: 15000,
      date: '2024-12-05',
      time: '10:00',
      duration: 45,
      location: 'ห้อง AD 205',
      building: 'อาคารบริหาร',
      floor: 'ชั้น 2',
      status: 'completed',
      studentGpa: 3.85,
      studentFaculty: 'คณะแพทยศาสตร์',
      studentYear: 2,
      priority: 'high',
      scheduledBy: 'วิไลวรรณ จัดการดี',
      scheduledDate: '2024-11-25',
      lastUpdate: '2024-12-05',
      interviewers: [
        {
          id: 'INT_003',
          name: 'รศ.ดร. อนุชา เก่งมาก',
          title: 'หัวหน้าคณะกรรมการทุน',
          department: 'คณะแพทยศาสตร์',
          email: 'anucha.k@mahidol.ac.th',
          role: 'primary'
        }
      ],
      result: {
        overallScore: 85,
        maxScore: 100,
        recommendation: 'highly_recommended',
        feedback: 'นักศึกษามีแรงจูงใจในการเรียนสูง มีแผนการใช้ทุนที่ชัดเจน และมีความรับผิดชอบต่อสังคม แนะนำให้ได้รับทุนการศึกษา',
        submittedDate: '2024-12-05',
        submittedBy: 'รศ.ดร. อนุชา เก่งมาก',
        criteria: {
          academic: 18,
          motivation: 17,
          communication: 16,
          potential: 17,
          financial_need: 17
        }
      }
    },
    {
      id: 'INT003',
      applicationId: 'APP003',
      studentId: '6388003',
      studentName: 'นางสาว อานิสา เก่งมาก',
      studentEmail: 'anisa.k@student.mahidol.ac.th',
      scholarshipName: 'ทุนช่วยเหลือการศึกษา',
      scholarshipAmount: 12000,
      date: '2024-12-22',
      time: '09:30',
      duration: 30,
      location: 'ห้อง SW 102',
      building: 'อาคารสวัสดิการนักศึกษา',
      floor: 'ชั้น 1',
      status: 'scheduled',
      studentGpa: 3.25,
      studentFaculty: 'คณะพยาบาลศาสตร์',
      studentYear: 4,
      priority: 'medium',
      scheduledBy: 'วิไลวรรณ จัดการดี',
      scheduledDate: '2024-12-15',
      lastUpdate: '2024-12-15',
      interviewers: [
        {
          id: 'INT_004',
          name: 'อ.สมหมาย ช่วยเหลือ',
          title: 'เจ้าหน้าที่สวัสดิการ',
          department: 'กองกิจการนักศึกษา',
          email: 'sommai.c@mahidol.ac.th',
          phone: '02-441-9000 ต่อ 5678',
          role: 'primary'
        }
      ],
      preparationNotes: 'ตรวจสอบเอกสารรายได้ครอบครัวและสถานการณ์ทางการเงิน'
    },
    {
      id: 'INT004',
      applicationId: 'APP004',
      studentId: '6388004',
      studentName: 'นายธนกร เรียนเก่ง',
      studentEmail: 'thanakorn.r@student.mahidol.ac.th',
      scholarshipName: 'ทุนวิจัยระดับปริญญาตรี',
      scholarshipAmount: 25000,
      date: '2024-11-28',
      time: '16:00',
      duration: 60,
      location: 'ห้อง RS 401',
      building: 'อาคารวิจัย',
      floor: 'ชั้น 4',
      status: 'no_show',
      studentGpa: 3.90,
      studentFaculty: 'คณะวิทยาศาสตร์',
      studentYear: 4,
      priority: 'high',
      scheduledBy: 'วิไลวรรณ จัดการดี',
      scheduledDate: '2024-11-20',
      lastUpdate: '2024-11-28',
      interviewers: [
        {
          id: 'INT_005',
          name: 'ศ.ดร. วิจัย ค้นคว้า',
          title: 'หัวหน้าศูนย์วิจัย',
          department: 'สำนักงานคণะกรรมการวิจัย',
          email: 'wichai.k@mahidol.ac.th',
          role: 'primary'
        }
      ],
      notes: 'นักศึกษาไม่มาสัมภาษณ์ ติดต่อแล้วแจ้งว่าลืม ขอจัดสัมภาษณ์ใหม่'
    },
    {
      id: 'INT005',
      applicationId: 'APP005',
      studentId: '6388005',
      studentName: 'นางสาว มาลี สวยงาม',
      studentEmail: 'malee.s@student.mahidol.ac.th',
      scholarshipName: 'ทุนกิจกรรมนักศึกษา',
      scholarshipAmount: 8000,
      date: '2024-12-20',
      time: '13:30',
      duration: 30,
      location: 'ห้อง AC 201',
      building: 'อาคารกิจกรรม',
      floor: 'ชั้น 2',
      status: 'rescheduled',
      studentGpa: 2.85,
      studentFaculty: 'คณะศิลปศาสตร์',
      studentYear: 2,
      priority: 'low',
      scheduledBy: 'วิไลวรรณ จัดการดี',
      scheduledDate: '2024-12-08',
      lastUpdate: '2024-12-16',
      interviewers: [
        {
          id: 'INT_006',
          name: 'อ.กิจกรรม สนใจ',
          title: 'เจ้าหน้าที่กิจกรรม',
          department: 'กองกิจการนักศึกษา',
          email: 'kijkarn.s@mahidol.ac.th',
          role: 'primary'
        }
      ],
      notes: 'เลื่อนจากวันที่ 15/12 เนื่องจากนักศึกษาป่วย'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'ทุกสถานะ' },
    { value: 'scheduled', label: 'จองแล้ว' },
    { value: 'confirmed', label: 'ยืนยันแล้ว' },
    { value: 'completed', label: 'เสร็จสิ้น' },
    { value: 'cancelled', label: 'ยกเลิก' },
    { value: 'no_show', label: 'ไม่มาสัมภาษณ์' },
    { value: 'rescheduled', label: 'เลื่อนนัด' }
  ];

  const dateOptions = [
    { value: 'all', label: 'ทุกวัน' },
    { value: 'today', label: 'วันนี้' },
    { value: 'tomorrow', label: 'พรุ่งนี้' },
    { value: 'this_week', label: 'สัปดาห์นี้' },
    { value: 'next_week', label: 'สัปดาห์หน้า' }
  ];

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.studentId.includes(searchTerm) ||
                         interview.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || interview.status === selectedStatus;
    
    let matchesDate = true;
    if (selectedDate !== 'all') {
      const today = new Date();
      const interviewDate = new Date(interview.date);
      
      switch (selectedDate) {
        case 'today':
          matchesDate = interviewDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDate = interviewDate.toDateString() === tomorrow.toDateString();
          break;
        case 'this_week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = interviewDate >= weekStart && interviewDate <= weekEnd;
          break;
        case 'next_week':
          const nextWeekStart = new Date(today);
          nextWeekStart.setDate(today.getDate() - today.getDay() + 7);
          const nextWeekEnd = new Date(nextWeekStart);
          nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
          matchesDate = interviewDate >= nextWeekStart && interviewDate <= nextWeekEnd;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'no_show': return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'จองแล้ว';
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      case 'no_show': return 'ไม่มาสัมภาษณ์';
      case 'rescheduled': return 'เลื่อนนัด';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return CalendarDaysIcon;
      case 'confirmed': return CheckCircleIcon;
      case 'completed': return StarIcon;
      case 'cancelled': return XCircleIcon;
      case 'no_show': return ExclamationTriangleIcon;
      case 'rescheduled': return ClockIcon;
      default: return CalendarDaysIcon;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'สูง';
      case 'medium': return 'ปานกลาง';
      case 'low': return 'ต่ำ';
      default: return 'ไม่ระบุ';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'highly_recommended': return 'text-green-600';
      case 'recommended': return 'text-blue-600';
      case 'not_recommended': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'highly_recommended': return 'แนะนำอย่างยิ่ง';
      case 'recommended': return 'แนะนำ';
      case 'not_recommended': return 'ไม่แนะนำ';
      default: return 'ไม่ระบุ';
    }
  };

  const getDaysUntil = (date: string) => {
    const today = new Date();
    const interviewDate = new Date(date);
    const diffTime = interviewDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statistics = {
    total: interviews.length,
    today: interviews.filter(i => {
      const today = new Date().toDateString();
      return new Date(i.date).toDateString() === today;
    }).length,
    thisWeek: interviews.filter(i => {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const interviewDate = new Date(i.date);
      return interviewDate >= weekStart && interviewDate <= weekEnd;
    }).length,
    completed: interviews.filter(i => i.status === 'completed').length,
    pending: interviews.filter(i => ['scheduled', 'confirmed'].includes(i.status)).length,
    noShow: interviews.filter(i => i.status === 'no_show').length
  };

  const handleSelectInterview = (interviewId: string) => {
    setSelectedInterviews(prev => 
      prev.includes(interviewId) 
        ? prev.filter(id => id !== interviewId)
        : [...prev, interviewId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInterviews.length === filteredInterviews.length) {
      setSelectedInterviews([]);
    } else {
      setSelectedInterviews(filteredInterviews.map(interview => interview.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for interviews:`, selectedInterviews);
    setSelectedInterviews([]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                  จัดการการสัมภาษณ์
                </h1>
                <p className="text-secondary-600 font-sarabun">
                  จัดตารางและติดตามการสัมภาษณ์ทุนการศึกษา
                </p>
              </div>
              <div className="flex space-x-3">
                {selectedInterviews.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('reschedule')} className="font-sarabun">
                    เลื่อนนัด ({selectedInterviews.length})
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={() => setShowScheduleModal(true)}
                  className="font-sarabun"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  จัดตารางใหม่
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                  <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.total}</p>
                <p className="text-sm text-secondary-600 font-sarabun">ทั้งหมด</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
                  <ClockIcon className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.today}</p>
                <p className="text-sm text-secondary-600 font-sarabun">วันนี้</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
                  <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.thisWeek}</p>
                <p className="text-sm text-secondary-600 font-sarabun">สัปดาห์นี้</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-yellow-50 mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.pending}</p>
                <p className="text-sm text-secondary-600 font-sarabun">รอสัมภาษณ์</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-indigo-50 mb-4">
                  <StarIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.completed}</p>
                <p className="text-sm text-secondary-600 font-sarabun">เสร็จสิ้น</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-red-50 mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.noShow}</p>
                <p className="text-sm text-secondary-600 font-sarabun">ไม่มา</p>
              </CardBody>
            </Card>
          </div>

          {/* Search and filters */}
          <Card className="mb-8">
            <CardBody className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="ค้นหาด้วยชื่อนักศึกษา รหัสนักศึกษา หรือชื่อทุน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-secondary-200">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      สถานะ
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      วันที่
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      {dateOptions.map(date => (
                        <option key={date.value} value={date.value}>{date.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" size="sm" className="font-sarabun">
                      ล้างตัวกรอง
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Bulk actions */}
          {filteredInterviews.length > 0 && (
            <Card className="mb-6">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedInterviews.length === filteredInterviews.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="text-sm font-medium text-secondary-700 font-sarabun">
                      เลือกทั้งหมด ({selectedInterviews.length}/{filteredInterviews.length})
                    </span>
                  </div>
                  {selectedInterviews.length > 0 && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('send_reminder')} className="font-sarabun">
                        ส่งการแจ้งเตือน
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')} className="font-sarabun">
                        ส่งออกตาราง
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Interviews list */}
          <div className="space-y-6">
            {filteredInterviews.length === 0 ? (
              <Card>
                <CardBody className="p-12 text-center">
                  <div className="inline-flex p-4 rounded-full bg-secondary-100 mb-4">
                    <CalendarDaysIcon className="h-8 w-8 text-secondary-400" />
                  </div>
                  <h3 className="text-lg font-medium text-secondary-900 font-sarabun mb-2">
                    ไม่พบการสัมภาษณ์
                  </h3>
                  <p className="text-secondary-600 font-sarabun mb-4">
                    ไม่มีการสัมภาษณ์ที่ตรงกับเงื่อนไขการค้นหา
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowScheduleModal(true)}
                    className="font-sarabun"
                  >
                    จัดตารางสัมภาษณ์ใหม่
                  </Button>
                </CardBody>
              </Card>
            ) : (
              filteredInterviews.map((interview) => {
                const StatusIcon = getStatusIcon(interview.status);
                const daysUntil = getDaysUntil(interview.date);
                const isUpcoming = ['scheduled', 'confirmed'].includes(interview.status) && daysUntil >= 0;
                
                return (
                  <Card key={interview.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardBody className="p-6">
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedInterviews.includes(interview.id)}
                          onChange={() => handleSelectInterview(interview.id)}
                          className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded mt-1"
                        />
                        <div className="inline-flex p-3 rounded-xl bg-blue-50">
                          <StatusIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-xl font-bold text-secondary-900 font-sarabun">
                                  {interview.studentName}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(interview.status)}`}>
                                  {getStatusText(interview.status)}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(interview.priority)}`}>
                                  {getPriorityText(interview.priority)}
                                </span>
                                {isUpcoming && daysUntil <= 3 && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                                    {daysUntil === 0 ? 'วันนี้' : `อีก ${daysUntil} วัน`}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-secondary-600 font-sarabun mb-2">
                                รหัส: {interview.studentId} | {interview.studentFaculty} | ชั้นปีที่ {interview.studentYear} | GPA: {interview.studentGpa}
                              </p>
                              <p className="text-lg font-semibold text-blue-600 font-sarabun mb-2">
                                {interview.scholarshipName}
                              </p>
                              <p className="text-green-600 font-semibold">
                                จำนวนเงิน: {interview.scholarshipAmount.toLocaleString()} บาท
                              </p>
                            </div>
                          </div>

                          {/* Interview details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center space-x-2">
                              <CalendarDaysIcon className="h-5 w-5 text-secondary-400" />
                              <div>
                                <p className="text-sm text-secondary-500">วันที่สัมภาษณ์</p>
                                <p className="font-medium text-secondary-900">
                                  {new Date(interview.date).toLocaleDateString('th-TH', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="h-5 w-5 text-secondary-400" />
                              <div>
                                <p className="text-sm text-secondary-500">เวลา</p>
                                <p className="font-medium text-secondary-900">
                                  {interview.time} น. ({interview.duration} นาที)
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPinIcon className="h-5 w-5 text-secondary-400" />
                              <div>
                                <p className="text-sm text-secondary-500">สถานที่</p>
                                <p className="font-medium text-secondary-900">{interview.location}</p>
                                {interview.building && (
                                  <p className="text-xs text-secondary-500">
                                    {interview.building} {interview.floor}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Interviewers */}
                          <div className="mb-6">
                            <h4 className="font-medium text-secondary-700 font-sarabun mb-3">ผู้สัมภาษณ์</h4>
                            <div className="space-y-3">
                              {interview.interviewers.map((interviewer) => (
                                <div key={interviewer.id} className="flex items-start space-x-3 bg-secondary-50 rounded-lg p-3">
                                  <div className="inline-flex p-2 rounded-full bg-blue-100">
                                    <UserIcon className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <p className="font-medium text-secondary-900 font-sarabun">
                                        {interviewer.name}
                                      </p>
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        interviewer.role === 'primary' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {interviewer.role === 'primary' ? 'หลัก' : 'ช่วย'}
                                      </span>
                                    </div>
                                    <p className="text-sm text-secondary-600">
                                      {interviewer.title} | {interviewer.department}
                                    </p>
                                    <div className="flex items-center space-x-4 mt-1">
                                      {interviewer.email && (
                                        <div className="flex items-center space-x-1 text-xs text-secondary-500">
                                          <EnvelopeIcon className="h-3 w-3" />
                                          <span>{interviewer.email}</span>
                                        </div>
                                      )}
                                      {interviewer.phone && (
                                        <div className="flex items-center space-x-1 text-xs text-secondary-500">
                                          <PhoneIcon className="h-3 w-3" />
                                          <span>{interviewer.phone}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Preparation notes */}
                          {interview.preparationNotes && (
                            <div className="mb-6">
                              <h4 className="font-medium text-secondary-700 font-sarabun mb-2">หมายเหตุการเตรียมตัว</h4>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-blue-800 text-sm">{interview.preparationNotes}</p>
                              </div>
                            </div>
                          )}

                          {/* Requirements */}
                          {interview.requirements && interview.requirements.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-medium text-secondary-700 font-sarabun mb-2">เอกสารที่ต้องนำมา</h4>
                              <ul className="space-y-1">
                                {interview.requirements.map((req, index) => (
                                  <li key={index} className="flex items-center space-x-2 text-sm text-secondary-600">
                                    <DocumentTextIcon className="h-4 w-4 text-secondary-400" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Interview result */}
                          {interview.result && (
                            <div className="mb-6">
                              <h4 className="font-medium text-secondary-700 font-sarabun mb-3">ผลการสัมภาษณ์</h4>
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                  <div>
                                    <p className="text-sm text-purple-600">คะแนนรวม</p>
                                    <p className="text-lg font-bold text-purple-700">
                                      {interview.result.overallScore}/{interview.result.maxScore}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-purple-600">ข้อเสนอแนะ</p>
                                    <p className={`font-medium ${getRecommendationColor(interview.result.recommendation)}`}>
                                      {getRecommendationText(interview.result.recommendation)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-purple-600">ประเมินโดย</p>
                                    <p className="font-medium text-purple-700">{interview.result.submittedBy}</p>
                                  </div>
                                </div>
                                
                                {/* Criteria breakdown */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                                  <div className="text-center">
                                    <p className="text-xs text-purple-600">วิชาการ</p>
                                    <p className="font-semibold text-purple-700">{interview.result.criteria.academic}/20</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-purple-600">แรงจูงใจ</p>
                                    <p className="font-semibold text-purple-700">{interview.result.criteria.motivation}/20</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-purple-600">การสื่อสาร</p>
                                    <p className="font-semibold text-purple-700">{interview.result.criteria.communication}/20</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-purple-600">ศักยภาพ</p>
                                    <p className="font-semibold text-purple-700">{interview.result.criteria.potential}/20</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-purple-600">ฐานะการเงิน</p>
                                    <p className="font-semibold text-purple-700">{interview.result.criteria.financial_need}/20</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-purple-600 mb-2">ความเห็นของผู้สัมภาษณ์</p>
                                  <p className="text-purple-800 text-sm">{interview.result.feedback}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {interview.notes && (
                            <div className="mb-6">
                              <h4 className="font-medium text-secondary-700 font-sarabun mb-2">หมายเหตุ</h4>
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-yellow-800 text-sm">{interview.notes}</p>
                              </div>
                            </div>
                          )}

                          {/* Schedule info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-secondary-600 mb-4">
                            <div>
                              <p className="text-secondary-500">จัดตารางโดย</p>
                              <p>{interview.scheduledBy}</p>
                            </div>
                            <div>
                              <p className="text-secondary-500">วันที่จัดตาราง</p>
                              <p>{new Date(interview.scheduledDate).toLocaleDateString('th-TH')}</p>
                            </div>
                            <div>
                              <p className="text-secondary-500">อัปเดตล่าสุด</p>
                              <p>{new Date(interview.lastUpdate).toLocaleDateString('th-TH')}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between border-t border-secondary-200 pt-4">
                            <div className="flex space-x-3">
                              <Link href={`/officer/interviews/${interview.id}`}>
                                <Button variant="outline" size="sm" className="font-sarabun">
                                  <EyeIcon className="h-4 w-4 mr-2" />
                                  ดูรายละเอียด
                                </Button>
                              </Link>
                              {['scheduled', 'confirmed'].includes(interview.status) && (
                                <>
                                  <Button variant="outline" size="sm" className="font-sarabun">
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    แก้ไขตาราง
                                  </Button>
                                  <Button variant="outline" size="sm" className="font-sarabun">
                                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                    เลื่อนนัด
                                  </Button>
                                </>
                              )}
                              {interview.status === 'no_show' && (
                                <Button variant="primary" size="sm" className="font-sarabun">
                                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                  จัดนัดใหม่
                                </Button>
                              )}
                              {interview.status === 'completed' && !interview.result && (
                                <Button variant="primary" size="sm" className="font-sarabun">
                                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                                  บันทึกผล
                                </Button>
                              )}
                              <Button variant="outline" size="sm" className="font-sarabun">
                                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                                ติดต่อนักศึกษา
                              </Button>
                            </div>
                            <div className="text-xs text-secondary-500">
                              ID: {interview.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>

          {/* Schedule Modal */}
          {showScheduleModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl">
                <CardHeader>
                  <CardTitle className="font-sarabun">จัดตารางสัมภาษณ์ใหม่</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        นักศึกษา
                      </label>
                      <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun">
                        <option value="">เลือกนักศึกษา</option>
                        <option value="6388007">6388007 - นายวิชัย ทำดี</option>
                        <option value="6388008">6388008 - นางสาว ปริยา เรียนเก่ง</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        ทุนการศึกษา
                      </label>
                      <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun">
                        <option value="">เลือกทุนการศึกษา</option>
                        <option value="1">ทุนพัฒนาศักยภาพนักศึกษา</option>
                        <option value="2">ทุนเรียนดี</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        วันที่
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        เวลา
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        ระยะเวลา (นาที)
                      </label>
                      <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun">
                        <option value="30">30 นาที</option>
                        <option value="45">45 นาที</option>
                        <option value="60">60 นาที</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      สถานที่
                    </label>
                    <Input
                      placeholder="เช่น ห้อง SC 301, อาคารศูนย์การเรียนรู้"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      ผู้สัมภาษณ์
                    </label>
                    <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun">
                      <option value="">เลือกผู้สัมภาษณ์หลัก</option>
                      <option value="INT_001">ผศ.ดร. สมปอง วิชาการดี</option>
                      <option value="INT_003">รศ.ดร. อนุชา เก่งมาก</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      หมายเหตุการเตรียมตัว
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      placeholder="หมายเหตุสำหรับผู้สัมภาษณ์และนักศึกษา"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowScheduleModal(false)}
                      className="flex-1 font-sarabun"
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setShowScheduleModal(false)}
                      className="flex-1 font-sarabun"
                    >
                      จัดตารางสัมภาษณ์
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
    </div>
  );
};

export default OfficerInterviewsPage;