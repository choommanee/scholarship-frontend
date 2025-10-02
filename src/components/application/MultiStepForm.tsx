'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface MultiStepFormProps {
  scholarshipId: number;
  onComplete?: (applicationId: number) => void;
}

interface StepConfig {
  step: number;
  title: string;
  description: string;
  fields: string[];
  required_fields: string[];
}

interface FormData {
  personal_info: PersonalInfo;
  academic_info: AcademicInfo;
  financial_info: FinancialInfo;
  activity_info: ActivityInfo;
  documents: DocumentInfo;
}

interface PersonalInfo {
  first_name: string;
  last_name: string;
  student_id: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  nationality: string;
}

interface AcademicInfo {
  faculty: string;
  department: string;
  year_level: number;
  gpa: number;
  admission_year: number;
  transcript: string;
}

interface FinancialInfo {
  family_income: number;
  monthly_expenses: number;
  siblings_count: number;
  parent_occupation: string;
  has_other_scholarships: boolean;
  other_scholarships_list: string;
  income_documents: string[];
}

interface ActivityInfo {
  extracurricular: ActivityRecord[];
  volunteer: ActivityRecord[];
  awards: AwardRecord[];
  skills: string[];
  languages: LanguageSkill[];
}

interface DocumentInfo {
  required_documents: DocumentUpload[];
  optional_documents: DocumentUpload[];
  personal_statement: string;
}

interface ActivityRecord {
  name: string;
  role: string;
  duration: string;
  description: string;
  certificate: string;
}

interface AwardRecord {
  name: string;
  issuer: string;
  date: string;
  description: string;
  certificate: string;
}

interface LanguageSkill {
  language: string;
  level: string;
}

interface DocumentUpload {
  document_type: string;
  file_name: string;
  file_id: string;
  is_required: boolean;
  status: string;
}

