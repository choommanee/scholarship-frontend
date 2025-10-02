'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import InterviewSteps from '@/components/interview/InterviewSteps';
import StudentInfo from '@/components/interview/StudentInfo';
import InterviewForm from '@/components/interview/InterviewForm';
import InterviewSummary from '@/components/interview/InterviewSummary';

export default function InterviewPage() {
  const params = useParams();
  const interviewId = params.id as string;
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [interviewData, setInterviewData] = useState({
    studentInfo: null,
    scores: {},
    notes: '',
    recommendation: '',
    documents: []
  });

  const user = {
    name: 'ผศ.ดร. สมปอง วิชาการดี',
    role: 'ผู้สัมภาษณ์',
    email: 'interviewer@university.ac.th',
    department: 'คณะสาธารณสุขศาสตร์'
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleDataUpdate = (data: any) => {
    setInterviewData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header 
        user={user}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex flex-1 relative">
        <Sidebar 
          userRole="interviewer"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8">
          <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-8xl mx-auto">
            
            {/* Interview Steps */}
            <InterviewSteps 
              currentStep={currentStep}
              onStepChange={handleStepChange}
            />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              
              {/* Student Information */}
              <div className="lg:col-span-1">
                <StudentInfo 
                  interviewId={interviewId}
                  onDataLoad={handleDataUpdate}
                />
              </div>

              {/* Interview Form */}
              <div className="lg:col-span-2">
                {currentStep <= 3 && (
                  <InterviewForm
                    step={currentStep}
                    interviewId={interviewId}
                    data={interviewData}
                    onDataUpdate={handleDataUpdate}
                    onNextStep={() => handleStepChange(currentStep + 1)}
                  />
                )}
                
                {currentStep === 4 && (
                  <InterviewSummary
                    interviewId={interviewId}
                    data={interviewData}
                    onSubmit={() => {
                      // Handle final submission
                      console.log('Interview completed:', interviewData);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
