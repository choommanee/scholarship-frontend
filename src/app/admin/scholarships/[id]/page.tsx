'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { scholarshipService, Scholarship } from '@/services/scholarship.service';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  BanknotesIcon,
  CalendarIcon,
  UsersIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface EditScholarshipForm {
  scholarship_name: string;
  scholarship_type: string;
  amount: number;
  total_quota: number;
  academic_year: string;
  semester: string;
  eligibility_criteria: string;
  required_documents: string;
  application_start_date: string;
  application_end_date: string;
  interview_required: boolean;
}

const ScholarshipDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scholarshipId = parseInt(params.id as string);
  const isEditMode = searchParams.get('edit') === 'true';
  const returnTo = searchParams.get('returnTo') || `/admin/scholarships/${scholarshipId}`;
  
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<EditScholarshipForm>();

  useEffect(() => {
    if (scholarshipId) {
      loadScholarshipDetail();
    }
  }, [scholarshipId]);

  const loadScholarshipDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scholarshipService.getScholarshipById(scholarshipId);
      setScholarship(data);
      
      // Set form values for edit mode
      if (isEditMode) {
        setValue('scholarship_name', data.scholarship_name);
        setValue('scholarship_type', data.scholarship_type);
        setValue('amount', data.amount);
        setValue('total_quota', data.total_quota);
        setValue('academic_year', data.academic_year);
        setValue('semester', data.semester || '');
        setValue('eligibility_criteria', data.eligibility_criteria || '');
        setValue('required_documents', data.required_documents || '');
        setValue('application_start_date', data.application_start_date ? data.application_start_date.split('T')[0] : '');
        setValue('application_end_date', data.application_end_date ? data.application_end_date.split('T')[0] : '');
        setValue('interview_required', data.interview_required);
      }
    } catch (error) {
      console.error('Failed to load scholarship detail:', error);
      setError('ไม่สามารถโหลดข้อมูลทุนการศึกษาได้');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/scholarships/${scholarshipId}?edit=true&returnTo=/admin/scholarships/${scholarshipId}`);
  };

  const handleDelete = async () => {
    if (!confirm('คุณต้องการลบทุนการศึกษานี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้')) {
      return;
    }

    try {
      await scholarshipService.deleteScholarship(scholarshipId);
      alert('ลบทุนการศึกษาเรียบร้อยแล้ว');
      router.push('/admin/scholarships');
    } catch (error) {
      console.error('Delete scholarship error:', error);
      alert('ไม่สามารถลบทุนการศึกษาได้');
    }
  };

  const handleDuplicate = async () => {
    try {
      await scholarshipService.duplicateScholarship(scholarshipId);
      alert('คัดลอกทุนการศึกษาเรียบร้อยแล้ว');
      router.push('/admin/scholarships');
    } catch (error) {
      console.error('Duplicate scholarship error:', error);
      alert('ไม่สามารถคัดลอกทุนการศึกษาได้');
    }
  };

  const handlePublish = async () => {
    try {
      await scholarshipService.publishScholarship(scholarshipId);
      await loadScholarshipDetail();
      alert('เผยแพร่ทุนการศึกษาเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Publish scholarship error:', error);
      alert('ไม่สามารถเผยแพร่ทุนการศึกษาได้');
    }
  };

  const handleClose = async () => {
    try {
      await scholarshipService.closeScholarship(scholarshipId);
      await loadScholarshipDetail();
      alert('ปิดรับสมัครทุนการศึกษาเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Close scholarship error:', error);
      alert('ไม่สามารถปิดรับสมัครทุนการศึกษาได้');
    }
  };

  const handleSuspend = async () => {
    try {
      await scholarshipService.suspendScholarship(scholarshipId);
      await loadScholarshipDetail();
      alert('ระงับทุนการศึกษาเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Suspend scholarship error:', error);
      alert('ไม่สามารถระงับทุนการศึกษาได้');
    }
  };

  const onSubmit = async (data: EditScholarshipForm) => {
    try {
      setSaving(true);
      setError(null);

      // Validate dates first
      const startDate = new Date(data.application_start_date);
      const endDate = new Date(data.application_end_date);
      
      if (endDate <= startDate) {
        setError('วันที่สิ้นสุดการรับสมัครต้องมากกว่าวันที่เริ่มรับสมัคร');
        return;
      }

      // Use the correct updateScholarship method signature
      await scholarshipService.updateScholarship({
        id: scholarshipId,
        name: data.scholarship_name,
        type: data.scholarship_type,
        amount: data.amount,
        maxRecipients: data.total_quota,
        academicYear: data.academic_year,
        applicationStartDate: new Date(data.application_start_date + 'T00:00:00').toISOString(),
        applicationDeadline: new Date(data.application_end_date + 'T23:59:59').toISOString(),
        requirements: [data.eligibility_criteria],
        documentsRequired: data.required_documents.split(',').map(doc => doc.trim()),
        description: data.eligibility_criteria,
        provider: scholarship?.source?.source_name || 'ไม่ระบุแหล่งทุน',
        totalBudget: data.amount * data.total_quota,
        semester: data.semester,
        interviewRequired: data.interview_required
      });

      toast.success('อัปเดตทุนการศึกษาเรียบร้อยแล้ว');
      
      // If returning to detail page, refresh data first
      if (returnTo === `/admin/scholarships/${scholarshipId}`) {
        await loadScholarshipDetail();
      }
      
      // Navigate to return destination
      router.push(returnTo);
    } catch (error) {
      console.error('Update scholarship error:', error);
      const errorMessage = error instanceof Error ? error.message : 'ไม่สามารถอัปเดตทุนการศึกษาได้';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const scholarshipTypes = [
    { value: 'merit', label: 'ทุนเรียนดี' },
    { value: 'need', label: 'ทุนขาดแคลน' },
    { value: 'mixed', label: 'ทุนผสม (เรียนดี + ขาดแคลน)' },
    { value: 'research', label: 'ทุนวิจัย' },
    { value: 'exchange', label: 'ทุนแลกเปลี่ยน' },
    { value: 'special', label: 'ทุนพิเศษ' }
  ];

  const academicYears = [
    { value: '2567', label: '2567' },
    { value: '2568', label: '2568' },
    { value: '2569', label: '2569' }
  ];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="success" icon={CheckCircleIcon}>เปิดรับสมัคร</Badge>;
      case 'pending':
        return <Badge variant="primary" icon={ClockIcon}>เตรียมเปิดรับสมัคร</Badge>;
      case 'closed':
        return <Badge variant="danger" icon={XCircleIcon}>ปิดรับสมัคร</Badge>;
      case 'draft':
        return <Badge variant="secondary" icon={ClockIcon}>แบบร่าง</Badge>;
      case 'suspended':
        return <Badge variant="warning" icon={ExclamationTriangleIcon}>ระงับชั่วคราว</Badge>;
      default:
        return <Badge variant="secondary" icon={ClockIcon}>ไม่ระบุ</Badge>;
    }
  };

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-sarabun">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2 font-sarabun">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-secondary-600 font-sarabun mb-4">
            {error || 'ไม่พบทุนการศึกษาที่ระบุ'}
          </p>
          <Button onClick={() => router.push('/admin/scholarships')} variant="primary">
            กลับไปหน้ารายการทุน
          </Button>
        </div>
      </div>
    );
  }

  // Render edit form if in edit mode
  if (isEditMode) {
    return (
      <div className="min-h-screen bg-secondary-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="outline"
                onClick={() => router.push(returnTo)}
                className="font-sarabun"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                กลับ
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 font-sarabun">
                  แก้ไขทุนการศึกษา
                </h1>
                <p className="text-secondary-600 font-sarabun">
                  แก้ไขข้อมูลทุนการศึกษา: {scholarship?.scholarship_name}
                </p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 font-sarabun">{error}</p>
              </div>
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                  ข้อมูลพื้นฐาน
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ชื่อทุนการศึกษา *
                    </label>
                    <Input
                      {...register('scholarship_name', { required: 'กรุณากรอกชื่อทุนการศึกษา' })}
                      placeholder="เช่น ทุนพัฒนาศักยภาพนักศึกษาดีเด่น"
                      error={errors.scholarship_name?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ประเภททุน *
                    </label>
                    <Select
                      {...register('scholarship_type', { required: 'กรุณาเลือกประเภททุน' })}
                      options={scholarshipTypes}
                      error={errors.scholarship_type?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      จำนวนเงิน (บาท) *
                    </label>
                    <Input
                      type="number"
                      {...register('amount', { 
                        required: 'กรุณากรอกจำนวนเงิน',
                        min: { value: 1, message: 'จำนวนเงินต้องมากกว่า 0' }
                      })}
                      placeholder="25000"
                      error={errors.amount?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      จำนวนทุน *
                    </label>
                    <Input
                      type="number"
                      {...register('total_quota', { 
                        required: 'กรุณากรอกจำนวนทุน',
                        min: { value: 1, message: 'จำนวนทุนต้องมากกว่า 0' }
                      })}
                      placeholder="10"
                      error={errors.total_quota?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ปีการศึกษา *
                    </label>
                    <Select
                      {...register('academic_year', { required: 'กรุณาเลือกปีการศึกษา' })}
                      options={academicYears}
                      error={errors.academic_year?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      ภาคการศึกษา
                    </label>
                    <Input
                      {...register('semester')}
                      placeholder="เช่น ภาคการศึกษาที่ 1"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Application Period */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                  ระยะเวลารับสมัคร
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      วันที่เริ่มรับสมัคร *
                    </label>
                    <Input
                      type="date"
                      {...register('application_start_date', { 
                        required: 'กรุณาเลือกวันที่เริ่มรับสมัคร'
                      })}
                      error={errors.application_start_date?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      วันที่สิ้นสุดการรับสมัคร *
                    </label>
                    <Input
                      type="date"
                      {...register('application_end_date', { 
                        required: 'กรุณาเลือกวันที่สิ้นสุดการรับสมัคร',
                        validate: (value) => {
                          const startDate = watch('application_start_date');
                          if (startDate && value) {
                            const start = new Date(startDate);
                            const end = new Date(value);
                            return end > start || 'วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มรับสมัคร';
                          }
                          return true;
                        }
                      })}
                      error={errors.application_end_date?.message}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('interview_required')}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-secondary-700 font-sarabun">
                      ต้องการสัมภาษณ์
                    </span>
                  </label>
                </div>
              </CardBody>
            </Card>

            {/* Requirements */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                  เงื่อนไขและเอกสาร
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      เงื่อนไขการสมัคร
                    </label>
                    <Textarea
                      {...register('eligibility_criteria')}
                      rows={4}
                      placeholder="เช่น เป็นนักศึกษาระดับปริญญาตรี มีเกรดเฉลี่ยสะสมไม่ต่ำกว่า 3.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      เอกสารที่ต้องใช้
                    </label>
                    <Textarea
                      {...register('required_documents')}
                      rows={4}
                      placeholder="เช่น ใบสมัคร, ใบรายงานผลการเรียน, หนังสือรับรองรายได้ครอบครัว"
                    />
                    <p className="text-xs text-secondary-500 mt-1 font-sarabun">
                      แยกแต่ละเอกสารด้วยเครื่องหมายจุลภาค (,)
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(returnTo)}
                disabled={saving}
                className="font-sarabun"
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className="font-sarabun"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    บันทึกการแก้ไข
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render detail view (default mode)
  return (
    <div className="min-h-screen bg-secondary-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/scholarships')}
                className="font-sarabun"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                กลับ
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 font-sarabun">
                  รายละเอียดทุนการศึกษา
                </h1>
                <p className="text-secondary-600 font-sarabun">
                  ข้อมูลเชิงลึกและการจัดการทุนการศึกษา
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit} className="font-sarabun">
                <PencilIcon className="h-4 w-4 mr-1" />
                แก้ไข
              </Button>
              <Button variant="outline" size="sm" onClick={handleDuplicate} className="font-sarabun">
                <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                คัดลอก
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete} className="font-sarabun">
                <TrashIcon className="h-4 w-4 mr-1" />
                ลบ
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-300">
                    <AcademicCapIcon className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-secondary-900 font-sarabun">
                      {scholarship.scholarship_name}
                    </h2>
                    {getStatusBadge(scholarship.status)}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <BuildingLibraryIcon className="w-4 h-4 mr-1" />
                      {scholarship.source?.source_name || 'ไม่ระบุแหล่งทุน'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      ปีการศึกษา {scholarship.academic_year}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {getScholarshipType(scholarship.scholarship_type)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-secondary-600">
                      <BanknotesIcon className="h-5 w-5 mr-2 text-secondary-500" />
                      <span className="font-medium">จำนวนเงิน:</span>
                      <span className="ml-1 font-semibold text-secondary-900">
                        {formatCurrency(scholarship.amount)}
                      </span>
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <UsersIcon className="h-5 w-5 mr-2 text-secondary-500" />
                      <span className="font-medium">จำนวนทุน:</span>
                      <span className="ml-1 font-semibold text-secondary-900">
                        {scholarship.total_quota} ทุน
                      </span>
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <UsersIcon className="h-5 w-5 mr-2 text-secondary-500" />
                      <span className="font-medium">ทุนคงเหลือ:</span>
                      <span className="ml-1 font-semibold text-secondary-900">
                        {scholarship.available_quota} ทุน
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                การจัดการสถานะ
              </h3>
              <div className="flex flex-wrap gap-3">
                {scholarship.status === 'draft' && (
                  <Button variant="success" onClick={handlePublish} className="font-sarabun">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    เผยแพร่ทุนการศึกษา
                  </Button>
                )}
                {scholarship.status === 'pending' && (
                  <Button variant="warning" onClick={handleSuspend} className="font-sarabun">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                    ระงับทุนการศึกษา
                  </Button>
                )}
                {scholarship.status === 'open' && (
                  <Button variant="warning" onClick={handleClose} className="font-sarabun">
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    ปิดรับสมัคร
                  </Button>
                )}
                {(scholarship.status === 'open' || scholarship.status === 'closed') && (
                  <Button variant="warning" onClick={handleSuspend} className="font-sarabun">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                    ระงับทุนการศึกษา
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Period */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                  ระยะเวลารับสมัคร
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-secondary-700">วันที่เริ่มรับสมัคร:</span>
                    <p className="text-secondary-900 font-sarabun">
                      {formatDate(scholarship.application_start_date)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-700">วันที่สิ้นสุดการรับสมัคร:</span>
                    <p className="text-secondary-900 font-sarabun">
                      {formatDate(scholarship.application_end_date)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-700">ภาคการศึกษา:</span>
                    <p className="text-secondary-900 font-sarabun">
                      {scholarship.semester || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-700">ต้องการสัมภาษณ์:</span>
                    <p className="text-secondary-900 font-sarabun">
                      {scholarship.interview_required ? 'ใช่' : 'ไม่ใช่'}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Source Information */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                  ข้อมูลแหล่งทุน
                </h3>
                {scholarship.source ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-secondary-700">ชื่อแหล่งทุน:</span>
                      <p className="text-secondary-900 font-sarabun">
                        {scholarship.source.source_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-secondary-700">ประเภทแหล่งทุน:</span>
                      <p className="text-secondary-900 font-sarabun">
                        {scholarship.source.source_type}
                      </p>
                    </div>
                    {scholarship.source.contact_person && (
                      <div>
                        <span className="text-sm font-medium text-secondary-700">ผู้ติดต่อ:</span>
                        <p className="text-secondary-900 font-sarabun">
                          {scholarship.source.contact_person}
                        </p>
                      </div>
                    )}
                    {scholarship.source.contact_email && (
                      <div>
                        <span className="text-sm font-medium text-secondary-700">อีเมล:</span>
                        <p className="text-secondary-900 font-sarabun">
                          {scholarship.source.contact_email}
                        </p>
                      </div>
                    )}
                    {scholarship.source.contact_phone && (
                      <div>
                        <span className="text-sm font-medium text-secondary-700">เบอร์โทร:</span>
                        <p className="text-secondary-900 font-sarabun">
                          {scholarship.source.contact_phone}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-secondary-600 font-sarabun">ไม่มีข้อมูลแหล่งทุน</p>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Eligibility Criteria */}
          {scholarship.eligibility_criteria && (
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                  เงื่อนไขการสมัคร
                </h3>
                <div className="prose max-w-none">
                  <p className="text-secondary-700 font-sarabun whitespace-pre-wrap">
                    {scholarship.eligibility_criteria}
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Required Documents */}
          {scholarship.required_documents && (
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                  เอกสารที่ต้องใช้
                </h3>
                <div className="prose max-w-none">
                  <p className="text-secondary-700 font-sarabun whitespace-pre-wrap">
                    {scholarship.required_documents}
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                ข้อมูลระบบ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-secondary-700 font-medium">วันที่สร้าง:</span>
                  <p className="text-secondary-900 font-sarabun">
                    {formatDate(scholarship.created_at)}
                  </p>
                </div>
                <div>
                  <span className="text-secondary-700 font-medium">แก้ไขล่าสุด:</span>
                  <p className="text-secondary-900 font-sarabun">
                    {formatDate(scholarship.updated_at)}
                  </p>
                </div>
                <div>
                  <span className="text-secondary-700 font-medium">ID ทุนการศึกษา:</span>
                  <p className="text-secondary-900 font-sarabun">
                    {scholarship.scholarship_id}
                  </p>
                </div>
                <div>
                  <span className="text-secondary-700 font-medium">สถานะการใช้งาน:</span>
                  <p className="text-secondary-900 font-sarabun">
                    {scholarship.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetailPage; 