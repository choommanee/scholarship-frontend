'use client';

import React, { useState } from 'react';
import {
  BanknotesIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  FunnelIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Allocation {
  allocation_id: number;
  scholarship_id: number;
  scholarship_name: string;
  scholarship_type: string;
  academic_year: string;
  semester: string;
  total_budget: number;
  allocated_amount: number;
  remaining_budget: number;
  total_quota: number;
  allocated_quota: number;
  remaining_quota: number;
  status: 'pending' | 'approved' | 'disbursed' | 'completed';
  allocation_date: string;
  approved_by?: string;
  approved_date?: string;
  notes?: string;
}

interface AllocationFormData {
  scholarship_id: number;
  scholarship_name: string;
  total_budget: number;
  total_quota: number;
  notes: string;
}

export default function OfficerAllocationsPage() {
  const [selectedYear, setSelectedYear] = useState('2567');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<AllocationFormData>({
    scholarship_id: 0,
    scholarship_name: '',
    total_budget: 0,
    total_quota: 0,
    notes: ''
  });

  // Mock data
  const [allocations, setAllocations] = useState<Allocation[]>([
    {
      allocation_id: 1,
      scholarship_id: 1,
      scholarship_name: 'ทุนเรียนดี',
      scholarship_type: 'ทุนความเป็นเลิศ',
      academic_year: '2567',
      semester: '1',
      total_budget: 500000,
      allocated_amount: 400000,
      remaining_budget: 100000,
      total_quota: 25,
      allocated_quota: 20,
      remaining_quota: 5,
      status: 'disbursed',
      allocation_date: '2024-08-01',
      approved_by: 'ผศ.ดร.สมชาย ใจดี',
      approved_date: '2024-08-05',
      notes: 'จัดสรรให้นักศึกษาที่มี GPA >= 3.50'
    },
    {
      allocation_id: 2,
      scholarship_id: 3,
      scholarship_name: 'ทุนช่วยเหลือนักศึกษา',
      scholarship_type: 'ทุนช่วยเหลือ',
      academic_year: '2567',
      semester: '1',
      total_budget: 750000,
      allocated_amount: 600000,
      remaining_budget: 150000,
      total_quota: 50,
      allocated_quota: 40,
      remaining_quota: 10,
      status: 'approved',
      allocation_date: '2024-08-01',
      approved_by: 'ผศ.ดร.สมชาย ใจดี',
      approved_date: '2024-08-05',
      notes: 'สำหรับนักศึกษาที่มีความต้องการพิเศษ'
    },
    {
      allocation_id: 3,
      scholarship_id: 5,
      scholarship_name: 'ทุนวิจัย',
      scholarship_type: 'ทุนวิจัย',
      academic_year: '2567',
      semester: '1',
      total_budget: 1000000,
      allocated_amount: 0,
      remaining_budget: 1000000,
      total_quota: 10,
      allocated_quota: 0,
      remaining_quota: 10,
      status: 'pending',
      allocation_date: '2024-08-01',
      notes: 'รอการอนุมัติจากคณะกรรมการ'
    }
  ]);

  // Mock scholarships for dropdown
  const availableScholarships = [
    { id: 1, name: 'ทุนเรียนดี', type: 'ทุนความเป็นเลิศ' },
    { id: 2, name: 'ทุนกีฬา', type: 'ทุนกิจกรรม' },
    { id: 3, name: 'ทุนช่วยเหลือนักศึกษา', type: 'ทุนช่วยเหลือ' },
    { id: 4, name: 'ทุนนักดนตรี', type: 'ทุนกิจกรรม' },
    { id: 5, name: 'ทุนวิจัย', type: 'ทุนวิจัย' }
  ];

  // Event Handlers
  const handleCreateAllocation = () => {
    setIsEditMode(false);
    setFormData({
      scholarship_id: 0,
      scholarship_name: '',
      total_budget: 0,
      total_quota: 0,
      notes: ''
    });
    setShowAllocationModal(true);
  };

  const handleEditAllocation = (allocation: Allocation) => {
    setIsEditMode(true);
    setSelectedAllocation(allocation);
    setFormData({
      scholarship_id: allocation.scholarship_id,
      scholarship_name: allocation.scholarship_name,
      total_budget: allocation.total_budget,
      total_quota: allocation.total_quota,
      notes: allocation.notes || ''
    });
    setShowAllocationModal(true);
  };

  const handleViewDetails = (allocation: Allocation) => {
    setSelectedAllocation(allocation);
    setShowDetailModal(true);
  };

  const handleApprove = (allocation: Allocation) => {
    setSelectedAllocation(allocation);
    setShowApproveModal(true);
  };

  const handleDelete = (allocation: Allocation) => {
    setSelectedAllocation(allocation);
    setShowDeleteModal(true);
  };

  const handleSaveAllocation = () => {
    if (isEditMode && selectedAllocation) {
      // Update existing allocation
      setAllocations(prev => prev.map(a =>
        a.allocation_id === selectedAllocation.allocation_id
          ? {
              ...a,
              total_budget: formData.total_budget,
              total_quota: formData.total_quota,
              notes: formData.notes,
              remaining_budget: formData.total_budget - a.allocated_amount,
              remaining_quota: formData.total_quota - a.allocated_quota
            }
          : a
      ));
      alert('อัพเดทการจัดสรรสำเร็จ');
    } else {
      // Create new allocation
      const selectedScholarship = availableScholarships.find(s => s.id === formData.scholarship_id);
      const newAllocation: Allocation = {
        allocation_id: allocations.length + 1,
        scholarship_id: formData.scholarship_id,
        scholarship_name: selectedScholarship?.name || '',
        scholarship_type: selectedScholarship?.type || '',
        academic_year: selectedYear,
        semester: selectedSemester === 'all' ? '1' : selectedSemester,
        total_budget: formData.total_budget,
        allocated_amount: 0,
        remaining_budget: formData.total_budget,
        total_quota: formData.total_quota,
        allocated_quota: 0,
        remaining_quota: formData.total_quota,
        status: 'pending',
        allocation_date: new Date().toISOString().split('T')[0],
        notes: formData.notes
      };
      setAllocations(prev => [...prev, newAllocation]);
      alert('สร้างการจัดสรรใหม่สำเร็จ');
    }
    setShowAllocationModal(false);
  };

  const handleConfirmApprove = () => {
    if (selectedAllocation) {
      setAllocations(prev => prev.map(a =>
        a.allocation_id === selectedAllocation.allocation_id
          ? {
              ...a,
              status: 'approved',
              approved_by: 'ผศ.ดร.สมชาย ใจดี',
              approved_date: new Date().toISOString().split('T')[0]
            }
          : a
      ));
      alert('อนุมัติการจัดสรรสำเร็จ');
      setShowApproveModal(false);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedAllocation) {
      setAllocations(prev => prev.filter(a => a.allocation_id !== selectedAllocation.allocation_id));
      alert('ลบการจัดสรรสำเร็จ');
      setShowDeleteModal(false);
    }
  };

  const handleExportExcel = () => {
    alert('กำลังส่งออกข้อมูลเป็น Excel...');
    // TODO: Implement Excel export
  };

  const handleExportPDF = () => {
    alert('กำลังส่งออกข้อมูลเป็น PDF...');
    // TODO: Implement PDF export
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string; icon: any } } = {
      pending: {
        label: 'รออนุมัติ',
        className: 'bg-yellow-100 text-yellow-800',
        icon: ClockIcon
      },
      approved: {
        label: 'อนุมัติแล้ว',
        className: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      },
      disbursed: {
        label: 'จ่ายเงินแล้ว',
        className: 'bg-blue-100 text-blue-800',
        icon: CheckCircleIcon
      },
      completed: {
        label: 'เสร็จสิ้น',
        className: 'bg-gray-100 text-gray-800',
        icon: CheckCircleIcon
      }
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
      icon: ClockIcon
    };

    const Icon = statusInfo.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        <Icon className="h-4 w-4 mr-1" />
        {statusInfo.label}
      </span>
    );
  };

  // Filter allocations
  const filteredAllocations = allocations.filter(allocation => {
    const matchesYear = selectedYear === 'all' || allocation.academic_year === selectedYear;
    const matchesSemester = selectedSemester === 'all' || allocation.semester === selectedSemester;
    const matchesStatus = selectedStatus === 'all' || allocation.status === selectedStatus;
    return matchesYear && matchesSemester && matchesStatus;
  });

  // Calculate totals
  const totalBudget = filteredAllocations.reduce((sum, a) => sum + a.total_budget, 0);
  const totalAllocated = filteredAllocations.reduce((sum, a) => sum + a.allocated_amount, 0);
  const totalRemaining = filteredAllocations.reduce((sum, a) => sum + a.remaining_budget, 0);
  const totalQuota = filteredAllocations.reduce((sum, a) => sum + a.total_quota, 0);
  const allocatedQuota = filteredAllocations.reduce((sum, a) => sum + a.allocated_quota, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              จัดสรรทุนการศึกษา
            </h1>
            <p className="text-secondary-600 font-sarabun">
              จัดการและติดตามการจัดสรรงบประมาณทุนการศึกษา
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleExportExcel}
              className="font-sarabun"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="font-sarabun"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="font-sarabun"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              ตัวกรอง
            </Button>
            <Button variant="primary" onClick={handleCreateAllocation} className="font-sarabun">
              <PlusIcon className="h-4 w-4 mr-2" />
              จัดสรรทุนใหม่
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
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
                  <option value="all">ทั้งหมด</option>
                  <option value="2567">2567</option>
                  <option value="2566">2566</option>
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
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  สถานะ
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="pending">รออนุมัติ</option>
                  <option value="approved">อนุมัติแล้ว</option>
                  <option value="disbursed">จ่ายเงินแล้ว</option>
                  <option value="completed">เสร็จสิ้น</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 font-sarabun">งบประมาณรวม</p>
                <p className="text-3xl font-bold text-blue-900 font-sarabun">
                  {(totalBudget / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-blue-700 font-sarabun mt-1">บาท</p>
              </div>
              <BanknotesIcon className="h-12 w-12 text-blue-600 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 font-sarabun">จัดสรรไปแล้ว</p>
                <p className="text-3xl font-bold text-green-900 font-sarabun">
                  {(totalAllocated / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-green-700 font-sarabun mt-1">
                  {totalBudget > 0 ? ((totalAllocated / totalBudget) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <CheckCircleIcon className="h-12 w-12 text-green-600 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 font-sarabun">คงเหลือ</p>
                <p className="text-3xl font-bold text-yellow-900 font-sarabun">
                  {(totalRemaining / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-yellow-700 font-sarabun mt-1">
                  {totalBudget > 0 ? ((totalRemaining / totalBudget) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <ChartBarIcon className="h-12 w-12 text-yellow-600 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 font-sarabun">จำนวนทุน</p>
                <p className="text-3xl font-bold text-purple-900 font-sarabun">
                  {allocatedQuota}/{totalQuota}
                </p>
                <p className="text-sm text-purple-700 font-sarabun mt-1">
                  {totalQuota > 0 ? ((allocatedQuota / totalQuota) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <UserGroupIcon className="h-12 w-12 text-purple-600 opacity-50" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Allocations List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sarabun">รายการจัดสรร</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {filteredAllocations.map((allocation) => (
              <div
                key={allocation.allocation_id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <AcademicCapIcon className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900 font-sarabun">
                        {allocation.scholarship_name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getStatusBadge(allocation.status)}
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium font-sarabun">
                        {allocation.academic_year}/{allocation.semester}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(allocation)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    {allocation.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(allocation)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </Button>
                    )}
                    {(allocation.status === 'pending' || allocation.status === 'approved') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAllocation(allocation)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    )}
                    {allocation.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(allocation)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700 font-sarabun">งบประมาณ</span>
                    <span className="font-sarabun">
                      {allocation.allocated_amount.toLocaleString()} / {allocation.total_budget.toLocaleString()} บาท
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${allocation.total_budget > 0 ? (allocation.allocated_amount / allocation.total_budget) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1 font-sarabun">
                    <span>จัดสรรแล้ว {((allocation.allocated_amount / allocation.total_budget) * 100).toFixed(1)}%</span>
                    <span>คงเหลือ {allocation.remaining_budget.toLocaleString()} บาท</span>
                  </div>
                </div>

                {/* Quota Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700 font-sarabun">โควต้า</span>
                    <span className="font-sarabun">
                      {allocation.allocated_quota} / {allocation.total_quota} ทุน
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${allocation.total_quota > 0 ? (allocation.allocated_quota / allocation.total_quota) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1 font-sarabun">
                    <span>จัดสรรแล้ว {((allocation.allocated_quota / allocation.total_quota) * 100).toFixed(1)}%</span>
                    <span>คงเหลือ {allocation.remaining_quota} ทุน</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="text-gray-500 font-sarabun">วันที่จัดสรร:</span>
                    <span className="ml-2 font-medium text-gray-900 font-sarabun">
                      {new Date(allocation.allocation_date).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  {allocation.approved_by && (
                    <div className="text-sm">
                      <span className="text-gray-500 font-sarabun">อนุมัติโดย:</span>
                      <span className="ml-2 font-medium text-gray-900 font-sarabun">
                        {allocation.approved_by}
                      </span>
                    </div>
                  )}
                  {allocation.approved_date && (
                    <div className="text-sm">
                      <span className="text-gray-500 font-sarabun">วันที่อนุมัติ:</span>
                      <span className="ml-2 font-medium text-gray-900 font-sarabun">
                        {new Date(allocation.approved_date).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  )}
                </div>

                {allocation.notes && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800 font-sarabun">
                      <span className="font-medium">หมายเหตุ:</span> {allocation.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredAllocations.length === 0 && (
            <div className="text-center py-12">
              <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 font-sarabun">
                ไม่พบรายการจัดสรร
              </h3>
              <p className="mt-1 text-sm text-gray-500 font-sarabun">
                ไม่มีรายการจัดสรรที่ตรงกับเงื่อนไขการค้นหา
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create/Edit Allocation Modal */}
      {showAllocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 font-sarabun">
                {isEditMode ? 'แก้ไขการจัดสรร' : 'สร้างการจัดสรรใหม่'}
              </h3>
              <button
                onClick={() => setShowAllocationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Scholarship Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  ทุนการศึกษา <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.scholarship_id}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const scholarship = availableScholarships.find(s => s.id === selectedId);
                    setFormData({
                      ...formData,
                      scholarship_id: selectedId,
                      scholarship_name: scholarship?.name || ''
                    });
                  }}
                  disabled={isEditMode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun disabled:bg-gray-100"
                >
                  <option value={0}>เลือกทุนการศึกษา</option>
                  {availableScholarships.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  งบประมาณ (บาท) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.total_budget}
                  onChange={(e) => setFormData({ ...formData, total_budget: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                  placeholder="0"
                />
              </div>

              {/* Quota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  จำนวนทุน (คน) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.total_quota}
                  onChange={(e) => setFormData({ ...formData, total_quota: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                  placeholder="0"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                  หมายเหตุ
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                  placeholder="ระบุรายละเอียดเพิ่มเติม..."
                />
              </div>

              {/* Academic Info Display */}
              {!isEditMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-sarabun">
                    <span className="font-medium">ปีการศึกษา:</span> {selectedYear} /
                    <span className="font-medium ml-2">ภาคเรียน:</span> {selectedSemester === 'all' ? '1' : selectedSemester}
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowAllocationModal(false)}
                className="font-sarabun"
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveAllocation}
                disabled={formData.scholarship_id === 0 || formData.total_budget === 0 || formData.total_quota === 0}
                className="font-sarabun"
              >
                {isEditMode ? 'บันทึกการแก้ไข' : 'สร้างการจัดสรร'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAllocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 font-sarabun">
                รายละเอียดการจัดสรร
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Scholarship Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 font-sarabun mb-2">
                      {selectedAllocation.scholarship_name}
                    </h4>
                    <p className="text-gray-600 font-sarabun">{selectedAllocation.scholarship_type}</p>
                  </div>
                  {getStatusBadge(selectedAllocation.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600 font-sarabun">ปีการศึกษา</p>
                    <p className="text-lg font-semibold text-gray-900 font-sarabun">
                      {selectedAllocation.academic_year}/{selectedAllocation.semester}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-sarabun">วันที่จัดสรร</p>
                    <p className="text-lg font-semibold text-gray-900 font-sarabun">
                      {new Date(selectedAllocation.allocation_date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget Details */}
              <div>
                <h5 className="text-lg font-semibold text-gray-900 font-sarabun mb-4">งบประมาณ</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-sarabun mb-1">งบประมาณรวม</p>
                    <p className="text-2xl font-bold text-blue-900 font-sarabun">
                      {selectedAllocation.total_budget.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-700 font-sarabun">บาท</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-sarabun mb-1">จัดสรรแล้ว</p>
                    <p className="text-2xl font-bold text-green-900 font-sarabun">
                      {selectedAllocation.allocated_amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-700 font-sarabun">
                      {((selectedAllocation.allocated_amount / selectedAllocation.total_budget) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-600 font-sarabun mb-1">คงเหลือ</p>
                    <p className="text-2xl font-bold text-yellow-900 font-sarabun">
                      {selectedAllocation.remaining_budget.toLocaleString()}
                    </p>
                    <p className="text-sm text-yellow-700 font-sarabun">
                      {((selectedAllocation.remaining_budget / selectedAllocation.total_budget) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full"
                      style={{
                        width: `${(selectedAllocation.allocated_amount / selectedAllocation.total_budget) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quota Details */}
              <div>
                <h5 className="text-lg font-semibold text-gray-900 font-sarabun mb-4">จำนวนทุน</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-sarabun mb-1">โควตารวม</p>
                    <p className="text-2xl font-bold text-purple-900 font-sarabun">
                      {selectedAllocation.total_quota}
                    </p>
                    <p className="text-sm text-purple-700 font-sarabun">ทุน</p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <p className="text-sm text-indigo-600 font-sarabun mb-1">จัดสรรแล้ว</p>
                    <p className="text-2xl font-bold text-indigo-900 font-sarabun">
                      {selectedAllocation.allocated_quota}
                    </p>
                    <p className="text-sm text-indigo-700 font-sarabun">
                      {((selectedAllocation.allocated_quota / selectedAllocation.total_quota) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <p className="text-sm text-pink-600 font-sarabun mb-1">คงเหลือ</p>
                    <p className="text-2xl font-bold text-pink-900 font-sarabun">
                      {selectedAllocation.remaining_quota}
                    </p>
                    <p className="text-sm text-pink-700 font-sarabun">
                      {((selectedAllocation.remaining_quota / selectedAllocation.total_quota) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full"
                      style={{
                        width: `${(selectedAllocation.allocated_quota / selectedAllocation.total_quota) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Approval Info */}
              {selectedAllocation.approved_by && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-green-900 font-sarabun mb-3">ข้อมูลการอนุมัติ</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700 font-sarabun">ผู้อนุมัติ</p>
                      <p className="text-base font-medium text-green-900 font-sarabun">
                        {selectedAllocation.approved_by}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-sarabun">วันที่อนุมัติ</p>
                      <p className="text-base font-medium text-green-900 font-sarabun">
                        {selectedAllocation.approved_date && new Date(selectedAllocation.approved_date).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedAllocation.notes && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-gray-900 font-sarabun mb-2">หมายเหตุ</h5>
                  <p className="text-gray-700 font-sarabun">{selectedAllocation.notes}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <Button
                variant="primary"
                onClick={() => setShowDetailModal(false)}
                className="font-sarabun"
              >
                ปิด
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedAllocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 font-sarabun mb-2">
                ยืนยันการอนุมัติ
              </h3>
              <p className="text-center text-gray-600 font-sarabun mb-6">
                คุณต้องการอนุมัติการจัดสรร<br />
                <span className="font-semibold">{selectedAllocation.scholarship_name}</span> ใช่หรือไม่?
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-sarabun">งบประมาณ</p>
                    <p className="font-semibold text-gray-900 font-sarabun">
                      {selectedAllocation.total_budget.toLocaleString()} บาท
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-sarabun">จำนวนทุน</p>
                    <p className="font-semibold text-gray-900 font-sarabun">
                      {selectedAllocation.total_quota} ทุน
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 font-sarabun"
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmApprove}
                  className="flex-1 font-sarabun bg-green-600 hover:bg-green-700"
                >
                  อนุมัติ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedAllocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 font-sarabun mb-2">
                ยืนยันการลบ
              </h3>
              <p className="text-center text-gray-600 font-sarabun mb-6">
                คุณต้องการลบการจัดสรร<br />
                <span className="font-semibold">{selectedAllocation.scholarship_name}</span> ใช่หรือไม่?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800 font-sarabun">
                  <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                  การดำเนินการนี้ไม่สามารถย้อนกลับได้
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 font-sarabun"
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmDelete}
                  className="flex-1 font-sarabun bg-red-600 hover:bg-red-700"
                >
                  ลบ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
