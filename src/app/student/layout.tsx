'use client';

import React from 'react';
import ProtectedRoute from '@/components/guards/ProtectedRoute';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute 
      requiredRoles={['student']}
    >
      {children}
    </ProtectedRoute>
  );
}