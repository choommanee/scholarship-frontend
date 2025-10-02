'use client';

import React, { useState } from 'react';
import { 
  UserGroupIcon,
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  EyeIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface Applicant {
  id: string;
  applicationId: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  faculty: string;
  year: number;
  gpa: number;
  scholarshipName: string;
  scholarshipAmount: number;
  applicationDate: string;
  interviewDate?: string;
  interviewStatus: 'scheduled' | 'completed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  familyIncome: number;
  reason: string;
  documents: string[];
}

export default function InterviewerApplicantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: 'ผศ.ดร. สมปอง วิชาการดี',
    role: 'ผู้สัมภาษณ์',
    email: 'interviewer@university.ac.th',
    department: 'คณะสาธารณสุขศาสตร์'
  };

  // Mock data
  const applicants: Applicant[] = [
    {
      id: 'APP001',
      applicationId: 'APP001',
      studentName: 'นางสาว สมใจ ใจดี',
      studentId: '6388001',
      studentEmail: 'somjai.j@student.mahidol.ac.th',
      faculty: 'คณะวิทยาศาสตร์',
      year: 3,
      gpa: 3.75,
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      scholarshipAmount: 20000,
      applicationDate: '2024-01-15',
      interviewDate: '2024-01-25',
      interviewStatus: 'scheduled',
      priority: 'high',
      familyIncome: 25000,
      reason: 'ครอบครัวมีรายได้น้อย ต้องการทุนการศึกษาเพื่อช่วยเหลือค่าใช้จ่ายในการเรียน',
      documents: ['ใบรายงานผลการเรียน', 'หนังสือรับรองรายได้', 'เอกสารประกอบการสมัคร']
    },
    {
      id: 'APP002',
      applicationId: 'APP002',
      studentName: 'นาย วิชัย เก่งมาก',
      studentId: '6388002',
      studentEmail: 'wichai.k@student.mahidol.ac.th',
      faculty: 'คณะวิศวกรรมศาสตร์',
      year: 4,
      gpa: 3.95,
      scholarshipName: 'ทุนเรียนดี',
      scholarshipAmount: 15000,
      applicationDate: '2024-01-14',
      interviewDate: '2024-01-25',
      interviewStatus: 'completed',
      priority: 'high',
      familyIncome: 30000,
      reason: 'มีผลการเรียนดีเยี่ยม ต้องการทุนเพื่อพัฒนาทักษะเพิ่มเติม',
      documents: ['ใบรายงานผลการเรียน', 'หนังสือรับรองรายได้', 'Portfolio ผลงาน']
    },
    {
      id: 'APP005',
      applicationId: 'APP005',
      studentName: 'นางสาว มานี ขยันเรียน',
      studentId: '6388005',
      studentEmail: 'manee.k@student.mahidol.ac.th',
      faculty: 'คณะพยาบาลศาสตร์',
      year: 3,
      gpa: 3.65,
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      scholarshipAmount: 20000,
      applicationDate: '2024-01-11',
      interviewDate: '2024-01-28',
      interviewStatus: 'scheduled',
      priority: 'medium',
      familyIncome: 28000,
      reason: 'ต้องการทุนเพื่อเป็นค่าใช้จ่ายในการฝึกงาน',
      documents: ['ใบรายงานผลการเรียน', 'หนังสือรับรองรายได้']
    },
    {
      id: 'APP007',
      applicationId: 'APP007',
      studentName: 'นาย ธนากร ดีเยี่ยม',
      studentId: '6388007',
      studentEmail: 'thanakorn.d@student.mahidol.ac.th',
      faculty: 'คณะแพทยศาสตร์',
      year: 2,
      gpa: 3.85,
      scholarshipName: 'ทุนส่งเสริมการศึกษา',
      scholarshipAmount: 25000,
      applicationDate: '2024-01-10',
      interviewStatus: 'pending',
      priority: 'high',
      familyIncome: 20000,
      reason: 'เป็นนักศึกษาแพทย์ที่มีความตั้งใจในการเรียน ครอบครัวมีฐานะยากจน',
      documents: ['ใบรายงานผลการเรียน', 'หนังสือรับรองรายได้', 'จดหมายแนะนำตัว']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'scheduled': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'สัมภาษณ์แล้ว';
      case 'scheduled': return 'นัดสัมภาษณ์';
      default: return 'รอนัดสัมภาษณ์';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.studentId.includes(searchTerm) ||
                         applicant.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = selectedFaculty === 'all' || applicant.faculty === selectedFaculty;
    const matchesStatus = selectedStatus === 'all' || applicant.interviewStatus === selectedStatus;
    
    return matchesSearch && matchesFaculty && matchesStatus;
  });

  const stats = {
    total: applicants.length,
    scheduled: applicants.filter(a => a.interviewStatus === 'scheduled').length,
    completed: applicants.filter(a => a.interviewStatus === 'completed').length,
    pending: applicants.filter(a => a.interviewStatus === 'pending').length
  };

  const faculties = Array.from(new Set(applicants.map(a => a.faculty)));

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      {/* Header - Fixed at top */}
      <Header 
        user={user}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Content Area - Flexbox layout */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar 
          userRole="interviewer"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8">
          <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-8xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              รายการผู้สมัคร
            </h1>
            <p className="text-secondary-600 font-sarabun">
              ข้อมูลผู้สมัครทุนการศึกษาที่ได้รับมอบหมายให้สัมภาษณ์
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-purple-600 font-sarabun">ทั้งหมด</p>
                <p className="text-2xl font-bold text-purple-900 font-sarabun">{stats.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-blue-600 font-sarabun">นัดสัมภาษณ์</p>
                <p className="text-2xl font-bold text-blue-900 font-sarabun">{stats.scheduled}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-green-600 font-sarabun">สัมภาษณ์แล้ว</p>
                <p className="text-2xl font-bold text-green-900 font-sarabun">{stats.completed}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardBody className="p-6">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-yellow-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-yellow-600 font-sarabun">รอนัดสัมภาษณ์</p>
                <p className="text-2xl font-bold text-yellow-900 font-sarabun">{stats.pending}</p>
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
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-sarabun"
                  >
                    <option value="all">คณะทั้งหมด</option>
                    {faculties.map(faculty => (
                      <option key={faculty} value={faculty}>{faculty}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full lg:w-48">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-sarabun"
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="pending">รอนัดสัมภาษณ์</option>
                    <option value="scheduled">นัดสัมภาษณ์</option>
                    <option value="completed">สัมภาษณ์แล้ว</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Applicants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApplicants.map((applicant) => (
          <Card key={applicant.id} className="hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 font-sarabun">
                      {applicant.studentName}
                    </h3>
                    <p className="text-sm text-secondary-600 font-sarabun">
                      {applicant.studentId}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-sarabun ${getStatusColor(applicant.interviewStatus)}`}>
                    {getStatusText(applicant.interviewStatus)}
                  </span>
                  <span className={`text-xs font-medium font-sarabun ${getPriorityColor(applicant.priority)}`}>
                    {applicant.priority === 'high' ? 'สำคัญสูง' : applicant.priority === 'medium' ? 'ปานกลาง' : 'ปกติ'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <AcademicCapIcon className="h-4 w-4 text-secondary-400" />
                  <span className="text-sm text-secondary-600 font-sarabun">
                    {applicant.faculty} • ปี {applicant.year}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-secondary-600 font-sarabun">
                    GPA: {applicant.gpa}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <BanknotesIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-secondary-600 font-sarabun">
                    รายได้ครอบครัว: {applicant.familyIncome.toLocaleString()} บาท/เดือน
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-purple-800 font-sarabun mb-1">
                  {applicant.scholarshipName}
                </h4>
                <p className="text-sm text-purple-600 font-sarabun">
                  จำนวน: {applicant.scholarshipAmount.toLocaleString()} บาท
                </p>
              </div>

              {applicant.interviewDate && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 font-sarabun">
                      วันสัมภาษณ์: {new Date(applicant.interviewDate).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs text-secondary-500 font-sarabun mb-1">เหตุผลในการสมัคร:</p>
                <p className="text-sm text-secondary-700 font-sarabun line-clamp-2">
                  {applicant.reason}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-secondary-500 font-sarabun mb-2">เอกสารประกอบ:</p>
                <div className="flex flex-wrap gap-1">
                  {applicant.documents.map((doc, index) => (
                    <span key={index} className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded font-sarabun">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1 font-sarabun">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  ดูรายละเอียด
                </Button>
                
                {applicant.interviewStatus === 'scheduled' && (
                  <Button size="sm" className="flex-1 font-sarabun">
                    <CalendarDaysIcon className="h-4 w-4 mr-1" />
                    เข้าสัมภาษณ์
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredApplicants.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-sm font-medium text-secondary-900 font-sarabun">ไม่พบผู้สมัคร</h3>
            <p className="mt-1 text-sm text-secondary-500 font-sarabun">
              ไม่มีผู้สมัครที่ตรงกับเงื่อนไขการค้นหา
            </p>
          </CardBody>
        </Card>
      )}
          </div>
        </main>
      </div>
    </div>
  );
}
