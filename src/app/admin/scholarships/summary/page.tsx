'use client';

import React, { useState } from 'react';
import { 
  ChartBarIcon,
  UserGroupIcon,
  BanknotesIcon,
  TrophyIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface ScholarshipSummary {
  id: string;
  name: string;
  type: string;
  totalBudget: number;
  allocatedAmount: number;
  remainingBudget: number;
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  averageAmount: number;
  applicationPeriod: {
    start: string;
    end: string;
  };
  paymentSchedule: string[];
  criteria: string[];
  recipients: {
    id: string;
    name: string;
    studentId: string;
    faculty: string;
    amount: number;
    paymentStatus: 'pending' | 'partial' | 'completed';
    interviewScore: number;
  }[];
}

export default function ScholarshipSummaryPage() {
  const [selectedScholarship, setSelectedScholarship] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: 'ผู้ดูแลระบบ',
    role: 'ผู้ดูแลระบบ',
    email: 'admin@university.ac.th',
    department: 'ฝ่ายเทคโนโลยีสารสนเทศ'
  };

  // Mock data
  const scholarshipSummaries: ScholarshipSummary[] = [
    {
      id: 'SCH001',
      name: 'ทุนพัฒนาศักยภาพนักศึกษา',
      type: 'ทุนรายเดือน',
      totalBudget: 2000000,
      allocatedAmount: 1500000,
      remainingBudget: 500000,
      totalApplications: 150,
      approvedApplications: 50,
      rejectedApplications: 80,
      pendingApplications: 20,
      averageAmount: 30000,
      applicationPeriod: {
        start: '2024-01-01',
        end: '2024-01-31'
      },
      paymentSchedule: ['เดือน 1', 'เดือน 2', 'เดือน 3', 'เดือน 4'],
      criteria: ['เกรดเฉลี่ย >= 3.0', 'รายได้ครอบครัว < 300,000', 'กิจกรรมเสริมหลักสูตร'],
      recipients: [
        {
          id: 'R001',
          name: 'นางสาว สมใจ ใจดี',
          studentId: '6388001',
          faculty: 'คณะสาธารณสุขศาสตร์',
          amount: 30000,
          paymentStatus: 'completed',
          interviewScore: 8.5
        },
        {
          id: 'R002',
          name: 'นาย วิชาการ ดีมาก',
          studentId: '6388002',
          faculty: 'คณะวิทยาศาสตร์',
          amount: 30000,
          paymentStatus: 'partial',
          interviewScore: 8.2
        }
      ]
    },
    {
      id: 'SCH002',
      name: 'ทุนช่วยเหลือครอบครัวยากจน',
      type: 'ทุนเหมาจ่าย',
      totalBudget: 1000000,
      allocatedAmount: 800000,
      remainingBudget: 200000,
      totalApplications: 200,
      approvedApplications: 40,
      rejectedApplications: 140,
      pendingApplications: 20,
      averageAmount: 20000,
      applicationPeriod: {
        start: '2024-02-01',
        end: '2024-02-28'
      },
      paymentSchedule: ['จ่ายครั้งเดียว'],
      criteria: ['รายได้ครอบครัว < 150,000', 'เกรดเฉลี่ย >= 2.5'],
      recipients: [
        {
          id: 'R003',
          name: 'นางสาว ขยัน เรียนดี',
          studentId: '6388003',
          faculty: 'คณะศิลปศาสตร์',
          amount: 20000,
          paymentStatus: 'pending',
          interviewScore: 7.8
        }
      ]
    }
  ];

  const getOverallStats = () => {
    return scholarshipSummaries.reduce((acc, scholarship) => ({
      totalBudget: acc.totalBudget + scholarship.totalBudget,
      allocatedAmount: acc.allocatedAmount + scholarship.allocatedAmount,
      totalApplications: acc.totalApplications + scholarship.totalApplications,
      approvedApplications: acc.approvedApplications + scholarship.approvedApplications,
      totalRecipients: acc.totalRecipients + scholarship.recipients.length
    }), {
      totalBudget: 0,
      allocatedAmount: 0,
      totalApplications: 0,
      approvedApplications: 0,
      totalRecipients: 0
    });
  };

  const overallStats = getOverallStats();

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'partial': return 'text-yellow-600 bg-yellow-50';
      case 'pending': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'จ่ายครบแล้ว';
      case 'partial': return 'จ่ายบางส่วน';
      case 'pending': return 'รอจ่าย';
      default: return 'ไม่ระบุ';
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
          userRole="admin"
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
                    สรุปทุนการศึกษา
                  </h1>
                  <p className="text-secondary-600 font-sarabun">
                    ภาพรวมการจัดสรรทุน ผู้ได้รับทุน และสถิติการสมัคร
                  </p>
                </div>
                <div className="flex space-x-3">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sarabun"
                  >
                    <option value="current">ปีการศึกษาปัจจุบัน</option>
                    <option value="last">ปีการศึกษาที่แล้ว</option>
                    <option value="all">ทั้งหมด</option>
                  </select>
                  <Button variant="outline" className="font-sarabun">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    ส่งออกรายงาน
                  </Button>
                </div>
              </div>
            </div>

            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <BanknotesIcon className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-blue-600 font-sarabun">งบประมาณรวม</p>
                      <p className="text-2xl font-bold text-blue-900 font-sarabun">
                        {(overallStats.totalBudget / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-green-600 font-sarabun">จัดสรรแล้ว</p>
                      <p className="text-2xl font-bold text-green-900 font-sarabun">
                        {(overallStats.allocatedAmount / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-purple-600 font-sarabun">ผู้สมัครทั้งหมด</p>
                      <p className="text-2xl font-bold text-purple-900 font-sarabun">
                        {overallStats.totalApplications}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <TrophyIcon className="h-8 w-8 text-yellow-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-yellow-600 font-sarabun">ผู้ได้รับทุน</p>
                      <p className="text-2xl font-bold text-yellow-900 font-sarabun">
                        {overallStats.approvedApplications}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-8 w-8 text-red-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-red-600 font-sarabun">อัตราสำเร็จ</p>
                      <p className="text-2xl font-bold text-red-900 font-sarabun">
                        {Math.round((overallStats.approvedApplications / overallStats.totalApplications) * 100)}%
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
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-secondary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-sarabun text-secondary-900">
                          {scholarship.name}
                        </CardTitle>
                        <p className="text-sm text-secondary-600 font-sarabun mt-1">
                          {scholarship.type} | งบประมาณ {scholarship.totalBudget.toLocaleString()} บาท
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-secondary-500 font-sarabun">รหัสทุน</p>
                        <p className="font-semibold text-secondary-900 font-sarabun">{scholarship.id}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className="p-6">
                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-sarabun">ผู้สมัครทั้งหมด</p>
                            <p className="text-2xl font-bold text-blue-900 font-sarabun">{scholarship.totalApplications}</p>
                          </div>
                          <UserGroupIcon className="h-8 w-8 text-blue-500" />
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-sarabun">ผู้ได้รับทุน</p>
                            <p className="text-2xl font-bold text-green-900 font-sarabun">{scholarship.approvedApplications}</p>
                          </div>
                          <CheckCircleIcon className="h-8 w-8 text-green-500" />
                        </div>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-yellow-600 font-sarabun">รอพิจารณา</p>
                            <p className="text-2xl font-bold text-yellow-900 font-sarabun">{scholarship.pendingApplications}</p>
                          </div>
                          <ClockIcon className="h-8 w-8 text-yellow-500" />
                        </div>
                      </div>

                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-red-600 font-sarabun">ไม่ผ่าน</p>
                            <p className="text-2xl font-bold text-red-900 font-sarabun">{scholarship.rejectedApplications}</p>
                          </div>
                          <XCircleIcon className="h-8 w-8 text-red-500" />
                        </div>
                      </div>
                    </div>

                    {/* Budget Information */}
                    <div className="bg-secondary-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-secondary-900 font-sarabun mb-3">ข้อมูลงบประมาณ</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-secondary-500 font-sarabun">งบประมาณรวม</p>
                          <p className="text-lg font-bold text-secondary-900 font-sarabun">
                            {scholarship.totalBudget.toLocaleString()} บาท
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary-500 font-sarabun">จัดสรรแล้ว</p>
                          <p className="text-lg font-bold text-green-600 font-sarabun">
                            {scholarship.allocatedAmount.toLocaleString()} บาท
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary-500 font-sarabun">คงเหลือ</p>
                          <p className="text-lg font-bold text-blue-600 font-sarabun">
                            {scholarship.remainingBudget.toLocaleString()} บาท
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-secondary-600 font-sarabun mb-1">
                          <span>การใช้งบประมาณ</span>
                          <span>{Math.round((scholarship.allocatedAmount / scholarship.totalBudget) * 100)}%</span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${(scholarship.allocatedAmount / scholarship.totalBudget) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Recipients List */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-secondary-900 font-sarabun">
                          ผู้ได้รับทุน ({scholarship.recipients.length} คน)
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
                                จำนวนเงิน
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                                คะแนน
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                                สถานะการจ่าย
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-secondary-200">
                            {scholarship.recipients.map((recipient) => (
                              <tr key={recipient.id} className="hover:bg-secondary-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="font-medium text-secondary-900 font-sarabun">
                                    {recipient.name}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500 font-sarabun">
                                  {recipient.studentId}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500 font-sarabun">
                                  {recipient.faculty}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 font-sarabun">
                                  {recipient.amount.toLocaleString()} บาท
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900 font-sarabun">
                                  <div className="flex items-center">
                                    <span className="font-medium">{recipient.interviewScore}</span>
                                    <span className="text-secondary-500 ml-1">/10</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-sarabun ${getPaymentStatusColor(recipient.paymentStatus)}`}>
                                    {getPaymentStatusText(recipient.paymentStatus)}
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
