'use client';

import React, { useState } from 'react';
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  AcademicCapIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface BudgetItem {
  id: string;
  scholarshipName: string;
  scholarshipType: string;
  totalBudget: number;
  allocated: number;
  disbursed: number;
  remaining: number;
  recipients: number;
  status: 'active' | 'depleted' | 'pending' | 'reserved';
  fiscalYear: string;
}

interface BudgetSummary {
  totalBudget: number;
  totalAllocated: number;
  totalDisbursed: number;
  totalRemaining: number;
  utilizationRate: number;
  scholarshipCount: number;
  recipientCount: number;
}

export default function AdminBudgetPage() {
  const [selectedYear, setSelectedYear] = useState('2568');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  const summary: BudgetSummary = {
    totalBudget: 15750000,
    totalAllocated: 12500000,
    totalDisbursed: 8950000,
    totalRemaining: 6800000,
    utilizationRate: 71.6,
    scholarshipCount: 45,
    recipientCount: 892
  };

  const budgetItems: BudgetItem[] = [
    {
      id: '1',
      scholarshipName: 'ทุนเรียนดี',
      scholarshipType: 'ทุนความเป็นเลิศทางวิชาการ',
      totalBudget: 3000000,
      allocated: 2800000,
      disbursed: 2100000,
      remaining: 900000,
      recipients: 140,
      status: 'active',
      fiscalYear: '2568'
    },
    {
      id: '2',
      scholarshipName: 'ทุนผู้มีรายได้น้อย',
      scholarshipType: 'ทุนช่วยเหลือทางการเงิน',
      totalBudget: 4500000,
      allocated: 4200000,
      disbursed: 3500000,
      remaining: 1000000,
      recipients: 280,
      status: 'active',
      fiscalYear: '2568'
    },
    {
      id: '3',
      scholarshipName: 'ทุนกีฬาดีเด่น',
      scholarshipType: 'ทุนกิจกรรมพิเศษ',
      totalBudget: 1200000,
      allocated: 1200000,
      disbursed: 950000,
      remaining: 250000,
      recipients: 60,
      status: 'active',
      fiscalYear: '2568'
    },
    {
      id: '4',
      scholarshipName: 'ทุนวิจัย',
      scholarshipType: 'ทุนวิจัยและพัฒนา',
      totalBudget: 2500000,
      allocated: 1500000,
      disbursed: 800000,
      remaining: 1700000,
      recipients: 45,
      status: 'active',
      fiscalYear: '2568'
    },
    {
      id: '5',
      scholarshipName: 'ทุนชุมชน',
      scholarshipType: 'ทุนบริการชุมชน',
      totalBudget: 1800000,
      allocated: 1800000,
      disbursed: 1800000,
      remaining: 0,
      recipients: 120,
      status: 'depleted',
      fiscalYear: '2568'
    },
    {
      id: '6',
      scholarshipName: 'ทุนแลกเปลี่ยนนักศึกษา',
      scholarshipType: 'ทุนระหว่างประเทศ',
      totalBudget: 2750000,
      allocated: 1000000,
      disbursed: 800000,
      remaining: 1950000,
      recipients: 25,
      status: 'active',
      fiscalYear: '2568'
    }
  ];

  const filteredItems = budgetItems.filter(item => {
    const matchesSearch = item.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.scholarshipType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'depleted':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reserved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'ใช้งานอยู่';
      case 'depleted':
        return 'หมดงบประมาณ';
      case 'pending':
        return 'รอดำเนินการ';
      case 'reserved':
        return 'สำรองไว้';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              จัดการงบประมาณทุนการศึกษา
            </h1>
            <p className="text-secondary-600 font-sarabun mb-3">
              ติดตามการใช้จ่ายงบประมาณและจัดสรรทุนให้กับนักศึกษา
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700 font-sarabun">
                    <strong>คำอธิบาย:</strong> หน้านี้ใช้สำหรับติดตามงบประมาณทุนการศึกษาทั้งหมด ดูว่าแต่ละทุนมีงบเท่าไร จัดสรรไปแล้วเท่าไร จ่ายไปแล้วเท่าไร และยังเหลืออีกเท่าไร
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="font-sarabun">
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              ส่งออกรายงาน Excel
            </Button>
            <Button variant="primary" className="font-sarabun">
              <PlusIcon className="h-4 w-4 mr-2" />
              เพิ่มงบประมาณ
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-secondary-900 font-sarabun mb-2">
          สรุปภาพรวมงบประมาณ (ปีงบประมาณ {selectedYear})
        </h2>
        <p className="text-sm text-secondary-600 font-sarabun mb-4">
          แสดงสถานะการใช้จ่ายงบประมาณทุนการศึกษาทั้งหมดในระบบ
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 font-sarabun mb-1">
                  งบประมาณทั้งหมด
                </p>
                <p className="text-xs text-blue-500 font-sarabun mb-2">
                  (งบที่ตั้งไว้ทั้งหมด)
                </p>
                <p className="text-2xl font-bold text-blue-900 font-sarabun">
                  {formatCurrency(summary.totalBudget)}
                </p>
              </div>
              <BanknotesIcon className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 font-sarabun mb-1">
                  จัดสรรแล้ว
                </p>
                <p className="text-xs text-green-500 font-sarabun mb-2">
                  (มอบให้นักศึกษาแล้ว)
                </p>
                <p className="text-2xl font-bold text-green-900 font-sarabun">
                  {formatCurrency(summary.totalAllocated)}
                </p>
                <p className="text-xs text-green-600 font-sarabun mt-1">
                  {calculatePercentage(summary.totalAllocated, summary.totalBudget).toFixed(1)}% ของงบทั้งหมด
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 font-sarabun mb-1">
                  จ่ายเงินแล้ว
                </p>
                <p className="text-xs text-purple-500 font-sarabun mb-2">
                  (โอนเงินให้นักศึกษาแล้ว)
                </p>
                <p className="text-2xl font-bold text-purple-900 font-sarabun">
                  {formatCurrency(summary.totalDisbursed)}
                </p>
                <p className="text-xs text-purple-600 font-sarabun mt-1">
                  {calculatePercentage(summary.totalDisbursed, summary.totalAllocated).toFixed(1)}% ของที่จัดสรร
                </p>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 font-sarabun mb-1">
                  งบคงเหลือ
                </p>
                <p className="text-xs text-orange-500 font-sarabun mb-2">
                  (ยังใช้ไม่หมด)
                </p>
                <p className="text-2xl font-bold text-orange-900 font-sarabun">
                  {formatCurrency(summary.totalRemaining)}
                </p>
                <p className="text-xs text-orange-600 font-sarabun mt-1">
                  {calculatePercentage(summary.totalRemaining, summary.totalBudget).toFixed(1)}% ของงบทั้งหมด
                </p>
              </div>
              <ArrowTrendingDownIcon className="h-12 w-12 text-orange-600 opacity-20" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Utilization Overview */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-secondary-900 font-sarabun mb-2">
          การวิเคราะห์การใช้งบประมาณ
        </h2>
        <p className="text-sm text-secondary-600 font-sarabun mb-4">
          แสดงอัตราการใช้จ่ายและสถิติการจัดสรรงบประมาณ
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-secondary-200">
            <CardTitle className="text-lg font-sarabun">
              อัตราการใช้งบประมาณ
              <span className="text-sm font-normal text-secondary-500 ml-2">(เปรียบเทียบงบที่จ่ายไปกับงบทั้งหมด)</span>
            </CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-6">
              {/* Total Budget Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-secondary-700 font-sarabun">
                    งบประมาณที่ใช้ไป
                  </span>
                  <span className="text-sm font-bold text-secondary-900 font-sarabun">
                    {summary.utilizationRate}%
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${summary.utilizationRate}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-secondary-500 font-sarabun">
                    {formatCurrency(summary.totalDisbursed)} จาก {formatCurrency(summary.totalBudget)}
                  </span>
                  <span className="text-xs text-secondary-500 font-sarabun">
                    คงเหลือ {formatCurrency(summary.totalRemaining)}
                  </span>
                </div>
              </div>

              {/* Allocation vs Disbursement */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-600 font-sarabun mb-1">จัดสรร</p>
                      <p className="text-lg font-bold text-green-900 font-sarabun">
                        {formatCurrency(summary.totalAllocated)}
                      </p>
                    </div>
                    <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-purple-600 font-sarabun mb-1">จ่ายแล้ว</p>
                      <p className="text-lg font-bold text-purple-900 font-sarabun">
                        {formatCurrency(summary.totalDisbursed)}
                      </p>
                    </div>
                    <BanknotesIcon className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="border-b border-secondary-200">
            <CardTitle className="text-lg font-sarabun">สถิติรวม</CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-xs text-blue-600 font-sarabun">ทุนการศึกษา</p>
                    <p className="text-lg font-bold text-blue-900 font-sarabun">
                      {summary.scholarshipCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <UsersIcon className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-xs text-green-600 font-sarabun">ผู้รับทุน</p>
                    <p className="text-lg font-bold text-green-900 font-sarabun">
                      {summary.recipientCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <ChartPieIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <p className="text-xs text-purple-600 font-sarabun">อัตราการใช้</p>
                    <p className="text-lg font-bold text-purple-900 font-sarabun">
                      {summary.utilizationRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="ค้นหาทุนการศึกษา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-sarabun"
              />
            </div>

            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
              >
                <option value="2568">ปีงบประมาณ 2568</option>
                <option value="2567">ปีงบประมาณ 2567</option>
                <option value="2566">ปีงบประมาณ 2566</option>
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="active">ใช้งานอยู่</option>
                <option value="depleted">หมดงบประมาณ</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="reserved">สำรองไว้</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Budget Items Table */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-secondary-900 font-sarabun mb-2">
          รายละเอียดงบประมาณแต่ละทุน
        </h2>
        <p className="text-sm text-secondary-600 font-sarabun mb-4">
          แสดงรายละเอียดการใช้จ่ายงบประมาณของแต่ละทุนการศึกษา พร้อมจำนวนผู้รับทุนและสถานะการใช้งาน
        </p>
      </div>
      <Card>
        <CardHeader className="border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-sarabun">รายการงบประมาณทุนการศึกษา</CardTitle>
            <div className="text-sm text-secondary-500 font-sarabun">
              ทั้งหมด {filteredItems.length} รายการ
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    ทุนการศึกษา
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    งบประมาณตั้งไว้
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    จัดสรรแล้ว
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    โอนเงินแล้ว
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    เหลือใช้
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    จำนวนผู้รับ
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    % ใช้ไป
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredItems.map((item) => {
                  const utilizationPercent = calculatePercentage(item.disbursed, item.totalBudget);

                  return (
                    <tr key={item.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-secondary-900 font-sarabun">
                            {item.scholarshipName}
                          </div>
                          <div className="text-xs text-secondary-500 font-sarabun">
                            {item.scholarshipType}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-medium text-secondary-900 font-sarabun">
                          {formatCurrency(item.totalBudget)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm text-green-600 font-sarabun">
                          {formatCurrency(item.allocated)}
                        </div>
                        <div className="text-xs text-secondary-500 font-sarabun">
                          {calculatePercentage(item.allocated, item.totalBudget).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm text-purple-600 font-sarabun">
                          {formatCurrency(item.disbursed)}
                        </div>
                        <div className="text-xs text-secondary-500 font-sarabun">
                          {calculatePercentage(item.disbursed, item.allocated).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-medium text-orange-600 font-sarabun">
                          {formatCurrency(item.remaining)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm text-secondary-900 font-sarabun">
                          {item.recipients}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-sarabun ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-secondary-200 rounded-full h-2 mb-1">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                utilizationPercent >= 90
                                  ? 'bg-red-500'
                                  : utilizationPercent >= 70
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-secondary-600 font-sarabun">
                            {utilizationPercent.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <BanknotesIcon className="mx-auto h-12 w-12 text-secondary-400" />
              <h3 className="mt-2 text-sm font-medium text-secondary-900 font-sarabun">
                ไม่พบข้อมูล
              </h3>
              <p className="mt-1 text-sm text-secondary-500 font-sarabun">
                ไม่มีรายการงบประมาณที่ตรงกับเงื่อนไขการค้นหา
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
