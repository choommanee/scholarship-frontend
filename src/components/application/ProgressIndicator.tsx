'use client';

import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { cn } from '@/utils/cn';

export interface Step {
  step: number;
  title: string;
  description?: string;
}

export interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  allowNavigation?: boolean;
}

export function ProgressIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  allowNavigation = false
}: ProgressIndicatorProps) {
  const completionPercentage = Math.round((completedSteps.length / steps.length) * 100);

  const handleStepClick = (stepNumber: number) => {
    if (allowNavigation && onStepClick && stepNumber <= currentStep) {
      onStepClick(stepNumber);
    }
  };

  const getStepStatus = (stepNumber: number): 'completed' | 'current' | 'upcoming' => {
    if (completedSteps.includes(stepNumber)) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">ความคืบหน้าโดยรวม</span>
          <span className="text-sm font-semibold text-primary-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-600 to-primary-700 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.step);
            const isClickable = allowNavigation && step.step <= currentStep;

            return (
              <div key={step.step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => handleStepClick(step.step)}
                    disabled={!isClickable}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                      status === 'completed' && 'bg-primary-600 border-primary-600 text-white',
                      status === 'current' && 'border-primary-600 text-primary-600 bg-white shadow-lg scale-110',
                      status === 'upcoming' && 'border-gray-300 text-gray-400 bg-white',
                      isClickable && 'cursor-pointer hover:scale-105',
                      !isClickable && 'cursor-not-allowed'
                    )}
                  >
                    {status === 'completed' ? (
                      <CheckIcon className="h-6 w-6" />
                    ) : (
                      <span className="text-sm font-semibold">{step.step}</span>
                    )}
                  </button>

                  <div className="mt-2 text-center">
                    <p className={cn(
                      'text-xs font-medium whitespace-nowrap',
                      status === 'completed' && 'text-primary-600',
                      status === 'current' && 'text-primary-700 font-semibold',
                      status === 'upcoming' && 'text-gray-500'
                    )}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-gray-400 mt-1 hidden xl:block">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 flex items-center px-2 pb-8">
                    <div className={cn(
                      'h-0.5 w-full transition-colors duration-300',
                      completedSteps.includes(step.step) ? 'bg-primary-600' : 'bg-gray-300'
                    )} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="lg:hidden space-y-4">
        {steps.map((step) => {
          const status = getStepStatus(step.step);
          const isClickable = allowNavigation && step.step <= currentStep;

          return (
            <div key={step.step} className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <button
                  onClick={() => handleStepClick(step.step)}
                  disabled={!isClickable}
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200',
                    status === 'completed' && 'bg-primary-600 border-primary-600 text-white',
                    status === 'current' && 'border-primary-600 text-primary-600 bg-white shadow-lg scale-110',
                    status === 'upcoming' && 'border-gray-300 text-gray-400 bg-white',
                    isClickable && 'cursor-pointer hover:scale-105',
                    !isClickable && 'cursor-not-allowed'
                  )}
                >
                  {status === 'completed' ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.step}</span>
                  )}
                </button>

                {step.step < steps.length && (
                  <div className={cn(
                    'w-0.5 h-12 mt-2 transition-colors duration-300',
                    completedSteps.includes(step.step) ? 'bg-primary-600' : 'bg-gray-300'
                  )} />
                )}
              </div>

              <div className="flex-1 pt-1">
                <p className={cn(
                  'text-sm font-medium',
                  status === 'completed' && 'text-primary-600',
                  status === 'current' && 'text-primary-700 font-semibold',
                  status === 'upcoming' && 'text-gray-500'
                )}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-400 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
