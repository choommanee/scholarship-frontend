'use client';

import React, { useState } from 'react';
import { 
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  ClipboardDocumentCheckIcon,
  EyeIcon,
  StarIcon,
  CalendarDaysIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface InterviewerScholarshipSummary {
  id: string;
  name: string;
  totalAssigned: number;
  completed: number;
  pending: number;
  averageScore: number;
  myRecommendations: {
    highly_recommended: number;
    recommended: number;
    not_recommended: number;
  };
  interviewees: {
    id: string;
    name: string;
    studentId: string;
    faculty: string;
    interviewDate: string;
    score: number;
    recommendation: 'highly_recommended' | 'recommended' | 'not_recommended';
    status: 'completed' | 'pending' | 'scheduled';
  }[];
}

export default function InterviewerScholarshipSummaryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: 'ผศ.ดร. สมปอง วิชาการดี',
    role: 'ผู้สัมภาษณ์',
    email: 'interviewer@university.ac.th',
    department: 'คณะสาธารณสุขศาสตร์'
  };

  // Mock data
  const scholarshipSummaries: InterviewerScholarshipSummary[] = [
    {
      id: 'SCH001',
      name: 'ทุนพัฒนาศักยภาพนักศึกษา',
      totalAssigned: 25,
      completed: 20,
      pending: 5,
      averageScore: 7.8,
      myRecommendations: {
        highly_recommended: 8,
        recommended: 10,
        not_recommended: 2
      },
      interviewees: [
        {
          id: 'INT001',
          name: 'นางสาว สมใจ ใจดี',
          studentId: '6388001',
          faculty: 'คณะสาธารณสุขศาสตร์',
          interviewDate: '2024-01-20',
          score: 8.5,
          recommendation: 'highly_recommended',
          status: 'completed'
        },
        {
          id: 'INT002',
          name: 'นาย วิชาการ ดีมาก',
          studentId: '6388002',
          faculty: 'คณะวิทยาศาสตร์',
          interviewDate: '2024-01-22',
          score: 7.2,
          recommendation: 'recommended',
          status: 'completed'
        },
        {
          id: 'INT003',
          name: 'นางสาว ขยัน เรียนดี',
          studentId: '6388003',
          faculty: 'คณะศิลปศาสตร์',
          interviewDate: '2024-01-25',
          score: 0,
          recommendation: 'recommended',
          status: 'pending'
        }
      ]
    },
    {
      id: 'SCH002',
      name: 'ทุนช่วยเหลือครอบครัวยากจน',
      totalAssigned: 15,
      completed: 12,
      pending: 3,
      averageScore: 7.5,
      myRecommendations: {
        highly_recommended: 4,
        recommended: 7,
        not_recommended: 1
      },
      interviewees: [
        {
          id: 'INT004',
          name: 'นาย ยากจน แต่ขยัน',
          studentId: '6388004',
          faculty: 'คณะเศรษฐศาสตร์',
          interviewDate: '2024-01-18',
          score: 8.0,
          recommendation: 'highly_recommended',
          status: 'completed'
        }
      ]
    }
  ];

  const getOverallStats = () => {
    return scholarshipSummaries.reduce((acc, scholarship) => ({
      totalAssigned: acc.totalAssigned + scholarship.totalAssigned,
      completed: acc.completed + scholarship.completed,
      pending: acc.pending + scholarship.pending,
      totalRecommendations: acc.totalRecommendations + 
        scholarship.myRecommendations.highly_recommended + 
        scholarship.myRecommendations.recommended + 
        scholarship.myRecommendations.not_recommended
    }), {
      totalAssigned: 0,
      completed: 0,
      pending: 0,
      totalRecommendations: 0
    });
  };

  const overallStats = getOverallStats();
  const overallAverage = scholarshipSummaries.reduce((sum, s) => sum + s.averageScore, 0) / scholarshipSummaries.length;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'scheduled': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'เสร็จสิ้น';
      case 'pending': return 'รอดำเนินการ';
      case 'scheduled': return 'นัดหมายแล้ว';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header 
        user={user}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex flex-1 relative">
        <Sidebar 
          userRole="interviewer"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8">
          <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-8xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                    สรุปการสัมภาษณ์ทุนการศึกษา
                  </h1>
                  <p className="text-secondary-600 font-sarabun">
                    ภาพรวมการสัมภาษณ์และการประเมินของคุณ
                  </p>
                </div>
                <div className="flex space-x-3">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-sarabun"
                  >
                    <option value="current_month">เดือนปัจจุบัน</option>
                    <option value="last_month">เดือนที่แล้ว</option>
                    <option value="current_semester">ภาคเรียนปัจจุบัน</option>
                    <option value="current_year">ปีการศึกษาปัจจุบัน</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-blue-600 font-sarabun">ได้รับมอบหมาย</p>
                      <p className="text-2xl font-bold text-blue-900 font-sarabun">
                        {overallStats.totalAssigned}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <ClipboardDocumentCheckIcon className="h-8 w-8 text-green-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-green-600 font-sarabun">เสร็จสิ้นแล้ว</p>
                      <p className="text-2xl font-bold text-green-900 font-sarabun">
                        {overallStats.completed}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-8 w-8 text-yellow-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-yellow-600 font-sarabun">รอดำเนินการ</p>
                      <p className="text-2xl font-bold text-yellow-900 font-sarabun">
                        {overallStats.pending}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <StarIcon className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-purple-600 font-sarabun">คะแนนเฉลี่ย</p>
                      <p className="text-2xl font-bold text-purple-900 font-sarabun">
                        {overallAverage.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Scholarship Details */}
            <div className="space-y-8">
              {scholarshipSummaries.map((scholarship) => (
                <Card key={scholarship.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-secondary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-sarabun text-secondary-900">
                          {scholarship.name}
                        </CardTitle>
                        <p className="text-sm text-secondary-600 font-sarabun mt-1">
                          ได้รับมอบหมาย {scholarship.totalAssigned} คน | เสร็จสิ้น {scholarship.completed} คน
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-secondary-500 font-sarabun">คะแนนเฉลี่ย</p>
                        <p className="text-2xl font-bold text-secondary-900 font-sarabun">{scholarship.averageScore}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className="p-6">
                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-sarabun">แนะนำอย่างยิ่ง</p>
                            <p className="text-2xl font-bold text-green-900 font-sarabun">{scholarship.myRecommendations.highly_recommended}</p>
                          </div>
                          <TrophyIcon className="h-8 w-8 text-green-500" />
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-sarabun">แนะนำ</p>
                            <p className="text-2xl font-bold text-blue-900 font-sarabun">{scholarship.myRecommendations.recommended}</p>
                          </div>
                          <ChartBarIcon className="h-8 w-8 text-blue-500" />
                        </div>
                      </div>

                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-red-600 font-sarabun">ไม่แนะนำ</p>
                            <p className="text-2xl font-bold text-red-900 font-sarabun">{scholarship.myRecommendations.not_recommended}</p>
                          </div>
                          <DocumentTextIcon className="h-8 w-8 text-red-500" />
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-secondary-600 font-sarabun mb-2">
                        <span>ความคืบหน้า</span>
                        <span>{Math.round((scholarship.completed / scholarship.totalAssigned) * 100)}%</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(scholarship.completed / scholarship.totalAssigned) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Interviewees List */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-secondary-900 font-sarabun">
                          รายการผู้เข้าสัมภาษณ์ ({scholarship.interviewees.length} คน)
                        </h4>
                        <Button size="sm" variant="outline" className="font-sarabun">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          ดูทั้งหมด
                        </Button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                          <thead className="bg-secondary-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                                ชื่อ-นามสกุล
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                                รหัสนักศึกษา
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                                คณะ
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                                วันที่สัมภาษณ์
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                                คะแนน
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                                คำแนะนำ
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                                สถานะ
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-secondary-200">
                            {scholarship.interviewees.map((interviewee) => (
                              <tr key={interviewee.id} className="hover:bg-secondary-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="font-medium text-secondary-900 font-sarabun">
                                    {interviewee.name}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500 font-sarabun">
                                  {interviewee.studentId}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500 font-sarabun">
                                  {interviewee.faculty}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500 font-sarabun">
                                  {new Date(interviewee.interviewDate).toLocaleDateString('th-TH')}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900 font-sarabun">
                                  {interviewee.status === 'completed' ? (
                                    <div className="flex items-center">
                                      <span className="font-medium">{interviewee.score}</span>
                                      <span className="text-secondary-500 ml-1">/10</span>
                                    </div>
                                  ) : (
                                    <span className="text-secondary-400">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  {interviewee.status === 'completed' ? (
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-sarabun ${getRecommendationColor(interviewee.recommendation)}`}>
                                      {getRecommendationText(interviewee.recommendation)}
                                    </span>
                                  ) : (
                                    <span className="text-secondary-400 text-xs font-sarabun">รอประเมิน</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-sarabun ${getStatusColor(interviewee.status)}`}>
                                    {getStatusText(interviewee.status)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
