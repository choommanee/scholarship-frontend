'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { scholarshipService } from '@/services/scholarship.service';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface CreateScholarshipForm {
  source_id: number;
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

const CreateScholarshipPage: React.FC = () => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CreateScholarshipForm>({
    defaultValues: {
      source_id: 1, // Default to faculty source
      interview_required: false
    }
  });

  const onSubmit = async (data: CreateScholarshipForm) => {
    try {
      setSaving(true);
      setError(null);

      // Prepare API data
      const createData = {
        source_id: data.source_id,
        scholarship_name: data.scholarship_name,
        scholarship_type: data.scholarship_type,
        amount: data.amount,
        total_quota: data.total_quota,
        academic_year: data.academic_year,
        semester: data.semester,
        eligibility_criteria: data.eligibility_criteria,
        required_documents: data.required_documents,
        application_start_date: new Date(data.application_start_date).toISOString(),
        application_end_date: new Date(data.application_end_date + 'T23:59:59').toISOString(),
        interview_required: data.interview_required
      };

      // Call scholarship service to create scholarship
      await scholarshipService.createScholarship({
        name: createData.scholarship_name,
        description: createData.eligibility_criteria || '',
        type: createData.scholarship_type,
        amount: createData.amount,
        maxRecipients: createData.total_quota,
        applicationDeadline: createData.application_end_date,
        academicYear: createData.academic_year,
        requirements: createData.eligibility_criteria ? [createData.eligibility_criteria] : [],
        documentsRequired: createData.required_documents ? createData.required_documents.split(',').map(doc => doc.trim()) : [],
        provider: 'คณะเศรษฐศาสตร์',
        totalBudget: createData.amount * createData.total_quota
      });

      alert('สร้างทุนการศึกษาเรียบร้อยแล้ว');
      router.push('/admin/scholarships');
    } catch (error) {
      console.error('Create scholarship error:', error);
      setError('ไม่สามารถสร้างทุนการศึกษาได้');
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

  const scholarshipSources = [
    { value: 1, label: 'คณะเศรษฐศาสตร์' },
    { value: 2, label: 'คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์' },
    { value: 3, label: 'องค์กรภายนอก' },
    { value: 4, label: 'มูลนิธิ' }
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
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
                สร้างทุนการศึกษาใหม่
              </h1>
              <p className="text-secondary-600 font-sarabun">
                กรอกข้อมูลเพื่อสร้างทุนการศึกษาใหม่ในระบบ
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                ข้อมูลพื้นฐาน
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                    แหล่งทุน *
                  </label>
                  <Select
                    {...register('source_id', { 
                      required: 'กรุณาเลือกแหล่งทุน',
                      valueAsNumber: true 
                    })}
                    options={scholarshipSources}
                    error={errors.source_id?.message}
                  />
                </div>
                <div className="md:col-span-2">
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
                    จำนวนเงิน (บาท) *
                  </label>
                  <Input
                    type="number"
                    {...register('amount', { 
                      required: 'กรุณากรอกจำนวนเงิน',
                      min: { value: 1, message: 'จำนวนเงินต้องมากกว่า 0' },
                      valueAsNumber: true
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
                      min: { value: 1, message: 'จำนวนทุนต้องมากกว่า 0' },
                      valueAsNumber: true
                    })}
                    placeholder="10"
                    error={errors.total_quota?.message}
                  />
                </div>
                <div className="md:col-span-2">
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
                    {...register('application_start_date', { required: 'กรุณาเลือกวันที่เริ่มรับสมัคร' })}
                    error={errors.application_start_date?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                    วันที่สิ้นสุดการรับสมัคร *
                  </label>
                  <Input
                    type="date"
                    {...register('application_end_date', { required: 'กรุณาเลือกวันที่สิ้นสุดการรับสมัคร' })}
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
                  <p className="text-xs text-secondary-500 mt-1 font-sarabun">
                    ระบุเงื่อนไขการสมัครที่นักศึกษาต้องมีคุณสมบัติ
                  </p>
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
              onClick={() => router.push('/admin/scholarships')}
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
                  กำลังสร้าง...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  สร้างทุนการศึกษา
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScholarshipPage; 