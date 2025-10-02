'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BanknotesIcon,
  UsersIcon,
  CalendarIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Scholarship, 
  ScholarshipFilter,
  ScholarshipStats,
  scholarshipService 
} from '@/services/scholarship.service';

const AdminScholarshipsPage: React.FC = () => {
  const router = useRouter();
  
  // State for scholarships data
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalScholarships, setTotalScholarships] = useState(0);
  const [stats, setStats] = useState<ScholarshipStats | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Load scholarships on initial render and when filters change
  useEffect(() => {
    loadScholarships();
    loadStats();
  }, [currentPage, searchTerm, selectedType, selectedStatus, selectedYear, selectedProvider]);

  // Function to load scholarships with filters
  const loadScholarships = async () => {
    try {
      setLoading(true);
      const filters: ScholarshipFilter = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        type: selectedType || undefined,
        status: selectedStatus || undefined,
        academicYear: selectedYear || undefined,
        provider: selectedProvider || undefined
      };

      const response = await scholarshipService.getScholarships(filters);
      setScholarships(response.scholarships);
      setTotalPages(response.pagination.totalPages);
      setTotalScholarships(response.pagination.total);
    } catch (error) {
      console.error('Failed to load scholarships:', error);
      toast.error('ไม่สามารถโหลดข้อมูลทุนการศึกษาได้');
    } finally {
      setLoading(false);
    }
  };

  // Load scholarship statistics
  const loadStats = async () => {
    try {
      const statsData = await scholarshipService.getScholarshipStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load scholarship stats:', error);
      // Don't show error toast for stats as it's not critical
      // Set default stats instead
      setStats({
        total: 0,
        open: 0,
        closed: 0,
        draft: 0,
        totalBudget: 0,
        allocatedBudget: 0,
        remainingBudget: 0
      });
    }
  };

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (type: 'type' | 'status' | 'year' | 'provider', value: string) => {
    if (type === 'type') {
      setSelectedType(value);
    } else if (type === 'status') {
      setSelectedStatus(value);
    } else if (type === 'year') {
      setSelectedYear(value);
    } else if (type === 'provider') {
      setSelectedProvider(value);
    }
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedStatus('');
    setSelectedYear('');
    setSelectedProvider('');
    setCurrentPage(1);
  };

  // Navigate to create new scholarship page
  const handleCreateScholarship = () => {
    router.push('/admin/scholarships/create');
  };

  // Navigate to edit scholarship page
    const handleEditScholarship = (id: number) => {
    router.push(`/admin/scholarships/${id}?edit=true&returnTo=/admin/scholarships`);
  };

  // Handle scholarship deletion
  const handleDeleteScholarship = async (id: number) => {
    if (!confirm('คุณต้องการลบทุนการศึกษานี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [`delete-${id}`]: true }));
    try {
      await scholarshipService.deleteScholarship(id);
      await loadScholarships();
      await loadStats();
      toast.success('ลบทุนการศึกษาเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Delete scholarship error:', error);
      toast.error(error instanceof Error ? error.message : 'ไม่สามารถลบทุนการศึกษาได้');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${id}`]: false }));
    }
  };

  // Handle scholarship duplication
  const handleDuplicateScholarship = async (id: number) => {
    setActionLoading(prev => ({ ...prev, [`duplicate-${id}`]: true }));
    try {
      await scholarshipService.duplicateScholarship(id);
      await loadScholarships();
      await loadStats();
      toast.success('คัดลอกทุนการศึกษาเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Duplicate scholarship error:', error);
      toast.error(error instanceof Error ? error.message : 'ไม่สามารถคัดลอกทุนการศึกษาได้');
    } finally {
      setActionLoading(prev => ({ ...prev, [`duplicate-${id}`]: false }));
    }
  };

  // Handle scholarship status changes
  const handlePublishScholarship = async (id: number) => {
    setActionLoading(prev => ({ ...prev, [`publish-${id}`]: true }));
    try {
      await scholarshipService.publishScholarship(id);
      await loadScholarships();
      await loadStats();
      toast.success('เผยแพร่ทุนการศึกษาเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Publish scholarship error:', error);
      toast.error(error instanceof Error ? error.message : 'ไม่สามารถเผยแพร่ทุนการศึกษาได้');
    } finally {
      setActionLoading(prev => ({ ...prev, [`publish-${id}`]: false }));
    }
  };

  const handleCloseScholarship = async (id: number) => {
    setActionLoading(prev => ({ ...prev, [`close-${id}`]: true }));
    try {
      await scholarshipService.closeScholarship(id);
      await loadScholarships();
      await loadStats();
      toast.success('ปิดรับสมัครทุนการศึกษาเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Close scholarship error:', error);
      toast.error(error instanceof Error ? error.message : 'ไม่สามารถปิดรับสมัครทุนการศึกษาได้');
    } finally {
      setActionLoading(prev => ({ ...prev, [`close-${id}`]: false }));
    }
  };

  const handleSuspendScholarship = async (id: number) => {
    setActionLoading(prev => ({ ...prev, [`suspend-${id}`]: true }));
    try {
      await scholarshipService.suspendScholarship(id);
      await loadScholarships();
      await loadStats();
      toast.success('ระงับทุนการศึกษาเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Suspend scholarship error:', error);
      toast.error(error instanceof Error ? error.message : 'ไม่สามารถระงับทุนการศึกษาได้');
    } finally {
      setActionLoading(prev => ({ ...prev, [`suspend-${id}`]: false }));
    }
  };

  // Helper function to get status badge color
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            เปิดรับสมัคร
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            ปิดรับสมัคร
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            เตรียมเปิดรับสมัคร
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            แบบร่าง
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            ระงับชั่วคราว
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            ไม่ระบุ
          </span>
        );
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get scholarship type display name
  const getScholarshipType = (type?: string) => {
    const typeMap: Record<string, string> = {
      'tuition': 'ทุนค่าเล่าเรียน',
      'living': 'ทุนค่าครองชีพ',
      'research': 'ทุนวิจัย',
      'full': 'ทุนเต็มจำนวน',
      'partial': 'ทุนบางส่วน',
      'exchange': 'ทุนแลกเปลี่ยน',
      'merit': 'ทุนเรียนดี',
      'need': 'ทุนขาดแคลน',
    };
    return typeMap[type || ''] || type || '-';
  };

  // Loading state
  if (loading && scholarships.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-sarabun">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                จัดการทุนการศึกษา
              </h1>
              <p className="text-secondary-600 font-sarabun">
                สร้าง แก้ไข และจัดการทุนการศึกษาทั้งหมดในระบบ
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleCreateScholarship}
              className="font-sarabun"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              สร้างทุนใหม่
            </Button>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{stats.total}</p>
                <p className="text-sm text-secondary-600 font-sarabun">ทุนทั้งหมด</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{stats.open}</p>
                <p className="text-sm text-secondary-600 font-sarabun">เปิดรับสมัคร</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-gray-50 mb-4">
                  <ClockIcon className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{stats.draft}</p>
                <p className="text-sm text-secondary-600 font-sarabun">แบบร่าง</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
                  <BanknotesIcon className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{formatCurrency(stats.totalBudget)}</p>
                <p className="text-sm text-secondary-600 font-sarabun">งบประมาณรวม</p>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <Input
                  type="text"
                  placeholder="ค้นหาทุนการศึกษา..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 font-sarabun"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="font-sarabun"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                ตัวกรอง
              </Button>
              {(searchTerm || selectedType || selectedStatus || selectedYear || selectedProvider) && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="font-sarabun text-red-600 hover:text-red-700"
                >
                  ล้างตัวกรอง
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card>
              <CardBody className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ประเภททุน
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      aria-label="เลือกประเภททุน"
                    >
                      <option value="">ทุกประเภท</option>
                      <option value="tuition">ทุนค่าเล่าเรียน</option>
                      <option value="living">ทุนค่าครองชีพ</option>
                      <option value="research">ทุนวิจัย</option>
                      <option value="full">ทุนเต็มจำนวน</option>
                      <option value="partial">ทุนบางส่วน</option>
                      <option value="exchange">ทุนแลกเปลี่ยน</option>
                      <option value="merit">ทุนเรียนดี</option>
                      <option value="need">ทุนขาดแคลน</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      สถานะ
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      aria-label="เลือกสถานะ"
                    >
                      <option value="">ทุกสถานะ</option>
                      <option value="open">เปิดรับสมัคร</option>
                      <option value="pending">เตรียมเปิดรับสมัคร</option>
                      <option value="closed">ปิดรับสมัคร</option>
                      <option value="draft">แบบร่าง</option>
                      <option value="suspended">ระงับชั่วคราว</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ปีการศึกษา
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      aria-label="เลือกปีการศึกษา"
                    >
                      <option value="">ทุกปีการศึกษา</option>
                      <option value="2568">2568</option>
                      <option value="2567">2567</option>
                      <option value="2566">2566</option>
                      <option value="2565">2565</option>
                      <option value="2564">2564</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      แหล่งทุน
                    </label>
                    <select
                      value={selectedProvider}
                      onChange={(e) => handleFilterChange('provider', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      aria-label="เลือกแหล่งทุน"
                    >
                      <option value="">ทุกแหล่งทุน</option>
                      <option value="university">มหาวิทยาลัย</option>
                      <option value="government">รัฐบาล</option>
                      <option value="private">เอกชน</option>
                      <option value="foundation">มูลนิธิ</option>
                      <option value="international">ต่างประเทศ</option>
                    </select>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Scholarships List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : scholarships.length === 0 ? (
            <Card>
              <CardBody className="p-8 text-center">
                <AcademicCapIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2 font-sarabun">
                  ไม่พบทุนการศึกษา
                </h3>
                <p className="text-secondary-600 font-sarabun mb-4">
                  {searchTerm || selectedType || selectedStatus || selectedYear || selectedProvider
                    ? 'ไม่พบทุนการศึกษาที่ตรงกับเงื่อนไขการค้นหา'
                    : 'ยังไม่มีทุนการศึกษาในระบบ'
                  }
                </p>
                {!searchTerm && !selectedType && !selectedStatus && !selectedYear && !selectedProvider && (
                  <Button
                    variant="primary"
                    onClick={handleCreateScholarship}
                    className="font-sarabun"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    สร้างทุนการศึกษาแรก
                  </Button>
                )}
              </CardBody>
            </Card>
          ) : (
            scholarships.map((scholarship) => (
              <Card key={scholarship.scholarship_id || scholarship.id} className="hover:shadow-md transition-shadow">
                <CardBody className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-300">
                            <AcademicCapIcon className="h-7 w-7 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-secondary-900 truncate font-sarabun">
                            {scholarship.scholarship_name || scholarship.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {getStatusBadge(scholarship.status)}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <BuildingLibraryIcon className="w-4 h-4 mr-1" />
                              {scholarship.source?.source_name || scholarship.provider || 'ไม่ระบุแหล่งทุน'}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              ปีการศึกษา {scholarship.academic_year || scholarship.academicYear || '-'}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-secondary-600 font-sarabun">
                            <BanknotesIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-secondary-500" />
                            {formatCurrency(scholarship.amount)} / ทุน
                            <span className="mx-2">•</span>
                            <UsersIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-secondary-500" />
                            {scholarship.total_quota || scholarship.maxRecipients || 0} ทุน
                            <span className="mx-2">•</span>
                            <span>
                              ประเภท: {getScholarshipType(scholarship.scholarship_type || scholarship.type)}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-secondary-600 font-sarabun">
                            <span className="font-medium">วันที่รับสมัคร:</span> {formatDate(scholarship.application_start_date)} - {formatDate(scholarship.application_end_date || scholarship.applicationDeadline)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/scholarships/${scholarship.scholarship_id || scholarship.id}`)}
                        className="font-sarabun"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        ดูรายละเอียด
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditScholarship(scholarship.scholarship_id || scholarship.id || 0)}
                        className="font-sarabun"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        แก้ไข
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateScholarship(scholarship.scholarship_id || scholarship.id || 0)}
                        disabled={actionLoading[`duplicate-${scholarship.scholarship_id || scholarship.id}`]}
                        className="font-sarabun"
                      >
                        {actionLoading[`duplicate-${scholarship.scholarship_id || scholarship.id}`] ? (
                          <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                        )}
                        คัดลอก
                      </Button>
                      {scholarship.status === 'draft' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handlePublishScholarship(scholarship.scholarship_id || scholarship.id || 0)}
                          disabled={actionLoading[`publish-${scholarship.scholarship_id || scholarship.id}`]}
                          className="font-sarabun"
                        >
                          {actionLoading[`publish-${scholarship.scholarship_id || scholarship.id}`] ? (
                            <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                          )}
                          เผยแพร่
                        </Button>
                      )}
                      {scholarship.status === 'pending' && (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleSuspendScholarship(scholarship.scholarship_id || scholarship.id || 0)}
                          disabled={actionLoading[`suspend-${scholarship.scholarship_id || scholarship.id}`]}
                          className="font-sarabun"
                        >
                          {actionLoading[`suspend-${scholarship.scholarship_id || scholarship.id}`] ? (
                            <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 mr-1" />
                          )}
                          ระงับ
                        </Button>
                      )}
                      {scholarship.status === 'open' && (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleCloseScholarship(scholarship.scholarship_id || scholarship.id || 0)}
                          disabled={actionLoading[`close-${scholarship.scholarship_id || scholarship.id}`]}
                          className="font-sarabun"
                        >
                          {actionLoading[`close-${scholarship.scholarship_id || scholarship.id}`] ? (
                            <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 mr-1" />
                          )}
                          ปิดรับสมัคร
                        </Button>
                      )}
                      {(scholarship.status === 'open' || scholarship.status === 'closed') && (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleSuspendScholarship(scholarship.scholarship_id || scholarship.id || 0)}
                          disabled={actionLoading[`suspend-${scholarship.scholarship_id || scholarship.id}`]}
                          className="font-sarabun"
                        >
                          {actionLoading[`suspend-${scholarship.scholarship_id || scholarship.id}`] ? (
                            <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 mr-1" />
                          )}
                          ระงับ
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteScholarship(scholarship.scholarship_id || scholarship.id || 0)}
                        disabled={actionLoading[`delete-${scholarship.scholarship_id || scholarship.id}`]}
                        className="font-sarabun"
                      >
                        {actionLoading[`delete-${scholarship.scholarship_id || scholarship.id}`] ? (
                          <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4 mr-1" />
                        )}
                        ลบ
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}

          {/* Pagination */}
          {!loading && scholarships.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1 || loading}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="font-sarabun"
                >
                  {loading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : 'ก่อนหน้า'}
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    page = currentPage - 2 + i;
                    if (page > totalPages) page = totalPages - 4 + i;
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'outline'}
                      size="sm"
                      disabled={loading}
                      onClick={() => handlePageChange(page)}
                      className="font-sarabun"
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages || loading}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="font-sarabun"
                >
                  {loading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : 'ถัดไป'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminScholarshipsPage;
