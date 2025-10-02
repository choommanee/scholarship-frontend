'use client';

import React, { useEffect, useState } from 'react';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  BellIcon,
  PlusIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
  TrophyIcon,
  CalculatorIcon,
  InformationCircleIcon,
  StarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface QuickStat {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: 'deadline' | 'document' | 'interview' | 'notification';
  urgency: 'high' | 'medium' | 'low';
  dueDate?: string;
  action: string;
}

interface RecentApplication {
  id: string;
  scholarshipName: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  appliedDate: string;
  lastUpdate: string;
  amount: number;
  priorityScore?: number;
}

interface UpcomingDeadline {
  id: string;
  scholarshipName: string;
  deadline: string;
  daysLeft: number;
  amount: number;
  type: string;
  isEligible: boolean;
}

interface StudentProfile {
  firstName: string;
  lastName: string;
  studentId: string;
  faculty: string;
  year: number;
  currentGPA: number;
  familyIncome: number;
  monthlyExpenses: number;
  activities: string[];
  priorityScore?: number;
}

const StudentDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScoreCalculator, setShowScoreCalculator] = useState(false);
  const [calculatorData, setCalculatorData] = useState({
    gpa: '',
    income: '',
    expenses: '',
    activities: 0
  });
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  // Mock user data
  const user = {
    name: 'นางสาว สมใจ ใจดี',
    role: 'นักศึกษา',
    email: 'somjai.j@student.mahidol.ac.th',
    studentId: '6388001',
    faculty: 'คณะสาธารณสุขศาสตร์',
    year: 3,
    gpa: 3.75
  };

  // Quick statistics
  const quickStats: QuickStat[] = [
    {
      title: 'ใบสมัครทั้งหมด',
      value: 5,
      subtitle: 'ใบสมัครที่ส่งแล้ว',
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: { value: 2, isPositive: true }
    },
    {
      title: 'รอการพิจารณา',
      value: 2,
      subtitle: 'ใบสมัครที่รอผล',
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'ได้รับอนุมัติ',
      value: 2,
      subtitle: 'ทุนที่ได้รับ',
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: { value: 1, isPositive: true }
    },
    {
      title: 'การสัมภาษณ์',
      value: 1,
      subtitle: 'นัดหมายที่กำลังมา',
      icon: CalendarDaysIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  // Action items that need attention
  const actionItems: ActionItem[] = [
    {
      id: '1',
      title: 'ส่งเอกสารประกอบการสมัครทุนวิจัย',
      description: 'ต้องส่งใบแสดงผลการเรียนและหนังสือรับรองจากอาจารย์ที่ปรึกษา',
      type: 'document',
      urgency: 'high',
      dueDate: '2024-12-20',
      action: 'อัปโหลดเอกสาร'
    },
    {
      id: '2',
      title: 'ทุนช่วยเหลือการศึกษา ปิดรับสมัครเร็วๆ นี้',
      description: 'ทุนสำหรับนักศึกษาที่มีฐานะยากจน จำนวน 15,000 บาท',
      type: 'deadline',
      urgency: 'high',
      dueDate: '2024-12-25',
      action: 'สมัครเลย'
    },
    {
      id: '3',
      title: 'การสัมภาษณ์ทุนเรียนดี',
      description: 'นัดสัมภาษณ์วันพุธที่ 18 ธ.ค. 2567 เวลา 14:00 น. ห้อง SC 301',
      type: 'interview',
      urgency: 'medium',
      dueDate: '2024-12-18',
      action: 'ยืนยันเข้าร่วม'
    },
    {
      id: '4',
      title: 'อัปเดตข้อมูลโปรไฟล์',
      description: 'กรุณาอัปเดตข้อมูลผลการเรียนล่าสุดและข้อมูลส่วนตัว',
      type: 'notification',
      urgency: 'low',
      action: 'อัปเดตเลย'
    }
  ];

  // Recent applications
  const recentApplications: RecentApplication[] = [
    {
      id: '1',
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      status: 'under_review',
      appliedDate: '2024-12-01',
      lastUpdate: '2024-12-10',
      amount: 20000,
      priorityScore: 78.5
    },
    {
      id: '2',
      scholarshipName: 'ทุนเรียนดี',
      status: 'approved',
      appliedDate: '2024-11-15',
      lastUpdate: '2024-12-05',
      amount: 15000,
      priorityScore: 82.3
    },
    {
      id: '3',
      scholarshipName: 'ทุนวิจัยระดับปริญญาตรี',
      status: 'submitted',
      appliedDate: '2024-12-08',
      lastUpdate: '2024-12-08',
      amount: 25000,
      priorityScore: 75.2
    }
  ];

  // Upcoming deadlines
  const upcomingDeadlines: UpcomingDeadline[] = [
    {
      id: 'SCH001',
      scholarshipName: 'ทุนวิจัยระดับปริญญาตรี',
      deadline: '2024-12-31',
      daysLeft: 16,
      amount: 25000,
      type: 'research',
      isEligible: true
    },
    {
      id: 'SCH002',
      scholarshipName: 'ทุนความเป็นเลิศทางวิชาการ',
      deadline: '2025-01-15',
      daysLeft: 31,
      amount: 30000,
      type: 'excellence',
      isEligible: false
    },
    {
      id: 'SCH003',
      scholarshipName: 'ทุนกิจกรรมนักศึกษา',
      deadline: '2024-12-25',
      daysLeft: 10,
      amount: 8000,
      type: 'activity',
      isEligible: true
    }
  ];

  const studentProfile: StudentProfile = {
    firstName: 'สมใจ',
    lastName: 'ใจดี',
    studentId: '6288001',
    faculty: 'คณะสาธารณสุขศาสตร์',
    year: 3,
    currentGPA: 3.45,
    familyIncome: 25000,
    monthlyExpenses: 8000,
    activities: ['ชมรมอาสาพัฒนา', 'กิจกรรมวิชาการ', 'โครงการชุมชน'],
    priorityScore: 78.5
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'under_review': return 'text-yellow-600 bg-yellow-50';
      case 'submitted': return 'text-blue-600 bg-blue-50';
      case 'draft': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'อนุมัติแล้ว';
      case 'rejected': return 'ไม่อนุมัติ';
      case 'under_review': return 'กำลังพิจารณา';
      case 'submitted': return 'ส่งแล้ว';
      case 'draft': return 'ร่าง';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Priority Score Calculation Algorithm (from PROJECT_RULES.md)
  const calculatePriorityScore = (gpa: number, income: number, activityCount: number): number => {
    // GPA Score (40% weight)
    let gpaScore = 50.0;
    if (gpa >= 4.0) {
      gpaScore = 100.0;
    } else if (gpa > 2.0) {
      gpaScore = 50.0 + ((gpa - 2.0) / 2.0) * 50.0;
    }

    // Financial Score (30% weight) - Lower income = higher score
    let financialScore = 20.0;
    if (income <= 15000) {
      financialScore = 100.0;
    } else if (income < 50000) {
      financialScore = 100.0 - ((income - 15000) / (50000 - 15000)) * 80.0;
    }

    // Activity Score (30% weight)
    let activityScore = Math.min(activityCount * 20, 100); // Max 100

    // Calculate weighted total
    const totalScore = (gpaScore * 0.4) + (financialScore * 0.3) + (activityScore * 0.3);
    return Math.round(totalScore * 100) / 100;
  };

  const handleCalculateScore = async () => {
    const gpa = parseFloat(calculatorData.gpa);
    const income = parseFloat(calculatorData.income);
    const activities = calculatorData.activities;

    if (!isNaN(gpa) && !isNaN(income) && gpa >= 0 && gpa <= 4 && income >= 0) {
      try {
        // Try API first, fallback to local calculation
        const { studentService } = await import('@/services/student.service');
        try {
          const response = await studentService.calculatePriorityScore({
            gpa,
            family_income: income,
            activity_count: activities
          });
          setCalculatedScore(response.total_score);
        } catch (apiError) {
          console.log('API not available, using local calculation');
          const response = studentService.calculatePriorityScoreLocally(gpa, income, activities);
          setCalculatedScore(response.total_score);
        }
      } catch (error) {
        // Fallback to original calculation
        const score = calculatePriorityScore(gpa, income, activities);
        setCalculatedScore(score);
      }
    }
  };

  const getPriorityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityScoreLevel = (score: number) => {
    if (score >= 80) return 'สูงมาก';
    if (score >= 60) return 'สูง';
    if (score >= 40) return 'ปานกลาง';
    return 'ต่ำ';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return DocumentTextIcon;
      case "submitted":
        return ArrowPathIcon;
      case "under_review":
        return ClockIcon;
      case "approved":
        return CheckCircleIcon;
      case "rejected":
        return XCircleIcon;
      default:
        return DocumentTextIcon;
    }
  };

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
          userRole="student"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8">
          <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-8xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold font-sarabun">
                      สวัสดี, {user.name}
                    </h1>
                    <p className="text-blue-100 mt-1 font-sarabun">
                      {user.studentId} | {user.faculty} | ชั้นปีที่ {user.year} | เกรดเฉลีย {user.gpa}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-blue-100">วันนี้</p>
                      <p className="text-lg font-semibold">{new Date().toLocaleDateString('th-TH')}</p>
                    </div>
                    <AcademicCapIcon className="h-12 w-12 text-blue-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-4`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                          {stat.value}
                        </p>
                        <p className="text-sm font-medium text-secondary-700 font-sarabun">
                          {stat.title}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          {stat.subtitle}
                        </p>
                      </div>
                      {stat.trend && (
                        <div className={`text-right ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          <p className="text-lg font-semibold">
                            {stat.trend.isPositive ? '+' : '-'}{stat.trend.value}
                          </p>
                          <p className="text-xs">เดือนนี้</p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Action items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-secondary-200">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mr-2" />
                        รายการที่ต้องดำเนินการ
                      </CardTitle>
                      <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        {actionItems.length} รายการ
                      </span>
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                    <div className="space-y-0">
                      {actionItems.map((item, index) => (
                        <div key={item.id} className={`p-6 border-l-4 ${getUrgencyColor(item.urgency)} ${index !== actionItems.length - 1 ? 'border-b border-secondary-100' : ''}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-secondary-900 font-sarabun">
                                  {item.title}
                                </h3>
                                {item.urgency === 'high' && (
                                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                    ด่วน
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-secondary-600 mb-3 font-sarabun">
                                {item.description}
                              </p>
                              {item.dueDate && (
                                <p className="text-xs text-secondary-500 mb-3 flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  กำหนดส่ง: {new Date(item.dueDate).toLocaleDateString('th-TH')}
                                </p>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              variant={item.urgency === 'high' ? 'primary' : 'outline'}
                              className="ml-4 font-sarabun"
                            >
                              {item.action}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Recent applications */}
                <Card className="mt-8">
                  <CardHeader className="border-b border-secondary-200">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-sarabun text-secondary-900">
                        ใบสมัครล่าสุด
                      </CardTitle>
                      <Button variant="outline" size="sm" className="font-sarabun">
                        ดูทั้งหมด
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                    <div className="space-y-0">
                      {recentApplications.map((app, index) => (
                        <div key={app.id} className={`p-6 ${index !== recentApplications.length - 1 ? 'border-b border-secondary-100' : ''}`}>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-secondary-900 font-sarabun">
                              {app.scholarshipName}
                            </h3>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(app.status)}`}>
                              {getStatusText(app.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-secondary-600">
                            <div>
                              <p className="text-xs text-secondary-500">จำนวนเงิน</p>
                              <p className="font-semibold text-secondary-900">
                                {app.amount.toLocaleString()} บาท
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-secondary-500">วันที่สมัคร</p>
                              <p>{new Date(app.appliedDate).toLocaleDateString('th-TH')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-secondary-500">อัปเดตล่าสุด</p>
                              <p>{new Date(app.lastUpdate).toLocaleDateString('th-TH')}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Sidebar widgets */}
              <div className="space-y-6">
                {/* Quick actions */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50 border-b border-secondary-200">
                    <CardTitle className="text-lg font-sarabun text-secondary-900">
                      การดำเนินการด่วน
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <Button variant="primary" size="sm" className="w-full justify-start font-sarabun">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      สมัครทุนใหม่
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                      <DocumentIcon className="h-4 w-4 mr-2" />
                      อัปโหลดเอกสาร
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      จองสัมภาษณ์
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                      <TrophyIcon className="h-4 w-4 mr-2" />
                      ดูประวัติทุน
                    </Button>
                  </CardBody>
                </Card>

                {/* Upcoming deadlines */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-secondary-200">
                    <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                      <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
                      กำหนดการที่สำคัญ
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r-lg">
                      <p className="font-semibold text-red-700 text-sm font-sarabun">
                        ทุนช่วยเหลือการศึกษา
                      </p>
                      <p className="text-xs text-red-600">
                        ปิดรับสมัคร: 25 ธ.ค. 2567
                      </p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 rounded-r-lg">
                      <p className="font-semibold text-yellow-700 text-sm font-sarabun">
                        การสัมภาษณ์ทุนเรียนดี
                      </p>
                      <p className="text-xs text-yellow-600">
                        วันที่: 18 ธ.ค. 2567 14:00 น.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
                      <p className="font-semibold text-blue-700 text-sm font-sarabun">
                        ทุนวิจัยระดับปริญญาตรี
                      </p>
                      <p className="text-xs text-blue-600">
                        เปิดรับสมัคร: 1 ม.ค. 2568
                      </p>
                    </div>
                  </CardBody>
                </Card>

                {/* Recent notifications */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-secondary-200">
                    <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                      <BellIcon className="h-5 w-5 text-purple-500 mr-2" />
                      การแจ้งเตือนล่าสุด
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 font-sarabun">
                          ทุนเรียนดีได้รับการอนุมัติ
                        </p>
                        <p className="text-xs text-secondary-500">2 ชั่วโมงที่แล้ว</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 font-sarabun">
                          เอกสารประกอบได้รับการตรวจสอบ
                        </p>
                        <p className="text-xs text-secondary-500">5 ชั่วโมงที่แล้ว</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 font-sarabun">
                          มีทุนใหม่เปิดรับสมัคร
                        </p>
                        <p className="text-xs text-secondary-500">1 วันที่แล้ว</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full text-purple-600 hover:text-purple-700 font-sarabun">
                      ดูการแจ้งเตือนทั้งหมด
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </div>

            {/* Priority Score Calculator */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalculatorIcon className="h-5 w-5 mr-2" />
                  เครื่องคำนวณคะแนนความสำคัญ
                </CardTitle>
              </CardHeader>
              <CardBody className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-secondary-600 mb-4">
                      คำนวณคะแนนความสำคัญของคุณตามหลักเกณฑ์: เกรดเฉลี่ย (40%) + ฐานะการเงิน (30%) + กิจกรรม (30%)
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          เกรดเฉลี่ยสะสม (0.00-4.00)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="4"
                          value={calculatorData.gpa}
                          onChange={(e) => setCalculatorData({...calculatorData, gpa: e.target.value})}
                          placeholder="เช่น 3.45"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          รายได้ครอบครัวต่อเดือน (บาท)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={calculatorData.income}
                          onChange={(e) => setCalculatorData({...calculatorData, income: e.target.value})}
                          placeholder="เช่น 25000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          จำนวนกิจกรรมที่เข้าร่วม
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={calculatorData.activities}
                          onChange={(e) => setCalculatorData({...calculatorData, activities: parseInt(e.target.value) || 0})}
                          placeholder="เช่น 3"
                        />
                      </div>
                      
                      <Button 
                        variant="primary" 
                        onClick={handleCalculateScore}
                        className="w-full"
                      >
                        คำนวณคะแนน
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    {calculatedScore !== null && (
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="text-center mb-4">
                          <div className={`text-4xl font-bold ${getPriorityScoreColor(calculatedScore)}`}>
                            {calculatedScore}
                          </div>
                          <div className="text-lg text-secondary-600">
                            คะแนนความสำคัญ ({getPriorityScoreLevel(calculatedScore)})
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>เกรดเฉลี่ย (40%):</span>
                            <span>{parseFloat(calculatorData.gpa) ? (parseFloat(calculatorData.gpa) >= 4.0 ? 100 : parseFloat(calculatorData.gpa) <= 2.0 ? 50 : (50.0 + ((parseFloat(calculatorData.gpa) - 2.0) / 2.0) * 50.0)).toFixed(1) : '0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ฐานะการเงิน (30%):</span>
                            <span>{parseFloat(calculatorData.income) ? (parseFloat(calculatorData.income) <= 15000 ? 100 : parseFloat(calculatorData.income) >= 50000 ? 20 : (100.0 - ((parseFloat(calculatorData.income) - 15000) / (50000 - 15000)) * 80.0)).toFixed(1) : '0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>กิจกรรม (30%):</span>
                            <span>{Math.min(calculatorData.activities * 20, 100)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 text-sm text-secondary-600">
                      <h4 className="font-semibold mb-2">เกณฑ์การให้คะแนน:</h4>
                      <ul className="space-y-1">
                        <li>• เกรดเฉลี่ย: 4.00 = 100 คะแนน, 2.00 = 50 คะแนน</li>
                        <li>• รายได้: ≤15,000 = 100 คะแนน, ≥50,000 = 20 คะแนน</li>
                        <li>• กิจกรรม: กิจกรรมละ 20 คะแนน (สูงสุด 100)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
                      {/* Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {studentProfile.currentGPA.toFixed(2)}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    เกรดเฉลี่ยสะสม
                  </p>
                </CardBody>
              </Card>
              
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
                    <TrophyIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className={`text-2xl font-bold font-sarabun ${getPriorityScoreColor(studentProfile.priorityScore!)}`}>
                    {studentProfile.priorityScore}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    คะแนนความสำคัญ ({getPriorityScoreLevel(studentProfile.priorityScore!)})
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
                    <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {recentApplications.length}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    ใบสมัครทั้งหมด
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-orange-50 mb-4">
                    <CalendarDaysIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {upcomingDeadlines.filter(d => d.isEligible).length}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    ทุนที่สามารถสมัครได้
                  </p>
                </CardBody>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      ใบสมัครล่าสุด
                    </div>
                    <Button variant="outline" size="sm">
                      ดูทั้งหมด
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {recentApplications.map((application) => {
                      const StatusIcon = getStatusIcon(application.status);
                      return (
                        <div key={application.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <StatusIcon className={`h-5 w-5 ${
                              application.status === 'approved' ? 'text-green-500' :
                              application.status === 'rejected' ? 'text-red-500' :
                              application.status === 'under_review' ? 'text-blue-500' :
                              'text-yellow-500'
                            }`} />
                            <div>
                              <h4 className="font-semibold text-secondary-900 font-sarabun">
                                {application.scholarshipName}
                              </h4>
                              <p className="text-sm text-secondary-600">
                                {application.amount.toLocaleString()} บาท
                              </p>
                              {application.priorityScore && (
                                <p className={`text-xs ${getPriorityScoreColor(application.priorityScore)}`}>
                                  คะแนน: {application.priorityScore}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-5 w-5 mr-2" />
                      ทุนที่เปิดรับสมัคร
                    </div>
                    <Button variant="outline" size="sm">
                      ดูทั้งหมด
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className={`p-4 border rounded-lg ${
                        deadline.isEligible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-secondary-900 font-sarabun">
                            {deadline.scholarshipName}
                          </h4>
                          {deadline.isEligible ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-secondary-600 mb-2">
                          จำนวนเงิน: {deadline.amount.toLocaleString()} บาท
                        </p>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm ${deadline.daysLeft <= 7 ? 'text-red-600' : 'text-secondary-600'}`}>
                            {deadline.daysLeft <= 0 ? 'หมดเขตแล้ว' : `เหลือ ${deadline.daysLeft} วัน`}
                          </p>
                          {deadline.isEligible && (
                            <Button variant="primary" size="sm">
                              สมัครเลย
                            </Button>
                          )}
                        </div>
                        {!deadline.isEligible && (
                          <p className="text-xs text-red-600 mt-1">
                            ไม่เข้าเกณฑ์คุณสมบัติ
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;