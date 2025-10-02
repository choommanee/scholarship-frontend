'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { runMigration } from '@/utils/migrateScholarships';
import toast from 'react-hot-toast';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function MigratePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [migrating, setMigrating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Redirect if not admin
  React.useEffect(() => {
    if (user && !['admin', 'superadmin'].includes(user.role)) {
      toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleMigration = async () => {
    try {
      setMigrating(true);
      setLogs(prev => [...prev, 'เริ่มการย้ายข้อมูลทุนการศึกษา...']);
      
      // Override console.log to capture logs
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      console.log = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        setLogs(prev => [...prev, message]);
        originalConsoleLog(...args);
      };
      
      console.error = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        setLogs(prev => [...prev, `ERROR: ${message}`]);
        originalConsoleError(...args);
      };
      
      await runMigration();
      
      // Restore console functions
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      
      setLogs(prev => [...prev, 'การย้ายข้อมูลเสร็จสมบูรณ์']);
      toast.success('ย้ายข้อมูลทุนการศึกษาสำเร็จ');
    } catch (error) {
      console.error('Migration failed:', error);
      setLogs(prev => [...prev, `เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : String(error)}`]);
      toast.error('เกิดข้อผิดพลาดในการย้ายข้อมูล');
    } finally {
      setMigrating(false);
    }
  };

  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-primary-700 hover:text-primary-800 transition-colors font-sarabun"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            กลับไปหน้าควบคุม
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-primary-500 to-primary-700"></div>
          <CardHeader className="border-b border-secondary-100 bg-gradient-to-r from-primary-50 to-secondary-50">
            <CardTitle className="text-2xl font-sarabun text-secondary-900">
              ย้ายข้อมูลทุนการศึกษา
            </CardTitle>
          </CardHeader>
          
          <CardBody className="space-y-6">
            <p className="text-secondary-700 font-sarabun">
              เครื่องมือนี้จะย้ายข้อมูลทุนการศึกษาจากข้อมูลตัวอย่างไปยังฐานข้อมูลหลัก
              กรุณาใช้งานด้วยความระมัดระวัง เนื่องจากอาจมีการสร้างข้อมูลซ้ำซ้อนได้
            </p>
            
            <div className="flex justify-center">
              <Button
                variant="mahidol"
                size="lg"
                className="font-sarabun"
                onClick={handleMigration}
                loading={migrating}
                disabled={migrating}
              >
                เริ่มย้ายข้อมูล
              </Button>
            </div>
            
            {logs.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-3">บันทึกการทำงาน</h3>
                <div className="bg-secondary-900 text-secondary-100 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className={`mb-1 ${log.startsWith('ERROR') ? 'text-red-400' : ''}`}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
