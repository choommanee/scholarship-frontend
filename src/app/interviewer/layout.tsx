'use client';

import React from 'react';
import ProtectedRoute from '@/components/guards/ProtectedRoute';

export default function InterviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute 
      requiredRoles={['interviewer']}
      requiredPermissions={['conduct_interviews']}
    >
      {children}
    </ProtectedRoute>
  );
}