'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  ChartBarIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  AcademicCapIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ReportStats {
  totalApplications: number;
  totalScholarships: number;
  totalBudget: number;
  totalRecipients: number;
  approvalRate: number;
  avgProcessingTime: number;
}

export default function AdminReportsPage() {
  const [selectedYear, setSelectedYear] = useState('2568');
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [stats, setStats] = useState<ReportStats>({
    totalApplications: 1247,
    totalScholarships: 45,
    totalBudget: 15750000,
    totalRecipients: 892,
    approvalRate: 71.5,
    avgProcessingTime: 14
  });

  const years = [
    { value: '2568', label: 'ปีการศึกษา 2568' },
    { value: '2567', label: 'ปีการศึกษา 2567' },
    { value: '2566', label: 'ปีการศึกษา 2566' },
  ];

  const periods = [
    { value: 'year', label: 'ทั้งปี' },
    { value: 'semester', label: 'รายภาคการศึกษา' },
    { value: 'month', label: 'รายเดือน' },
    { value: 'custom', label: 'กำหนดเอง' },
  ];

  const reportTypes = [
    { value: 'overview', label: 'ภาพรวมระบบ', icon: ChartBarIcon },
    { value: 'applications', label: 'รายงานใบสมัคร', icon: DocumentTextIcon },
    { value: 'scholarships', label: 'รายงานทุนการศึกษา', icon: AcademicCapIcon },
    { value: 'budget', label: 'รายงานงบประมาณ', icon: CurrencyDollarIcon },
    { value: 'users', label: 'รายงานผู้ใช้งาน', icon: UsersIcon },
    { value: 'performance', label: 'รายงานประสิทธิภาพ', icon: ArrowTrendingUpIcon },
  ];

  const applicationStats = [
    { status: 'ส่งแล้ว', count: 1247, color: 'bg-blue-500', percentage: 100 },
    { status: 'กำลังพิจารณา', count: 356, color: 'bg-yellow-500', percentage: 28.5 },
    { status: 'อนุมัติ', count: 892, color: 'bg-green-500', percentage: 71.5 },
    { status: 'ปฏิเสธ', count: 355, color: 'bg-red-500', percentage: 28.5 },
  ];

  const scholarshipsByType = [
    { type: 'ค่าเทอม', count: 18, budget: 7500000, percentage: 47.6 },
    { type: 'ค่าครองชีพ', count: 12, budget: 4200000, percentage: 26.7 },
    { type: 'วิจัย', count: 8, budget: 2500000, percentage: 15.9 },
    { type: 'กิจกรรม', count: 5, budget: 1200000, percentage: 7.6 },
    { type: 'ทุนเต็มจำนวน', count: 2, budget: 350000, percentage: 2.2 },
  ];

  const monthlyTrends = [
    { month: 'ม.ค.', applications: 45, approved: 32 },
    { month: 'ก.พ.', applications: 67, approved: 48 },
    { month: 'มี.ค.', applications: 123, approved: 89 },
    { month: 'เม.ย.', applications: 156, approved: 112 },
    { month: 'พ.ค.', applications: 189, approved: 135 },
    { month: 'มิ.ย.', applications: 145, approved: 104 },
    { month: 'ก.ค.', applications: 98, approved: 70 },
    { month: 'ส.ค.', applications: 178, approved: 127 },
    { month: 'ก.ย.', applications: 134, approved: 96 },
    { month: 'ต.ค.', applications: 67, approved: 48 },
    { month: 'พ.ย.', applications: 32, approved: 23 },
    { month: 'ธ.ค.', applications: 13, approved: 8 },
  ];

  const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      setExporting(true);
      // TODO: Call actual export API
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`ส่งออกรายงานเป็น ${format.toUpperCase()} เรียบร้อยแล้ว`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('ไม่สามารถส่งออกรายงานได้');
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              รายงานและสถิติ
            </h1>
            <p className="text-secondary-600 font-sarabun">
              รายงานสรุปและวิเคราะห์ข้อมูลทุนการศึกษาและผู้สมัคร
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('excel')}
              disabled={exporting}
              className="font-sarabun"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="font-sarabun"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="font-sarabun"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                ปีการศึกษา
              </label>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                options={years}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                ช่วงเวลา
              </label>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                options={periods}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                ประเภทรายงาน
              </label>
              <Select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                options={reportTypes}
              />
            </div>
            <div className="flex items-end">
              <Button variant="primary" className="w-full font-sarabun">
                <FunnelIcon className="h-4 w-4 mr-2" />
                กรองข้อมูล
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <Card>
          <CardBody className="p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900 font-sarabun">
              {stats.totalApplications.toLocaleString()}
            </p>
            <p className="text-sm text-secondary-600 font-sarabun">ใบสมัครทั้งหมด</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
              <AcademicCapIcon className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900 font-sarabun">
              {stats.totalScholarships}
            </p>
            <p className="text-sm text-secondary-600 font-sarabun">ทุนการศึกษา</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xl font-bold text-secondary-900 font-sarabun">
              {formatCurrency(stats.totalBudget)}
            </p>
            <p className="text-sm text-secondary-600 font-sarabun">งบประมาณรวม</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-yellow-50 mb-4">
              <UsersIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900 font-sarabun">
              {stats.totalRecipients.toLocaleString()}
            </p>
            <p className="text-sm text-secondary-600 font-sarabun">ผู้รับทุน</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900 font-sarabun">
              {stats.approvalRate}%
            </p>
            <p className="text-sm text-secondary-600 font-sarabun">อัตราการอนุมัติ</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-orange-50 mb-4">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900 font-sarabun">
              {stats.avgProcessingTime}
            </p>
            <p className="text-sm text-secondary-600 font-sarabun">วัน (เฉลี่ย)</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sarabun">สถานะใบสมัคร</CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {applicationStats.map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-secondary-700 font-sarabun">
                      {stat.status}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-secondary-600 font-sarabun">
                        {stat.count.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-secondary-900 font-sarabun">
                        {stat.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${stat.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Scholarships by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sarabun">ทุนการศึกษาตามประเภท</CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {scholarshipsByType.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-secondary-900 font-sarabun">
                        {item.type}
                      </p>
                      <p className="text-xs text-secondary-600 font-sarabun">
                        {item.count} ทุน • {formatCurrency(item.budget)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-secondary-900 font-sarabun">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Monthly Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-sarabun">แนวโน้มรายเดือน</CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      เดือน
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      ใบสมัคร
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      อนุมัติ
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      อัตราอนุมัติ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      กราฟ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyTrends.map((data, index) => {
                    const approvalRate = ((data.approved / data.applications) * 100).toFixed(1);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-secondary-900 font-sarabun">
                          {data.month}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-secondary-600 text-right font-sarabun">
                          {data.applications}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 text-right font-sarabun">
                          {data.approved}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-secondary-900 text-right font-sarabun">
                          {approvalRate}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(data.applications / 200) * 100}%` }}
                              ></div>
                            </div>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(data.approved / 200) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 font-sarabun mb-1">
                  ยอดนิยมสูงสุด
                </p>
                <p className="text-xl font-bold text-blue-900 font-sarabun">
                  ทุนค่าเทอม
                </p>
                <p className="text-xs text-blue-600 font-sarabun mt-1">
                  456 ใบสมัคร (36.6%)
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <AcademicCapIcon className="h-8 w-8 text-blue-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 font-sarabun mb-1">
                  คณะที่สมัครมากที่สุด
                </p>
                <p className="text-xl font-bold text-green-900 font-sarabun">
                  วิศวกรรมศาสตร์
                </p>
                <p className="text-xs text-green-600 font-sarabun mt-1">
                  312 ใบสมัคร (25%)
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-xl">
                <UsersIcon className="h-8 w-8 text-green-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 font-sarabun mb-1">
                  ระยะเวลาเฉลี่ย
                </p>
                <p className="text-xl font-bold text-purple-900 font-sarabun">
                  14 วัน
                </p>
                <p className="text-xs text-purple-600 font-sarabun mt-1">
                  จากส่งถึงอนุมัติ
                </p>
              </div>
              <div className="p-3 bg-purple-200 rounded-xl">
                <ClockIcon className="h-8 w-8 text-purple-700" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
