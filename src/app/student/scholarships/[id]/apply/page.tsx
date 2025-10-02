'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/utils/api';

import MultiStepForm from '@/components/application/MultiStepForm';

interface Scholarship {
  scholarship_id: number;
  scholarship_name: string;
  scholarship_type: string;
  amount: number;
  application_start_date: string;
  application_end_date: string;
  eligibility_criteria: string;
  required_documents: string;
  interview_required: boolean;
}

export default function ApplyScholarshipPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = parseInt(params?.id as string);
  
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [canApply, setCanApply] = useState(false);
  const [applicationExists, setApplicationExists] = useState(false);

  useEffect(() => {
    if (scholarshipId) {
      loadScholarship();
      checkApplicationStatus();
    }
  }, [scholarshipId]);

  const loadScholarship = async () => {
    try {
      const data = await apiClient.get(`/scholarships/${scholarshipId}`) as any;
      
      if (data.success) {
        setScholarship(data.data);
        
        // Check if application period is active
        const now = new Date();
        const startDate = new Date(data.data.application_start_date);
        const endDate = new Date(data.data.application_end_date);
        
        setCanApply(now >= startDate && now <= endDate);
      } else {
        toast.error('ไม่พบข้อมูลทุนการศึกษา');
      } 
      router.push('/student/scholarships');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      router.push('/student/scholarships');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const data = await apiClient.get(`/applications/my?scholarship_id=${scholarshipId}`) as any;
      
      if (data.success && data.data.length > 0) {
        setApplicationExists(true);
      }
    } catch (error) {
      // No existing application found - this is normal
    }
  };

  const handleApplicationComplete = (applicationId: number) => {
    toast.success('ส่งใบสมัครเรียบร้อย!');
    router.push(`/student/applications/${applicationId}`);
  };

  const handleGoBack = () => {
    router.push(`/student/scholarships/${scholarshipId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">ไม่พบข้อมูลทุนการศึกษา</p>
        </div>
      </div>
    );
  }

  if (applicationExists) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <InformationCircleIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              คุณได้สมัครทุนนี้แล้ว
            </h2>
            <p className="text-gray-600 mb-6">
              คุณได้ส่งใบสมัครทุน "{scholarship.scholarship_name}" ไปแล้ว
              คุณสามารถตรวจสอบสถานะการสมัครได้ในหน้าใบสมัครของฉัน
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleGoBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                กลับไปดูทุน
              </button>
              <button
                onClick={() => router.push('/student/applications')}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                ดูใบสมัครของฉัน
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!canApply) {
    const now = new Date();
    const startDate = new Date(scholarship.application_start_date);
    const endDate = new Date(scholarship.application_end_date);
    
    const isBeforeStart = now < startDate;
    const isAfterEnd = now > endDate;

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <InformationCircleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isBeforeStart ? 'ยังไม่เปิดรับสมัคร' : 'ปิดรับสมัครแล้ว'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isBeforeStart ? (
                <>
                  การสมัครทุน "{scholarship.scholarship_name}" จะเปิดรับสมัครเมื่อ{' '}
                  <strong>{new Date(scholarship.application_start_date).toLocaleDateString('th-TH')}</strong>
                </>
              ) : (
                <>
                  การสมัครทุน "{scholarship.scholarship_name}" ได้ปิดรับสมัครเมื่อ{' '}
                  <strong>{new Date(scholarship.application_end_date).toLocaleDateString('th-TH')}</strong>
                </>
              )}
            </p>
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              กลับไปดูทุน
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            กลับ
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            สมัคร{scholarship.scholarship_name}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">ประเภททุน:</span>
              <span className="ml-2 font-medium">{scholarship.scholarship_type}</span>
            </div>
            <div>
              <span className="text-gray-500">จำนวนเงิน:</span>
              <span className="ml-2 font-medium">
                {scholarship.amount.toLocaleString()} บาท
              </span>
            </div>
            <div>
              <span className="text-gray-500">เปิดรับสมัคร:</span>
              <span className="ml-2 font-medium">
                {new Date(scholarship.application_start_date).toLocaleDateString('th-TH')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">ปิดรับสมัคร:</span>
              <span className="ml-2 font-medium text-red-600">
                {new Date(scholarship.application_end_date).toLocaleDateString('th-TH')}
              </span>
            </div>
          </div>

          {scholarship.interview_required && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-blue-800 text-sm">
                  ทุนนี้ต้องผ่านการสัมภาษณ์
                </span>
              </div>
            </div>
          )}

          {scholarship.eligibility_criteria && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-2">เงื่อนไขการสมัคร:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {scholarship.eligibility_criteria}
              </p>
            </div>
          )}

          {scholarship.required_documents && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-2">เอกสารที่ต้องใช้:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {scholarship.required_documents}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application Form */}
      <MultiStepForm 
        scholarshipId={scholarshipId} 
        onComplete={handleApplicationComplete}
      />

      {/* Help Section */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">💡 คำแนะนำ</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• ระบบจะบันทึกข้อมูลอัตโนมัติทุก 30 วินาที</li>
            <li>• คุณสามารถกลับมาแก้ไขข้อมูลได้ภายหลัง</li>
            <li>• ตรวจสอบข้อมูลให้ถูกต้องก่อนส่งใบสมัคร</li>
            <li>• หากมีปัญหาในการสมัคร กรุณาติดต่อเจ้าหน้าที่</li>
          </ul>
        </div>
      </div>
    </div>
  );
}