'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import applicationService from '@/services/application.service';
import PersonalInfoForm from '@/components/applications/forms/PersonalInfoForm';
import AddressesForm from '@/components/applications/forms/AddressesForm';
import EducationForm from '@/components/applications/forms/EducationForm';
import FamilyForm from '@/components/applications/forms/FamilyForm';
import FinancialForm from '@/components/applications/forms/FinancialForm';
import ActivitiesForm from '@/components/applications/forms/ActivitiesForm';
import type { CompleteApplicationForm } from '@/types/application';

const STEPS = [
  { id: 1, name: 'ข้อมูลส่วนตัว', component: 'personal' },
  { id: 2, name: 'ที่อยู่', component: 'addresses' },
  { id: 3, name: 'การศึกษา', component: 'education' },
  { id: 4, name: 'ครอบครัว', component: 'family' },
  { id: 5, name: 'การเงิน', component: 'financial' },
  { id: 6, name: 'กิจกรรม', component: 'activities' },
];

export default function EditApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = parseInt(params.id as string);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CompleteApplicationForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplicationData();
  }, []);

  const loadApplicationData = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getCompleteForm(applicationId);
      if (response.success && response.data) {
        setFormData(response.data);
      }
    } catch (err) {
      console.error('Failed to load application:', err);
      setError('ไม่สามารถโหลดข้อมูลใบสมัครได้');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit application
      router.push(`/student/applications/${applicationId}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const savePersonalInfo = async (data: any) => {
    await applicationService.savePersonalInfo(applicationId, data);
    setFormData(prev => ({ ...prev!, personal_info: data }));
  };

  const saveAddresses = async (data: any) => {
    await applicationService.saveAddresses(applicationId, data);
    setFormData(prev => ({ ...prev!, addresses: data }));
  };

  const saveEducation = async (data: any) => {
    await applicationService.saveEducation(applicationId, data);
    setFormData(prev => ({ ...prev!, education_history: data }));
  };

  const saveFamily = async (data: any) => {
    await applicationService.saveFamily(applicationId, data);
    setFormData(prev => ({
      ...prev!,
      family_members: data.members,
      guardians: data.guardians,
      siblings: data.siblings,
      living_situation: data.living_situation,
    }));
  };

  const saveFinancial = async (data: any) => {
    await applicationService.saveFinancial(applicationId, data);
    setFormData(prev => ({
      ...prev!,
      financial_info: data.financial_info,
      assets: data.assets,
      scholarship_history: data.scholarship_history,
      health_info: data.health_info,
      funding_needs: data.funding_needs,
    }));
  };

  const saveActivities = async (data: any) => {
    await applicationService.saveActivities(applicationId, data);
    setFormData(prev => ({
      ...prev!,
      activities: data.activities,
      references: data.references,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">แก้ไขใบสมัคร</h1>
          <p className="text-gray-600">กรอกข้อมูลให้ครบถ้วนเพื่อยื่นใบสมัครขอรับทุนการศึกษา</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step.id === currentStep
                        ? 'bg-blue-600 text-white'
                        : step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.id < currentStep ? '✓' : step.id}
                  </div>
                  <div className="mt-2 text-xs text-center hidden md:block">{step.name}</div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {currentStep === 1 && (
            <PersonalInfoForm
              data={formData?.personal_info}
              onSave={savePersonalInfo}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <AddressesForm
              data={formData?.addresses}
              onSave={saveAddresses}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <EducationForm
              data={formData?.education_history}
              onSave={saveEducation}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <FamilyForm
              data={{
                members: formData?.family_members,
                guardians: formData?.guardians,
                siblings: formData?.siblings,
                living_situation: formData?.living_situation,
              }}
              onSave={saveFamily}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <FinancialForm
              data={{
                financial_info: formData?.financial_info,
                assets: formData?.assets,
                scholarship_history: formData?.scholarship_history,
                health_info: formData?.health_info,
                funding_needs: formData?.funding_needs,
              }}
              onSave={saveFinancial}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 6 && (
            <ActivitiesForm
              data={{
                activities: formData?.activities,
                references: formData?.references,
              }}
              onSave={saveActivities}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 text-center text-sm text-gray-600">
          ขั้นตอนที่ {currentStep} จาก {STEPS.length}
        </div>
      </div>
    </div>
  );
}
