'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  StarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface InterviewFormProps {
  step: number;
  interviewId: string;
  data: any;
  onDataUpdate: (data: any) => void;
  onNextStep: () => void;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ 
  step, 
  interviewId, 
  data, 
  onDataUpdate, 
  onNextStep 
}) => {
  const [scores, setScores] = useState(data.scores || {});
  const [notes, setNotes] = useState(data.notes || '');
  const [recommendation, setRecommendation] = useState(data.recommendation || '');

  const evaluationCriteria = [
    { key: 'academic', label: 'ความรู้วิชาการ', weight: 25 },
    { key: 'communication', label: 'ทักษะการสื่อสาร', weight: 20 },
    { key: 'leadership', label: 'ภาวะผู้นำ', weight: 15 },
    { key: 'motivation', label: 'แรงจูงใจ', weight: 20 },
    { key: 'financial_need', label: 'ความต้องการทางการเงิน', weight: 20 }
  ];

  const handleScoreChange = (criterion: string, score: number) => {
    const newScores = { ...scores, [criterion]: score };
    setScores(newScores);
    onDataUpdate({ scores: newScores });
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    onDataUpdate({ notes: value });
  };

  const handleRecommendationChange = (value: string) => {
    setRecommendation(value);
    onDataUpdate({ recommendation: value });
  };

  const calculateTotalScore = () => {
    return evaluationCriteria.reduce((total, criterion) => {
      const score = scores[criterion.key] || 0;
      return total + (score * criterion.weight / 100);
    }, 0);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'การประเมินโดยนักศึกษา';
      case 2: return 'การประเมินโดยเจ้าหน้าที่';
      case 3: return 'การประเมินโดยอาจารย์ที่ปรึกษา';
      default: return 'การประเมิน';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'ให้นักศึกษาแนะนำตัวและอธิบายเหตุผลในการขอทุน';
      case 2: return 'ตรวจสอบเอกสารและประเมินคุณสมบัติเบื้องต้น';
      case 3: return 'ประเมินความเหมาะสมและให้คำแนะนำ';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900">
            {getStepTitle()}
          </CardTitle>
          <p className="text-sm text-secondary-600 font-sarabun mt-1">
            {getStepDescription()}
          </p>
        </CardHeader>
      </Card>

      {/* Evaluation Criteria */}
      <Card>
        <CardHeader className="border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
            เกณฑ์การประเมิน
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <div className="space-y-6">
            {evaluationCriteria.map((criterion) => (
              <div key={criterion.key} className="border-b border-secondary-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-secondary-900 font-sarabun">
                      {criterion.label}
                    </h4>
                    <p className="text-sm text-secondary-500 font-sarabun">
                      น้ำหนัก {criterion.weight}%
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-secondary-900 font-sarabun">
                      {scores[criterion.key] || 0}
                    </span>
                    <span className="text-sm text-secondary-500">/10</span>
                  </div>
                </div>

                {/* Score Buttons */}
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleScoreChange(criterion.key, score)}
                      className={`
                        w-8 h-8 rounded-full text-sm font-semibold transition-all
                        ${scores[criterion.key] === score
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                        }
                      `}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Total Score */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900 font-sarabun">คะแนนรวม</span>
                <span className="text-2xl font-bold text-blue-900 font-sarabun">
                  {calculateTotalScore().toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 text-green-500 mr-2" />
            บันทึกการสัมภาษณ์
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="บันทึกรายละเอียดการสัมภาษณ์ ความประทับใจ และข้อสังเกต..."
            className="w-full h-32 p-3 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sarabun"
          />
        </CardBody>
      </Card>

      {/* Recommendation */}
      <Card>
        <CardHeader className="border-b border-secondary-200">
          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-2" />
            คำแนะนำ
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <div className="space-y-3">
            {['highly_recommended', 'recommended', 'not_recommended'].map((value) => (
              <label key={value} className="flex items-center">
                <input
                  type="radio"
                  name="recommendation"
                  value={value}
                  checked={recommendation === value}
                  onChange={(e) => handleRecommendationChange(e.target.value)}
                  className="mr-3"
                />
                <span className="font-sarabun">
                  {value === 'highly_recommended' && 'แนะนำอย่างยิ่ง'}
                  {value === 'recommended' && 'แนะนำ'}
                  {value === 'not_recommended' && 'ไม่แนะนำ'}
                </span>
              </label>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="font-sarabun">
          บันทึกร่าง
        </Button>
        <Button 
          variant="primary" 
          onClick={onNextStep}
          className="font-sarabun"
        >
          ขั้นตอนถัดไป
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default InterviewForm;
