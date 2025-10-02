'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { applicationService, Application, ApplicationStats } from '@/services/application.service';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowDownTrayIcon,
  Squares2X2Icon,
  DocumentCheckIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const AdminApplicationsPage: React.FC = () => {
  const router = useRouter();
  
  // State management
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedGpaRange, setSelectedGpaRange] = useState('');
  const [selectedIncomeRange, setSelectedIncomeRange] = useState('');
  const [sortBy, setSortBy] = useState('submissionDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Bulk selection
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Load applications data
  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getApplications({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
        status: selectedStatus || undefined,
        faculty: selectedFaculty || undefined,
        priority: selectedPriority || undefined,
        sortBy,
        sortOrder
      });
      
      setApplications(response.applications);
      setTotalPages(response.pagination.totalPages);
      setSelectedApplications([]); // Clear selection when data changes
      setSelectAll(false);
    } catch (error) {
      console.error('Failed to load applications:', error);
      setApplications([]);
      toast.error('ไม่สามารถโหลดข้อมูลใบสมัครได้');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const statsData = await applicationService.getApplicationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('ไม่สามารถโหลดสถิติได้');
    }
  };

  // Effects
  useEffect(() => {
    loadApplications();
  }, [currentPage, searchTerm, selectedStatus, selectedFaculty, selectedPriority, sortBy, sortOrder]);

  useEffect(() => {
    loadStats();
  }, []);

  // Event handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case 'status':
        setSelectedStatus(value);
        break;
      case 'faculty':
        setSelectedFaculty(value);
        break;
      case 'scholarship':
        setSelectedScholarship(value);
        break;
      case 'priority':
        setSelectedPriority(value);
        break;
      case 'gpa':
        setSelectedGpaRange(value);
        break;
      case 'income':
        setSelectedIncomeRange(value);
        break;
    }
    setCurrentPage(1);
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedFaculty('');
    setSelectedScholarship('');
    setSelectedPriority('');
    setSelectedGpaRange('');
    setSelectedIncomeRange('');
    setSortBy('submissionDate');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedApplications([]);
      setSelectAll(false);
    } else {
      setSelectedApplications(applications.map(app => app.id));
      setSelectAll(true);
    }
  };

  const handleSelectApplication = (id: string) => {
    if (selectedApplications.includes(id)) {
      setSelectedApplications(selectedApplications.filter(appId => appId !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedApplications, id];
      setSelectedApplications(newSelected);
      setSelectAll(newSelected.length === applications.length);
    }
  };

  // Individual actions
  const handleViewApplication = (id: string) => {
    router.push(`/admin/applications/${id}`);
  };

  const handleReviewApplication = async (id: string, action: 'approve' | 'reject' | 'interview' | 'document', data?: any) => {
    try {
      setActionLoading(prev => ({ ...prev, [`${action}-${id}`]: true }));
      
      let statusMap = {
        'approve': 'approved',
        'reject': 'rejected',
        'interview': 'interview_scheduled',
        'document': 'document_pending'
      };

      await applicationService.reviewApplication({
        applicationId: id,
        status: statusMap[action] as any,
        score: action === 'approve' ? 85 : undefined,
        notes: data?.notes || '',
        interviewDate: data?.interviewDate,
        rejectionReason: data?.rejectionReason
      });
      
      await loadApplications();
      await loadStats();
      toast.success(`${action === 'approve' ? 'อนุมัติ' : action === 'reject' ? 'ปฏิเสธ' : action === 'interview' ? 'นัดสัมภาษณ์' : 'ขอเอกสาร'}ใบสมัครเรียบร้อยแล้ว`);
    } catch (error) {
      console.error('Review application error:', error);
      toast.error('ไม่สามารถดำเนินการได้');
    } finally {
      setActionLoading(prev => ({ ...prev, [`${action}-${id}`]: false }));
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: 'approve' | 'reject' | 'interview' | 'document') => {
    if (selectedApplications.length === 0) {
      toast.error('กรุณาเลือกใบสมัครที่ต้องการดำเนินการ');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [`bulk-${action}`]: true }));
      
      let actionData: any = { action: action === 'approve' ? 'approve' : action === 'reject' ? 'reject' : action === 'interview' ? 'schedule_interview' : 'request_documents' };
      
      if (action === 'reject') {
        const reason = prompt('เหตุผลในการปฏิเสธ:');
        if (!reason) return;
        actionData.data = { rejectionReason: reason };
      } else if (action === 'interview') {
        const date = prompt('วันที่สัมภาษณ์ (YYYY-MM-DD):');
        if (!date) return;
        actionData.data = { interviewDate: date };
      }

      await applicationService.bulkAction({
        applicationIds: selectedApplications,
        ...actionData
      });

      await loadApplications();
      await loadStats();
      setSelectedApplications([]);
      setSelectAll(false);
      toast.success(`ดำเนินการกับใบสมัคร ${selectedApplications.length} รายการเรียบร้อยแล้ว`);
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('ไม่สามารถดำเนินการได้');
    } finally {
      setActionLoading(prev => ({ ...prev, [`bulk-${action}`]: false }));
    }
  };

  // Export functionality
  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      setActionLoading(prev => ({ ...prev, 'export': true }));
      
      const blob = await applicationService.exportApplications({
        status: selectedStatus || undefined,
        faculty: selectedFaculty || undefined,
        priority: selectedPriority || undefined,
        search: searchTerm || undefined
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `applications_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('ส่งออกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('ไม่สามารถส่งออกข้อมูลได้');
    } finally {
      setActionLoading(prev => ({ ...prev, 'export': false }));
    }
  };

  // Helper functions
  const getStatusBadge = (status: Application['status']) => {
    const statusConfig = {
      'draft': { color: 'secondary', label: 'แบบร่าง', icon: DocumentTextIcon },
      'submitted': { color: 'primary', label: 'ส่งแล้ว', icon: CheckCircleIcon },
      'under_review': { color: 'warning', label: 'กำลังพิจารณา', icon: ClockIcon },
      'document_pending': { color: 'warning', label: 'รอเอกสาร', icon: ExclamationTriangleIcon },
      'interview_scheduled': { color: 'info', label: 'นัดสัมภาษณ์', icon: CalendarIcon },
      'approved': { color: 'success', label: 'อนุมัติ', icon: CheckCircleIcon },
      'rejected': { color: 'danger', label: 'ปฏิเสธ', icon: XCircleIcon }
    };

    const config = statusConfig[status] || statusConfig['draft'];
    const Icon = config.icon;

    return (
      <Badge variant={config.color as any} className="inline-flex items-center">
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Application['priority']) => {
    const priorityConfig = {
      'high': { color: 'danger', label: 'สูง' },
      'medium': { color: 'warning', label: 'ปานกลาง' },
      'low': { color: 'secondary', label: 'ต่ำ' }
    };

    const config = priorityConfig[priority] || priorityConfig['medium'];
    
    return (
      <Badge variant={config.color as any}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter options
  const facultyOptions = [
    { value: '', label: 'ทุกคณะ' },
    { value: 'economics', label: 'คณะเศรษฐศาสตร์' },
    { value: 'business', label: 'คณะพาณิชยศาสตร์' },
    { value: 'engineering', label: 'คณะวิศวกรรมศาสตร์' },
    { value: 'medicine', label: 'คณะแพทยศาสตร์' },
    { value: 'law', label: 'คณะนิติศาสตร์' }
  ];

  const gpaOptions = [
    { value: '', label: 'ทุกระดับ GPA' },
    { value: '3.5-4.0', label: '3.50 - 4.00' },
    { value: '3.0-3.49', label: '3.00 - 3.49' },
    { value: '2.5-2.99', label: '2.50 - 2.99' },
    { value: '2.0-2.49', label: '2.00 - 2.49' }
  ];

  const incomeOptions = [
    { value: '', label: 'ทุกระดับรายได้' },
    { value: '0-50000', label: 'ต่ำกว่า 50,000 บาท' },
    { value: '50000-100000', label: '50,000 - 100,000 บาท' },
    { value: '100000-200000', label: '100,000 - 200,000 บาท' },
    { value: '200000-500000', label: '200,000 - 500,000 บาท' },
    { value: '500000+', label: 'มากกว่า 500,000 บาท' }
  ];

  // Loading state
  if (loading && applications.length === 0) {
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                จัดการใบสมัครทุนการศึกษา
              </h1>
              <p className="text-secondary-600 font-sarabun">
                ตรวจสอบ พิจารณา และจัดการใบสมัครทุนการศึกษาทั้งหมดในระบบ
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport('excel')}
                disabled={actionLoading.export}
                className="font-sarabun"
              >
                {actionLoading.export ? (
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                )}
                ส่งออก Excel
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push('/admin/applications/bulk-review')}
                className="font-sarabun"
              >
                <Squares2X2Icon className="h-4 w-4 mr-2" />
                พิจารณาแบบกลุ่ม
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardBody className="p-4 text-center">
                <div className="inline-flex p-2 rounded-lg bg-blue-50 mb-2">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xl font-bold text-secondary-900 font-sarabun">{stats.total}</p>
                <p className="text-xs text-secondary-600 font-sarabun">ทั้งหมด</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 text-center">
                <div className="inline-flex p-2 rounded-lg bg-yellow-50 mb-2">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <p className="text-xl font-bold text-secondary-900 font-sarabun">{stats.pending}</p>
                <p className="text-xs text-secondary-600 font-sarabun">รอพิจารณา</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 text-center">
                <div className="inline-flex p-2 rounded-lg bg-purple-50 mb-2">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-xl font-bold text-secondary-900 font-sarabun">{stats.interview}</p>
                <p className="text-xs text-secondary-600 font-sarabun">สัมภาษณ์</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 text-center">
                <div className="inline-flex p-2 rounded-lg bg-green-50 mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-xl font-bold text-secondary-900 font-sarabun">{stats.approved}</p>
                <p className="text-xs text-secondary-600 font-sarabun">อนุมัติ</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 text-center">
                <div className="inline-flex p-2 rounded-lg bg-red-50 mb-2">
                  <XCircleIcon className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-xl font-bold text-secondary-900 font-sarabun">{stats.rejected}</p>
                <p className="text-xs text-secondary-600 font-sarabun">ปฏิเสธ</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 text-center">
                <div className="inline-flex p-2 rounded-lg bg-orange-50 mb-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-xl font-bold text-secondary-900 font-sarabun">{stats.overdue}</p>
                <p className="text-xs text-secondary-600 font-sarabun">เกินกำหนด</p>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedApplications.length > 0 && (
          <Card className="mb-6 border-primary-200 bg-primary-50">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-primary-900 font-sarabun">
                    เลือกแล้ว {selectedApplications.length} รายการ
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedApplications([]);
                      setSelectAll(false);
                    }}
                    className="font-sarabun"
                  >
                    ยกเลิกการเลือก
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleBulkAction('approve')}
                    disabled={actionLoading['bulk-approve']}
                    className="font-sarabun"
                  >
                    {actionLoading['bulk-approve'] ? (
                      <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    อนุมัติทั้งหมด
                  </Button>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleBulkAction('interview')}
                    disabled={actionLoading['bulk-interview']}
                    className="font-sarabun"
                  >
                    {actionLoading['bulk-interview'] ? (
                      <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <CalendarIcon className="h-4 w-4 mr-1" />
                    )}
                    นัดสัมภาษณ์
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleBulkAction('document')}
                    disabled={actionLoading['bulk-document']}
                    className="font-sarabun"
                  >
                    {actionLoading['bulk-document'] ? (
                      <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <DocumentCheckIcon className="h-4 w-4 mr-1" />
                    )}
                    ขอเอกสาร
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleBulkAction('reject')}
                    disabled={actionLoading['bulk-reject']}
                    className="font-sarabun"
                  >
                    {actionLoading['bulk-reject'] ? (
                      <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    ปฏิเสธทั้งหมด
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <Input
                  type="text"
                  placeholder="ค้นหาใบสมัคร (ชื่อ, อีเมล, ทุนการศึกษา, รหัสนักศึกษา)..."
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
                ตัวกรอง {(searchTerm || selectedStatus || selectedFaculty || selectedPriority) && '•'}
              </Button>
              {(searchTerm || selectedStatus || selectedFaculty || selectedPriority || selectedGpaRange || selectedIncomeRange) && (
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

          {/* Enhanced Filters */}
          {showFilters && (
            <Card>
              <CardBody className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      สถานะ
                    </label>
                    <Select
                      value={selectedStatus}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      options={[
                        { value: '', label: 'ทุกสถานะ' },
                        { value: 'draft', label: 'แบบร่าง' },
                        { value: 'submitted', label: 'ส่งแล้ว' },
                        { value: 'under_review', label: 'กำลังพิจารณา' },
                        { value: 'document_pending', label: 'รอเอกสาร' },
                        { value: 'interview_scheduled', label: 'นัดสัมภาษณ์' },
                        { value: 'approved', label: 'อนุมัติ' },
                        { value: 'rejected', label: 'ปฏิเสธ' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      คณะ
                    </label>
                    <Select
                      value={selectedFaculty}
                      onChange={(e) => handleFilterChange('faculty', e.target.value)}
                      options={facultyOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ความสำคัญ
                    </label>
                    <Select
                      value={selectedPriority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      options={[
                        { value: '', label: 'ทุกระดับ' },
                        { value: 'high', label: 'สูง' },
                        { value: 'medium', label: 'ปานกลาง' },
                        { value: 'low', label: 'ต่ำ' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      GPA
                    </label>
                    <Select
                      value={selectedGpaRange}
                      onChange={(e) => handleFilterChange('gpa', e.target.value)}
                      options={gpaOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      รายได้ครอบครัว
                    </label>
                    <Select
                      value={selectedIncomeRange}
                      onChange={(e) => handleFilterChange('income', e.target.value)}
                      options={incomeOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      เรียงลำดับ
                    </label>
                    <Select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order as 'asc' | 'desc');
                      }}
                      options={[
                        { value: 'submissionDate-desc', label: 'วันส่งล่าสุด' },
                        { value: 'submissionDate-asc', label: 'วันส่งเก่าสุด' },
                        { value: 'score-desc', label: 'คะแนนสูงสุด' },
                        { value: 'score-asc', label: 'คะแนนต่ำสุด' },
                        { value: 'gpa-desc', label: 'GPA สูงสุด' },
                        { value: 'gpa-asc', label: 'GPA ต่ำสุด' },
                        { value: 'familyIncome-asc', label: 'รายได้น้อยสุด' },
                        { value: 'familyIncome-desc', label: 'รายได้มากสุด' }
                      ]}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {/* Table Header */}
          {applications.length > 0 && (
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    aria-label="เลือกใบสมัครทั้งหมด"
                  />
                  <span className="text-sm font-medium text-secondary-700 font-sarabun">
                    เลือกทั้งหมด ({applications.length} รายการ)
                  </span>
                </div>
              </CardBody>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <Card>
              <CardBody className="p-8 text-center">
                <DocumentTextIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2 font-sarabun">
                  ไม่พบใบสมัคร
                </h3>
                <p className="text-secondary-600 font-sarabun">
                  {searchTerm || selectedStatus || selectedFaculty || selectedPriority
                    ? 'ไม่พบใบสมัครที่ตรงกับเงื่อนไขการค้นหา'
                    : 'ยังไม่มีใบสมัครในระบบ'
                  }
                </p>
              </CardBody>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(application.id)}
                      onChange={() => handleSelectApplication(application.id)}
                      className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      aria-label={`เลือกใบสมัครของ ${application.personalInfo?.firstName || ''} ${application.personalInfo?.lastName || ''}`}
                    />
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-300">
                        <UserIcon className="h-7 w-7 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-lg font-medium text-secondary-900 truncate font-sarabun">
                      {application.personalInfo?.firstName} {application.personalInfo?.lastName}
                    </h3>
                        {getStatusBadge(application.status)}
                        {getPriorityBadge(application.priority)}
                      </div>
                      <p className="text-sm text-secondary-600 font-sarabun mb-2">
                        {application.personalInfo?.email} • {application.personalInfo?.phone}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-sarabun">
                        <div className="flex items-center text-secondary-600">
                          <AcademicCapIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-secondary-500" />
                          <div>
                            <div className="font-medium">{application.scholarshipName}</div>
                            <div className="text-xs text-secondary-500">{formatCurrency(application.scholarshipAmount)}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-secondary-600">
                          <ChartBarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-secondary-500" />
                          <div>
                            <div>GPA: {application.gpa}</div>
                            <div className="text-xs text-secondary-500">คะแนน: {application.score || 'ยังไม่ให้'}/100</div>
                          </div>
                        </div>
                        <div className="flex items-center text-secondary-600">
                          <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-secondary-500" />
                          <div>
                            <div>รายได้: {formatCurrency(application.familyIncome)}</div>
                            <div className="text-xs text-secondary-500">{application.faculty}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-secondary-600">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-secondary-500" />
                          <div>
                            <div>ส่งเมื่อ: {formatDate(application.submissionDate)}</div>
                            {application.reviewDate && (
                              <div className="text-xs text-secondary-500">พิจารณาเมื่อ: {formatDate(application.reviewDate)}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(application.id)}
                        className="font-sarabun min-w-[100px]"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        ดูรายละเอียด
                      </Button>
                      {(application.status === 'submitted' || application.status === 'under_review') && (
                        <div className="flex gap-1">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleReviewApplication(application.id, 'approve')}
                            disabled={actionLoading[`approve-${application.id}`]}
                            className="font-sarabun flex-1"
                          >
                            {actionLoading[`approve-${application.id}`] ? (
                              <ArrowPathIcon className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircleIcon className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => {
                              const date = prompt('วันที่สัมภาษณ์ (YYYY-MM-DD):');
                              if (date) {
                                handleReviewApplication(application.id, 'interview', { interviewDate: date });
                              }
                            }}
                            disabled={actionLoading[`interview-${application.id}`]}
                            className="font-sarabun flex-1"
                          >
                            {actionLoading[`interview-${application.id}`] ? (
                              <ArrowPathIcon className="h-3 w-3 animate-spin" />
                            ) : (
                              <CalendarIcon className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const reason = prompt('เหตุผลในการปฏิเสธ:');
                              if (reason) {
                                handleReviewApplication(application.id, 'reject', { rejectionReason: reason });
                              }
                            }}
                            disabled={actionLoading[`reject-${application.id}`]}
                            className="font-sarabun flex-1"
                          >
                            {actionLoading[`reject-${application.id}`] ? (
                              <ArrowPathIcon className="h-3 w-3 animate-spin" />
                            ) : (
                              <XCircleIcon className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}

          {/* Pagination */}
          {!loading && applications.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="font-sarabun"
                >
                  ก่อนหน้า
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
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="font-sarabun"
                >
                  ถัดไป
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationsPage; 