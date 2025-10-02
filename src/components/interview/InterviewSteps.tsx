'use client';

import React from 'react';
import { 
  UserIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface InterviewStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const InterviewSteps: React.FC<InterviewStepsProps> = ({ currentStep, onStepChange }) => {
  const steps = [
    {
      id: 1,
      title: 'นักศึกษา',
      description: 'ข้อมูลและเอกสารนักศึกษา',
      icon: UserIcon,
      color: 'blue'
    },
    {
      id: 2,
      title: 'เจ้าหน้าที่',
      description: 'ตรวจสอบและประเมินเบื้องต้น',
      icon: ClipboardDocumentCheckIcon,
      color: 'green'
    },
    {
      id: 3,
      title: 'อาจารย์ที่ปรึกษา',
      description: 'การประเมินและให้คำแนะนำ',
      icon: AcademicCapIcon,
      color: 'purple'
    },
    {
      id: 4,
      title: 'สรุปผล',
      description: 'บันทึกผลการสัมภาษณ์',
      icon: CheckCircleIcon,
      color: 'orange'
    }
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (stepId: number, color: string) => {
    const status = getStepStatus(stepId);
    
    switch (status) {
      case 'completed':
        return `bg-green-600 text-white border-green-600`;
      case 'current':
        return `bg-${color}-600 text-white border-${color}-600`;
      case 'upcoming':
        return `bg-white text-secondary-400 border-secondary-300`;
      default:
        return `bg-white text-secondary-400 border-secondary-300`;
    }
  };

  const getConnectorClasses = (stepId: number) => {
    return stepId < currentStep ? 'bg-green-600' : 'bg-secondary-300';
  };

  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-200">
        <h2 className="text-xl font-bold text-secondary-900 font-sarabun mb-6">
          ขั้นตอนการสัมภาษณ์
        </h2>
        
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onStepChange(step.id)}
                  className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200 hover:scale-105
                    ${getStepClasses(step.id, step.color)}
                  `}
                >
                  <step.icon className="w-6 h-6" />
                </button>
                
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-secondary-900 font-sarabun">
                    {step.title}
                  </p>
                  <p className="text-xs text-secondary-500 font-sarabun mt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={`h-0.5 ${getConnectorClasses(step.id + 1)}`}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-secondary-500 font-sarabun mb-2">
            <span>ความคืบหนา</span>
            <span>{Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSteps;
