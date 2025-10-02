'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserIcon,
  AcademicCapIcon,
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  BanknotesIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

interface StudentInfoProps {
  interviewId: string;
  onDataLoad: (data: any) => void;
}

interface StudentData {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  year: number;
  gpa: number;
  scholarshipName: string;
  applicationDate: string;
  familyIncome: number;
  address: string;
  reason: string;
  activities: string[];
  documents: string[];
}

const StudentInfo: React.FC<StudentInfoProps> = ({ interviewId, onDataLoad }) => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - ในการใช้งานจริงจะดึงจาก API
    const mockData: StudentData = {
      id: interviewId,
      studentId: '6388001',
      firstName: 'สมใจ',
      lastName: 'ใจดี',
      email: 'somjai.j@student.mahidol.ac.th',
      phone: '081-234-5678',
      faculty: 'คณะสาธารณสุขศาสตร์',
      department: 'สาธารณสุขศาสตร์',
      year: 3,
      gpa: 3.65,
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      applicationDate: '2024-01-15',
      familyIncome: 180000,
      address: '123 หมู่ 5 ตำบลบางกะปิ อำเภอห้วยกวาง จังหวัดกาฬสินธุ์ 46160',
      reason: 'ครอบครัวมีรายได้น้อย พ่อแม่เป็นเกษตรกร ต้องการทุนการศึกษาเพื่อช่วยเหลือค่าใช้จ่ายในการเรียน',
      activities: [
        'ชมรมนักศึกษาสาธารณสุขศาสตร์',
        'กิจกรรมอาสาพัฒนาชุมชน',
        'โครงการบริการวิชาการแก่สังคม'
      ],
      documents: [
        'ใบสมัคร',
        'ใบแสดงผลการเรียน',
        'หนังสือรับรองรายได้',
        'สำเนาบัตรประชาชน',
        'สำเนาทะเบียนบาน'
      ]
    };

    setTimeout(() => {
      setStudentData(mockData);
      onDataLoad({ studentInfo: mockData });
      setLoading(false);
    }, 1000);
  }, [interviewId, onDataLoad]);

  if (loading) {
    return (
      <Card>
        <CardBody className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
            <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
            <div className="h-4 bg-secondary-200 rounded w-2/3"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!studentData) {
    return (
      <Card>
        <CardBody className="p-6 text-center">
          <p className="text-secondary-500 font-sarabun">ไม่พบข้อมูลนักศึกษา</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
            <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
            ข้อมูลนักศึกษา
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 font-sarabun">
                {studentData.firstName} {studentData.lastName}
              </h3>
              <p className="text-secondary-600 font-sarabun">รหัส: {studentData.studentId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center">
              <EnvelopeIcon className="w-4 h-4 text-secondary-400 mr-2" />
              <span className="font-sarabun">{studentData.email}</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="w-4 h-4 text-secondary-400 mr-2" />
              <span className="font-sarabun">{studentData.phone}</span>
            </div>
            <div className="flex items-center">
              <AcademicCapIcon className="w-4 h-4 text-secondary-400 mr-2" />
              <span className="font-sarabun">{studentData.faculty}</span>
            </div>
            <div className="flex items-center">
              <StarIcon className="w-4 h-4 text-secondary-400 mr-2" />
              <span className="font-sarabun">ชั้นปีที่ {studentData.year} | เกรด {studentData.gpa}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Scholarship Info */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
            <BanknotesIcon className="h-5 w-5 text-green-500 mr-2" />
            ข้อมูลทุนการศึกษา
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6 space-y-3">
          <div>
            <p className="text-sm text-secondary-500 font-sarabun">ทุนที่สมัคร</p>
            <p className="font-semibold text-secondary-900 font-sarabun">{studentData.scholarshipName}</p>
          </div>
          <div>
            <p className="text-sm text-secondary-500 font-sarabun">วันที่สมัคร</p>
            <p className="font-sarabun">{new Date(studentData.applicationDate).toLocaleDateString('th-TH')}</p>
          </div>
          <div>
            <p className="text-sm text-secondary-500 font-sarabun">รายได้ครอบครัว</p>
            <p className="font-sarabun">{studentData.familyIncome.toLocaleString()} บาท/ปี</p>
          </div>
        </CardBody>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
            <HomeIcon className="h-5 w-5 text-orange-500 mr-2" />
            ที่อยู่
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <p className="text-sm text-secondary-700 font-sarabun leading-relaxed">
            {studentData.address}
          </p>
        </CardBody>
      </Card>

      {/* Reason */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 text-purple-500 mr-2" />
            เหตุผลการขอทุน
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <p className="text-sm text-secondary-700 font-sarabun leading-relaxed">
            {studentData.reason}
          </p>
        </CardBody>
      </Card>

      {/* Activities */}
      <Card>
        <CardHeader className="border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900">
            กิจกรรมที่เข้าร่วม
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <ul className="space-y-2">
            {studentData.activities.map((activity, index) => (
              <li key={index} className="flex items-center text-sm font-sarabun">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                {activity}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className="border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900">
            เอกสารประกอบ
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <ul className="space-y-2">
            {studentData.documents.map((doc, index) => (
              <li key={index} className="flex items-center text-sm font-sarabun">
                <DocumentTextIcon className="w-4 h-4 text-green-500 mr-2" />
                {doc}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentInfo;
