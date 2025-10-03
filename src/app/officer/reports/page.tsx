'use client';

import React, { useState } from 'react';
import {
  ChartBarIcon,
  ChartPieIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function OfficerReportsPage() {
  const [selectedYear, setSelectedYear] = useState('2567');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedReportType, setSelectedReportType] = useState('overview');

  // Mock data
  const stats = {
    totalScholarships: 45,
    totalApplications: 328,
    approvedApplications: 156,
    rejectedApplications: 48,
    pendingApplications: 124,
    totalBudget: 12500000,
    disbursedAmount: 7800000,
    remainingBudget: 4700000,
    averageGPA: 3.45,
    totalStudents: 156
  };

  const scholarshipTypes = [
    { name: 'ทุนเรียนดี', count: 45, amount: 2250000, percentage: 28.8 },
    { name: 'ทุนช่วยเหลือการเงิน', count: 67, amount: 3350000, percentage: 42.9 },
    { name: 'ทุนวิจัย', count: 24, amount: 1440000, percentage: 18.5 },
    { name: 'ทุนกีฬา', count: 12, amount: 480000, percentage: 6.2 },
    { name: 'ทุนบริการชุมชน', count: 8, amount: 280000, percentage: 3.6 }
  ];

  const facultyStats = [
    { faculty: 'คณะวิทยาศาสตร์', students: 45, amount: 2250000 },
    { faculty: 'คณะวิศวกรรมศาสตร์', students: 38, amount: 1900000 },
    { faculty: 'คณะแพทยศาสตร์', students: 28, amount: 1680000 },
    { faculty: 'คณะพยาบาลศาสตร์', students: 22, amount: 1100000 },
    { faculty: 'คณะเภสัชศาสตร์', students: 23, amount: 870000 }
  ];

  const monthlyApplications = [
    { month: 'ม.ค.', applications: 45, approved: 23 },
    { month: 'ก.พ.', applications: 52, approved: 28 },
    { month: 'มี.ค.', applications: 38, approved: 19 },
    { month: 'เม.ย.', applications: 41, approved: 22 },
    { month: 'พ.ค.', applications: 48, approved: 25 },
    { month: 'มิ.ย.', applications: 35, approved: 18 },
    { month: 'ก.ค.', applications: 42, approved: 21 },
    { month: 'ส.ค.', applications: 27, approved: 0 }
  ];

  const handleExportReport = (format: 'pdf' | 'excel') => {
    // TODO: Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              รายงานและสถิติ
            </h1>
            <p className="text-secondary-600 font-sarabun">
              รายงานสรุปและสถิติทุนการศึกษา
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => handleExportReport('excel')}
              className="font-sarabun"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleExportReport('pdf')}
              className="font-sarabun"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                ปีการศึกษา
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun"
              >
                <option value="2567">2567</option>
                <option value="2566">2566</option>
                <option value="2565">2565</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                ภาคเรียน
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun"
              >
                <option value="all">ทั้งหมด</option>
                <option value="1">ภาคเรียนที่ 1</option>
                <option value="2">ภาคเรียนที่ 2</option>
                <option value="summer">ภาคฤดูร้อน</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                ประเภทรายงาน
              </label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun"
              >
                <option value="overview">ภาพรวม</option>
                <option value="scholarship">รายประเภททุน</option>
                <option value="faculty">รายคณะ</option>
                <option value="budget">งบประมาณ</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 font-sarabun">ทุนทั้งหมด</p>
                <p className="text-3xl font-bold text-blue-900 font-sarabun">{stats.totalScholarships}</p>
                <p className="text-sm text-blue-700 font-sarabun mt-1">ทุนการศึกษา</p>
              </div>
              <AcademicCapIcon className="h-12 w-12 text-blue-600 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 font-sarabun">ใบสมัครทั้งหมด</p>
                <p className="text-3xl font-bold text-green-900 font-sarabun">{stats.totalApplications}</p>
                <p className="text-sm text-green-700 font-sarabun mt-1">ใบสมัคร</p>
              </div>
              <DocumentTextIcon className="h-12 w-12 text-green-600 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 font-sarabun">นักศึกษาที่ได้รับทุน</p>
                <p className="text-3xl font-bold text-purple-900 font-sarabun">{stats.totalStudents}</p>
                <p className="text-sm text-purple-700 font-sarabun mt-1">คน</p>
              </div>
              <UserGroupIcon className="h-12 w-12 text-purple-600 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 font-sarabun">งบประมาณใช้ไป</p>
                <p className="text-3xl font-bold text-yellow-900 font-sarabun">
                  {(stats.disbursedAmount / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-yellow-700 font-sarabun mt-1">บาท</p>
              </div>
              <BanknotesIcon className="h-12 w-12 text-yellow-600 opacity-50" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Application Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-sarabun">สถานะใบสมัคร</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-900 font-sarabun">อนุมัติแล้ว</p>
                    <p className="text-sm text-green-600 font-sarabun">{stats.approvedApplications} ใบสมัคร</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-900 font-sarabun">
                    {((stats.approvedApplications / stats.totalApplications) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-900 font-sarabun">รอพิจารณา</p>
                    <p className="text-sm text-yellow-600 font-sarabun">{stats.pendingApplications} ใบสมัคร</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-900 font-sarabun">
                    {((stats.pendingApplications / stats.totalApplications) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <XCircleIcon className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-red-900 font-sarabun">ไม่อนุมัติ</p>
                    <p className="text-sm text-red-600 font-sarabun">{stats.rejectedApplications} ใบสมัคร</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-900 font-sarabun">
                    {((stats.rejectedApplications / stats.totalApplications) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-sarabun">งบประมาณ</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 font-sarabun">งบประมาณทั้งหมด</span>
                  <span className="text-sm font-bold text-gray-900 font-sarabun">
                    {stats.totalBudget.toLocaleString()} บาท
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 font-sarabun">ใช้ไปแล้ว</span>
                  <span className="text-sm font-bold text-green-900 font-sarabun">
                    {stats.disbursedAmount.toLocaleString()} บาท
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${(stats.disbursedAmount / stats.totalBudget) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 font-sarabun">คงเหลือ</span>
                  <span className="text-sm font-bold text-yellow-900 font-sarabun">
                    {stats.remainingBudget.toLocaleString()} บาท
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-600 h-3 rounded-full"
                    style={{ width: `${(stats.remainingBudget / stats.totalBudget) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900 font-sarabun">เปอร์เซ็นต์การใช้งบ</span>
                  <span className="text-2xl font-bold text-blue-900 font-sarabun">
                    {((stats.disbursedAmount / stats.totalBudget) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Scholarship Types Distribution */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-sarabun">สัดส่วนทุนแต่ละประเภท</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sarabun">
                    ประเภททุน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sarabun">
                    จำนวนนักศึกษา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sarabun">
                    งบประมาณ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sarabun">
                    สัดส่วน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sarabun">
                    แผนภูมิ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scholarshipTypes.map((type, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-sarabun">{type.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-sarabun">{type.count} คน</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-sarabun">
                        {type.amount.toLocaleString()} บาท
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-sarabun">
                        {type.percentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${type.percentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Faculty Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sarabun">สถิติรายคณะ</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sarabun">
                    คณะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sarabun">
                    จำนวนนักศึกษา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sarabun">
                    งบประมาณ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sarabun">
                    เฉลี่ยต่อคน
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facultyStats.map((faculty, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-sarabun">{faculty.faculty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-sarabun">{faculty.students} คน</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-sarabun">
                        {faculty.amount.toLocaleString()} บาท
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-sarabun">
                        {(faculty.amount / faculty.students).toLocaleString()} บาท
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
