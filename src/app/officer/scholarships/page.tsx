'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AcademicCapIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Scholarship {
  id: number;
  name: string;
  description: string;
  type: string;
  amount: number;
  maxRecipients: number;
  currentApplicants: number;
  approvedApplicants: number;
  status: 'draft' | 'open' | 'closed' | 'suspended';
  createdDate: string;
  applicationDeadline: string;
  academicYear: string;
  requirements: string[];
  documentsRequired: string[];
  provider: string;
  budget: {
    total: number;
    allocated: number;
    remaining: number;
  };
  lastModified: string;
  createdBy: string;
  isActive: boolean;
}

const OfficerScholarshipsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);


  const scholarships: Scholarship[] = [
    {
      id: 1,
      name: 'ทุนพัฒนาศักยภาพนักศึกษา',
      description: 'ทุนการศึกษาสำหรับนักศึกษาที่มีผลการเรียนดีและต้องการพัฒนาทักษะในด้านต่างๆ มุ่งเน้นการพัฒนาความเป็นผู้นำและการทำงานเป็นทีม',
      type: 'development',
      amount: 20000,
      maxRecipients: 100,
      currentApplicants: 45,
      approvedApplicants: 25,
      status: 'open',
      createdDate: '2024-10-01',
      applicationDeadline: '2024-12-31',
      academicYear: '2567',
      requirements: ['เกรดเฉลีย์ ≥ 3.00', 'ไม่เคยได้ทุนประเภทนี้', 'มีกิจกรรมเสริม'],
      documentsRequired: ['ใบแสดงผลการเรียน', 'หนังสือรับรองรายได้', 'สำเนาบัตรประชาชน'],
      provider: 'คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
      budget: {
        total: 2000000,
        allocated: 500000,
        remaining: 1500000
      },
      lastModified: '2024-12-01',
      createdBy: 'วิไลวรรณ จัดการดี',
      isActive: true
    },
    {
      id: 2,
      name: 'ทุนเรียนดี',
      description: 'ทุนการศึกษาสำหรับนักศึกษาที่มีผลการเรียนดีเยี่ยม มุ่งเน้นการส่งเสริมความเป็นเลิศทางวิชาการ',
      type: 'academic',
      amount: 15000,
      maxRecipients: 80,
      currentApplicants: 78,
      approvedApplicants: 45,
      status: 'open',
      createdDate: '2024-09-15',
      applicationDeadline: '2024-12-25',
      academicYear: '2567',
      requirements: ['เกรดเฉลีย์ ≥ 3.50', 'นักศึกษาชั้นปีที่ 2-4', 'ไม่มีวิชา F'],
      documentsRequired: ['ใบแสดงผลการเรียน', 'รูปถ่าย', 'หนังสือรับรอง'],
      provider: 'มูลนิธิเพื่อการศึกษา',
      budget: {
        total: 1200000,
        allocated: 675000,
        remaining: 525000
      },
      lastModified: '2024-11-20',
      createdBy: 'สมหมาย ช่วยเหลือ',
      isActive: true
    },
    {
      id: 3,
      name: 'ทุนช่วยเหลือการศึกษา',
      description: 'ทุนการศึกษาสำหรับนักศึกษาที่มีฐานะทางเศรษฐกิจยากจน เพื่อสนับสนุนค่าใช้จ่ายในการศึกษา',
      type: 'financial_aid',
      amount: 12000,
      maxRecipients: 150,
      currentApplicants: 120,
      approvedApplicants: 85,
      status: 'open',
      createdDate: '2024-08-01',
      applicationDeadline: '2024-12-20',
      academicYear: '2567',
      requirements: ['รายได้ครอบครัว < 30,000 บาท/เดือน', 'เกรดเฉลีย์ ≥ 2.50', 'มีเอกสารรับรองรายได้'],
      documentsRequired: ['หนังสือรับรองรายได้', 'ใบแสดงผลการเรียน', 'สำเนาบัตรประชาชน'],
      provider: 'กองทุนสวัสดิการนักศึกษา',
      budget: {
        total: 1800000,
        allocated: 1020000,
        remaining: 780000
      },
      lastModified: '2024-12-05',
      createdBy: 'วิไลวรรณ จัดการดี',
      isActive: true
    },
    {
      id: 4,
      name: 'ทุนวิจัยระดับปริญญาตรี',
      description: 'ทุนสนับสนุนการทำวิจัยสำหรับนักศึกษาปริญญาตรี เพื่อส่งเสริมการเรียนรู้และการค้นคว้า',
      type: 'research',
      amount: 25000,
      maxRecipients: 50,
      currentApplicants: 23,
      approvedApplicants: 12,
      status: 'open',
      createdDate: '2024-11-01',
      applicationDeadline: '2025-01-15',
      academicYear: '2567',
      requirements: ['นักศึกษาชั้นปีที่ 3-4', 'มีโครงการวิจัย', 'เกรดเฉลีย์ ≥ 3.25'],
      documentsRequired: ['โครงร่างวิจัย', 'ใบแสดงผลการเรียน', 'หนังสือรับรองจากอาจารย์ที่ปรึกษา'],
      provider: 'สำนักงานคณะกรรมการวิจัยแห่งชาติ',
      budget: {
        total: 1250000,
        allocated: 300000,
        remaining: 950000
      },
      lastModified: '2024-12-08',
      createdBy: 'ดร.วิจัย ค้นคว้า',
      isActive: true
    },
    {
      id: 5,
      name: 'ทุนกิจกรรมนักศึกษา',
      description: 'ทุนสำหรับนักศึกษาที่เข้าร่วมกิจกรรมเสริมหลักสูตรและกิจกรรมเพื่อสังคม',
      type: 'activity',
      amount: 8000,
      maxRecipients: 200,
      currentApplicants: 200,
      approvedApplicants: 150,
      status: 'closed',
      createdDate: '2024-07-01',
      applicationDeadline: '2024-12-15',
      academicYear: '2567',
      requirements: ['เข้าร่วมกิจกรรม ≥ 20 ชั่วโมง', 'มีใบรับรองจากอาจารย์ที่ปรึกษา'],
      documentsRequired: ['ใบรับรองการเข้าร่วมกิจกรรม', 'รูปถ่าย'],
      provider: 'กองกิจการนักศึกษา',
      budget: {
        total: 1600000,
        allocated: 1200000,
        remaining: 400000
      },
      lastModified: '2024-12-15',
      createdBy: 'อ.กิจกรรม สนใจ',
      isActive: true
    },
    {
      id: 6,
      name: 'ทุนความเป็นเลิศทางวิชาการ',
      description: 'ทุนสำหรับนักศึกษาที่มีผลการเรียนดีเยี่ยมและมีความสามารถพิเศษ',
      type: 'excellence',
      amount: 30000,
      maxRecipients: 25,
      currentApplicants: 12,
      approvedApplicants: 0,
      status: 'draft',
      createdDate: '2024-12-01',
      applicationDeadline: '2025-01-31',
      academicYear: '2567',
      requirements: ['เกรดเฉลีย์ ≥ 3.75', 'อันดับ 10% แรกของคณะ', 'มีผลงานพิเศษ'],
      documentsRequired: ['ใบแสดงผลการเรียน', 'ผลงานพิเศษ', 'หนังสือรับรอง'],
      provider: 'คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
      budget: {
        total: 750000,
        allocated: 0,
        remaining: 750000
      },
      lastModified: '2024-12-12',
      createdBy: 'วิไลวรรณ จัดการดี',
      isActive: false
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'ทุกสถานะ' },
    { value: 'draft', label: 'ร่าง' },
    { value: 'open', label: 'เปิดรับสมัคร' },
    { value: 'closed', label: 'ปิดรับสมัคร' },
    { value: 'suspended', label: 'ระงับชั่วคราว' }
  ];

  const typeOptions = [
    { value: 'all', label: 'ทุกประเภท' },
    { value: 'academic', label: 'ทุนเรียนดี' },
    { value: 'financial_aid', label: 'ทุนช่วยเหลือ' },
    { value: 'research', label: 'ทุนวิจัย' },
    { value: 'development', label: 'ทุนพัฒนาศักยภาพ' },
    { value: 'activity', label: 'ทุนกิจกรรม' },
    { value: 'excellence', label: 'ทุนความเป็นเลิศ' }
  ];

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || scholarship.status === selectedStatus;
    const matchesType = selectedType === 'all' || scholarship.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'ร่าง';
      case 'open': return 'เปิดรับสมัคร';
      case 'closed': return 'ปิดรับสมัคร';
      case 'suspended': return 'ระงับชั่วคราว';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return PencilIcon;
      case 'open': return CheckCircleIcon;
      case 'closed': return XCircleIcon;
      case 'suspended': return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUtilizationPercentage = (budget: any) => {
    return Math.round((budget.allocated / budget.total) * 100);
  };

  const statistics = {
    total: scholarships.length,
    draft: scholarships.filter(s => s.status === 'draft').length,
    open: scholarships.filter(s => s.status === 'open').length,
    closed: scholarships.filter(s => s.status === 'closed').length,
    totalBudget: scholarships.reduce((sum, s) => sum + s.budget.total, 0),
    allocatedBudget: scholarships.reduce((sum, s) => sum + s.budget.allocated, 0)
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                  จัดการทุนการศึกษา
                </h1>
                <p className="text-secondary-600 font-sarabun">
                  สร้าง แก้ไข และจัดการทุนการศึกษาทั้งหมด
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="font-sarabun"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                สร้างทุนใหม่
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.total}</p>
                <p className="text-sm text-secondary-600 font-sarabun">ทุนทั้งหมด</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-gray-50 mb-4">
                  <PencilIcon className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.draft}</p>
                <p className="text-sm text-secondary-600 font-sarabun">ร่าง</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.open}</p>
                <p className="text-sm text-secondary-600 font-sarabun">เปิดรับสมัคร</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-red-50 mb-4">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.closed}</p>
                <p className="text-sm text-secondary-600 font-sarabun">ปิดรับสมัคร</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
                  <BanknotesIcon className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-lg font-bold text-secondary-900">{Math.round((statistics.allocatedBudget / statistics.totalBudget) * 100)}%</p>
                <p className="text-sm text-secondary-600 font-sarabun">งบประมาณใช้ไป</p>
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
                    placeholder="ค้นหาทุนการศึกษา..."
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
                      ประเภท
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      {typeOptions.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
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

          {/* Scholarships list */}
          <div className="space-y-6">
            {filteredScholarships.length === 0 ? (
              <Card>
                <CardBody className="p-12 text-center">
                  <div className="inline-flex p-4 rounded-full bg-secondary-100 mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-secondary-400" />
                  </div>
                  <h3 className="text-lg font-medium text-secondary-900 font-sarabun mb-2">
                    ไม่พบทุนการศึกษา
                  </h3>
                  <p className="text-secondary-600 font-sarabun mb-4">
                    ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูทุนการศึกษาอื่นๆ
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                    className="font-sarabun"
                  >
                    สร้างทุนใหม่
                  </Button>
                </CardBody>
              </Card>
            ) : (
              filteredScholarships.map((scholarship) => {
                const StatusIcon = getStatusIcon(scholarship.status);
                const daysLeft = getDaysLeft(scholarship.applicationDeadline);
                const utilizationPercentage = getUtilizationPercentage(scholarship.budget);
                
                return (
                  <Card key={scholarship.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardBody className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="inline-flex p-3 rounded-xl bg-blue-50">
                          <StatusIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-xl font-bold text-secondary-900 font-sarabun">
                                  {scholarship.name}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(scholarship.status)}`}>
                                  {getStatusText(scholarship.status)}
                                </span>
                                {!scholarship.isActive && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                    ไม่เปิดใช้งาน
                                  </span>
                                )}
                                {daysLeft <= 7 && scholarship.status === 'open' && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                                    เหลือ {daysLeft} วัน
                                  </span>
                                )}
                              </div>
                              <p className="text-secondary-600 font-sarabun mb-3">
                                {scholarship.description}
                              </p>
                              <p className="text-sm text-secondary-600 font-sarabun">
                                ผู้สนับสนุน: {scholarship.provider}
                              </p>
                            </div>
                          </div>

                          {/* Statistics */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-secondary-500 font-sarabun">จำนวนเงิน</p>
                              <p className="text-lg font-bold text-green-600">
                                {scholarship.amount.toLocaleString()} บาท
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-secondary-500 font-sarabun">ผู้สมัคร</p>
                              <p className="text-lg font-bold text-blue-600">
                                {scholarship.currentApplicants}/{scholarship.maxRecipients}
                              </p>
                              <div className="w-full bg-secondary-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-blue-500 h-1 rounded-full"
                                  style={{ width: `${(scholarship.currentApplicants / scholarship.maxRecipients) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-secondary-500 font-sarabun">อนุมัติแล้ว</p>
                              <p className="text-lg font-bold text-purple-600">
                                {scholarship.approvedApplicants} คน
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-secondary-500 font-sarabun">กำหนดปิดรับ</p>
                              <p className="font-medium text-secondary-900">
                                {new Date(scholarship.applicationDeadline).toLocaleDateString('th-TH')}
                              </p>
                            </div>
                          </div>

                          {/* Budget */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm font-medium text-secondary-700 font-sarabun">งบประมาณ</p>
                              <p className="text-sm text-secondary-600">
                                {utilizationPercentage}% ใช้ไปแล้ว
                              </p>
                            </div>
                            <div className="w-full bg-secondary-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${utilizationPercentage}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-secondary-500 mt-1">
                              <span>ใช้ไป: {scholarship.budget.allocated.toLocaleString()} บาท</span>
                              <span>คงเหลือ: {scholarship.budget.remaining.toLocaleString()} บาท</span>
                            </div>
                          </div>

                          {/* Requirements preview */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-secondary-700 font-sarabun mb-2">
                              คุณสมบัติหลัก:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {scholarship.requirements.slice(0, 3).map((req, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full">
                                  {req}
                                </span>
                              ))}
                              {scholarship.requirements.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full">
                                  +{scholarship.requirements.length - 3} อื่นๆ
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Meta info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-secondary-600 mb-4">
                            <div>
                              <p className="text-secondary-500">สร้างโดย</p>
                              <p>{scholarship.createdBy}</p>
                            </div>
                            <div>
                              <p className="text-secondary-500">สร้างเมื่อ</p>
                              <p>{new Date(scholarship.createdDate).toLocaleDateString('th-TH')}</p>
                            </div>
                            <div>
                              <p className="text-secondary-500">แก้ไขล่าสุด</p>
                              <p>{new Date(scholarship.lastModified).toLocaleDateString('th-TH')}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between border-t border-secondary-200 pt-4">
                            <div className="flex space-x-3">
                              <Link href={`/officer/scholarships/${scholarship.id}`}>
                                <Button variant="outline" size="sm" className="font-sarabun">
                                  <EyeIcon className="h-4 w-4 mr-2" />
                                  ดูรายละเอียด
                                </Button>
                              </Link>
                              <Link href={`/officer/scholarships/${scholarship.id}/edit`}>
                                <Button variant="outline" size="sm" className="font-sarabun">
                                  <PencilIcon className="h-4 w-4 mr-2" />
                                  แก้ไข
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm" className="font-sarabun">
                                <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                                คัดลอก
                              </Button>
                              {scholarship.status === 'draft' && (
                                <Button variant="primary" size="sm" className="font-sarabun">
                                  เผยแพร่
                                </Button>
                              )}
                              {scholarship.status === 'open' && (
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 font-sarabun">
                                  ปิดรับสมัคร
                                </Button>
                              )}
                            </div>
                            <div className="text-xs text-secondary-500">
                              ID: {scholarship.id}
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

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl">
                <CardHeader>
                  <CardTitle className="font-sarabun">สร้างทุนการศึกษาใหม่</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="ชื่อทุนการศึกษา"
                      placeholder="เช่น ทุนพัฒนาศักยภาพนักศึกษา"
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        ประเภททุน
                      </label>
                      <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun">
                        <option value="">เลือกประเภท</option>
                        <option value="academic">ทุนเรียนดี</option>
                        <option value="financial_aid">ทุนช่วยเหลือ</option>
                        <option value="research">ทุนวิจัย</option>
                        <option value="development">ทุนพัฒนาศักยภาพ</option>
                        <option value="activity">ทุนกิจกรรม</option>
                        <option value="excellence">ทุนความเป็นเลิศ</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="จำนวนเงิน (บาท)"
                      type="number"
                      placeholder="20000"
                      required
                    />
                    <Input
                      label="จำนวนผู้รับทุน"
                      type="number"
                      placeholder="100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      คำอธิบาย
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      placeholder="อธิบายรายละเอียดและวัตถุประสงค์ของทุนการศึกษา"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      กำหนดปิดรับสมัคร
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 font-sarabun"
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 font-sarabun"
                    >
                      บันทึกร่าง
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 font-sarabun"
                    >
                      สร้างและเผยแพร่
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
    </div>
  );
};

export default OfficerScholarshipsPage;