'use client';

import React, { useState } from 'react';
import { 
  CalendarDaysIcon,
  ClipboardIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TodaySchedule {
  id: string;
  time: string;
  studentName: string;
  studentId: string;
  scholarshipName: string;
  duration: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'missed';
  room: string;
  notes?: string;
}

interface InterviewStat {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface PendingEvaluation {
  id: string;
  studentName: string;
  studentId: string;
  scholarshipName: string;
  interviewDate: string;
  daysOverdue: number;
}

interface RecentEvaluation {
  id: string;
  studentName: string;
  scholarshipName: string;
  score: number;
  recommendation: 'highly_recommended' | 'recommended' | 'not_recommended';
  submittedDate: string;
}

const InterviewerDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  const stats: InterviewStat[] = [
    {
      title: 'สัมภาษณ์วันนี้',
      value: 5,
      subtitle: 'นัดหมายทั้งหมด',
      icon: CalendarDaysIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'เสร็จสิ้นแล้ว',
      value: 2,
      subtitle: 'สัมภาษณ์ที่เสร็จ',
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'รอส่งผล',
      value: 8,
      subtitle: 'ผลประเมินค้างส่ง',
      icon: ClipboardIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'คะแนนเฉลีย์',
      value: 7.8,
      subtitle: 'คะแนนที่ให้เดือนนี้',
      icon: StarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const todaySchedule: TodaySchedule[] = [
    {
      id: '1',
      time: '09:00',
      studentName: 'นายสมชาย ใจดี',
      studentId: '6388001',
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      duration: 30,
      status: 'completed',
      room: 'SC 301',
      notes: 'นักศึกษามีผลการเรียนดี มีประสบการณ์ทำงานชุมชน'
    },
    {
      id: '2',
      time: '09:30',
      studentName: 'นางสาวสุดา เรียนดี',
      studentId: '6388002',
      scholarshipName: 'ทุนเรียนดี',
      duration: 30,
      status: 'completed',
      room: 'SC 301'
    },
    {
      id: '3',
      time: '10:30',
      studentName: 'นายอานนท์ ขยันเรียน',
      studentId: '6388003',
      scholarshipName: 'ทุนวิจัยระดับปริญญาตรี',
      duration: 45,
      status: 'ongoing',
      room: 'SC 301',
      notes: 'สัมภาษณ์เรื่องโครงการวิจัย'
    },
    {
      id: '4',
      time: '13:00',
      studentName: 'นางสาววิไลวรรณ เก่งมาก',
      studentId: '6388004',
      scholarshipName: 'ทุนช่วยเหลือการศึกษา',
      duration: 30,
      status: 'upcoming',
      room: 'SC 301'
    },
    {
      id: '5',
      time: '14:00',
      studentName: 'นายประยุทธ ตั้งใจเรียน',
      studentId: '6388005',
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      duration: 30,
      status: 'upcoming',
      room: 'SC 301'
    }
  ];

  const pendingEvaluations: PendingEvaluation[] = [
    {
      id: '1',
      studentName: 'นายสมศักดิ์ ดีเด่น',
      studentId: '6387001',
      scholarshipName: 'ทุนเรียนดี',
      interviewDate: '2024-12-10',
      daysOverdue: 3
    },
    {
      id: '2',
      studentName: 'นางสาวชลิดา เก่งเยี่ยม',
      studentId: '6387002',
      scholarshipName: 'ทุนวิจัยระดับปริญญาตรี',
      interviewDate: '2024-12-08',
      daysOverdue: 5
    }
  ];

  const recentEvaluations: RecentEvaluation[] = [
    {
      id: '1',
      studentName: 'นายธนกร เก่งมาก',
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      score: 8.5,
      recommendation: 'highly_recommended',
      submittedDate: '2024-12-12'
    },
    {
      id: '2',
      studentName: 'นางสาวพิมพ์ใจ ขยันดี',
      scholarshipName: 'ทุนช่วยเหลือการศึกษา',
      score: 7.2,
      recommendation: 'recommended',
      submittedDate: '2024-12-11'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'เสร็จสิ้น';
      case 'ongoing': return 'กำลังดำเนินการ';
      case 'upcoming': return 'กำลังจะถึง';
      case 'missed': return 'ไม่มาสัมภาษณ์';
      default: return 'ไม่ทราบ';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'highly_recommended': return 'text-green-600 bg-green-50';
      case 'recommended': return 'text-blue-600 bg-blue-50';
      case 'not_recommended': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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

  const isCurrentTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduleTime = new Date();
    scheduleTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - scheduleTime.getTime());
    return timeDiff <= 30 * 60 * 1000; // Within 30 minutes
  };

  return (
    <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-8xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-sarabun">
                แผงควบคุมการสัมภาษณ์
              </h1>
              <p className="text-purple-100 mt-1 font-sarabun">
                ระบบจัดการการสัมภาษณ์ทุนการศึกษา
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-purple-100">เวลาปัจจุบัน</p>
                <p className="text-lg font-semibold">
                  {currentTime.toLocaleTimeString('th-TH', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
              <CalendarDaysIcon className="h-12 w-12 text-purple-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
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
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-secondary-700 font-sarabun">
                    {stat.title}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-500 mr-2" />
                  ตารางสัมภาษณ์วันนี้
                </CardTitle>
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {todaySchedule.length} นัดหมาย
                </span>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="space-y-0">
                {todaySchedule.map((schedule, index) => (
                  <div key={schedule.id} className={`p-6 ${index !== todaySchedule.length - 1 ? 'border-b border-secondary-100' : ''} ${isCurrentTime(schedule.time) ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${isCurrentTime(schedule.time) ? 'text-blue-600' : 'text-secondary-900'} font-sarabun`}>
                            {schedule.time}
                          </div>
                          <div className="text-xs text-secondary-500">
                            {schedule.duration} นาที
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-secondary-900 font-sarabun">
                              {schedule.studentName}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(schedule.status)}`}>
                              {getStatusText(schedule.status)}
                            </span>
                            {schedule.status === 'ongoing' && (
                              <div className="flex items-center text-blue-600">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-1"></div>
                                <span className="text-xs">กำลังดำเนินการ</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-secondary-600 font-sarabun mb-1">
                            รหัส: {schedule.studentId} | ห้อง: {schedule.room}
                          </p>
                          <p className="text-sm text-purple-600 font-sarabun mb-2">
                            {schedule.scholarshipName}
                          </p>
                          {schedule.notes && (
                            <p className="text-xs text-secondary-500 bg-secondary-50 p-2 rounded">
                              {schedule.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline" className="font-sarabun">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          ดูข้อมูล
                        </Button>
                        {schedule.status === 'upcoming' && (
                          <Button size="sm" variant="primary" className="font-sarabun">
                            <PlayIcon className="h-4 w-4 mr-1" />
                            เริ่มสัมภาษณ์
                          </Button>
                        )}
                        {schedule.status === 'ongoing' && (
                          <Button size="sm" variant="success" className="font-sarabun">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            เสร็จสิ้น
                          </Button>
                        )}
                        {schedule.status === 'completed' && (
                          <Button size="sm" variant="outline" className="font-sarabun">
                            <ClipboardIcon className="h-4 w-4 mr-1" />
                            ส่งผล
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Recent evaluations */}
          <Card className="mt-8">
            <CardHeader className="border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-sarabun text-secondary-900">
                  การประเมินล่าสุด
                </CardTitle>
                <Button variant="outline" size="sm" className="font-sarabun">
                  ดูทั้งหมด
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="space-y-0">
                {recentEvaluations.map((evaluation, index) => (
                  <div key={evaluation.id} className={`p-6 ${index !== recentEvaluations.length - 1 ? 'border-b border-secondary-100' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-secondary-900 font-sarabun">
                        {evaluation.studentName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-yellow-500">
                          <StarIcon className="h-4 w-4 mr-1" />
                          <span className="font-semibold">{evaluation.score}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRecommendationColor(evaluation.recommendation)}`}>
                          {getRecommendationText(evaluation.recommendation)}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-secondary-600">
                      <div>
                        <p className="text-xs text-secondary-500">ทุนการศึกษา</p>
                        <p className="font-medium">{evaluation.scholarshipName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500">วันที่ส่งผล</p>
                        <p>{new Date(evaluation.submittedDate).toLocaleDateString('th-TH')}</p>
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
          {/* Pending evaluations */}
          <Card>
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-secondary-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mr-2" />
                      ผลที่ค้างส่ง
                    </CardTitle>
                    <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
                      {pendingEvaluations.length}
                    </span>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  {pendingEvaluations.map((pending) => (
                    <div key={pending.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-secondary-900 font-sarabun text-sm">
                          {pending.studentName}
                        </h3>
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                          เกิน {pending.daysOverdue} วัน
                        </span>
                      </div>
                      <p className="text-xs text-secondary-600 mb-2">
                        รหัส: {pending.studentId}
                      </p>
                      <p className="text-xs text-purple-600 font-medium mb-3">
                        {pending.scholarshipName}
                      </p>
                      <Button size="sm" variant="primary" className="w-full font-sarabun text-xs">
                        <ClipboardIcon className="h-3 w-3 mr-1" />
                        ส่งผลประเมิน
                      </Button>
                    </div>
                  ))}
                </CardBody>
              </Card>

              {/* Quick actions */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-secondary-200">
                  <CardTitle className="text-lg font-sarabun text-secondary-900">
                    การดำเนินการด่วน
                  </CardTitle>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Button variant="primary" size="sm" className="w-full justify-start font-sarabun">
                    <ClipboardIcon className="h-4 w-4 mr-2" />
                    ส่งผลประเมิน (8)
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                    ดูตารางสัมภาษณ์
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    ตั้งเวลาว่าง
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                    <DocumentMagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    เกณฑ์การประเมิน
                  </Button>
                </CardBody>
              </Card>

              {/* Interview tips */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-secondary-200">
                  <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500 mr-2" />
                    เคล็ดลับการสัมภาษณ์
                  </CardTitle>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="font-medium text-blue-700 text-sm font-sarabun mb-1">
                      การเตรียมตัว
                    </h4>
                    <p className="text-xs text-blue-600">
                      อ่านประวัติและผลการเรียนของนักศึกษาก่อนสัมภาษณ์
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <h4 className="font-medium text-green-700 text-sm font-sarabun mb-1">
                      คำถามสำคัญ
                    </h4>
                    <p className="text-xs text-green-600">
                      ถามเกี่ยวกับแรงจูงใจ เป้าหมาย และการใช้ทุนการศึกษา
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <h4 className="font-medium text-purple-700 text-sm font-sarabun mb-1">
                      การประเมิน
                    </h4>
                    <p className="text-xs text-purple-600">
                      ให้คะแนนตามเกณฑ์ที่กำหนดและเขียนความเห็นอย่างละเอียด
                    </p>
                  </div>
                </CardBody>
              </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewerDashboard;