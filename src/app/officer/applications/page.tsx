'use client';

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ChevronDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  faculty: string;
  year: number;
  gpa: number;
  scholarshipName: string;
  scholarshipAmount: number;
  applicationDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'interview_scheduled';
  priority: 'high' | 'medium' | 'low';
  documentsComplete: boolean;
  interviewDate?: string;
  reviewNotes?: string;
  familyIncome: number;
  reason: string;
}

export default function OfficerApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);

  // Mock data
  const applications: Application[] = [
    {
      id: 'APP001',
      studentId: '6388001',
      studentName: 'นางสาว สมใจ ใจดี',
      studentEmail: 'somjai.j@student.mahidol.ac.th',
      faculty: 'คณะวิทยาศาสตร์',
      year: 3,
      gpa: 3.75,
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      scholarshipAmount: 20000,
      applicationDate: '2024-01-15',
      status: 'pending',
      priority: 'high',
      documentsComplete: true,
      familyIncome: 25000,
      reason: 'ครอบครัวมีรายได้น้อย ต้องการทุนการศึกษาเพื่อช่วยเหลือค่าใช้จ่ายในการเรียน'
    },
    {
      id: 'APP002',
      studentId: '6388002',
      studentName: 'นาย วิชัย เก่งมาก',
      studentEmail: 'wichai.k@student.mahidol.ac.th',
      faculty: 'คณะวิศวกรรมศาสตร์',
      year: 4,
      gpa: 3.95,
      scholarshipName: 'ทุนเรียนดี',
      scholarshipAmount: 15000,
      applicationDate: '2024-01-14',
      status: 'under_review',
      priority: 'high',
      documentsComplete: true,
      interviewDate: '2024-01-25',
      familyIncome: 30000,
      reason: 'มีผลการเรียนดีเยี่ยม ต้องการทุนเพื่อพัฒนาทักษะเพิ่มเติม'
    },
    {
      id: 'APP003',
      studentId: '6388003',
      studentName: 'นางสาว ปัญญา ฉลาดมาก',
      studentEmail: 'panya.c@student.mahidol.ac.th',
      faculty: 'คณะแพทยศาสตร์',
      year: 2,
      gpa: 3.85,
      scholarshipName: 'ทุนส่งเสริมการศึกษา',
      scholarshipAmount: 25000,
      applicationDate: '2024-01-13',
      status: 'approved',
      priority: 'high',
      documentsComplete: true,
      familyIncome: 20000,
      reason: 'เป็นนักศึกษาแพทย์ที่มีความตั้งใจในการเรียน ครอบครัวมีฐานะยากจน'
    },
    {
      id: 'APP004',
      studentId: '6388004',
      studentName: 'นาย สุขใจ ดีมาก',
      studentEmail: 'sukjai.d@student.mahidol.ac.th',
      faculty: 'คณะเศรษฐศาสตร์',
      year: 1,
      gpa: 3.45,
      scholarshipName: 'ทุนช่วยเหลือนักศึกษา',
      scholarshipAmount: 10000,
      applicationDate: '2024-01-12',
      status: 'rejected',
      priority: 'medium',
      documentsComplete: false,
      familyIncome: 45000,
      reason: 'ต้องการทุนเพื่อซื้ออุปกรณ์การเรียน',
      reviewNotes: 'เอกสารไม่ครบถ้วน และรายได้ครอบครัวเกินเกณฑ์'
    },
    {
      id: 'APP005',
      studentId: '6388005',
      studentName: 'นางสาว มานี ขยันเรียน',
      studentEmail: 'manee.k@student.mahidol.ac.th',
      faculty: 'คณะพยาบาลศาสตร์',
      year: 3,
      gpa: 3.65,
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      scholarshipAmount: 20000,
      applicationDate: '2024-01-11',
      status: 'interview_scheduled',
      priority: 'medium',
      documentsComplete: true,
      interviewDate: '2024-01-28',
      familyIncome: 28000,
      reason: 'ต้องการทุนเพื่อเป็นค่าใช้จ่ายในการฝึกงาน'
    },
    {
      id: 'APP006',
      studentId: '6388006',
      studentName: 'นาย ดำรง ซื่อสัตย์',
      studentEmail: 'damrong.s@student.mahidol.ac.th',
      faculty: 'คณะสังคมศาสตร์',
      year: 4,
      gpa: 3.55,
      scholarshipName: 'ทุนเรียนดี',
      scholarshipAmount: 15000,
      applicationDate: '2024-01-10',
      status: 'pending',
      priority: 'low',
      documentsComplete: true,
      familyIncome: 35000,
      reason: 'ต้องการทุนเพื่อทำโครงงานจบการศึกษา'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
      case 'under_review': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'interview_scheduled': return 'text-purple-700 bg-purple-50 border-purple-200';
      default: return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'อนุมัติ';
      case 'rejected': return 'ไม่อนุมัติ';
      case 'under_review': return 'กำลังพิจารณา';
      case 'interview_scheduled': return 'นัดสัมภาษณ์';
      default: return 'รอพิจารณา';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected': return <XCircleIcon className="h-4 w-4" />;
      case 'under_review': return <ArrowPathIcon className="h-4 w-4" />;
      case 'interview_scheduled': return <CalendarDaysIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.studentId.includes(searchTerm) ||
                         app.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || app.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    underReview: applications.filter(app => app.status === 'under_review').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    interviewScheduled: applications.filter(app => app.status === 'interview_scheduled').length
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const handleSelectApplication = (id: string) => {
    setSelectedApplications(prev => 
      prev.includes(id) 
        ? prev.filter(appId => appId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              ตรวจสอบใบสมัคร
            </h1>
            <p className="text-secondary-600 font-sarabun">
              จัดการและพิจารณาใบสมัครทุนการศึกษา
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="font-sarabun"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              ตัวกรอง
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-600 font-sarabun">ทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-900 font-sarabun">{stats.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-600 font-sarabun">รอพิจารณา</p>
                <p className="text-2xl font-bold text-yellow-900 font-sarabun">{stats.pending}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <ArrowPathIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-600 font-sarabun">กำลังพิจารณา</p>
                <p className="text-2xl font-bold text-purple-900 font-sarabun">{stats.underReview}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-indigo-600 font-sarabun">นัดสัมภาษณ์</p>
                <p className="text-2xl font-bold text-indigo-900 font-sarabun">{stats.interviewScheduled}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-600 font-sarabun">อนุมัติ</p>
                <p className="text-2xl font-bold text-green-900 font-sarabun">{stats.approved}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardBody className="p-4">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-red-600 font-sarabun">ไม่อนุมัติ</p>
                <p className="text-2xl font-bold text-red-900 font-sarabun">{stats.rejected}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <Input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อนักศึกษา รหัสนักศึกษา หรือชื่อทุน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-sarabun"
                />
              </div>
            </div>
            
            {showFilters && (
              <>
                <div className="w-full lg:w-48">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="pending">รอพิจารณา</option>
                    <option value="under_review">กำลังพิจารณา</option>
                    <option value="interview_scheduled">นัดสัมภาษณ์</option>
                    <option value="approved">อนุมัติ</option>
                    <option value="rejected">ไม่อนุมัติ</option>
                  </select>
                </div>

                <div className="w-full lg:w-48">
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
                  >
                    <option value="all">ความสำคัญทั้งหมด</option>
                    <option value="high">สูง</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="low">ต่ำ</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-sarabun">
              รายการใบสมัคร ({filteredApplications.length} รายการ)
            </CardTitle>
            {selectedApplications.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-secondary-600 font-sarabun">
                  เลือก {selectedApplications.length} รายการ
                </span>
                <Button size="sm" variant="outline" className="font-sarabun">
                  ดำเนินการ
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === filteredApplications.length}
                      onChange={handleSelectAll}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    นักศึกษา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    ทุนการศึกษา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    ความสำคัญ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    วันที่สมัคร
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                    การดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => handleSelectApplication(application.id)}
                        className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900 font-sarabun">
                            {application.studentName}
                          </div>
                          <div className="text-sm text-secondary-500 font-sarabun">
                            {application.studentId} • {application.faculty}
                          </div>
                          <div className="text-xs text-secondary-400 font-sarabun">
                            ปี {application.year} • GPA {application.gpa}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-secondary-900 font-sarabun">
                        {application.scholarshipName}
                      </div>
                      <div className="text-sm text-secondary-500 font-sarabun flex items-center">
                        <BanknotesIcon className="h-4 w-4 mr-1" />
                        {application.scholarshipAmount.toLocaleString()} บาท
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-sarabun ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{getStatusText(application.status)}</span>
                      </span>
                      {application.interviewDate && (
                        <div className="text-xs text-secondary-500 mt-1 font-sarabun">
                          สัมภาษณ์: {new Date(application.interviewDate).toLocaleDateString('th-TH')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium font-sarabun ${getPriorityColor(application.priority)}`}>
                        {application.priority === 'high' ? 'สูง' : application.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
                      </span>
                      <div className="flex items-center mt-1">
                        {application.documentsComplete ? (
                          <span className="text-xs text-green-600 font-sarabun flex items-center">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            เอกสารครบ
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 font-sarabun flex items-center">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            เอกสารไม่ครบ
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-500 font-sarabun">
                      {new Date(application.applicationDate).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-sarabun"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-secondary-400" />
              <h3 className="mt-2 text-sm font-medium text-secondary-900 font-sarabun">ไม่พบใบสมัคร</h3>
              <p className="mt-1 text-sm text-secondary-500 font-sarabun">
                ไม่มีใบสมัครที่ตรงกับเงื่อนไขการค้นหา
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
