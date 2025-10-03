'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DocumentCheckIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { ClockIcon } from '@heroicons/react/24/solid';

export interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
  canProceed?: boolean;
  lastSaved?: Date | null;
  showSubmit?: boolean;
}

export function FormNavigation({
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  onSaveDraft,
  onSubmit,
  isLoading = false,
  isSaving = false,
  canProceed = true,
  lastSaved,
  showSubmit = false
}: FormNavigationProps) {
  return (
    <div className="bg-white border-t border-gray-200 p-6 sticky bottom-0 shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* Last Saved Indicator */}
        {lastSaved && (
          <div className="flex items-center justify-center text-xs text-gray-500 mb-4">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>บันทึกล่าสุด: {lastSaved.toLocaleTimeString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Left Side - Previous & Save Draft */}
          <div className="flex items-center space-x-3">
            {!isFirstStep && (
              <Button
                variant="secondary"
                onClick={onPrevious}
                disabled={isLoading || isSaving}
                leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
              >
                ย้อนกลับ
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSaving}
              loading={isSaving}
              leftIcon={<DocumentCheckIcon className="h-4 w-4" />}
            >
              {isSaving ? 'กำลังบันทึก...' : 'บันทึกแบบร่าง'}
            </Button>
          </div>

          {/* Right Side - Next or Submit */}
          <div className="flex items-center space-x-3">
            {/* Step Counter */}
            <span className="text-sm text-gray-600 hidden sm:inline">
              ขั้นตอน {currentStep} จาก {totalSteps}
            </span>

            {/* Next/Submit Button */}
            {!isLastStep ? (
              <Button
                variant="primary"
                onClick={onNext}
                disabled={!canProceed || isLoading || isSaving}
                loading={isLoading}
                rightIcon={<ArrowRightIcon className="h-4 w-4" />}
              >
                ถัดไป
              </Button>
            ) : showSubmit ? (
              <Button
                variant="thammasat"
                size="lg"
                onClick={onSubmit}
                disabled={!canProceed || isLoading || isSaving}
                loading={isLoading}
                rightIcon={<PaperAirplaneIcon className="h-5 w-5" />}
              >
                {isLoading ? 'กำลังส่งใบสมัคร...' : 'ส่งใบสมัคร'}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={onNext}
                disabled={!canProceed || isLoading || isSaving}
                loading={isLoading}
                rightIcon={<ArrowRightIcon className="h-4 w-4" />}
              >
                ตรวจสอบและส่ง
              </Button>
            )}
          </div>
        </div>

        {/* Validation Message */}
        {!canProceed && !isLoading && (
          <div className="mt-4 text-center">
            <p className="text-sm text-red-600">
              กรุณากรอกข้อมูลให้ครบถ้วนก่อนดำเนินการต่อ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
