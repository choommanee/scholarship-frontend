'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BuildingLibraryIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { scholarshipService, Scholarship as ScholarshipType } from '@/services/scholarship.service';
import { apiClient } from '@/utils/api';

interface ScholarshipDetail {
  // Backend fields
  scholarship_id: number;
  source_id: number;
  scholarship_name: string;
  scholarship_type: string;
  amount: number;
  total_quota: number;
  available_quota: number;
  academic_year: string;
  semester?: string;
  eligibility_criteria?: string;
  required_documents?: string;
  application_start_date: string;
  application_end_date: string;
  interview_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  source?: {
    source_id: number;
    source_name: string;
    source_type: string;
    contact_info?: string;
    website?: string;
  };
  
  // Frontend display fields (mapped from backend)
  title?: string; // Mapped from scholarship_name
  type?: string; // Mapped from scholarship_type
  status?: 'open' | 'closed'; // Derived from dates and is_active
  requirements?: string[];
  documents?: string[];
}

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState<ScholarshipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const scholarshipId = params?.id ? Number(params.id) : null;

  useEffect(() => {
    if (scholarshipId) {
      fetchScholarship();
    }
  }, [scholarshipId]);

  const fetchScholarship = async () => {
    try {
      setLoading(true);
      
      // Try to get scholarship from API
      try {
        const response = await apiClient.get<ScholarshipDetail>(`/scholarships/${scholarshipId}`);
        
        if (response) {
          // Map backend fields to frontend display fields
          const mappedScholarship = {
            ...response,
            title: response.scholarship_name,
            type: response.scholarship_type,
            status: (new Date(response.application_end_date) > new Date() && response.is_active ? 'open' : 'closed') as 'open' | 'closed',
            requirements: response.eligibility_criteria?.split('\n'),
            documents: response.required_documents?.split('\n'),
          };
          setScholarship(mappedScholarship);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }
      
      // Use mock data based on scholarshipId
      const mockScholarships: Record<number, ScholarshipDetail> = {
        1: {
          scholarship_id: 1,
          source_id: 1,
          scholarship_name: 'ทุนพัฒนาศักยภาพนักศึกษา',
          scholarship_type: 'ทุนความเป็นเลิศทางการศึกษา',
          amount: 20000,
          total_quota: 50,
          available_quota: 35,
          academic_year: '2566',
          semester: '1',
          eligibility_criteria: `• เป็นนักศึกษาระดับปริญญาตรี ชั้นปีที่ 2-4
• มีผลการเรียนเฉลี่ยสะสมไม่ต่ำกว่า 3.25
• ไม่เคยได้รับทุนการศึกษาประเภทอื่นในปีการศึกษาเดียวกัน
• มีความประพฤติดี ไม่เคยถูกลงโทษทางวินัย
• มีกิจกรรมเพื่อสังคมหรือกิจกรรมพัฒนาตนเอง`,
          required_documents: `• สำเนาบัตรประจำตัวประชาชน
• สำเนาทะเบียนบ้าน
• ใบรายงานผลการเรียน (Transcript) ล่าสุด
• หนังสือรับรองรายได้ครอบครัว
• จดหมายแนะนำตัวจากอาจารย์ที่ปรึกษา
• ผลงานหรือกิจกรรมที่แสดงศักยภาพ (ถ้ามี)`,
          application_start_date: '2024-01-01',
          application_end_date: '2024-12-31',
          interview_required: true,
          is_active: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          source: {
            source_id: 1,
            source_name: 'มูลนิธิการศึกษามหิดล',
            source_type: 'มูลนิธิ',
            contact_info: 'scholarship@mahidol.ac.th'
          },
          title: 'ทุนพัฒนาศักยภาพนักศึกษา',
          type: 'ทุนความเป็นเลิศทางการศึกษา',
          status: 'open' as 'open'
        },
        2: {
          scholarship_id: 2,
          source_id: 2,
          scholarship_name: 'ทุนสนับสนุนนักศึกษายากไร้',
          scholarship_type: 'ทุนสงเคราะห์',
          amount: 15000,
          total_quota: 100,
          available_quota: 75,
          academic_year: '2566',
          semester: '1',
          eligibility_criteria: `• เป็นนักศึกษาที่มีฐานะครอบครัวยากจน
• รายได้ครอบครัวต่อเดือนไม่เกิน 15,000 บาท
• มีผลการเรียนเฉลี่ยสะสมไม่ต่ำกว่า 2.50
• ไม่เคยถูกลงโทษทางวินัยในระดับรุนแรง
• ต้องมีหนังสือรับรองความยากจนจากผู้ใหญ่บ้าน`,
          required_documents: `• สำเนาบัตรประจำตัวประชาชน
• สำเนาทะเบียนบ้าน
• ใบรายงานผลการเรียน (Transcript) ล่าสุด
• หนังสือรับรองรายได้ครอบครัว
• หนังสือรับรองความยากจนจากผู้ใหญ่บ้าน
• รูปถ่ายครอบครัวและที่อยู่อาศัย`,
          application_start_date: '2024-01-01',
          application_end_date: '2025-01-15',
          interview_required: false,
          is_active: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          source: {
            source_id: 2,
            source_name: 'กองทุนสงเคราะห์นักศึกษา',
            source_type: 'กองทุนมหาวิทยาลัย',
            contact_info: 'welfare@mahidol.ac.th'
          },
          title: 'ทุนสนับสนุนนักศึกษายากไร้',
          type: 'ทุนสงเคราะห์',
          status: 'open' as 'open'
        },
        3: {
          scholarship_id: 3,
          source_id: 3,
          scholarship_name: 'ทุนเพื่อการวิจัยและพัฒนา',
          scholarship_type: 'ทุนวิจัย',
          amount: 25000,
          total_quota: 30,
          available_quota: 20,
          academic_year: '2566',
          semester: '2',
          eligibility_criteria: `• เป็นนักศึกษาระดับปริญญาตรี ชั้นปีที่ 3-4
• มีผลการเรียนเฉลี่ยสะสมไม่ต่ำกว่า 3.50
• มีโครงการวิจัยที่ชัดเจนและมีประโยชน์
• ได้รับความเห็นชอบจากอาจารย์ที่ปรึกษาโครงการ
• มีประสบการณ์หรือความสนใจด้านการวิจัย`,
          required_documents: `• สำเนาบัตรประจำตัวประชาชน
• ใบรายงานผลการเรียน (Transcript) ล่าสุด
• โครงร่างโครงการวิจัย (ไม่เกิน 5 หน้า)
• จดหมายรับรองจากอาจารย์ที่ปรึกษาโครงการ
• Portfolio ผลงานหรือกิจกรรมที่เกี่ยวข้อง
• Timeline การดำเนินโครงการ`,
          application_start_date: '2024-01-15',
          application_end_date: '2025-02-28',
          interview_required: true,
          is_active: true,
          created_at: '2024-01-15',
          updated_at: '2024-01-15',
          source: {
            source_id: 3,
            source_name: 'สำนักงานพัฒนาวิจัย',
            source_type: 'หน่วยงานมหาวิทยาลัย',
            contact_info: 'research@mahidol.ac.th'
          },
          title: 'ทุนเพื่อการวิจัยและพัฒนา',
          type: 'ทุนวิจัย',
          status: 'open' as 'open'
        },
        4: {
          scholarship_id: 4,
          source_id: 4,
          scholarship_name: 'ทุนกิจกรรมนักศึกษา',
          scholarship_type: 'ทุนกิจกรรม',
          amount: 10000,
          total_quota: 80,
          available_quota: 60,
          academic_year: '2566',
          semester: '2',
          eligibility_criteria: `• เป็นนักศึกษาที่มีส่วนร่วมในกิจกรรมนักศึกษา
• มีผลการเรียนเฉลี่ยสะสมไม่ต่ำกว่า 2.75
• เป็นหรือเคยเป็นผู้นำองค์กรนักศึกษา
• มีโครงการหรือกิจกรรมเพื่อพัฒนาสังคม
• ได้รับการรับรองจากที่ปรึกษาองค์กรนักศึกษา`,
          required_documents: `• สำเนาบัตรประจำตัวประชาชน
• ใบรายงานผลการเรียน (Transcript) ล่าสุด
• หลักฐานการเป็นสมาชิกหรือผู้นำองค์กรนักศึกษา
• โครงร่างกิจกรรมที่จะดำเนินการ
• จดหมายรับรองจากที่ปรึกษาองค์กรนักศึกษา
• Portfolio กิจกรรมที่เคยจัดหรือเข้าร่วม`,
          application_start_date: '2024-02-01',
          application_end_date: '2025-03-31',
          interview_required: false,
          is_active: true,
          created_at: '2024-02-01',
          updated_at: '2024-02-01',
          source: {
            source_id: 4,
            source_name: 'กองกิจการนักศึกษา',
            source_type: 'หน่วยงานมหาวิทยาลัย',
            contact_info: 'student.affairs@mahidol.ac.th'
          },
          title: 'ทุนกิจกรรมนักศึกษา',
          type: 'ทุนกิจกรรม',
          status: 'open' as 'open'
        }
      };

      const mockScholarship = mockScholarships[scholarshipId!];
      if (mockScholarship) {
        setScholarship(mockScholarship);
      } else {
        toast.error('ไม่พบข้อมูลทุนการศึกษา');
        router.push('/');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!scholarship) return;

    try {
      setApplying(true);
      // Mock application submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('สมัครทุนการศึกษาสำเร็จ!');
      router.push('/');
    } catch (error: any) {
      console.error('Failed to apply:', error);
      toast.error('เกิดข้อผิดพลาดในการสมัคร');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header with better visual hierarchy */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-8 shadow-2xl relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 bg-gradient-to-br from-white/30 to-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-xl">
                <AcademicCapIcon className="h-10 w-10 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-sarabun tracking-tight">
                  ระบบจัดการทุนการศึกษา
                </h1>
                <p className="text-primary-100 font-inter text-base mt-1">
                  Scholarship Management System
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <BuildingLibraryIcon className="h-12 w-12 text-yellow-300 drop-shadow-lg" />
              <div className="text-right">
                <p className="text-lg text-primary-50 font-sarabun font-semibold">คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์</p>
                <p className="text-sm text-primary-200 font-inter">Economics at Thammasat university</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Enhanced Back button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-primary-200 text-primary-700 hover:text-primary-800 hover:bg-white hover:shadow-md transition-all duration-200 font-sarabun group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            กลับไปหน้าหลัก
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-200 border-t-primary-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <AcademicCapIcon className="h-8 w-8 text-primary-600 animate-pulse" />
              </div>
            </div>
          </div>
        ) : scholarship ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main scholarship information */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md overflow-hidden rounded-2xl">
                <div className="h-2 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-800"></div>
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50 px-8 py-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 shadow-sm">
                      {scholarship.type}
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 shadow-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                      {scholarship.status === 'open' ? 'เปิดรับสมัคร' : scholarship.status}
                    </span>
                  </div>
                  <CardTitle className="text-3xl font-sarabun text-gray-900 leading-tight">
                    {scholarship.title}
                  </CardTitle>
                  <p className="text-gray-600 font-sarabun mt-2">รายละเอียดทุนการศึกษาและข้อมูลการสมัคร</p>
                </CardHeader>
                
                <CardBody className="space-y-8 px-8 py-8">
                  {/* Enhanced Scholarship image with overlay */}
                  <div className="relative h-72 w-full rounded-2xl overflow-hidden shadow-lg group">
                    <Image 
                      src="/images/scholarship1.jpg" 
                      alt={scholarship.title || 'ทุนการศึกษา'} 
                      fill 
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                          <BanknotesIcon className="h-5 w-5" />
                        </div>
                        <span className="font-semibold font-sarabun">{scholarship.amount?.toLocaleString('th-TH') || '0'} บาท</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Key information cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-blue-500 shadow-lg">
                          <BanknotesIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 font-sarabun font-medium">จำนวนเงิน</p>
                          <p className="text-xl font-bold text-blue-900 font-sarabun">{scholarship.amount?.toLocaleString('th-TH') || '0'} บาท</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-purple-500 shadow-lg">
                          <CalendarDaysIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-600 font-sarabun font-medium">วันปิดรับสมัคร</p>
                          <p className="text-lg font-bold text-purple-900 font-sarabun">
                            {new Date(scholarship.application_end_date).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-green-500 shadow-lg">
                          <UserGroupIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-green-600 font-sarabun font-medium">จำนวนผู้รับทุน</p>
                          <p className="text-xl font-bold text-green-900 font-sarabun">{scholarship.total_quota} คน</p>
                          <div className="mt-1 bg-green-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${((scholarship.total_quota - scholarship.available_quota) / scholarship.total_quota) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-green-600 mt-1">เหลือ {scholarship.available_quota} ที่นั่ง</p>
                        </div>
                      </div>
                    </div>
                    
                    {scholarship.source && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-xl bg-orange-500 shadow-lg">
                            <BuildingLibraryIcon className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-orange-600 font-sarabun font-medium">แหล่งทุน</p>
                            <p className="text-lg font-bold text-orange-900 font-sarabun">{scholarship.source.source_name}</p>
                            <p className="text-sm text-orange-600 font-sarabun">{scholarship.source.source_type}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Description */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-lg bg-gray-600">
                        <DocumentTextIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 font-sarabun">รายละเอียดทุนการศึกษา</h3>
                    </div>
                    <div className="prose prose-gray max-w-none font-sarabun">
                      <p className="text-gray-700 leading-relaxed">
                        ทุนการศึกษานี้มีวัตถุประสงค์เพื่อส่งเสริมและสนับสนุนนักศึกษาที่มีศักยภาพและมีความต้องการทางการเงิน 
                        เพื่อให้สามารถศึกษาต่อได้อย่างมีคุณภาพและประสบความสำเร็จในการเรียน
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Requirements */}
                  {scholarship.eligibility_criteria && (
                    <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-sm">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 rounded-lg bg-green-500">
                          <CheckCircleIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 font-sarabun">คุณสมบัติผู้สมัคร</h3>
                      </div>
                      <div className="grid gap-3">
                        {scholarship.eligibility_criteria?.split('\n').map((req, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors">
                            <div className="flex-shrink-0 mt-0.5">
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-gray-800 font-sarabun leading-relaxed">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Required documents */}
                  {scholarship.required_documents && (
                    <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500">
                          <DocumentTextIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 font-sarabun">เอกสารที่ต้องใช้ในการสมัคร</h3>
                      </div>
                      <div className="grid gap-3">
                        {scholarship.required_documents.split('\n').map((doc, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                            </div>
                            <span className="text-gray-800 font-sarabun leading-relaxed">{doc}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-start space-x-2">
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-yellow-800 font-sarabun">
                            <span className="font-semibold">หมายเหตุ:</span> กรุณาเตรียมเอกสารให้ครบถ้วนและตรวจสอบความถูกต้องก่อนส่งใบสมัคร
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Application button */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-2xl border border-primary-200">
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-bold text-gray-900 font-sarabun mb-2">พร้อมสมัครทุนการศึกษาแล้วใช่หรือไม่?</h4>
                        <p className="text-sm text-gray-600 font-sarabun">กรุณาตรวจสอบคุณสมบัติและเอกสารให้ครบถ้วนก่อนสมัคร</p>
                      </div>
                      <Button
                        variant="mahidol"
                        size="lg"
                        className="w-full font-sarabun text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                        onClick={handleApply}
                        loading={applying}
                      >
                        {applying ? 'กำลังส่งใบสมัคร...' : 'สมัครทุนการศึกษา'}
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Application status card */}
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-green-50/50 px-6 py-5">
                  <CardTitle className="text-xl font-bold font-sarabun text-gray-900 flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                    สถานะการรับสมัคร
                  </CardTitle>
                </CardHeader>
                <CardBody className="px-6 py-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-emerald-100">
                        <ClockIcon className="h-7 w-7 text-emerald-700" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-700 font-sarabun text-lg">เปิดรับสมัคร</p>
                        <p className="text-sm text-gray-600 font-sarabun">
                          ปิดรับสมัคร: {new Date(scholarship.application_end_date).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Time remaining indicator */}
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-emerald-700 font-sarabun">เวลาที่เหลือ</span>
                        <span className="text-xs text-emerald-600 font-sarabun">จนถึงวันปิดรับสมัคร</span>
                      </div>
                      <div className="bg-emerald-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-3/4 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xs text-emerald-600 mt-2 font-sarabun">ยังเหลือเวลาในการสมัคร</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Enhanced Contact information */}
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-600"></div>
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50 px-6 py-5">
                  <CardTitle className="text-xl font-bold font-sarabun text-gray-900 flex items-center">
                    <div className="p-2 rounded-lg bg-blue-100 mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    ติดต่อสอบถาม
                  </CardTitle>
                </CardHeader>
                <CardBody className="px-6 py-6">
                  <div className="space-y-4 font-sarabun">
                    <div className="flex items-center space-x-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="p-2 rounded-lg bg-blue-500">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 font-medium">โทรศัพท์</p>
                        <p className="font-semibold text-blue-900">02-441-9000 ต่อ 1234</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="p-2 rounded-lg bg-purple-500">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-purple-600 font-medium">อีเมล</p>
                        <p className="font-semibold text-purple-900">{scholarship.source?.contact_info || 'scholarship@mahidol.ac.th'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 rounded-xl bg-green-50 border border-green-100">
                      <div className="p-2 rounded-lg bg-green-500">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-green-600 font-medium">เวลาทำการ</p>
                        <p className="font-semibold text-green-900">จันทร์-ศุกร์ 8:30-16:30 น.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-600 font-sarabun text-center">
                      💡 <span className="font-semibold">เคล็ดลับ:</span> ควรติดต่อสอบถามล่วงหน้าก่อนส่งใบสมัครเพื่อความแน่ใจ
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        ) : (
          <div className="bg-danger-50 border border-danger-200 text-danger-600 px-6 py-4 rounded-lg">
            <p className="font-sarabun">ไม่พบข้อมูลทุนการศึกษา</p>
          </div>
        )}
      </div>

      {/* Footer - same as login page */}
      <footer className="bg-secondary-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-sarabun opacity-80">
            © 2024 คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ | ระบบจัดการทุนการศึกษา
          </p>
          <p className="text-xs text-secondary-400 mt-1 font-inter">
            Economics at Thammasat university | Scholarship Management System
          </p>
        </div>
      </footer>
    </div>
  );
}
