'use client';

import React, { useState } from 'react';
import { 
  ClipboardDocumentCheckIcon,
  StarIcon,
  UserIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface Evaluation {
  id: string;
  applicationId: string;
  studentName: string;
  studentId: string;
  scholarshipName: string;
  interviewDate: string;
  status: 'pending' | 'completed';
  score?: number;
  recommendation?: 'highly_recommended' | 'recommended' | 'not_recommended';
  submittedDate?: string;
  daysOverdue?: number;
}

export default function InterviewerEvaluationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: 'ผศ.ดร. สมปอง วิชาการดี',
    role: 'ผู้สัมภาษณ์',
    email: 'interviewer@university.ac.th',
    department: 'คณะสาธารณสุขศาสตร์'
  };

  // Mock data
  const evaluations: Evaluation[] = [
    {
      id: 'EVAL001',
      applicationId: 'APP001',
      studentName: 'นางสาว สมใจ ใจดี',
      studentId: '6388001',
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      interviewDate: '2024-01-20',
      status: 'pending',
      daysOverdue: 3
    },
    {
      id: 'EVAL002',
      applicationId: 'APP002',
      studentName: 'นาย วิชัย เก่งมาก',
      studentId: '6388002',
      scholarshipName: 'ทุนเรียนดี',
      interviewDate: '2024-01-25',
      status: 'completed',
      score: 8.5,
      recommendation: 'highly_recommended',
      submittedDate: '2024-01-25'
    },
    {
      id: 'EVAL003',
      applicationId: 'APP005',
      studentName: 'นางสาว มานี ขยันเรียน',
      studentId: '6388005',
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      interviewDate: '2024-01-22',
      status: 'pending',
      daysOverdue: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'highly_recommended': return 'text-green-600 bg-green-50';
      case 'recommended': return 'text-blue-600 bg-blue-50';
      case 'not_recommended': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.studentId.includes(searchTerm) ||
                         evaluation.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || evaluation.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: evaluations.length,
    pending: evaluations.filter(e => e.status === 'pending').length,
    completed: evaluations.filter(e => e.status === 'completed').length,
    overdue: evaluations.filter(e => e.daysOverdue && e.daysOverdue > 0).length
  };

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
        <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
          ประเมินผลการสัมภาษณ์
        </h1>
        <p className="text-secondary-600 font-sarabun">
          บันทึกและจัดการผลการประเมินการสัมภาษณ์
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-6">
            <div className="flex items-center">
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-purple-600 font-sarabun">ทั้งหมด</p>
                <p className="text-2xl font-bold text-purple-900 font-sarabun">{stats.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardBody className="p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-yellow-600 font-sarabun">รอประเมิน</p>
                <p className="text-2xl font-bold text-yellow-900 font-sarabun">{stats.pending}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-green-600 font-sarabun">เสร็จสิ้น</p>
                <p className="text-2xl font-bold text-green-900 font-sarabun">{stats.completed}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardBody className="p-6">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-8 w-8 text-red-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-red-600 font-sarabun">เกินกำหนด</p>
                <p className="text-2xl font-bold text-red-900 font-sarabun">{stats.overdue}</p>
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
            
            <div className="w-full lg:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-sarabun"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="pending">รอประเมิน</option>
                <option value="completed">เสร็จสิ้น</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Evaluations List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sarabun">
            รายการประเมินผล ({filteredEvaluations.length} รายการ)
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-secondary-200">
            {filteredEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="p-6 hover:bg-secondary-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-secondary-900 font-sarabun">
                          {evaluation.studentName}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-sarabun ${getStatusColor(evaluation.status)}`}>
                          {evaluation.status === 'completed' ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              เสร็จสิ้น
                            </>
                          ) : (
                            <>
                              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                              รอประเมิน
                            </>
                          )}
                        </span>
                        
                        {evaluation.daysOverdue && evaluation.daysOverdue > 0 && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-sarabun">
                            เกิน {evaluation.daysOverdue} วัน
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-secondary-600 font-sarabun">รหัสนักศึกษา</p>
                          <p className="text-sm font-medium text-secondary-900 font-sarabun">{evaluation.studentId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary-600 font-sarabun">วันที่สัมภาษณ์</p>
                          <p className="text-sm font-medium text-secondary-900 font-sarabun">
                            {new Date(evaluation.interviewDate).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-secondary-600 font-sarabun">ทุนการศึกษา</p>
                        <p className="text-sm font-medium text-purple-600 font-sarabun">{evaluation.scholarshipName}</p>
                      </div>
                      
                      {evaluation.status === 'completed' && (
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium text-secondary-900 font-sarabun">
                              คะแนน: {evaluation.score}/10
                            </span>
                          </div>
                          
                          {evaluation.recommendation && (
                            <span className={`text-xs px-2 py-1 rounded-full font-sarabun ${getRecommendationColor(evaluation.recommendation)}`}>
                              {evaluation.recommendation === 'highly_recommended' ? 'แนะนำอย่างยิ่ง' :
                               evaluation.recommendation === 'recommended' ? 'แนะนำ' : 'ไม่แนะนำ'}
                            </span>
                          )}
                          
                          {evaluation.submittedDate && (
                            <span className="text-xs text-secondary-500 font-sarabun">
                              ส่งเมื่อ: {new Date(evaluation.submittedDate).toLocaleDateString('th-TH')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {evaluation.status === 'pending' ? (
                      <Button className="font-sarabun">
                        <PencilIcon className="h-4 w-4 mr-1" />
                        ประเมินผล
                      </Button>
                    ) : (
                      <Button variant="outline" className="font-sarabun">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        ดูผลประเมิน
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEvaluations.length === 0 && (
            <div className="text-center py-12">
              <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-secondary-400" />
              <h3 className="mt-2 text-sm font-medium text-secondary-900 font-sarabun">ไม่พบรายการประเมิน</h3>
              <p className="mt-1 text-sm text-secondary-500 font-sarabun">
                ไม่มีรายการประเมินที่ตรงกับเงื่อนไขการค้นหา
              </p>
            </div>
          )}
        </CardBody>
      </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
