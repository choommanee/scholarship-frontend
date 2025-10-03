'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  AcademicCapIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  UsersIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';

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

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toasts, removeToast, success, error, warning } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data - ในระบบจริงจะดึงข้อมูลจาก API ตาม ID
  const scholarship: Scholarship = {
    id: parseInt(params.id as string),
    name: 'ทุนพัฒนาศักยภาพนักศึกษา',
    description: 'ทุนการศึกษาสำหรับนักศึกษาที่มีผลการเรียนดีและต้องการพัฒนาทักษะในด้านต่างๆ มุ่งเน้นการพัฒนาความเป็นผู้นำและการทำงานเป็นทีม พร้อมทั้งเสริมสร้างทักษะที่จำเป็นในศตวรรษที่ 21',
    type: 'development',
    amount: 20000,
    maxRecipients: 100,
    currentApplicants: 45,
    approvedApplicants: 25,
    status: 'open',
    createdDate: '2024-10-01',
    applicationDeadline: '2024-12-31',
    academicYear: '2567',
    requirements: [
      'เกรดเฉลีย์ ≥ 3.00',
      'ไม่เคยได้ทุนประเภทนี้มาก่อน',
      'มีผลงานหรือกิจกรรมเสริมหลักสูตร',
      'ไม่มีวิชาที่ได้เกรด F',
      'เป็นนักศึกษาชั้นปีที่ 2-4'
    ],
    documentsRequired: [
      'ใบแสดงผลการเรียน (Transcript)',
      'หนังสือรับรองรายได้ครอบครัว',
      'สำเนาบัตรประชาชน',
      'รูปถ่าย 1 นิ้ว',
      'หนังสือรับรองการเป็นนักศึกษา'
    ],
    provider: 'คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
    budget: {
      total: 2000000,
      allocated: 500000,
      remaining: 1500000
    },
    lastModified: '2024-12-01',
    createdBy: 'วิไลวรรณ จัดการดี',
    isActive: true
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'open': return 'bg-green-100 text-green-800 border-green-300';
      case 'closed': return 'bg-red-100 text-red-800 border-red-300';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
      case 'draft': return <PencilIcon className="h-5 w-5" />;
      case 'open': return <CheckCircleIcon className="h-5 w-5" />;
      case 'closed': return <XCircleIcon className="h-5 w-5" />;
      case 'suspended': return <ExclamationTriangleIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getTypeText = (type: string) => {
    const types: { [key: string]: string } = {
      academic: 'ทุนเรียนดี',
      financial_aid: 'ทุนช่วยเหลือ',
      research: 'ทุนวิจัย',
      development: 'ทุนพัฒนาศักยภาพ',
      activity: 'ทุนกิจกรรม',
      excellence: 'ทุนความเป็นเลิศ'
    };
    return types[type] || type;
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const utilizationPercentage = Math.round((scholarship.budget.allocated / scholarship.budget.total) * 100);
  const applicantPercentage = Math.round((scholarship.currentApplicants / scholarship.maxRecipients) * 100);
  const daysLeft = getDaysLeft(scholarship.applicationDeadline);

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      success('ลบสำเร็จ', `ลบทุน ${scholarship.name} เรียบร้อยแล้ว`);
      setTimeout(() => {
        router.push('/officer/scholarships');
      }, 1000);
    } catch (err) {
      error('เกิดข้อผิดพลาด', 'ไม่สามารถลบทุนได้');
    } finally {
      setIsProcessing(false);
      setShowDeleteModal(false);
    }
  };

  const handleDuplicate = () => {
    success('คัดลอกสำเร็จ', `คัดลอกทุน ${scholarship.name} เรียบร้อยแล้ว`);
  };

  const handleChangeStatus = (newStatus: string) => {
    const statusText = getStatusText(newStatus);
    success('เปลี่ยนสถานะสำเร็จ', `เปลี่ยนสถานะเป็น "${statusText}" แล้ว`);
  };

  return (
    <div>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 font-sarabun">
              {scholarship.name}
            </h1>
            <p className="text-gray-600 font-sarabun mt-1">
              ID: {scholarship.id} • สร้างโดย {scholarship.createdBy}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/officer/scholarships/${scholarship.id}/edit`)}
              className="font-sarabun"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              แก้ไข
            </Button>
            <Button
              variant="outline"
              onClick={handleDuplicate}
              className="font-sarabun"
            >
              <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
              คัดลอก
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:text-red-700 font-sarabun"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              ลบ
            </Button>
          </div>
        </div>

        {/* Status and Quick Stats */}
        <div className="flex items-center space-x-4">
          <span className={`inline-flex items-center px-4 py-2 rounded-lg border-2 font-medium font-sarabun ${getStatusColor(scholarship.status)}`}>
            {getStatusIcon(scholarship.status)}
            <span className="ml-2">{getStatusText(scholarship.status)}</span>
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium font-sarabun">
            {getTypeText(scholarship.type)}
          </span>
          {!scholarship.isActive && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium font-sarabun">
              ไม่เปิดใช้งาน
            </span>
          )}
          {daysLeft <= 7 && scholarship.status === 'open' && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium font-sarabun">
              ⏰ เหลือ {daysLeft} วัน
            </span>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 font-sarabun mb-1">จำนวนเงิน</p>
                <p className="text-3xl font-bold text-green-700">
                  {scholarship.amount.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 font-sarabun">บาท/คน</p>
              </div>
              <div className="p-3 bg-green-200 rounded-xl">
                <BanknotesIcon className="h-8 w-8 text-green-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 font-sarabun mb-1">ผู้สมัคร</p>
                <p className="text-3xl font-bold text-blue-700">
                  {scholarship.currentApplicants}/{scholarship.maxRecipients}
                </p>
                <div className="w-32 bg-blue-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${applicantPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <UsersIcon className="h-8 w-8 text-blue-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 font-sarabun mb-1">อนุมัติแล้ว</p>
                <p className="text-3xl font-bold text-purple-700">
                  {scholarship.approvedApplicants}
                </p>
                <p className="text-sm text-purple-600 font-sarabun">คน</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-xl">
                <CheckCircleIcon className="h-8 w-8 text-purple-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 font-sarabun mb-1">กำหนดปิดรับ</p>
                <p className="text-lg font-bold text-orange-700">
                  {new Date(scholarship.applicationDeadline).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-orange-600 font-sarabun">เหลือ {daysLeft} วัน</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-xl">
                <CalendarDaysIcon className="h-8 w-8 text-orange-700" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                รายละเอียดทุน
              </CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <p className="text-gray-700 font-sarabun leading-relaxed">
                {scholarship.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 font-sarabun">
                  <strong>ผู้สนับสนุน:</strong> {scholarship.provider}
                </p>
                <p className="text-sm text-gray-600 font-sarabun mt-2">
                  <strong>ปีการศึกษา:</strong> {scholarship.academicYear}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-green-600" />
                คุณสมบัติผู้สมัคร
              </CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <ul className="space-y-3">
                {scholarship.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-sarabun">{req}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Required Documents */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-600" />
                เอกสารประกอบการสมัคร
              </CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <ul className="space-y-3">
                {scholarship.documentsRequired.map((doc, index) => (
                  <li key={index} className="flex items-start">
                    <DocumentTextIcon className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-sarabun">{doc}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Budget */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun">งบประมาณ</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-sarabun">งบประมาณรวม</span>
                    <span className="text-lg font-bold text-gray-900 font-sarabun">
                      {scholarship.budget.total.toLocaleString()} บาท
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-sarabun">ใช้ไปแล้ว</span>
                    <span className="text-lg font-bold text-orange-600 font-sarabun">
                      {scholarship.budget.allocated.toLocaleString()} บาท
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600 font-sarabun">คงเหลือ</span>
                    <span className="text-lg font-bold text-green-600 font-sarabun">
                      {scholarship.budget.remaining.toLocaleString()} บาท
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                      style={{ width: `${utilizationPercentage}%` }}
                    >
                      <span className="text-xs text-white font-bold">{utilizationPercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun">การจัดการ</CardTitle>
            </CardHeader>
            <CardBody className="p-6 space-y-3">
              {scholarship.status === 'draft' && (
                <Button
                  variant="primary"
                  className="w-full font-sarabun"
                  onClick={() => handleChangeStatus('open')}
                >
                  เผยแพร่ทุนนี้
                </Button>
              )}
              {scholarship.status === 'open' && (
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 font-sarabun"
                  onClick={() => handleChangeStatus('closed')}
                >
                  ปิดรับสมัคร
                </Button>
              )}
              {scholarship.status === 'closed' && (
                <Button
                  variant="primary"
                  className="w-full font-sarabun"
                  onClick={() => handleChangeStatus('open')}
                >
                  เปิดรับสมัครอีกครั้ง
                </Button>
              )}
              <Button variant="outline" className="w-full font-sarabun">
                ดูใบสมัครทั้งหมด ({scholarship.currentApplicants})
              </Button>
              <Button variant="outline" className="w-full font-sarabun">
                ส่งออกข้อมูล
              </Button>
            </CardBody>
          </Card>

          {/* Meta Information */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun">ข้อมูลเพิ่มเติม</CardTitle>
            </CardHeader>
            <CardBody className="p-6 space-y-3 text-sm">
              <div>
                <p className="text-gray-500 font-sarabun">สร้างเมื่อ</p>
                <p className="text-gray-900 font-sarabun">
                  {new Date(scholarship.createdDate).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-sarabun">แก้ไขล่าสุด</p>
                <p className="text-gray-900 font-sarabun">
                  {new Date(scholarship.lastModified).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-sarabun">สร้างโดย</p>
                <p className="text-gray-900 font-sarabun">{scholarship.createdBy}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                ยืนยันการลบ
              </CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <p className="text-gray-700 font-sarabun mb-4">
                คุณแน่ใจหรือไม่ที่จะลบทุน <strong>{scholarship.name}</strong>?
              </p>
              <p className="text-sm text-red-600 font-sarabun mb-6">
                การดำเนินการนี้ไม่สามารถย้อนกลับได้ และจะมีผลกับใบสมัคร {scholarship.currentApplicants} รายการ
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 font-sarabun"
                  disabled={isProcessing}
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 font-sarabun"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'กำลังลบ...' : 'ลบทุน'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
