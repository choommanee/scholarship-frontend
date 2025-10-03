'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import applicationService from '@/services/application.service';
import scholarshipService from '@/services/scholarship.service';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MultiStepForm from '@/components/application/MultiStepForm';

export default function EditApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scholarshipId, setScholarshipId] = useState<number | null>(null);
  const [scholarship, setScholarship] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadApplicationData();
  }, []);

  const loadApplicationData = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getCompleteForm(applicationId);
      if (response.success && response.data) {
        setScholarshipId(response.data.scholarship_id);

        // Load scholarship details
        const scholarshipData = await scholarshipService.getPublicScholarshipById(response.data.scholarship_id);
        setScholarship(scholarshipData);
      }
    } catch (err) {
      console.error('Failed to load application:', err);
      setError('ไม่สามารถโหลดข้อมูลใบสมัครได้');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationComplete = () => {
    router.push('/student/applications');
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 relative">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="student" />
          <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gray-50">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 relative">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="student" />
          <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gray-50">
            <div className="flex items-center justify-center h-full">
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
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="student" />
        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gray-50">
          {/* Header */}
          {scholarship && (
            <div className="max-w-7xl mx-auto px-4 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={handleGoBack}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-1" />
                  กลับ
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  แก้ไข: {scholarship.scholarship_name}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">ประเภททุน:</span>
                    <span className="ml-2 font-medium">{scholarship.scholarship_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">จำนวนเงิน:</span>
                    <span className="ml-2 font-medium">
                      {scholarship.amount.toLocaleString()} บาท
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Application Form */}
          {scholarshipId && (
            <MultiStepForm
              scholarshipId={scholarshipId}
              existingApplicationId={applicationId}
              onComplete={handleApplicationComplete}
            />
          )}
        </main>
      </div>
    </div>
  );
}
