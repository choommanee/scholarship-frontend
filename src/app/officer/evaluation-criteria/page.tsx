'use client';

import { useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentMagnifyingGlassIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  FireIcon,
  BanknotesIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';

interface ScoreRange {
  range: string;
  description: string;
  examples: string[];
}

interface EvaluationCriterion {
  id: string;
  name: string;
  weight: number;
  description: string;
  scoreRanges: ScoreRange[];
  tips: string[];
}

interface ScholarshipCriteria {
  id: string;
  scholarship_id: number;
  scholarshipName: string;
  description: string;
  criteria: EvaluationCriterion[];
  generalGuidelines: string[];
  scoringNotes: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CriterionFormData {
  name: string;
  weight: number;
  description: string;
  scoreRanges: ScoreRange[];
  tips: string[];
}

export default function OfficerEvaluationCriteriaPage() {
  const { toasts, removeToast, success, error, warning, info } = useToast();

  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showCriterionModal, setShowCriterionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<ScholarshipCriteria | null>(null);
  const [selectedCriterion, setSelectedCriterion] = useState<EvaluationCriterion | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [criteriaList, setCriteriaList] = useState<ScholarshipCriteria[]>([
    {
      id: 'CRIT001',
      scholarship_id: 1,
      scholarshipName: 'ทุนเรียนดี',
      description: 'เกณฑ์การประเมินสำหรับทุนเรียนดี',
      criteria: [
        {
          id: 'academic',
          name: 'ความรู้วิชาการ',
          weight: 30,
          description: 'ประเมินความรู้ในสาขาวิชา',
          scoreRanges: [
            { range: '9-10', description: 'ดีเยี่ยม', examples: ['มีความรู้ลึกซึ้ง'] },
            { range: '7-8', description: 'ดี', examples: ['มีความรู้พื้นฐานดี'] }
          ],
          tips: ['ถามเกี่ยวกับสาขาวิชา']
        }
      ],
      generalGuidelines: ['ใช้เวลา 30-45 นาที'],
      scoringNotes: ['ให้คะแนนอย่างเป็นธรรม'],
      is_active: true,
      created_at: '2024-10-01',
      updated_at: '2024-10-01'
    }
  ]);

  const [criteriaFormData, setCriteriaFormData] = useState({
    scholarship_id: 0,
    scholarshipName: '',
    description: '',
    generalGuidelines: [''],
    scoringNotes: ['']
  });

  const [criterionFormData, setCriterionFormData] = useState<CriterionFormData>({
    name: '',
    weight: 0,
    description: '',
    scoreRanges: [{ range: '', description: '', examples: [''] }],
    tips: ['']
  });

  // Handlers
  const handleCreateCriteria = () => {
    setIsEditMode(false);
    setCriteriaFormData({
      scholarship_id: 0,
      scholarshipName: '',
      description: '',
      generalGuidelines: [''],
      scoringNotes: ['']
    });
    setShowCriteriaModal(true);
    info('สร้างเกณฑ์การประเมินใหม่', 'กรอกข้อมูลเกณฑ์การประเมิน');
  };

  const handleEditCriteria = (criteria: ScholarshipCriteria) => {
    setIsEditMode(true);
    setSelectedCriteria(criteria);
    setCriteriaFormData({
      scholarship_id: criteria.scholarship_id,
      scholarshipName: criteria.scholarshipName,
      description: criteria.description,
      generalGuidelines: criteria.generalGuidelines,
      scoringNotes: criteria.scoringNotes
    });
    setShowCriteriaModal(true);
    info('แก้ไขเกณฑ์', `แก้ไขเกณฑ์สำหรับ ${criteria.scholarshipName}`);
  };

  const handleDeleteCriteria = (criteria: ScholarshipCriteria) => {
    setSelectedCriteria(criteria);
    setShowDeleteModal(true);
  };

  const handleAddCriterion = (criteriaId: string) => {
    const criteria = criteriaList.find(c => c.id === criteriaId);
    if (!criteria) return;

    setSelectedCriteria(criteria);
    setIsEditMode(false);
    setCriterionFormData({
      name: '',
      weight: 0,
      description: '',
      scoreRanges: [{ range: '', description: '', examples: [''] }],
      tips: ['']
    });
    setShowCriterionModal(true);
  };

  const handleEditCriterion = (criteriaId: string, criterion: EvaluationCriterion) => {
    const criteria = criteriaList.find(c => c.id === criteriaId);
    if (!criteria) return;

    setSelectedCriteria(criteria);
    setSelectedCriterion(criterion);
    setIsEditMode(true);
    setCriterionFormData({
      name: criterion.name,
      weight: criterion.weight,
      description: criterion.description,
      scoreRanges: criterion.scoreRanges,
      tips: criterion.tips
    });
    setShowCriterionModal(true);
  };

  const handleSaveCriteria = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isEditMode && selectedCriteria) {
      setCriteriaList(prev => prev.map(c =>
        c.id === selectedCriteria.id
          ? { ...c, ...criteriaFormData, updated_at: new Date().toISOString() }
          : c
      ));
      success('อัพเดทสำเร็จ', `อัพเดทเกณฑ์ ${criteriaFormData.scholarshipName} แล้ว`);
    } else {
      const newCriteria: ScholarshipCriteria = {
        id: `CRIT${(criteriaList.length + 1).toString().padStart(3, '0')}`,
        ...criteriaFormData,
        criteria: [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCriteriaList(prev => [...prev, newCriteria]);
      success('สร้างสำเร็จ', `สร้างเกณฑ์ ${criteriaFormData.scholarshipName} แล้ว`);
    }

    setIsProcessing(false);
    setShowCriteriaModal(false);
  };

  const handleSaveCriterion = async () => {
    if (!selectedCriteria) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCriteriaList(prev => prev.map(c => {
      if (c.id !== selectedCriteria.id) return c;

      if (isEditMode && selectedCriterion) {
        return {
          ...c,
          criteria: c.criteria.map(cr =>
            cr.id === selectedCriterion.id
              ? { ...cr, ...criterionFormData }
              : cr
          ),
          updated_at: new Date().toISOString()
        };
      } else {
        return {
          ...c,
          criteria: [
            ...c.criteria,
            {
              id: `crit_${Date.now()}`,
              ...criterionFormData
            }
          ],
          updated_at: new Date().toISOString()
        };
      }
    }));

    success(isEditMode ? 'อัพเดทสำเร็จ' : 'เพิ่มสำเร็จ', `${isEditMode ? 'อัพเดท' : 'เพิ่ม'}หัวข้อ ${criterionFormData.name} แล้ว`);
    setIsProcessing(false);
    setShowCriterionModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCriteria) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setCriteriaList(prev => prev.filter(c => c.id !== selectedCriteria.id));
    success('ลบสำเร็จ', `ลบเกณฑ์ ${selectedCriteria.scholarshipName} แล้ว`);
    setIsProcessing(false);
    setShowDeleteModal(false);
  };

  const addArrayField = (field: 'generalGuidelines' | 'scoringNotes', type: 'criteria' | 'criterion' = 'criteria') => {
    if (type === 'criteria') {
      setCriteriaFormData(prev => ({
        ...prev,
        [field]: [...prev[field], '']
      }));
    }
  };

  const removeArrayField = (field: 'generalGuidelines' | 'scoringNotes', index: number) => {
    setCriteriaFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (field: 'generalGuidelines' | 'scoringNotes', index: number, value: string) => {
    setCriteriaFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const getCriterionIcon = (criterionId: string) => {
    const icons: { [key: string]: any } = {
      academic: BookOpenIcon,
      communication: ChatBubbleLeftRightIcon,
      leadership: UserGroupIcon,
      motivation: FireIcon,
      financial_need: BanknotesIcon
    };
    return icons[criterionId] || StarIcon;
  };

  return (
    <div>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              จัดการเกณฑ์การประเมิน
            </h1>
            <p className="text-secondary-600 font-sarabun">
              สร้างและจัดการเกณฑ์การประเมินการสัมภาษณ์สำหรับแต่ละทุนการศึกษา
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleCreateCriteria}
            disabled={isProcessing}
            className="font-sarabun"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            สร้างเกณฑ์ใหม่
          </Button>
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-6">
        {criteriaList.map((criteria) => (
          <Card key={criteria.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <DocumentMagnifyingGlassIcon className="h-6 w-6 text-purple-600" />
                    <CardTitle className="text-xl font-sarabun">{criteria.scholarshipName}</CardTitle>
                    {criteria.is_active ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        ใช้งาน
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        ไม่ใช้งาน
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-sarabun">{criteria.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCriteria(criteria)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCriteria(criteria)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardBody className="p-6">
              {/* Criteria */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 font-sarabun">
                    หัวข้อการประเมิน ({criteria.criteria.length})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCriterion(criteria.id)}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    เพิ่มหัวข้อ
                  </Button>
                </div>

                {criteria.criteria.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 font-sarabun">ยังไม่มีหัวข้อการประเมิน</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {criteria.criteria.map((criterion) => {
                      const Icon = getCriterionIcon(criterion.id);
                      return (
                        <div
                          key={criterion.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Icon className="h-5 w-5 text-blue-600" />
                              <h4 className="font-semibold text-gray-900 font-sarabun">{criterion.name}</h4>
                            </div>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              {criterion.weight}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-sarabun mb-3">{criterion.description}</p>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditCriterion(criteria.id, criterion)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-sarabun"
                            >
                              แก้ไข
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Guidelines & Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 font-sarabun mb-2">แนวทางทั่วไป</h4>
                  <ul className="space-y-1">
                    {criteria.generalGuidelines.map((guideline, index) => (
                      <li key={index} className="text-sm text-gray-600 font-sarabun flex items-start">
                        <StarIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {guideline}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 font-sarabun mb-2">หมายเหตุการให้คะแนน</h4>
                  <ul className="space-y-1">
                    {criteria.scoringNotes.map((note, index) => (
                      <li key={index} className="text-sm text-gray-600 font-sarabun flex items-start">
                        <ClipboardDocumentCheckIcon className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        {criteriaList.length === 0 && (
          <Card>
            <CardBody className="p-12 text-center">
              <DocumentMagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 font-sarabun mb-2">
                ยังไม่มีเกณฑ์การประเมิน
              </h3>
              <p className="text-gray-500 font-sarabun mb-4">
                เริ่มต้นสร้างเกณฑ์การประเมินสำหรับทุนการศึกษา
              </p>
              <Button variant="primary" onClick={handleCreateCriteria}>
                <PlusIcon className="h-4 w-4 mr-2" />
                สร้างเกณฑ์แรก
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Create/Edit Criteria Modal */}
      {showCriteriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 font-sarabun">
                  {isEditMode ? 'แก้ไขเกณฑ์การประเมิน' : 'สร้างเกณฑ์การประเมินใหม่'}
                </h2>
                <button
                  onClick={() => setShowCriteriaModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Scholarship Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  ทุนการศึกษา <span className="text-red-500">*</span>
                </label>
                <select
                  value={criteriaFormData.scholarship_id}
                  onChange={(e) => setCriteriaFormData({ ...criteriaFormData, scholarship_id: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun"
                  disabled={isEditMode}
                >
                  <option value={0}>เลือกทุนการศึกษา</option>
                  <option value={1}>ทุนเรียนดี</option>
                  <option value={2}>ทุนช่วยเหลือนักศึกษา</option>
                  <option value={3}>ทุนวิจัย</option>
                  <option value={4}>ทุนกีฬา</option>
                  <option value={5}>ทุนพัฒนาทักษะดิจิทัล</option>
                </select>
              </div>

              {/* Scholarship Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  ชื่อทุนการศึกษา <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={criteriaFormData.scholarshipName}
                  onChange={(e) => setCriteriaFormData({ ...criteriaFormData, scholarshipName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun"
                  placeholder="ระบุชื่อทุนการศึกษา"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  คำอธิบาย <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={criteriaFormData.description}
                  onChange={(e) => setCriteriaFormData({ ...criteriaFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun"
                  placeholder="อธิบายเกี่ยวกับเกณฑ์การประเมิน"
                />
              </div>

              {/* General Guidelines */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  แนวทางทั่วไป
                </label>
                {criteriaFormData.generalGuidelines.map((guideline, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={guideline}
                      onChange={(e) => updateArrayField('generalGuidelines', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun"
                      placeholder="ระบุแนวทางทั่วไป"
                    />
                    {criteriaFormData.generalGuidelines.length > 1 && (
                      <button
                        onClick={() => removeArrayField('generalGuidelines', index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayField('generalGuidelines')}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium font-sarabun flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  เพิ่มแนวทาง
                </button>
              </div>

              {/* Scoring Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  หมายเหตุการให้คะแนน
                </label>
                {criteriaFormData.scoringNotes.map((note, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => updateArrayField('scoringNotes', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun"
                      placeholder="ระบุหมายเหตุ"
                    />
                    {criteriaFormData.scoringNotes.length > 1 && (
                      <button
                        onClick={() => removeArrayField('scoringNotes', index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayField('scoringNotes')}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium font-sarabun flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  เพิ่มหมายเหตุ
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCriteriaModal(false)}
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveCriteria}
                disabled={!criteriaFormData.scholarship_id || !criteriaFormData.scholarshipName || !criteriaFormData.description}
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {isEditMode ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างเกณฑ์'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Criterion Modal */}
      {showCriterionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 font-sarabun">
                  {isEditMode ? 'แก้ไขหัวข้อการประเมิน' : 'เพิ่มหัวข้อการประเมินใหม่'}
                </h2>
                <button
                  onClick={() => setShowCriterionModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Criterion Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  ชื่อหัวข้อ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={criterionFormData.name}
                  onChange={(e) => setCriterionFormData({ ...criterionFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun"
                  placeholder="เช่น ความรู้วิชาการ, ทักษะการสื่อสาร"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  น้ำหนักคะแนน (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={criterionFormData.weight}
                  onChange={(e) => setCriterionFormData({ ...criterionFormData, weight: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun"
                  placeholder="0-100"
                />
                <p className="mt-1 text-sm text-gray-500 font-sarabun">
                  น้ำหนักคะแนนรวมของทุกหัวข้อต้องเท่ากับ 100%
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  คำอธิบาย <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={criterionFormData.description}
                  onChange={(e) => setCriterionFormData({ ...criterionFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun"
                  placeholder="อธิบายรายละเอียดของหัวข้อการประเมิน"
                />
              </div>

              {/* Score Ranges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  ช่วงคะแนนและคำอธิบาย <span className="text-red-500">*</span>
                </label>
                {criterionFormData.scoreRanges.map((range, rangeIndex) => (
                  <div key={rangeIndex} className="bg-gray-50 p-4 rounded-lg mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 font-sarabun mb-1">
                          ช่วงคะแนน
                        </label>
                        <input
                          type="text"
                          value={range.range}
                          onChange={(e) => {
                            const newRanges = [...criterionFormData.scoreRanges];
                            newRanges[rangeIndex].range = e.target.value;
                            setCriterionFormData({ ...criterionFormData, scoreRanges: newRanges });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun text-sm"
                          placeholder="เช่น 9-10, 7-8"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 font-sarabun mb-1">
                          คำอธิบาย
                        </label>
                        <input
                          type="text"
                          value={range.description}
                          onChange={(e) => {
                            const newRanges = [...criterionFormData.scoreRanges];
                            newRanges[rangeIndex].description = e.target.value;
                            setCriterionFormData({ ...criterionFormData, scoreRanges: newRanges });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun text-sm"
                          placeholder="เช่น ดีเยี่ยม, ดี, พอใช้"
                        />
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 font-sarabun mb-1">
                        ตัวอย่าง
                      </label>
                      {range.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={example}
                            onChange={(e) => {
                              const newRanges = [...criterionFormData.scoreRanges];
                              newRanges[rangeIndex].examples[exampleIndex] = e.target.value;
                              setCriterionFormData({ ...criterionFormData, scoreRanges: newRanges });
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun text-sm"
                            placeholder="ระบุตัวอย่าง"
                          />
                          {range.examples.length > 1 && (
                            <button
                              onClick={() => {
                                const newRanges = [...criterionFormData.scoreRanges];
                                newRanges[rangeIndex].examples = newRanges[rangeIndex].examples.filter((_, i) => i !== exampleIndex);
                                setCriterionFormData({ ...criterionFormData, scoreRanges: newRanges });
                              }}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newRanges = [...criterionFormData.scoreRanges];
                          newRanges[rangeIndex].examples.push('');
                          setCriterionFormData({ ...criterionFormData, scoreRanges: newRanges });
                        }}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium font-sarabun flex items-center"
                      >
                        <PlusIcon className="h-3 w-3 mr-1" />
                        เพิ่มตัวอย่าง
                      </button>
                    </div>

                    {criterionFormData.scoreRanges.length > 1 && (
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => {
                            setCriterionFormData({
                              ...criterionFormData,
                              scoreRanges: criterionFormData.scoreRanges.filter((_, i) => i !== rangeIndex)
                            });
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-medium font-sarabun flex items-center"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          ลบช่วงคะแนน
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    setCriterionFormData({
                      ...criterionFormData,
                      scoreRanges: [...criterionFormData.scoreRanges, { range: '', description: '', examples: [''] }]
                    });
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium font-sarabun flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  เพิ่มช่วงคะแนน
                </button>
              </div>

              {/* Tips */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  คำแนะนำสำหรับผู้สัมภาษณ์
                </label>
                {criterionFormData.tips.map((tip, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => {
                        const newTips = [...criterionFormData.tips];
                        newTips[index] = e.target.value;
                        setCriterionFormData({ ...criterionFormData, tips: newTips });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sarabun"
                      placeholder="ระบุคำแนะนำ"
                    />
                    {criterionFormData.tips.length > 1 && (
                      <button
                        onClick={() => {
                          setCriterionFormData({
                            ...criterionFormData,
                            tips: criterionFormData.tips.filter((_, i) => i !== index)
                          });
                        }}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    setCriterionFormData({
                      ...criterionFormData,
                      tips: [...criterionFormData.tips, '']
                    });
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium font-sarabun flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  เพิ่มคำแนะนำ
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCriterionModal(false)}
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveCriterion}
                disabled={!criterionFormData.name || !criterionFormData.weight || !criterionFormData.description}
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {isEditMode ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มหัวข้อ'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCriteria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-sarabun">
                  ยืนยันการลบ
                </h2>
              </div>
            </div>

            <div className="px-6 py-4">
              <p className="text-gray-700 font-sarabun mb-4">
                คุณแน่ใจหรือไม่ที่จะลบเกณฑ์การประเมิน
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-900 font-sarabun mb-1">
                  {selectedCriteria.scholarshipName}
                </p>
                <p className="text-sm text-red-700 font-sarabun mb-2">
                  {selectedCriteria.description}
                </p>
                {selectedCriteria.criteria.length > 0 && (
                  <p className="text-xs text-red-600 font-sarabun">
                    มี {selectedCriteria.criteria.length} หัวข้อการประเมินที่จะถูกลบด้วย
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-600 font-sarabun mt-4">
                การดำเนินการนี้ไม่สามารถย้อนกลับได้
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                ลบเกณฑ์
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-700 font-sarabun">กำลังดำเนินการ...</p>
          </div>
        </div>
      )}
    </div>
  );
}
