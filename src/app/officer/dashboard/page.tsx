'use client';

import React, { useState } from 'react';
import { 
  ClipboardDocumentCheckIcon,
  DocumentCheckIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ChartBarIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  EyeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface StatCard {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  change?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
}

interface UrgentTask {
  id: string;
  title: string;
  description: string;
  type: 'application' | 'document' | 'interview' | 'budget';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  count?: number;
}

interface RecentActivity {
  id: string;
  type: 'application_submitted' | 'document_uploaded' | 'interview_completed' | 'allocation_approved';
  title: string;
  description: string;
  timestamp: string;
  studentName?: string;
  scholarshipName?: string;
}

const OfficerDashboard: React.FC = () => {
  const user = {
    name: 'นางสาว วิไลวรรณ จัดการดี',
    role: 'เจ้าหน้าที่ทุนการศึกษา',
    email: 'wilaiwan.j@mahidol.ac.th',
    department: 'งานกิจการนักศึกษา'
  };

  const stats: StatCard[] = [
    {
      title: 'ใบสมัครใหม่',
      value: 45,
      subtitle: 'รอการตรวจสอบ',
      icon: ClipboardDocumentCheckIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: { value: 12, isPositive: true, period: 'สัปดาห์นี้' }
    },
    {
      title: 'เอกสารรอตรวจ',
      value: 28,
      subtitle: 'ต้องตรวจสอบ',
      icon: DocumentCheckIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: { value: 5, isPositive: false, period: 'วันนี้' }
    },
    {
      title: 'การสัมภาษณ์',
      value: 15,
      subtitle: 'ที่จัดแล้ว',
      icon: CalendarDaysIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'งบประมาณใช้ไป',
      value: 2.8,
      subtitle: 'ล้านบาท (70%)',
      icon: BanknotesIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: { value: 0.5, isPositive: true, period: 'เดือนนี้' }
    }
  ];

  const urgentTasks: UrgentTask[] = [
    {
      id: '1',
      title: 'ใบสมัครที่ใกล้เกินกำหนด',
      description: 'มีใบสมัคร 8 ฉบับที่รอการพิจารณาเกิน 7 วัน',
      type: 'application',
      priority: 'high',
      count: 8,
      dueDate: '2024-12-15'
    },
    {
      id: '2',
      title: 'เอกสารที่ต้องตรวจสอบด่วน',
      description: 'เอกสารประกอบสำหรับทุนที่มีกำหนดปิดรับสมัครเร็วๆ นี้',
      type: 'document',
      priority: 'high',
      count: 12
    },
    {
      id: '3',
      title: 'จัดตารางสัมภาษณ์ทุนวิจัย',
      description: 'ต้องจัดตารางสัมภาษณ์สำหรับผู้สมัครที่ผ่านการพิจารณา',
      type: 'interview',
      priority: 'medium',
      count: 25,
      dueDate: '2024-12-20'
    },
    {
      id: '4',
      title: 'อนุมัติการจัดสรรงบประมาณ',
      description: 'มีการจัดสรรทุน 5 รายการรอการอนุมัติ',
      type: 'budget',
      priority: 'medium',
      count: 5
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'application_submitted',
      title: 'ใบสมัครใหม่',
      description: 'สมัครทุนพัฒนาศักยภาพนักศึกษา',
      timestamp: '5 นาทีที่แล้ว',
      studentName: 'นายสมชาย ใจดี',
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา'
    },
    {
      id: '2',
      type: 'document_uploaded',
      title: 'อัปโหลดเอกสาร',
      description: 'อัปโหลดใบแสดงผลการเรียน',
      timestamp: '15 นาทีที่แล้ว',
      studentName: 'นางสาวสุดา เรียนดี'
    },
    {
      id: '3',
      type: 'interview_completed',
      title: 'สัมภาษณ์เสร็จสิ้น',
      description: 'การสัมภาษณ์ทุนเรียนดีได้เสร็จสิ้นแล้ว',
      timestamp: '1 ชั่วโมงที่แล้ว',
      studentName: 'นายอานนท์ ขยันเรียน'
    },
    {
      id: '4',
      type: 'allocation_approved',
      title: 'อนุมัติการจัดสรร',
      description: 'อนุมัติการจัดสรรทุนช่วยเหลือการศึกษา',
      timestamp: '2 ชั่วโมงที่แล้ว',
      scholarshipName: 'ทุนช่วยเหลือการศึกษา'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application_submitted': return DocumentTextIcon;
      case 'document_uploaded': return DocumentCheckIcon;
      case 'interview_completed': return CheckCircleIcon;
      case 'allocation_approved': return BanknotesIcon;
      default: return BellIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'application_submitted': return 'text-blue-600 bg-blue-50';
      case 'document_uploaded': return 'text-purple-600 bg-purple-50';
      case 'interview_completed': return 'text-green-600 bg-green-50';
      case 'allocation_approved': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
          {/* Page header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold font-sarabun">
                    ภาพรวมการจัดการทุนการศึกษา
                  </h1>
                  <p className="text-green-100 mt-1 font-sarabun">
                    {user.name} | {user.department}
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-green-100">วันนี้</p>
                    <p className="text-lg font-semibold">{new Date().toLocaleDateString('th-TH')}</p>
                  </div>
                  <UsersIcon className="h-12 w-12 text-green-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-4`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                        {typeof stat.value === 'number' && stat.value > 1000000 
                          ? `${(stat.value / 1000000).toFixed(1)}M` 
                          : stat.value.toLocaleString()}
                      </p>
                      <p className="text-sm font-medium text-secondary-700 font-sarabun">
                        {stat.title}
                      </p>
                      <p className="text-xs text-secondary-500 mt-1">
                        {stat.subtitle}
                      </p>
                    </div>
                    {stat.change && (
                      <div className={`text-right ${stat.change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <p className="text-lg font-semibold">
                          {stat.change.isPositive ? '+' : '-'}{stat.change.value}
                        </p>
                        <p className="text-xs">{stat.change.period}</p>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Urgent tasks */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-secondary-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                      งานที่ต้องดำเนินการด่วน
                    </CardTitle>
                    <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
                      {urgentTasks.length} รายการ
                    </span>
                  </div>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="space-y-0">
                    {urgentTasks.map((task, index) => (
                      <div key={task.id} className={`p-6 border-l-4 ${getPriorityColor(task.priority)} ${index !== urgentTasks.length - 1 ? 'border-b border-secondary-100' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-secondary-900 font-sarabun">
                                {task.title}
                              </h3>
                              {task.count && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {task.count} รายการ
                                </span>
                              )}
                              {task.priority === 'high' && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                  ด่วน
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-secondary-600 mb-3 font-sarabun">
                              {task.description}
                            </p>
                            {task.dueDate && (
                              <p className="text-xs text-secondary-500 mb-3 flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                กำหนดเสร็จ: {new Date(task.dueDate).toLocaleDateString('th-TH')}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button size="sm" variant="outline" className="font-sarabun">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              ดู
                            </Button>
                            <Button 
                              size="sm" 
                              variant={task.priority === 'high' ? 'primary' : 'outline'}
                              className="font-sarabun"
                            >
                              จัดการ
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Recent activities */}
              <Card className="mt-8">
                <CardHeader className="border-b border-secondary-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-sarabun text-secondary-900">
                      กิจกรรมล่าสุด
                    </CardTitle>
                    <Button variant="outline" size="sm" className="font-sarabun">
                      ดูทั้งหมด
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="space-y-0">
                    {recentActivities.map((activity, index) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className={`p-6 ${index !== recentActivities.length - 1 ? 'border-b border-secondary-100' : ''}`}>
                          <div className="flex items-start space-x-4">
                            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-secondary-900 font-sarabun text-sm">
                                  {activity.title}
                                </h3>
                                <span className="text-xs text-secondary-500">
                                  {activity.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-secondary-600 font-sarabun">
                                {activity.description}
                              </p>
                              {activity.studentName && (
                                <p className="text-xs text-secondary-500 mt-1">
                                  โดย: {activity.studentName}
                                </p>
                              )}
                              {activity.scholarshipName && (
                                <p className="text-xs text-secondary-500 mt-1">
                                  ทุน: {activity.scholarshipName}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar widgets */}
            <div className="space-y-6">
              {/* Quick actions */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-secondary-200">
                  <CardTitle className="text-lg font-sarabun text-secondary-900">
                    การดำเนินการด่วน
                  </CardTitle>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Button variant="primary" size="sm" className="w-full justify-start font-sarabun">
                    <ClipboardDocumentCheckIcon className="h-4 w-4 mr-2" />
                    ตรวจสอบใบสมัคร (45)
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                    <DocumentCheckIcon className="h-4 w-4 mr-2" />
                    ตรวจสอบเอกสาร (28)
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                    จัดตารางสัมภาษณ์
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                    <BanknotesIcon className="h-4 w-4 mr-2" />
                    จัดสรรงบประมาณ
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    สร้างรายงาน
                  </Button>
                </CardBody>
              </Card>

              {/* Budget overview */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-secondary-200">
                  <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                    <BanknotesIcon className="h-5 w-5 text-blue-500 mr-2" />
                    ภาพรวมงบประมาณ
                  </CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600 font-sarabun">งบประมาณทั้งหมด</span>
                      <span className="font-semibold text-secondary-900">4.0 ล้าน</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-secondary-500">
                      <span>ใช้ไป 2.8 ล้าน (70%)</span>
                      <span>คงเหลือ 1.2 ล้าน</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-secondary-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">ทุนเรียนดี</span>
                      <span className="text-green-600 font-medium">1.5 ล้าน</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">ทุนช่วยเหลือ</span>
                      <span className="text-blue-600 font-medium">0.8 ล้าน</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">ทุนวิจัย</span>
                      <span className="text-purple-600 font-medium">0.5 ล้าน</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Performance metrics */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-secondary-200">
                  <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-purple-500 mr-2" />
                    ประสิทธิภาพการทำงาน
                  </CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600 font-sarabun">เวลาเฉลีย์การตรวจสอบ</span>
                      <span className="font-semibold text-green-600">2.5 วัน</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600 font-sarabun">อัตราการอนุมัติ</span>
                      <span className="font-semibold text-blue-600">68%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600 font-sarabun">ความพึงพอใจ</span>
                      <span className="font-semibold text-purple-600">4.2/5</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-secondary-200">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-green-700 font-medium font-sarabun">
                        เป้าหมายเดือนนี้
                      </div>
                      <div className="text-lg font-bold text-green-600">85%</div>
                      <div className="text-xs text-green-600">ปัจจุบัน 78%</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
    </div>
  );
};

export default OfficerDashboard;