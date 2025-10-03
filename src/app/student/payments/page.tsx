'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface Payment {
  payment_id: number;
  scholarship_id: number;
  scholarship_name: string;
  award_id: number;
  amount: number;
  academic_year: string;
  semester: string;
  payment_type: 'full' | 'installment';
  installment_number?: number;
  total_installments?: number;
  payment_status: 'pending' | 'processing' | 'approved' | 'paid' | 'failed' | 'cancelled';
  payment_method: 'bank_transfer' | 'cash' | 'check';
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  scheduled_date?: string;
  approved_date?: string;
  paid_date?: string;
  transaction_reference?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
}

export default function PaymentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await paymentService.getMyPayments();
      // setPayments(response.payments);

      // Mock data
      setPayments([
        {
          payment_id: 1,
          scholarship_id: 1,
          scholarship_name: 'ทุนเรียนดี',
          award_id: 1,
          amount: 20000,
          academic_year: '2567',
          semester: '1',
          payment_type: 'full',
          payment_status: 'paid',
          payment_method: 'bank_transfer',
          bank_name: 'ธนาคารกรุงเทพ',
          bank_account_number: '1234567890',
          bank_account_name: 'นาย ทดสอบ ระบบ',
          scheduled_date: '2024-08-15',
          approved_date: '2024-08-18',
          paid_date: '2024-08-20',
          transaction_reference: 'TXN20240820001',
          receipt_url: '/receipts/payment-1.pdf',
          created_at: '2024-08-10T10:00:00Z'
        },
        {
          payment_id: 2,
          scholarship_id: 3,
          scholarship_name: 'ทุนช่วยเหลือนักศึกษา',
          award_id: 2,
          amount: 7500,
          academic_year: '2567',
          semester: '1',
          payment_type: 'installment',
          installment_number: 1,
          total_installments: 2,
          payment_status: 'paid',
          payment_method: 'bank_transfer',
          bank_name: 'ธนาคารกรุงเทพ',
          bank_account_number: '1234567890',
          bank_account_name: 'นาย ทดสอบ ระบบ',
          scheduled_date: '2024-08-01',
          approved_date: '2024-08-03',
          paid_date: '2024-08-05',
          transaction_reference: 'TXN20240805001',
          receipt_url: '/receipts/payment-2.pdf',
          created_at: '2024-07-25T10:00:00Z'
        },
        {
          payment_id: 3,
          scholarship_id: 3,
          scholarship_name: 'ทุนช่วยเหลือนักศึกษา',
          award_id: 2,
          amount: 7500,
          academic_year: '2567',
          semester: '1',
          payment_type: 'installment',
          installment_number: 2,
          total_installments: 2,
          payment_status: 'approved',
          payment_method: 'bank_transfer',
          bank_name: 'ธนาคารกรุงเทพ',
          bank_account_number: '1234567890',
          bank_account_name: 'นาย ทดสอบ ระบบ',
          scheduled_date: '2024-10-01',
          approved_date: '2024-09-28',
          notes: 'จะโอนเงินในวันที่ 1 ตุลาคม 2567',
          created_at: '2024-07-25T10:00:00Z'
        },
        {
          payment_id: 4,
          scholarship_id: 5,
          scholarship_name: 'ทุนวิจัย',
          award_id: 3,
          amount: 30000,
          academic_year: '2567',
          semester: '1',
          payment_type: 'full',
          payment_status: 'processing',
          payment_method: 'bank_transfer',
          bank_name: 'ธนาคารกรุงเทพ',
          bank_account_number: '1234567890',
          bank_account_name: 'นาย ทดสอบ ระบบ',
          scheduled_date: '2024-10-05',
          notes: 'รอการอนุมัติจากผู้บริหาร',
          created_at: '2024-09-20T10:00:00Z'
        }
      ]);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string; icon: any } } = {
      pending: {
        label: 'รอดำเนินการ',
        className: 'bg-gray-100 text-gray-800',
        icon: ClockIcon
      },
      processing: {
        label: 'กำลังดำเนินการ',
        className: 'bg-blue-100 text-blue-800',
        icon: ClockIcon
      },
      approved: {
        label: 'อนุมัติแล้ว',
        className: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      },
      paid: {
        label: 'จ่ายเงินแล้ว',
        className: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      },
      failed: {
        label: 'ล้มเหลว',
        className: 'bg-red-100 text-red-800',
        icon: ExclamationTriangleIcon
      },
      cancelled: {
        label: 'ยกเลิก',
        className: 'bg-gray-100 text-gray-800',
        icon: ExclamationTriangleIcon
      }
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
      icon: ClockIcon
    };

    const Icon = statusInfo.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        <Icon className="h-4 w-4 mr-1" />
        {statusInfo.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string): string => {
    const methodMap: { [key: string]: string } = {
      bank_transfer: 'โอนเข้าบัญชีธนาคาร',
      cash: 'เงินสด',
      check: 'เช็ค'
    };
    return methodMap[method] || method;
  };

  // Get unique years
  const years = Array.from(new Set(payments.map(p => p.academic_year))).sort().reverse();

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.payment_status === filterStatus;
    const matchesYear = filterYear === 'all' || payment.academic_year === filterYear;
    return matchesStatus && matchesYear;
  });

  // Calculate totals
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = filteredPayments
    .filter(p => p.payment_status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayments
    .filter(p => ['pending', 'processing', 'approved'].includes(p.payment_status))
    .reduce((sum, p) => sum + p.amount, 0);

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
                <BanknotesIcon className="h-8 w-8 text-primary-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">การจ่ายเงิน / เบิกเงิน</h1>
              </div>
              <p className="text-gray-600">ข้อมูลการจ่ายเงินทุนการศึกษา</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ยอดรวมทั้งหมด</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">บาท</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BanknotesIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">จ่ายแล้ว</p>
                    <p className="text-3xl font-bold text-green-600">
                      {paidAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">บาท</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">รอจ่าย</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {pendingAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">บาท</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <ClockIcon className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="pending">รอดำเนินการ</option>
                  <option value="processing">กำลังดำเนินการ</option>
                  <option value="approved">อนุมัติแล้ว</option>
                  <option value="paid">จ่ายเงินแล้ว</option>
                  <option value="failed">ล้มเหลว</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
            </div>

            {/* Payments List */}
            {filteredPayments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <BanknotesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลการจ่ายเงิน</h3>
                <p className="text-gray-500">
                  {filterYear !== 'all' || filterStatus !== 'all'
                    ? 'ลองเปลี่ยนตัวกรอง'
                    : 'คุณยังไม่มีรายการจ่ายเงิน'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.payment_id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {payment.scholarship_name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {getStatusBadge(payment.payment_status)}
                          {payment.payment_type === 'installment' && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              งวดที่ {payment.installment_number}/{payment.total_installments}
                            </span>
                          )}
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            {payment.academic_year}/{payment.semester}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary-600">
                          {payment.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">บาท</div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-start">
                        <BuildingLibraryIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-gray-500">วิธีการจ่าย</p>
                          <p className="font-medium text-gray-900">
                            {getPaymentMethodLabel(payment.payment_method)}
                          </p>
                          {payment.bank_name && (
                            <p className="text-gray-600">{payment.bank_name}</p>
                          )}
                        </div>
                      </div>

                      {payment.scheduled_date && (
                        <div className="flex items-start">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-gray-500">วันที่กำหนดจ่าย</p>
                            <p className="font-medium text-gray-900">
                              {new Date(payment.scheduled_date).toLocaleDateString('th-TH')}
                            </p>
                          </div>
                        </div>
                      )}

                      {payment.paid_date && (
                        <div className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-gray-500">วันที่จ่ายจริง</p>
                            <p className="font-medium text-gray-900">
                              {new Date(payment.paid_date).toLocaleDateString('th-TH')}
                            </p>
                          </div>
                        </div>
                      )}

                      {payment.transaction_reference && (
                        <div className="flex items-start">
                          <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-gray-500">เลขที่อ้างอิง</p>
                            <p className="font-medium text-gray-900 font-mono">
                              {payment.transaction_reference}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bank Account Info */}
                    {payment.bank_account_number && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">ข้อมูลบัญชีรับเงิน</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-blue-700">ชื่อบัญชี:</span>
                            <span className="ml-2 font-medium text-blue-900">
                              {payment.bank_account_name}
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-700">เลขที่บัญชี:</span>
                            <span className="ml-2 font-medium text-blue-900 font-mono">
                              {payment.bank_account_number}
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-700">ธนาคาร:</span>
                            <span className="ml-2 font-medium text-blue-900">
                              {payment.bank_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {payment.notes && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">หมายเหตุ:</span> {payment.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    {payment.receipt_url && (
                      <div className="pt-4 border-t border-gray-200">
                        <a
                          href={payment.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                          ดาวน์โหลดใบเสร็จ
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
