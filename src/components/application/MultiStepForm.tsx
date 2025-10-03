'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Card, CardBody } from '@/components/ui/Card';
import { ProgressIndicator, Step } from './ProgressIndicator';
import { FormNavigation } from './FormNavigation';
import { Step1PersonalInfo, PersonalInfoData } from './steps/Step1PersonalInfo';
import { Step2AddressInfo, AddressInfoData } from './steps/Step2AddressInfo';
import { Step3EducationHistory, EducationHistoryData } from './steps/Step3EducationHistory';
import { Step4FamilyInfo, FamilyInfoData } from './steps/Step4FamilyInfo';
import { Step5FinancialInfo, FinancialInfoData } from './steps/Step5FinancialInfo';
import { Step6ActivitiesSkills, ActivitiesSkillsData } from './steps/Step6ActivitiesSkills';
import { Step7Documents } from './steps/Step7Documents';
import { Step8ReviewSubmit } from './steps/Step8ReviewSubmit';
import { applicationService } from '@/services/application.service';
import { DocumentUpload } from '@/services/document.service';

interface MultiStepFormProps {
  scholarshipId: number;
  existingApplicationId?: number;
  onComplete?: (applicationId: number) => void;
}

interface FormData {
  step1_personal_info: PersonalInfoData;
  step2_address_info: AddressInfoData;
  step3_education_history: EducationHistoryData;
  step4_family_info: FamilyInfoData;
  step5_financial_info: FinancialInfoData;
  step6_activities_skills: ActivitiesSkillsData;
  step7_documents: DocumentUpload[];
}

const STEPS: Step[] = [
  { step: 1, title: 'ข้อมูลส่วนตัว', description: 'Personal Information' },
  { step: 2, title: 'ที่อยู่', description: 'Address' },
  { step: 3, title: 'การศึกษา', description: 'Education' },
  { step: 4, title: 'ครอบครัว', description: 'Family' },
  { step: 5, title: 'การเงิน', description: 'Financial' },
  { step: 6, title: 'กิจกรรม', description: 'Activities' },
  { step: 7, title: 'เอกสาร', description: 'Documents' },
  { step: 8, title: 'ตรวจสอบ', description: 'Review' }
];

