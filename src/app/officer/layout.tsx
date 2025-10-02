'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/guards/ProtectedRoute';
import OfficerSidebar from '@/components/officer/OfficerSidebar';
import OfficerHeader from '@/components/officer/OfficerHeader';

export default function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedRoute 
      requiredRoles={['officer', 'scholarship_officer']}
      requiredPermissions={['manage_applications', 'review_documents']}
    >
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <OfficerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <OfficerHeader onMenuToggle={toggleSidebar} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}