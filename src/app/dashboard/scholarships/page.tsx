'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AcademicCapIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

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
  application_start_date: string;
  application_end_date: string;
  interview_required: boolean;
  is_active: boolean;
  source?: {
    source_name: string;
    source_type: string;
  };
}

export default function ScholarshipsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const isAdmin = user ? ['admin', 'scholarship_officer'].includes(user.role) : false;

  useEffect(() => {
    fetchScholarships();
  }, [search, filter]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '20',
        offset: '0',
        ...(search && { search }),
        ...(filter !== 'all' && { type: filter }),
        active_only: 'true'
      });

      const response = await apiClient.get<any>(`/scholarships?${params}`);
      setScholarships(response.scholarships || []);
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (scholarship: Scholarship) => {
    const now = new Date();
    const startDate = new Date(scholarship.application_start_date);
    const endDate = new Date(scholarship.application_end_date);

    if (now < startDate) {
      return <span className="badge badge-gray">เร็วๆ นี้</span>;
    } else if (now > endDate) {
      return <span className="badge badge-error">ปิดรับสมัครแล้ว</span>;
    } else if (scholarship.available_quota <= 0) {
      return <span className="badge badge-warning">เต็มแล้ว</span>;
    } else {
      return <span className="badge badge-success">เปิดรับสมัคร</span>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'need_based':
        return 'text-blue-600 bg-blue-50';
      case 'merit_based':
        return 'text-green-600 bg-green-50';
      case 'activity_based':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-header thai-text">ทุนการศึกษา</h1>
          <p className="page-subtitle thai-text">
            รายการทุนการศึกษาที่เปิดให้สมัคร
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex space-x-3">
            <button 
              onClick={() => router.push('/dashboard/scholarships/create')}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              <span className="thai-text">เพิ่มทุนใหม่</span>
            </button>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาทุนการศึกษา..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 thai-text"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-auto thai-text"
            >
              <option value="all">ทุกประเภท</option>
              <option value="need_based">ทุนขาดแคลน</option>
              <option value="merit_based">ทุนเรียนดี</option>
              <option value="activity_based">ทุนกิจกรรม</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scholarships Grid */}
      {loading ? (
        <div className="grid-responsive">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse-soft">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : scholarships.length === 0 ? (
        <div className="card text-center py-12">
          <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2 thai-text">
            ไม่พบทุนการศึกษา
          </h3>
          <p className="text-gray-500 thai-text">
            ขณะนี้ยังไม่มีทุนการศึกษาที่ตรงกับการค้นหาของคุณ
          </p>
        </div>
      ) : (
        <div className="grid-responsive">
          {scholarships.map((scholarship) => (
            <div
              key={scholarship.scholarship_id}
              className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => router.push(`/dashboard/scholarships/${scholarship.scholarship_id}`)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-800 transition-colors thai-text line-clamp-2">
                    {scholarship.scholarship_name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 thai-text">
                    {scholarship.source?.source_name || 'ไม่ระบุแหล่งทุน'}
                  </p>
                </div>
                {getStatusBadge(scholarship)}
              </div>

              {/* Type Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(scholarship.scholarship_type)}`}>
                  {getTypeName(scholarship.scholarship_type)}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <BanknotesIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span className="thai-text">
                    จำนวนเงิน: {scholarship.amount.toLocaleString()} บาท
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="thai-text">
                    จำนวนทุน: {scholarship.available_quota}/{scholarship.total_quota} ทุน
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDaysIcon className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="thai-text">
                    ปิดรับสมัคร: {new Date(scholarship.application_end_date).toLocaleDateString('th-TH')}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 thai-text">
                    ปีการศึกษา {scholarship.academic_year}
                    {scholarship.semester && ` / ${scholarship.semester}`}
                  </span>
                  
                  {scholarship.interview_required && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full thai-text">
                      ต้องสัมภาษณ์
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="thai-text">ความคืบหน้า</span>
                  <span>{Math.round((scholarship.total_quota - scholarship.available_quota) / scholarship.total_quota * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.round((scholarship.total_quota - scholarship.available_quota) / scholarship.total_quota * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}