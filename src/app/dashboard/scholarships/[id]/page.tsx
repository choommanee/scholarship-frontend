'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/utils/api';

interface Scholarship {
  scholarship_id: number;
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
  source?: {
    source_name: string;
    source_type: string;
    contact_person?: string;
    contact_email?: string;
    contact_phone?: string;
    description?: string;
  };
}

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const scholarshipId = params?.id;
  const isStudent = user?.role === 'student';

  useEffect(() => {
    if (scholarshipId) {
      fetchScholarship();
    }
  }, [scholarshipId]);

  const fetchScholarship = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Scholarship>(`/scholarships/${scholarshipId}`);
      setScholarship(response);
    } catch (error) {
      console.error('Failed to fetch scholarship:', error);
      toast.error('ไม่สามารถโหลดข้อมูลทุนการศึกษาได้');
      router.push('/dashboard/scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!scholarship) return;

    try {
      setApplying(true);
      await apiClient.post('/applications', {
        scholarship_id: scholarship.scholarship_id,
        application_data: JSON.stringify({
          applied_date: new Date().toISOString(),
        }),
      });

      toast.success('สมัครทุนการศึกษาสำเร็จ!');
      router.push('/dashboard/applications/my');
    } catch (error: any) {
      console.error('Failed to apply:', error);
      const errorMessage = error.response?.data?.error || 'เกิดข้อผิดพลาดในการสมัคร';
      toast.error(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const getStatusInfo = () => {
    if (!scholarship) return null;

    const now = new Date();
    const startDate = new Date(scholarship.application_start_date);
    const endDate = new Date(scholarship.application_end_date);

    if (now < startDate) {
      return {
        status: 'upcoming',
        text: 'เร็วๆ นี้',
        color: 'text-gray-600 bg-gray-100',
        icon: ClockIcon,
        message: `เปิดรับสมัครวันที่ ${startDate.toLocaleDateString('th-TH')}`
      };
    } else if (now > endDate) {
      return {
        status: 'closed',
        text: 'ปิดรับสมัครแล้ว',
        color: 'text-red-600 bg-red-100',
        icon: ExclamationTriangleIcon,
        message: `ปิดรับสมัครเมื่อวันที่ ${endDate.toLocaleDateString('th-TH')}`
      };
    } else if (scholarship.available_quota <= 0) {
      return {
        status: 'full',
        text: 'เต็มแล้ว',
        color: 'text-yellow-600 bg-yellow-100',
        icon: ExclamationTriangleIcon,
        message: 'ทุนการศึกษานี้เต็มแล้ว'
      };
    } else {
      return {
        status: 'open',
        text: 'เปิดรับสมัคร',
        color: 'text-green-600 bg-green-100',
        icon: CheckCircleIcon,
        message: `ปิดรับสมัครวันที่ ${endDate.toLocaleDateString('th-TH')}`
      };
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'need_based':
        return 'ทุนขาดแคลน';
      case 'merit_based':
        return 'ทุนเรียนดี';
      case 'activity_based':
        return 'ทุนกิจกรรม';
      default:
        return type;
    }
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="card-elevated animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="card text-center py-12">
        <ExclamationTriangleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2 thai-text">
          ไม่พบทุนการศึกษา
        </h3>
        <p className="text-gray-500 thai-text">
          ทุนการศึกษาที่คุณค้นหาไม่พบหรือถูกลบไปแล้ว
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-red-800 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="thai-text">กลับ</span>
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="card-elevated">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 thai-text">
                  {scholarship.scholarship_name}
                </h1>
                <p className="text-lg text-gray-600 thai-text">
                  {scholarship.source?.source_name || 'ไม่ระบุแหล่งทุน'}
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getTypeName(scholarship.scholarship_type)}
                  </span>
                </div>
              </div>
              
              {statusInfo && (
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    <statusInfo.icon className="h-4 w-4 mr-1" />
                    {statusInfo.text}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 thai-text">
                    {statusInfo.message}
                  </p>
                </div>
              )}
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <BanknotesIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">
                  {scholarship.amount.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 thai-text">บาท</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <UserGroupIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">
                  {scholarship.available_quota}/{scholarship.total_quota}
                </div>
                <div className="text-sm text-blue-600 thai-text">ทุนที่เหลือ</div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <CalendarDaysIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-orange-800 thai-text">
                  {new Date(scholarship.application_end_date).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
                <div className="text-sm text-orange-600 thai-text">ปิดรับสมัคร</div>
              </div>
            </div>
          </div>

          {/* Details Sections */}
          <div className="space-y-6">
            {/* Eligibility Criteria */}
            {scholarship.eligibility_criteria && (
              <div className="card">
                <h3 className="section-header thai-text">คุณสมบัติผู้สมัคร</h3>
                <div className="prose prose-sm max-w-none thai-text">
                  <div dangerouslySetInnerHTML={{ 
                    __html: scholarship.eligibility_criteria.replace(/\n/g, '<br>') 
                  }} />
                </div>
              </div>
            )}

            {/* Required Documents */}
            {scholarship.required_documents && (
              <div className="card">
                <h3 className="section-header thai-text">เอกสารที่ต้องใช้</h3>
                <div className="prose prose-sm max-w-none thai-text">
                  <div dangerouslySetInnerHTML={{ 
                    __html: scholarship.required_documents.replace(/\n/g, '<br>') 
                  }} />
                </div>
              </div>
            )}

            {/* Source Information */}
            {scholarship.source && (
              <div className="card">
                <h3 className="section-header thai-text">ข้อมูลแหล่งทุน</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 thai-text">ชื่อองค์กร:</span>
                    <p className="text-gray-900 thai-text">{scholarship.source.source_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 thai-text">ประเภท:</span>
                    <p className="text-gray-900 thai-text">{scholarship.source.source_type}</p>
                  </div>
                  {scholarship.source.description && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 thai-text">รายละเอียด:</span>
                      <p className="text-gray-900 thai-text">{scholarship.source.description}</p>
                    </div>
                  )}
                  {scholarship.source.contact_person && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 thai-text">ผู้ติดต่อ:</span>
                      <p className="text-gray-900 thai-text">{scholarship.source.contact_person}</p>
                    </div>
                  )}
                  {scholarship.source.contact_email && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 thai-text">อีเมล:</span>
                      <p className="text-gray-900">{scholarship.source.contact_email}</p>
                    </div>
                  )}
                  {scholarship.source.contact_phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 thai-text">โทรศัพท์:</span>
                      <p className="text-gray-900">{scholarship.source.contact_phone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Application */}
        <div className="space-y-6">
          {/* Application Card */}
          <div className="card-elevated sticky top-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 thai-text">
              สมัครทุนการศึกษา
            </h3>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2 thai-text">ข้อมูลทุน</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 thai-text">ปีการศึกษา:</span>
                    <span className="text-gray-900">{scholarship.academic_year}</span>
                  </div>
                  {scholarship.semester && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 thai-text">ภาคการศึกษา:</span>
                      <span className="text-gray-900">{scholarship.semester}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 thai-text">การสัมภาษณ์:</span>
                    <span className={scholarship.interview_required ? "text-yellow-600" : "text-green-600"}>
                      {scholarship.interview_required ? 'ต้องสัมภาษณ์' : 'ไม่ต้องสัมภาษณ์'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="thai-text">ทุนที่จ่ายไปแล้ว</span>
                  <span>{scholarship.total_quota - scholarship.available_quota}/{scholarship.total_quota}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-600 to-red-500 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.round((scholarship.total_quota - scholarship.available_quota) / scholarship.total_quota * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Application Button */}
              {isStudent && statusInfo?.status === 'open' ? (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed thai-text"
                >
                  {applying ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      กำลังสมัคร...
                    </div>
                  ) : (
                    'สมัครทุนการศึกษา'
                  )}
                </button>
              ) : isStudent ? (
                <button
                  disabled
                  className="w-full btn-secondary opacity-50 cursor-not-allowed thai-text"
                >
                  {statusInfo?.text || 'ไม่สามารถสมัครได้'}
                </button>
              ) : (
                <div className="text-center text-gray-500 text-sm thai-text">
                  เฉพาะนักศึกษาเท่านั้นที่สามารถสมัครได้
                </div>
              )}

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h5 className="font-medium text-blue-900 mb-2 thai-text">ข้อควรทราบ</h5>
                <ul className="text-sm text-blue-700 space-y-1 thai-text">
                  <li>• ตรวจสอบคุณสมบัติให้ครบถ้วนก่อนสมัคร</li>
                  <li>• เตรียมเอกสารประกอบการสมัครให้พร้อม</li>
                  <li>• สามารถแก้ไขใบสมัครได้ก่อนส่ง</li>
                  {scholarship.interview_required && (
                    <li>• ทุนนี้จำเป็นต้องผ่านการสัมภาษณ์</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}