export default function MultiStepForm({ scholarshipId, existingApplicationId, onComplete }: MultiStepFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [applicationId, setApplicationId] = useState<number | undefined>(existingApplicationId);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    step1_personal_info: {
      prefix_th: '', first_name_th: '', last_name_th: '',
      prefix_en: '', first_name_en: '', last_name_en: '',
      citizen_id: '', birth_date: '', gender: '', nationality: 'ไทย', religion: '',
      email: '', phone: '', line_id: '', student_id: '',
      faculty: '', department: '', major: '', year_level: '',
      admission_type: '', admission_year: '', admission_details: ''
    },
    step2_address_info: {
      current_address: {
        house_number: '', village_number: '', alley: '', road: '',
        subdistrict: '', district: '', province: '', postal_code: '',
        latitude: '', longitude: ''
      },
      permanent_address: {
        house_number: '', village_number: '', alley: '', road: '',
        subdistrict: '', district: '', province: '', postal_code: '',
        latitude: '', longitude: ''
      },
      same_as_current: false
    },
    step3_education_history: {
      education_records: []
    },
    step4_family_info: {
      father: {
        relationship: 'father', title: '', first_name: '', last_name: '', age: '',
        living_status: '', occupation: '', workplace: '', monthly_income: '', phone: ''
      },
      mother: {
        relationship: 'mother', title: '', first_name: '', last_name: '', age: '',
        living_status: '', occupation: '', workplace: '', monthly_income: '', phone: ''
      },
      guardians: [],
      siblings: [],
      living_with: ''
    },
    step5_financial_info: {
      family_income: '', monthly_expenses: '', income_per_member: '', debt_amount: '',
      assets: [], living_with: '', house_type: '', house_ownership: '',
      utilities: [], monthly_rent: '', house_condition: ''
    },
    step6_activities_skills: {
      scholarship_history: [],
      activities: [],
      skills: '',
      special_abilities: '',
      awards: '',
      reference_person: {
        title: '', first_name: '', last_name: '', relationship: '',
        position: '', organization: '', phone: '', email: ''
      },
      health_issue: {
        has_health_issue: false, description: '', severity: '', treatment: ''
      }
    },
    step7_documents: []
  });

  // Load or create draft on mount
  useEffect(() => {
    if (existingApplicationId) {
      // Load existing application for edit
      loadExistingApplication();
    } else {
      // Create new application
      loadOrCreateDraft();
    }
  }, [scholarshipId, existingApplicationId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (applicationId && !isSaving && !isLoading) {
        saveDraft(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [applicationId, formData, isSaving, isLoading]);

  const loadExistingApplication = async () => {
    try {
      setIsLoading(true);
      console.log('[MultiStepForm] Loading existing application:', existingApplicationId);

      const response = await applicationService.getCompleteForm(existingApplicationId!);
      console.log('[MultiStepForm] getCompleteForm response:', response);

      if (response.success && response.data) {
        const data = response.data;
        console.log('[MultiStepForm] Application data:', data);

        // Map backend data to form data structure
        // Ensure all string fields have string values (not null/undefined) to avoid controlled input warnings
        const mergeWithDefaults = (backendData: any, defaults: any): any => {
          if (!backendData) return defaults;
          const merged: any = { ...defaults };
          Object.keys(defaults).forEach(key => {
            if (backendData[key] !== null && backendData[key] !== undefined) {
              merged[key] = backendData[key];
            }
          });
          return merged;
        };

        setFormData({
          step1_personal_info: mergeWithDefaults(data.personal_info, formData.step1_personal_info),
          step2_address_info: data.addresses ? {
            current_address: mergeWithDefaults(data.addresses.current_address, formData.step2_address_info.current_address),
            permanent_address: mergeWithDefaults(data.addresses.permanent_address, formData.step2_address_info.permanent_address),
            same_as_current: data.addresses.same_as_current || false
          } : formData.step2_address_info,
          step3_education_history: data.education_history || formData.step3_education_history,
          step4_family_info: {
            family_members: data.family_members || [],
            guardians: data.guardians || [],
            siblings: data.siblings || [],
            living_situation: data.living_situation || {}
          },
          step5_financial_info: {
            family_income: data.financial_info?.family_income || '',
            income_source: data.financial_info?.income_source || '',
            family_expenses: data.financial_info?.family_expenses || '',
            assets: data.assets || [],
            debts: data.financial_info?.debts || '',
            other_income: data.financial_info?.other_income || ''
          },
          step6_activities_skills: {
            scholarship_history: data.scholarship_history || [],
            activities: data.activities || [],
            skills: data.activities_skills?.skills || '',
            special_abilities: data.activities_skills?.special_abilities || '',
            awards: data.activities_skills?.awards || '',
            reference_person: data.references?.[0] || formData.step6_activities_skills.reference_person,
            health_issue: data.health_info || formData.step6_activities_skills.health_issue
          },
          step7_documents: data.documents || []
        });

        setCurrentStep(data.current_step || 1);
        toast.success('โหลดข้อมูลแบบฟอร์มสำเร็จ');
      } else {
        console.error('[MultiStepForm] Invalid response structure:', response);
        toast.error('ไม่พบข้อมูลแบบฟอร์ม');
      }
    } catch (error: any) {
      console.error('[MultiStepForm] Failed to load existing application:', error);
      console.error('[MultiStepForm] Error details:', error.message, error.response);
      toast.error(`ไม่สามารถโหลดข้อมูลแบบฟอร์มได้: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrCreateDraft = async () => {
    try {
      const draft = await applicationService.getDraft(scholarshipId);

      if (draft && draft.application_id) {
        setApplicationId(draft.application_id);
        setCurrentStep(draft.current_step || 1);
        if (draft.form_data) {
          setFormData({ ...formData, ...draft.form_data });
        }
        if (draft.last_saved_at) {
          setLastSaved(new Date(draft.last_saved_at));
        }
        toast.success('โหลดแบบร่างสำเร็จ');
      } else {
        // Create new draft
        const newDraft = await applicationService.createDraft(scholarshipId);
        if (newDraft && newDraft.application_id) {
          setApplicationId(newDraft.application_id);
          toast.success('สร้างแบบร่างสำเร็จ');
        } else {
          throw new Error('ไม่สามารถสร้างแบบร่างได้');
        }
      }
    } catch (error: any) {
      console.error('Failed to load/create draft:', error);
      toast.error('ไม่สามารถโหลดหรือสร้างแบบร่างได้ กรุณาล็อกอินใหม่');
    }
  };

  const saveDraft = useCallback(async (autoSave = false) => {
    if (!applicationId) return;

    setIsSaving(true);

    try {
      // Map current step to section name
      const sectionMap: { [key: number]: string } = {
        1: 'step1_personal_info',
        2: 'step2_address_info',
        3: 'step3_education_history',
        4: 'step4_family_info',
        5: 'step5_financial_info',
        6: 'step6_activities_skills'
      };

      const sectionName = sectionMap[currentStep];

      if (sectionName && currentStep <= 6) {
        // Save only the current section
        const sectionData = formData[sectionName as keyof typeof formData];
        await applicationService.saveSection(
          applicationId,
          sectionName,
          sectionData,
          autoSave
        );
      }

      setLastSaved(new Date());
      if (!autoSave) {
        toast.success('บันทึกแบบร่างเรียบร้อย');
      }
    } catch (error: any) {
      console.error('Save draft error:', error);
      if (!autoSave) {
        toast.error('ไม่สามารถบันทึกแบบร่างได้: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsSaving(false);
    }
  }, [applicationId, currentStep, formData]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.step1_personal_info.first_name_th) newErrors.first_name_th = 'กรุณากรอกชื่อภาษาไทย';
        if (!formData.step1_personal_info.last_name_th) newErrors.last_name_th = 'กรุณากรอกนามสกุลภาษาไทย';
        if (!formData.step1_personal_info.citizen_id || formData.step1_personal_info.citizen_id.length !== 13) {
          newErrors.citizen_id = 'กรุณากรอกเลขประจำตัวประชาชน 13 หลัก';
        }
        if (!formData.step1_personal_info.email) newErrors.email = 'กรุณากรอกอีเมล';
        if (!formData.step1_personal_info.student_id) newErrors.student_id = 'กรุณากรอกรหัสนักศึกษา';
        break;

      case 2:
        if (!formData.step2_address_info.current_address.house_number) {
          newErrors['current_address.house_number'] = 'กรุณากรอกบ้านเลขที่';
        }
        if (!formData.step2_address_info.current_address.subdistrict) {
          newErrors['current_address.subdistrict'] = 'กรุณากรอกตำบล/แขวง';
        }
        break;

      case 3:
        if (formData.step3_education_history.education_records.length === 0) {
          newErrors.education_records = 'กรุณาเพิ่มประวัติการศึกษาอย่างน้อย 1 รายการ';
        }
        break;

      case 4:
        if (!formData.step4_family_info.living_with) {
          newErrors.living_with = 'กรุณาเลือกว่าอาศัยอยู่กับใคร';
        }
        break;

      case 5:
        if (!formData.step5_financial_info.family_income) {
          newErrors.family_income = 'กรุณากรอกรายได้ครอบครัว';
        }
        if (!formData.step5_financial_info.monthly_expenses) {
          newErrors.monthly_expenses = 'กรุณากรอกค่าใช้จ่ายต่อเดือน';
        }
        break;

      case 6:
        // Optional step
        break;

      case 7:
        // Will be validated by document service
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    // Save before moving to next step
    await saveDraft();

    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!applicationId) {
      toast.error('ไม่พบข้อมูลใบสมัคร');
      return;
    }

    // Validate all steps
    for (let i = 1; i <= 7; i++) {
      if (!validateStep(i)) {
        toast.error(`ข้อมูลในขั้นตอนที่ ${i} ยังไม่ครบถ้วน`);
        setCurrentStep(i);
        return;
      }
    }

    setIsLoading(true);

    try {
      await applicationService.submit({
        application_id: applicationId,
        terms_accepted: true
      });

      toast.success('ส่งใบสมัครเรียบร้อยแล้ว');

      if (onComplete) {
        onComplete(applicationId);
      } else {
        router.push('/student/applications');
      }
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการส่งใบสมัคร');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStep1 = (field: keyof PersonalInfoData, value: string) => {
    setFormData(prev => ({
      ...prev,
      step1_personal_info: { ...prev.step1_personal_info, [field]: value }
    }));
  };

  const updateStep2 = (field: 'current_address' | 'permanent_address' | 'same_as_current', value: any) => {
    setFormData(prev => ({
      ...prev,
      step2_address_info: { ...prev.step2_address_info, [field]: value }
    }));
  };

  const updateStep3 = (records: any) => {
    setFormData(prev => ({
      ...prev,
      step3_education_history: { education_records: records }
    }));
  };

  const updateStep4 = (field: keyof FamilyInfoData, value: any) => {
    setFormData(prev => ({
      ...prev,
      step4_family_info: { ...prev.step4_family_info, [field]: value }
    }));
  };

  const updateStep5 = (field: keyof FinancialInfoData, value: any) => {
    setFormData(prev => ({
      ...prev,
      step5_financial_info: { ...prev.step5_financial_info, [field]: value }
    }));
  };

  const updateStep6 = (field: keyof ActivitiesSkillsData, value: any) => {
    setFormData(prev => ({
      ...prev,
      step6_activities_skills: { ...prev.step6_activities_skills, [field]: value }
    }));
  };

  const updateStep7 = (documents: DocumentUpload[]) => {
    setFormData(prev => ({
      ...prev,
      step7_documents: documents
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo
            data={formData.step1_personal_info}
            onChange={updateStep1}
            errors={errors}
          />
        );

      case 2:
        return (
          <Step2AddressInfo
            data={formData.step2_address_info}
            onChange={updateStep2}
            errors={errors}
          />
        );

      case 3:
        return (
          <Step3EducationHistory
            data={formData.step3_education_history}
            onChange={updateStep3}
            errors={errors}
          />
        );

      case 4:
        return (
          <Step4FamilyInfo
            data={formData.step4_family_info}
            onChange={updateStep4}
            errors={errors}
          />
        );

      case 5:
        const familyCount = 1 +
          (formData.step4_family_info.father.living_status === 'alive' ? 1 : 0) +
          (formData.step4_family_info.mother.living_status === 'alive' ? 1 : 0) +
          formData.step4_family_info.siblings.length;

        return (
          <Step5FinancialInfo
            data={formData.step5_financial_info}
            onChange={updateStep5}
            errors={errors}
            familyMemberCount={familyCount}
          />
        );

      case 6:
        return (
          <Step6ActivitiesSkills
            data={formData.step6_activities_skills}
            onChange={updateStep6}
            errors={errors}
          />
        );

      case 7:
        return (
          <Step7Documents
            applicationId={applicationId}
            onDocumentsChange={updateStep7}
            errors={errors}
          />
        );

      case 8:
        return (
          <Step8ReviewSubmit
            data={{
              personalInfo: formData.step1_personal_info,
              addressInfo: formData.step2_address_info,
              educationHistory: formData.step3_education_history,
              familyInfo: formData.step4_family_info,
              financialInfo: formData.step5_financial_info,
              activitiesSkills: formData.step6_activities_skills,
              documents: formData.step7_documents
            }}
            onEdit={handleStepClick}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
            completedSteps={completedSteps}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <Card className="mb-6">
          <CardBody>
            <ProgressIndicator
              steps={STEPS}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
              allowNavigation={true}
            />
          </CardBody>
        </Card>

        {/* Step Content */}
        <Card>
          <CardBody className="p-6 md:p-8">
            {renderStepContent()}
          </CardBody>
        </Card>
      </div>

      {/* Navigation Footer */}
      <FormNavigation
        currentStep={currentStep}
        totalSteps={8}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 8}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSaveDraft={() => saveDraft(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSaving={isSaving}
        canProceed={true}
        lastSaved={lastSaved}
        showSubmit={currentStep === 8}
      />
    </div>
  );
}
