'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/auth.service';

const LoginTestPage: React.FC = () => {
  const [email, setEmail] = useState('admin@university.ac.th');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing login with:', { email, password });
      
      const response = await authService.login({ email, password });
      
      console.log('Login response:', response);
      setResult({ success: true, data: response });
      
    } catch (error: any) {
      console.error('Login error:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTestMockLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing mock login');
      
      // Import mock service directly
      const { mockService } = await import('@/services/mock.service');
      const response = await mockService.mockLogin('admin', 'admin123');
      
      console.log('Mock login response:', response);
      setResult({ success: true, data: response, type: 'mock' });
      
    } catch (error: any) {
      console.error('Mock login error:', error);
      setResult({ success: false, error: error.message, type: 'mock' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sarabun">ทดสอบการเข้าสู่ระบบ</CardTitle>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="อีเมล"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="รหัสผ่าน"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={handleTestLogin}
                disabled={loading}
                className="font-sarabun"
              >
                {loading ? 'กำลังทดสอบ...' : 'ทดสอบ API Login'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleTestMockLogin}
                disabled={loading}
                className="font-sarabun"
              >
                {loading ? 'กำลังทดสอบ...' : 'ทดสอบ Mock Login'}
              </Button>
            </div>
            
            {result && (
              <div className={`p-4 rounded-lg ${
                result.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h4 className="font-medium font-sarabun mb-2">
                  {result.success ? '✅ สำเร็จ' : '❌ ล้มเหลว'}
                  {result.type && ` (${result.type})`}
                </h4>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-sarabun">ข้อมูลระบบ</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 text-sm font-sarabun">
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
              <p><strong>Use Mock:</strong> {process.env.NEXT_PUBLIC_USE_MOCK}</p>
              <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL}</p>
              <p><strong>Current User:</strong> {JSON.stringify(authService.getUser())}</p>
              <p><strong>Is Authenticated:</strong> {authService.isAuthenticated().toString()}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginTestPage;
