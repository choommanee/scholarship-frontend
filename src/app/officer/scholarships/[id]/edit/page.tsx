'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';

interface ScholarshipFormData {
  name: string;
  description: string;
  type: string;
  amount: number;
  maxRecipients: number;
  applicationDeadline: string;
  academicYear: string;
  provider: string;
  totalBudget: number;
  requirements: string[];
  documentsRequired: string[];
  isActive: boolean;
  status: 'draft' | 'open' | 'closed' | 'suspended';
}

export default function EditScholarshipPage() {
  const params = useParams();
  const router = useRouter();
  const { toasts, removeToast, success, error, warning } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Mock data - ในระบบจริงจะดึงข้อมูลจาก API
  const [formData, setFormData] = useState<ScholarshipFormData>({
    name: 'ทุนพัฒนาศักยภาพนักศึกษา',
    description: 'ทุนการศึกษาสำหรับนักศึกษาที่มีผลการเรียนดีและต้องการพัฒนาทักษะในด้านต่างๆ มุ่งเน้นการพัฒนาความเป็นผู้นำและการทำงานเป็นทีม',
    type: 'development',
    amount: 20000,
    maxRecipients: 100,
    applicationDeadline: '2024-12-31',
    academicYear: '2567',
    provider: 'คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
    totalBudget: 2000000,
    requirements: [
      'เกรดเฉลีย์ ≥ 3.00',
      'ไม่เคยได้ทุนประเภทนี้มาก่อน',
      'มีผลงานหรือกิจกรรมเสริมหลักสูตร'
    ],
    documentsRequired: [
      'ใบแสดงผลการเรียน (Transcript)',
      'หนังสือรับรองรายได้ครอบครัว',
      'สำเนาบัตรประชาชน'
    ],
    isActive: true,
    status: 'open'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const typeOptions = [
    { value: 'academic', label: 'ทุนเรียนดี' },
    { value: 'financial_aid', label: 'ทุนช่วยเหลือ' },
    { value: 'research', label: 'ทุนวิจัย' },
    { value: 'development', label: 'ทุนพัฒนาศักยภาพ' },
    { value: 'activity', label: 'ทุนกิจกรรม' },
    { value: 'excellence', label: 'ทุนความเป็นเลิศ' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'ร่าง' },
    { value: 'open', label: 'เปิดรับสมัคร' },
    { value: 'closed', label: 'ปิดรับสมัคร' },
    { value: 'suspended', label: 'ระงับชั่วคราว' }
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อทุนการศึกษา';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'กรุณากรอกคำอธิบาย';
    }

    if (!formData.type) {
      newErrors.type = 'กรุณาเลือกประเภททุน';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'จำนวนเงินต้องมากกว่า 0';
    }

    if (formData.maxRecipients <= 0) {
      newErrors.maxRecipients = 'จำนวนผู้รับทุนต้องมากกว่า 0';
    }

    if (formData.totalBudget <= 0) {
      newErrors.totalBudget = 'งบประมาณรวมต้องมากกว่า 0';
    }

    if (formData.totalBudget < formData.amount * formData.maxRecipients) {
      newErrors.totalBudget = 'งบประมาณรวมไม่เพียงพอสำหรับจำนวนผู้รับทุน';
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = 'กรุณาเลือกกำหนดปิดรับสมัคร';
    }

    if (formData.requirements.filter(r => r.trim()).length === 0) {
      newErrors.requirements = 'กรุณาระบุคุณสมบัติอย่างน้อย 1 ข้อ';
    }

    if (formData.documentsRequired.filter(d => d.trim()).length === 0) {
      newErrors.documentsRequired = 'กรุณาระบุเอกสารที่ต้องใช้อย่างน้อย 1 รายการ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (saveAsDraft: boolean = false) => {
    if (!validate()) {
      error('ข้อมูลไม่ครบถ้วน', 'กรุณาตรวจสอบข้อมูลที่กรอก');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (saveAsDraft) {
        success('บันทึกร่างสำเร็จ', 'บันทึกทุนการศึกษาเป็นร่างแล้ว');
      } else {
        success('บันทึกสำเร็จ', 'บันทึกข้อมูลทุนการศึกษาแล้ว');
      }

      setTimeout(() => {
        router.push(`/officer/scholarships/${params.id}`);
      }, 1000);
    } catch (err) {
      error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setIsSaving(false);
    }
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({
      ...formData,
      requirements: newRequirements
    });
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      documentsRequired: [...formData.documentsRequired, '']
    });
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documentsRequired: formData.documentsRequired.filter((_, i) => i !== index)
    });
  };

  const updateDocument = (index: number, value: string) => {
    const newDocuments = [...formData.documentsRequired];
    newDocuments[index] = value;
    setFormData({
      ...formData,
      documentsRequired: newDocuments
    });
  };

  return (
    <div>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 font-sarabun">
              แก้ไขทุนการศึกษา
            </h1>
            <p className="text-gray-600 font-sarabun mt-1">
              ID: {params.id}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isSaving}
              className="font-sarabun"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              ยกเลิก
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="font-sarabun"
            >
              บันทึกร่าง
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="font-sarabun"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun">ข้อมูลพื้นฐาน</CardTitle>
            </CardHeader>
            <CardBody className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  ชื่อทุนการศึกษา <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น ทุนพัฒนาศักยภาพนักศึกษา"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  คำอธิบาย <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="อธิบายรายละเอียดและวัตถุประสงค์ของทุนการศึกษา"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                    ประเภททุน <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun ${
                      errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">เลือกประเภท</option>
                    {typeOptions.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                    สถานะ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  ผู้สนับสนุน
                </label>
                <Input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="เช่น คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                    ปีการศึกษา
                  </label>
                  <Input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="2567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                    กำหนดปิดรับสมัคร <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun ${
                      errors.applicationDeadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.applicationDeadline && (
                    <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.applicationDeadline}</p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Budget and Quota */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun">งบประมาณและจำนวน</CardTitle>
            </CardHeader>
            <CardBody className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                    จำนวนเงิน (บาท/คน) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                    placeholder="20000"
                    className={errors.amount ? 'border-red-500' : ''}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                    จำนวนผู้รับทุน <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.maxRecipients}
                    onChange={(e) => setFormData({ ...formData, maxRecipients: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                    className={errors.maxRecipients ? 'border-red-500' : ''}
                  />
                  {errors.maxRecipients && (
                    <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.maxRecipients}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                    งบประมาณรวม (บาท) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.totalBudget}
                    onChange={(e) => setFormData({ ...formData, totalBudget: parseInt(e.target.value) || 0 })}
                    placeholder="2000000"
                    className={errors.totalBudget ? 'border-red-500' : ''}
                  />
                  {errors.totalBudget && (
                    <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.totalBudget}</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700 font-sarabun">
                    <p className="font-medium mb-1">งบประมาณที่ต้องใช้</p>
                    <p>
                      {formData.amount.toLocaleString()} บาท × {formData.maxRecipients} คน = {' '}
                      <strong>{(formData.amount * formData.maxRecipients).toLocaleString()} บาท</strong>
                    </p>
                    {formData.totalBudget > 0 && (
                      <p className="mt-1">
                        คงเหลือ: <strong>{(formData.totalBudget - (formData.amount * formData.maxRecipients)).toLocaleString()} บาท</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="font-sarabun">คุณสมบัติผู้สมัคร</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                  className="font-sarabun"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  เพิ่มคุณสมบัติ
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-6 space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder={`คุณสมบัติข้อที่ ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      onClick={() => removeRequirement(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              {errors.requirements && (
                <p className="text-sm text-red-600 font-sarabun">{errors.requirements}</p>
              )}
            </CardBody>
          </Card>

          {/* Required Documents */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="font-sarabun">เอกสารประกอบการสมัคร</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addDocument}
                  className="font-sarabun"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  เพิ่มเอกสาร
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-6 space-y-3">
              {formData.documentsRequired.map((doc, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={doc}
                    onChange={(e) => updateDocument(index, e.target.value)}
                    placeholder={`เอกสารที่ ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.documentsRequired.length > 1 && (
                    <button
                      onClick={() => removeDocument(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              {errors.documentsRequired && (
                <p className="text-sm text-red-600 font-sarabun">{errors.documentsRequired}</p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="font-sarabun">การเผยแพร่</CardTitle>
            </CardHeader>
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 font-sarabun">เปิดใช้งาน</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <p className="text-xs text-gray-500 font-sarabun">
                {formData.isActive
                  ? 'ทุนนี้จะแสดงในระบบและนักศึกษาสามารถสมัครได้'
                  : 'ทุนนี้จะไม่แสดงในระบบและนักศึกษาไม่สามารถสมัครได้'}
              </p>
            </CardBody>
          </Card>

          {/* Help */}
          <Card className="bg-blue-50 border-blue-200">
            <CardBody className="p-6">
              <div className="flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 font-sarabun mb-2">
                    คำแนะนำ
                  </h3>
                  <ul className="text-xs text-blue-700 font-sarabun space-y-1">
                    <li>• ระบุคุณสมบัติให้ชัดเจนและเฉพาะเจาะจง</li>
                    <li>• ตรวจสอบงบประมาณให้เพียงพอ</li>
                    <li>• กำหนดวันปิดรับสมัครให้เหมาะสม</li>
                    <li>• ระบุเอกสารที่ต้องใช้อย่างครบถ้วน</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
