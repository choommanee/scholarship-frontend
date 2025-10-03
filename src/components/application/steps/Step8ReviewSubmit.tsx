'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CheckCircleIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  DocumentCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

export interface ReviewData {
  personalInfo: any;
  addressInfo: any;
  educationHistory: any;
  familyInfo: any;
  financialInfo: any;
  activitiesSkills: any;
  documents: any[];
}

export interface Step8ReviewSubmitProps {
  data: ReviewData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  completedSteps: number[];
}

export function Step8ReviewSubmit({
  data,
  onEdit,
  onSubmit,
  isSubmitting,
  completedSteps
}: Step8ReviewSubmitProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const canSubmit = termsAccepted && declarationAccepted && completedSteps.length >= 7;

  const sections = [
    {
      step: 1,
      title: 'ข้อมูลส่วนตัว',
      icon: '👤',
      data: data.personalInfo,
      fields: [
        { label: 'ชื่อ-นามสกุล (ไทย)', value: `${data.personalInfo?.prefix_th || ''} ${data.personalInfo?.first_name_th || ''} ${data.personalInfo?.last_name_th || ''}` },
        { label: 'ชื่อ-นามสกุล (อังกฤษ)', value: `${data.personalInfo?.prefix_en || ''} ${data.personalInfo?.first_name_en || ''} ${data.personalInfo?.last_name_en || ''}` },
        { label: 'เลขบัตรประชาชน', value: data.personalInfo?.citizen_id },
        { label: 'อีเมล', value: data.personalInfo?.email },
        { label: 'เบอร์โทรศัพท์', value: data.personalInfo?.phone },
        { label: 'รหัสนักศึกษา', value: data.personalInfo?.student_id },
        { label: 'คณะ / สาขา', value: `${data.personalInfo?.faculty || ''} / ${data.personalInfo?.department || ''}` },
        { label: 'ชั้นปี', value: `ปี ${data.personalInfo?.year_level || ''}` }
      ]
    },
    {
      step: 2,
      title: 'ข้อมูลที่อยู่',
      icon: '🏠',
      data: data.addressInfo,
      fields: [
        { label: 'ที่อยู่ปัจจุบัน', value: formatAddress(data.addressInfo?.current_address) },
        { label: 'ที่อยู่ตามทะเบียนบ้าน', value: data.addressInfo?.same_as_current ? 'เหมือนที่อยู่ปัจจุบัน' : formatAddress(data.addressInfo?.permanent_address) }
      ]
    },
    {
      step: 3,
      title: 'ประวัติการศึกษา',
      icon: '🎓',
      data: data.educationHistory,
      fields: [
        { label: 'จำนวนประวัติการศึกษา', value: `${data.educationHistory?.education_records?.length || 0} รายการ` }
      ]
    },
    {
      step: 4,
      title: 'ข้อมูลครอบครัว',
      icon: '👨‍👩‍👧‍👦',
      data: data.familyInfo,
      fields: [
        { label: 'ปัจจุบันอาศัยอยู่กับ', value: data.familyInfo?.living_with },
        { label: 'สถานะบิดา', value: data.familyInfo?.father?.living_status },
        { label: 'สถานะมารดา', value: data.familyInfo?.mother?.living_status },
        { label: 'จำนวนพี่น้อง', value: `${data.familyInfo?.siblings?.length || 0} คน` }
      ]
    },
    {
      step: 5,
      title: 'ข้อมูลทางการเงิน',
      icon: '💰',
      data: data.financialInfo,
      fields: [
        { label: 'รายได้ครอบครัว/เดือน', value: `${parseFloat(data.financialInfo?.family_income || 0).toLocaleString()} บาท` },
        { label: 'ค่าใช้จ่าย/เดือน', value: `${parseFloat(data.financialInfo?.monthly_expenses || 0).toLocaleString()} บาท` },
        { label: 'รายได้ต่อหัว/เดือน', value: `${parseFloat(data.financialInfo?.income_per_member || 0).toLocaleString()} บาท` },
        { label: 'หนี้สิน', value: `${parseFloat(data.financialInfo?.debt_amount || 0).toLocaleString()} บาท` },
        { label: 'ประเภทที่อยู่อาศัย', value: data.financialInfo?.house_type },
        { label: 'สถานะความเป็นเจ้าของ', value: data.financialInfo?.house_ownership }
      ]
    },
    {
      step: 6,
      title: 'กิจกรรมและทักษะ',
      icon: '⭐',
      data: data.activitiesSkills,
      fields: [
        { label: 'ทุนที่เคยได้รับ', value: `${data.activitiesSkills?.scholarship_history?.length || 0} รายการ` },
        { label: 'กิจกรรม/ผลงาน', value: `${data.activitiesSkills?.activities?.length || 0} รายการ` },
        { label: 'บุคคลอ้างอิง', value: data.activitiesSkills?.reference_person?.first_name ? `${data.activitiesSkills.reference_person.title} ${data.activitiesSkills.reference_person.first_name} ${data.activitiesSkills.reference_person.last_name}` : '-' }
      ]
    },
    {
      step: 7,
      title: 'เอกสารประกอบ',
      icon: '📄',
      data: data.documents,
      fields: [
        { label: 'จำนวนเอกสาร', value: `${data.documents?.length || 0} ไฟล์` }
      ]
    }
  ];

  function formatAddress(address: any): string {
    if (!address) return '-';
    const parts = [
      address.house_number && `เลขที่ ${address.house_number}`,
      address.village_number && `หมู่ ${address.village_number}`,
      address.alley && address.alley,
      address.road && address.road,
      address.subdistrict && `ต.${address.subdistrict}`,
      address.district && `อ.${address.district}`,
      address.province && `จ.${address.province}`,
      address.postal_code
    ].filter(Boolean);
    return parts.join(' ');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardBody>
          <div className="text-center py-6">
            <DocumentCheckIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ตรวจสอบและส่งใบสมัคร
            </h2>
            <p className="text-gray-600">
              กรุณาตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนส่งใบสมัคร
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Completion Status */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">สถานะความสมบูรณ์</h3>
              <p className="text-sm text-gray-600 mt-1">
                กรอกข้อมูลครบ {completedSteps.length} จาก 7 ส่วน
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">
                {Math.round((completedSteps.length / 7) * 100)}%
              </div>
              <p className="text-xs text-gray-500">ความสมบูรณ์</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-600 to-primary-700 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / 7) * 100}%` }}
              />
            </div>
          </div>

          {completedSteps.length < 7 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="ml-2 text-sm text-yellow-800">
                  ยังมีข้อมูลบางส่วนที่ยังไม่สมบูรณ์ กรุณากรอกให้ครบถ้วนก่อนส่งใบสมัคร
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Review Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const isComplete = completedSteps.includes(section.step);

          return (
            <Card key={section.step}>
              <CardHeader className={cn(
                'flex flex-row items-center justify-between',
                !isComplete && 'bg-yellow-50'
              )}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    {!isComplete && (
                      <p className="text-xs text-yellow-700 mt-1">ยังไม่สมบูรณ์</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isComplete ? (
                    <Badge color="success">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      ครบถ้วน
                    </Badge>
                  ) : (
                    <Badge color="warning">
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                      ไม่ครบ
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(section.step)}
                    leftIcon={<PencilIcon className="h-4 w-4" />}
                  >
                    แก้ไข
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.fields.map((field, index) => (
                    <div key={index}>
                      <dt className="text-xs font-medium text-gray-500">{field.label}</dt>
                      <dd className="text-sm text-gray-900 mt-1">{field.value || '-'}</dd>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Terms and Conditions */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">เงื่อนไขและข้อตกลง</h3>

          <div className="space-y-4">
            {/* Terms Checkbox */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                  <strong>ข้าพเจ้ายอมรับเงื่อนไขและข้อกำหนด</strong> ของการสมัครทุนการศึกษา
                  โดยได้อ่านและเข้าใจเงื่อนไขทั้งหมดแล้ว
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs max-h-40 overflow-y-auto">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ข้าพเจ้ารับทราบว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ</li>
                      <li>ข้าพเจ้าจะรักษาผลการเรียนให้เป็นไปตามเงื่อนไขทุน (GPA ≥ 2.50)</li>
                      <li>ข้าพเจ้าจะปฏิบัติตามเงื่อนไขและข้อกำหนดของทุนอย่างเคร่งครัด</li>
                      <li>หากพบว่าข้อมูลเป็นเท็จ ข้าพเจ้ายินยอมให้ยกเลิกทุนทันที</li>
                      <li>ข้าพเจ้ายินยอมให้ตรวจสอบข้อมูลและเอกสารทั้งหมด</li>
                    </ul>
                  </div>
                </label>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="declaration" className="ml-3 text-sm text-gray-700">
                  <strong>คำรับรอง</strong> ข้าพเจ้าขอรับรองว่า:
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ข้อมูลทั้งหมดที่ให้ไว้เป็นความจริงและถูกต้อง</li>
                      <li>เอกสารทั้งหมดเป็นของแท้และไม่ได้ปลอมแปลง</li>
                      <li>ข้าพเจ้าไม่ได้รับทุนซ้ำซ้อนจากแหล่งอื่น (หรือได้แจ้งไว้แล้ว)</li>
                      <li>ข้าพเจ้าตกลงรับผลการพิจารณาของคณะกรรมการ</li>
                    </ul>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {!canSubmit && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="ml-2 text-sm text-red-800">
                  <p className="font-medium">ไม่สามารถส่งใบสมัครได้</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {!termsAccepted && <li>กรุณายอมรับเงื่อนไขและข้อกำหนด</li>}
                    {!declarationAccepted && <li>กรุณายอมรับคำรับรอง</li>}
                    {completedSteps.length < 7 && <li>กรุณากรอกข้อมูลให้ครบถ้วนทุกส่วน</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Estimated Processing Time */}
      <Card>
        <CardBody>
          <div className="flex items-start space-x-3">
            <ClockIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-md font-semibold text-gray-900">ระยะเวลาการพิจารณา</h3>
              <p className="text-sm text-gray-600 mt-1">
                หลังจากส่งใบสมัคร ระบบจะตรวจสอบเอกสารภายใน <strong>3-5 วันทำการ</strong>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                หากมีการนัดสัมภาษณ์ ท่านจะได้รับการแจ้งผ่านอีเมลและระบบ ภายใน <strong>7 วันทำการ</strong>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                ผลการพิจารณาจะประกาศภายใน <strong>30 วันทำการ</strong> หลังจากส่งใบสมัคร
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Important Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              <strong>คำเตือน:</strong> เมื่อกดปุ่ม "ส่งใบสมัคร" แล้ว จะไม่สามารถแก้ไขข้อมูลได้อีก
              กรุณาตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนส่ง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