export default function MultiStepForm({ scholarshipId, onComplete }: MultiStepFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [stepsConfig, setStepsConfig] = useState<StepConfig[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    personal_info: {
      first_name: '',
      last_name: '',
      student_id: '',
      email: '',
      phone: '',
      address: '',
      date_of_birth: '',
      nationality: 'ไทย',
    },
    academic_info: {
      faculty: '',
      department: '',
      year_level: 1,
      gpa: 0,
      admission_year: new Date().getFullYear(),
      transcript: '',
    },
    financial_info: {
      family_income: 0,
      monthly_expenses: 0,
      siblings_count: 0,
      parent_occupation: '',
      has_other_scholarships: false,
      other_scholarships_list: '',
      income_documents: [],
    },
    activity_info: {
      extracurricular: [],
      volunteer: [],
      awards: [],
      skills: [],
      languages: [],
    },
    documents: {
      required_documents: [],
      optional_documents: [],
      personal_statement: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Load configuration and draft on mount
  useEffect(() => {
    loadStepsConfiguration();
    loadDraft();
  }, [scholarshipId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData && !isSaving) {
        saveDraft(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, isSaving]);

  const loadStepsConfiguration = async () => {
    try {
      const response = await fetch(`/api/v1/applications/steps-config?scholarship_id=${scholarshipId}`);
      const data = await response.json();
      
      if (data.success) {
        setStepsConfig(data.data.steps);
        setTotalSteps(data.data.total_steps);
      }
    } catch (error) {
      console.error('Failed to load steps configuration:', error);
    }
  };

  const loadDraft = async () => {
    try {
      const response = await fetch(`/api/v1/applications/draft?scholarship_id=${scholarshipId}`);
      const data = await response.json();
      
      if (data.success && data.draft_data) {
        setFormData(JSON.parse(data.draft_data));
        setCurrentStep(data.current_step);
        setLastSaved(new Date(data.last_saved_at));
      }
    } catch (error) {
      // No draft found - this is normal for new applications
    }
  };

  const saveDraft = useCallback(async (autoSave = false) => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/v1/applications/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scholarship_id: scholarshipId,
          current_step: currentStep,
          draft_data: JSON.stringify(formData),
          auto_save: autoSave,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setLastSaved(new Date());
        if (!autoSave) {
          toast.success('บันทึกแบบร่างเรียบร้อย');
        }
      }
    } catch (error) {
      if (!autoSave) {
        toast.error('ไม่สามารถบันทึกแบบร่างได้');
      }
    } finally {
      setIsSaving(false);
    }
  }, [scholarshipId, currentStep, formData]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const stepConfig = stepsConfig.find(s => s.step === step);
    
    if (!stepConfig) return true;

    // Validate required fields for current step
    stepConfig.required_fields.forEach(field => {
      const value = getFieldValue(field);
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = `${field} เป็นข้อมูลที่จำเป็น`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFieldValue = (field: string): any => {
    const parts = field.split('.');
    let value: any = formData;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value;
  };

  const updateFormData = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const calculateCompletion = (): number => {
    let totalFields = 0;
    let completedFields = 0;

    // Count completed fields across all steps
    Object.values(formData).forEach(section => {
      if (typeof section === 'object' && section !== null) {
        Object.values(section).forEach(value => {
          totalFields++;
          if (value && value !== '' && value !== 0) {
            completedFields++;
          }
        });
      }
    });

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };

  useEffect(() => {
    setCompletionPercentage(calculateCompletion());
  }, [formData]);

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    await saveDraft();
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit application
      await submitApplication();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/v1/applications/multi-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scholarship_id: scholarshipId,
          step: currentStep,
          step_data: JSON.stringify(formData),
          is_complete: true,
          save_as_draft: false,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('ส่งใบสมัครเรียบร้อย');
        if (onComplete) {
          onComplete(data.data.application_id);
        } else {
          router.push('/student/applications');
        }
      } else {
        toast.error(data.error || 'เกิดข้อผิดพลาดในการส่งใบสมัคร');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          ขั้นตอนที่ {currentStep}: {stepsConfig.find(s => s.step === currentStep)?.title}
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {isSaving ? (
            <>
              <ClockIcon className="h-4 w-4 animate-spin" />
              <span>กำลังบันทึก...</span>
            </>
          ) : lastSaved ? (
            <>
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
              <span>บันทึกล่าสุด: {lastSaved.toLocaleTimeString('th-TH')}</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>ความคืบหน้า</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {stepsConfig.map((step, index) => (
          <div key={step.step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.step < currentStep
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : step.step === currentStep
                  ? 'border-primary-600 text-primary-600'
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {step.step < currentStep ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{step.step}</span>
              )}
            </div>
            
            <div className="ml-2 hidden md:block">
              <p className={`text-sm font-medium ${
                step.step <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
            </div>
            
            {index < stepsConfig.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  step.step < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลส่วนตัว</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.personal_info.first_name}
              onChange={(e) => updateFormData('personal_info', 'first_name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors['first_name'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="กรอกชื่อ"
            />
            {errors['first_name'] && (
              <p className="mt-1 text-sm text-red-600">{errors['first_name']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.personal_info.last_name}
              onChange={(e) => updateFormData('personal_info', 'last_name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors['last_name'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="กรอกนามสกุล"
            />
            {errors['last_name'] && (
              <p className="mt-1 text-sm text-red-600">{errors['last_name']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสนักศึกษา <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.personal_info.student_id}
              onChange={(e) => updateFormData('personal_info', 'student_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors['student_id'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="เช่น 12345678"
              maxLength={8}
            />
            {errors['student_id'] && (
              <p className="mt-1 text-sm text-red-600">{errors['student_id']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.personal_info.email}
              onChange={(e) => updateFormData('personal_info', 'email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors['email'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.name@student.mahidol.ac.th"
            />
            {errors['email'] && (
              <p className="mt-1 text-sm text-red-600">{errors['email']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              value={formData.personal_info.phone}
              onChange={(e) => updateFormData('personal_info', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="เช่น 0812345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สัญชาติ
            </label>
            <input
              type="text"
              value={formData.personal_info.nationality}
              onChange={(e) => updateFormData('personal_info', 'nationality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="เช่น ไทย"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ที่อยู่
          </label>
          <textarea
            value={formData.personal_info.address}
            onChange={(e) => updateFormData('personal_info', 'address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="กรอกที่อยู่ปัจจุบัน"
          />
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return <div>Academic Info Step - Coming Soon</div>;
      case 3:
        return <div>Financial Info Step - Coming Soon</div>;
      case 4:
        return <div>Activity Info Step - Coming Soon</div>;
      case 5:
        return <div>Documents Step - Coming Soon</div>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderStepIndicator()}

      <div className="bg-white rounded-lg shadow-lg p-8">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                ย้อนกลับ
              </button>
            )}
            
            <button
              type="button"
              onClick={() => saveDraft(false)}
              disabled={isSaving}
              className="px-6 py-2 border border-primary-300 text-primary-700 rounded-md hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSaving ? 'กำลังบันทึก...' : 'บันทึกแบบร่าง'}
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'กำลังส่ง...' : currentStep === totalSteps ? 'ส่งใบสมัคร' : 'ถัดไป'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 