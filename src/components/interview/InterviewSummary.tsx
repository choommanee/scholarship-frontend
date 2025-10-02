'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircleIcon,
  DocumentTextIcon,
  StarIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
  PrinterIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface InterviewSummaryProps {
  interviewId: string;
  data: any;
  onSubmit: () => void;
}

const InterviewSummary: React.FC<InterviewSummaryProps> = ({ 
  interviewId, 
  data, 
  onSubmit 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const evaluationCriteria = [
    { key: 'academic', label: 'ความรู้วิชาการ', weight: 25 },
    { key: 'communication', label: 'ทักษะการสื่อสาร', weight: 20 },
    { key: 'leadership', label: 'ภาวะผู้นำ', weight: 15 },
    { key: 'motivation', label: 'แรงจูงใจ', weight: 20 },
    { key: 'financial_need', label: 'ความต้องการทางการเงิน', weight: 20 }
  ];

  const calculateTotalScore = () => {
    if (!data.scores) return 0;
    return evaluationCriteria.reduce((total, criterion) => {
      const score = data.scores[criterion.key] || 0;
      return total + (score * criterion.weight / 100);
    }, 0);
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'highly_recommended': return 'แนะนำอย่างยิ่ง';
      case 'recommended': return 'แนะนำ';
      case 'not_recommended': return 'ไม่แนะนำ';
      default: return 'ไม่ระบุ';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'highly_recommended': return 'text-green-600 bg-green-50';
      case 'recommended': return 'text-blue-600 bg-blue-50';
      case 'not_recommended': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit();
      setIsSubmitting(false);
    }, 2000);
  };

  const totalScore = calculateTotalScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
            <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-500 mr-2" />
            สรุปผลการสัมภาษณ์
          </CardTitle>
          <p className="text-sm text-secondary-600 font-sarabun mt-1">
            ตรวจสอบและยืนยันผลการประเมินก่อนส่ง
          </p>
        </CardHeader>
      </Card>

      {/* Student Summary */}
      {data.studentInfo && (
        <Card>
          <CardHeader className="border-b border-secondary-200">
            <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
              <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
              ข้อมูลนักศึกษา
            </CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500 font-sarabun">ชื่อ-นามสกุล</p>
                <p className="font-semibold text-secondary-900 font-sarabun">
                  {data.studentInfo.firstName} {data.studentInfo.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 font-sarabun">รหัสนักศึกษา</p>
                <p className="font-semibold text-secondary-900 font-sarabun">
                  {data.studentInfo.studentId}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 font-sarabun">คณะ</p>
                <p className="font-semibold text-secondary-900 font-sarabun">
                  {data.studentInfo.faculty}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 font-sarabun">ทุนที่สมัคร</p>
                <p className="font-semibold text-secondary-900 font-sarabun">
                  {data.studentInfo.scholarshipName}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Score Summary */}
      <Card>
        <CardHeader className="border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
            สรุปคะแนนการประเมิน
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <div className="space-y-4">
            {evaluationCriteria.map((criterion) => (
              <div key={criterion.key} className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-b-0">
                <div>
                  <span className="font-medium text-secondary-900 font-sarabun">
                    {criterion.label}
                  </span>
                  <span className="text-sm text-secondary-500 ml-2">
                    (น้ำหนัก {criterion.weight}%)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-secondary-900 font-sarabun">
                    {data.scores?.[criterion.key] || 0}
                  </span>
                  <span className="text-sm text-secondary-500">/10</span>
                </div>
              </div>
            ))}

            {/* Total Score */}
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-blue-900 font-sarabun">
                  คะแนนรวมถ่วงน้ำหนัก
                </span>
                <span className="text-3xl font-bold text-blue-900 font-sarabun">
                  {totalScore.toFixed(1)}/10
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(totalScore / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Notes */}
      {data.notes && (
        <Card>
          <CardHeader className="border-b border-secondary-200">
            <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-green-500 mr-2" />
              บันทึกการสัมภาษณ์
            </CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-secondary-700 font-sarabun leading-relaxed">
                {data.notes}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Recommendation */}
      <Card>
        <CardHeader className="border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-2" />
            คำแนะนำสุดท้าย
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <div className="text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold font-sarabun ${getRecommendationColor(data.recommendation)}`}>
              <CheckCircleIcon className="w-6 h-6 mr-2" />
              {getRecommendationText(data.recommendation)}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Interview Details */}
      <Card>
        <CardHeader className="border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900">
            รายละเอียดการสัมภาษณ์
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-secondary-500 font-sarabun">วันที่สัมภาษณ์</p>
              <p className="font-semibold text-secondary-900 font-sarabun">
                {new Date().toLocaleDateString('th-TH')}
              </p>
            </div>
            <div>
              <p className="text-secondary-500 font-sarabun">เวลา</p>
              <p className="font-semibold text-secondary-900 font-sarabun">
                {new Date().toLocaleTimeString('th-TH', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <div>
              <p className="text-secondary-500 font-sarabun">ผู้สัมภาษณ์</p>
              <p className="font-semibold text-secondary-900 font-sarabun">
                ผศ.ดร. สมปอง วิชาการดี
              </p>
            </div>
            <div>
              <p className="text-secondary-500 font-sarabun">รหัสการสัมภาษณ์</p>
              <p className="font-semibold text-secondary-900 font-sarabun">
                {interviewId}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" className="font-sarabun">
          <PrinterIcon className="w-4 h-4 mr-2" />
          พิมพ์รายงาน
        </Button>
        
        <div className="flex space-x-4">
          <Button variant="outline" className="font-sarabun">
            บันทึกร่าง
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="font-sarabun"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                กำลังส่ง...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                ส่งผลการประเมิน
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSummary;
