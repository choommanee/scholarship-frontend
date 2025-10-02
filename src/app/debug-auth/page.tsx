'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const DebugAuthPage: React.FC = () => {
  const { user, isLoading, isAuthenticated, showForceLogin, forceLogin } = useAuth();

  const storedUser = authService.getUser();
  const storedToken = authService.getToken();

  const clearAuth = async () => {
    await authService.logout();
    window.location.reload();
  };

  const testAPI = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      console.log('API Test Success:', currentUser);
      alert('API Test Success - check console');
    } catch (error) {
      console.error('API Test Failed:', error);
      alert('API Test Failed - check console');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Authentication Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Context State */}
          <Card>
            <CardHeader>
              <CardTitle>Auth Context State</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div><strong>isLoading:</strong> {isLoading ? 'true' : 'false'}</div>
                <div><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</div>
                <div><strong>showForceLogin:</strong> {showForceLogin ? 'true' : 'false'}</div>
                <div><strong>user exists:</strong> {user ? 'true' : 'false'}</div>
                {user && (
                  <div className="mt-4">
                    <strong>User Details:</strong>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Stored Data */}
          <Card>
            <CardHeader>
              <CardTitle>Stored Data</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div><strong>Stored Token:</strong> {storedToken ? 'exists' : 'null'}</div>
                <div><strong>Stored User:</strong> {storedUser ? 'exists' : 'null'}</div>
                
                {storedToken && (
                  <div className="mt-4">
                    <strong>Token (first 50 chars):</strong>
                    <pre className="bg-gray-100 p-2 rounded text-xs">
                      {storedToken.substring(0, 50)}...
                    </pre>
                  </div>
                )}
                
                {storedUser && (
                  <div className="mt-4">
                    <strong>Stored User:</strong>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(storedUser, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Environment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Info</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
                <div><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}</div>
                <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
                <div><strong>Use Mock:</strong> {process.env.NEXT_PUBLIC_USE_MOCK || 'false'}</div>
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Debug Actions</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <Button onClick={testAPI} variant="outline" className="w-full">
                  Test API Call
                </Button>
                
                <Button onClick={clearAuth} variant="outline" className="w-full">
                  Clear Auth Data
                </Button>
                
                <Button onClick={forceLogin} variant="outline" className="w-full">
                  Force Login
                </Button>
                
                <Button 
                  onClick={() => window.location.href = '/login'} 
                  variant="mahidol" 
                  className="w-full"
                >
                  Go to Login
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Console Logs */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="text-sm space-y-2">
              <p>1. เปิด Developer Console (F12) เพื่อดู logs</p>
              <p>2. ตรวจสอบ Network tab สำหรับ API calls</p>
              <p>3. ใช้ "Test API Call" เพื่อทดสอบการเชื่อมต่อ Backend</p>
              <p>4. ใช้ "Clear Auth Data" เพื่อล้างข้อมูล authentication</p>
              <p>5. ถ้า loading ติดค้าง ให้ใช้ "Force Login"</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DebugAuthPage; 