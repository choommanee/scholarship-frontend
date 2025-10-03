'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrophyIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface Award {
  award_id: number;
  scholarship_id: number;
  scholarship_name: string;
  scholarship_type: string;
  amount: number;
  academic_year: string;
  semester: string;
  award_date: string;
  payment_status: string;
  payment_date?: string;
  disbursement_method?: string;
  bank_account?: string;
  notes?: string;
  certificate_url?: string;
}

export default function AwardsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [awards, setAwards] = useState<Award[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadAwards();
  }, []);

  const loadAwards = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await awardService.getMyAwards();
      // setAwards(response.awards);

      // Mock data for now
      setAwards([
        {
          award_id: 1,
          scholarship_id: 1,
          scholarship_name: 'ทุนเรียนดี',
          scholarship_type: 'academic_excellence',
          amount: 20000,
          academic_year: '2567',
          semester: '1',
          award_date: '2024-08-15',
          payment_status: 'paid',
          payment_date: '2024-08-20',
          disbursement_method: 'bank_transfer',
          certificate_url: '/certificates/award-1.pdf'
        },
        {
          award_id: 2,
          scholarship_id: 3,
          scholarship_name: 'ทุนช่วยเหลือนักศึกษา',
          scholarship_type: 'financial_aid',
          amount: 15000,
          academic_year: '2566',
          semester: '2',
          award_date: '2024-01-10',
          payment_status: 'paid',
          payment_date: '2024-01-15',
          disbursement_method: 'bank_transfer'
        }
      ]);
    } catch (error) {
      console.error('Failed to load awards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      pending: { label: 'รอการจ่าย', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'กำลังดำเนินการ', className: 'bg-blue-100 text-blue-800' },
      paid: { label: 'จ่ายแล้ว', className: 'bg-green-100 text-green-800' },
      failed: { label: 'ล้มเหลว', className: 'bg-red-100 text-red-800' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getScholarshipTypeLabel = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      academic_excellence: 'ทุนความเป็นเลิศทางวิชาการ',
      financial_aid: 'ทุนช่วยเหลือทางการเงิน',
      research: 'ทุนวิจัย',
      sports: 'ทุนกีฬา',
      community_service: 'ทุนบริการชุมชน',
      special_talent: 'ทุนความสามารถพิเศษ',
    };
    return typeMap[type] || type;
  };

  // Get unique years for filter
  const years = Array.from(new Set(awards.map(a => a.academic_year))).sort().reverse();

  // Filter awards
  const filteredAwards = awards.filter(award => {
    const matchesSearch = award.scholarship_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === 'all' || award.academic_year === filterYear;
    const matchesStatus = filterStatus === 'all' || award.payment_status === filterStatus;
    return matchesSearch && matchesYear && matchesStatus;
  });

  // Calculate total amount
  const totalAmount = filteredAwards.reduce((sum, award) => sum + award.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 relative">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="student" />
          <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gray-50">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="student" />
        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <TrophyIcon className="h-8 w-8 text-primary-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">ทุนการศึกษาที่ได้รับ</h1>
              </div>
              <p className="text-gray-600">รายการทุนการศึกษาที่คุณได้รับอนุมัติ</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">จำนวนทุนที่ได้รับ</p>
                    <p className="text-3xl font-bold text-gray-900">{filteredAwards.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">มูลค่ารวม</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">บาท</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ทุนที่จ่ายแล้ว</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {filteredAwards.filter(a => a.payment_status === 'paid').length}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <TrophyIcon className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อทุน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Year Filter */}
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">ทุกปีการศึกษา</option>
                  {years.map(year => (
                    <option key={year} value={year}>ปีการศึกษา {year}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="pending">รอการจ่าย</option>
                  <option value="processing">กำลังดำเนินการ</option>
                  <option value="paid">จ่ายแล้ว</option>
                  <option value="failed">ล้มเหลว</option>
                </select>
              </div>
            </div>

            {/* Awards List */}
            {filteredAwards.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <TrophyIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลทุนการศึกษา</h3>
                <p className="text-gray-500">
                  {searchTerm || filterYear !== 'all' || filterStatus !== 'all'
                    ? 'ลองเปลี่ยนตัวกรองค้นหา'
                    : 'คุณยังไม่มีทุนการศึกษาที่ได้รับอนุมัติ'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAwards.map((award) => (
                  <div
                    key={award.award_id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {award.scholarship_name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {getScholarshipTypeLabel(award.scholarship_type)}
                          </span>
                          {getPaymentStatusBadge(award.payment_status)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {award.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">บาท</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>ปีการศึกษา {award.academic_year}/{award.semester}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        <span>
                          วันที่ได้รับทุน: {new Date(award.award_date).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                      {award.payment_date && (
                        <div className="flex items-center text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          <span>
                            วันที่จ่าย: {new Date(award.payment_date).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                      )}
                    </div>

                    {award.disbursement_method && (
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">วิธีการจ่าย:</span>{' '}
                        {award.disbursement_method === 'bank_transfer' ? 'โอนเข้าบัญชีธนาคาร' : award.disbursement_method}
                      </div>
                    )}

                    {award.notes && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">หมายเหตุ:</span> {award.notes}
                        </p>
                      </div>
                    )}

                    {award.certificate_url && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <a
                          href={award.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <DocumentTextIcon className="h-5 w-5 mr-2" />
                          ดาวน์โหลดเกียรติบัตร
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
