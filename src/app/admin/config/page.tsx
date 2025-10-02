'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { configService, SystemConfig } from '@/services/config.service';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { 
  CogIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  BellIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  BanknotesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';



const SystemConfigPage: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('system');
  
  const [config, setConfig] = useState<SystemConfig>({
    systemName: 'ระบบจัดการทุนการศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
    systemVersion: '1.0.0',
    maintenanceMode: false,
    allowRegistration: true,
    maxFileUploadSize: 10,
    sessionTimeout: 30,
    currentAcademicYear: '2567',
    applicationDeadline: '2024-06-30',
    maxApplicationsPerStudent: 3,
    autoApproveApplications: false,
    requireDocumentVerification: true,
    emailEnabled: true,
    smtpHost: 'smtp.mahidol.ac.th',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'scholarship@mahidol.ac.th',
    fromName: 'ระบบทุนการศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
    notificationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    enforcePasswordPolicy: true,
    minPasswordLength: 8,
    requireTwoFactor: false,
    loginAttemptLimit: 5,
    lockoutDuration: 15,
    totalBudget: 4834200,
    budgetWarningThreshold: 80,
    autoCloseBudgetExceeded: false,
  });

  const [testResults, setTestResults] = useState<{[key: string]: 'success' | 'error' | 'testing'}>({});

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      window.location.href = '/dashboard';
      return;
    }
    
    loadConfig();
  }, [user]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const configData = await configService.getSystemConfig();
      setConfig(configData);
    } catch (error) {
      console.error('Failed to load config:', error);
      toast.error('ไม่สามารถโหลดการตั้งค่าระบบได้');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      await configService.updateSystemConfig(config);
      toast.success('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Failed to save config:', error);
      toast.error('ไม่สามารถบันทึกการตั้งค่าได้');
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    setTestResults({...testResults, email: 'testing'});
    
    try {
      await configService.testEmailConnection();
      setTestResults({...testResults, email: 'success'});
      toast.success('ทดสอบการเชื่อมต่ออีเมลสำเร็จ');
    } catch (error) {
      setTestResults({...testResults, email: 'error'});
      toast.error('ทดสอบการเชื่อมต่ออีเมลไม่สำเร็จ');
    }
  };

  const testDatabaseConnection = async () => {
    setTestResults({...testResults, database: 'testing'});
    
    try {
      await configService.testDatabaseConnection();
      setTestResults({...testResults, database: 'success'});
      toast.success('ทดสอบการเชื่อมต่อฐานข้อมูลสำเร็จ');
    } catch (error) {
      setTestResults({...testResults, database: 'error'});
      toast.error('ทดสอบการเชื่อมต่อฐานข้อมูลไม่สำเร็จ');
    }
  };

  const handleConfigChange = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'system', name: 'ระบบทั่วไป', icon: ServerIcon },
    { id: 'scholarship', name: 'ทุนการศึกษา', icon: AcademicCapIcon },
    { id: 'email', name: 'อีเมล', icon: EnvelopeIcon },
    { id: 'notification', name: 'การแจ้งเตือน', icon: BellIcon },
    { id: 'security', name: 'ความปลอดภัย', icon: ShieldCheckIcon },
    { id: 'budget', name: 'งบประมาณ', icon: BanknotesIcon },
  ];

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-sarabun">กำลังโหลดการตั้งค่า...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary-50">
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1 relative">
        <Sidebar 
          userRole="admin"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8">
          <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-8xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                    การตั้งค่าระบบ
                  </h1>
                  <p className="text-secondary-600 font-sarabun">
                    จัดการการตั้งค่าและกำหนดค่าระบบทุนการศึกษา
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={loadConfig}
                    disabled={loading}
                    className="font-sarabun"
                  >
                    รีเฟรช
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveConfig}
                    loading={saving}
                    className="font-sarabun"
                  >
                    บันทึกการตั้งค่า
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center font-sarabun">
                      <CogIcon className="h-5 w-5 mr-2" />
                      หมวดหมู่การตั้งค่า
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="p-0">
                    <nav className="space-y-1">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors font-sarabun ${
                              activeTab === tab.id
                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                                : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                            }`}
                          >
                            <Icon className="h-5 w-5 mr-3" />
                            {tab.name}
                          </button>
                        );
                      })}
                    </nav>
                  </CardBody>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="font-sarabun">การทดสอบระบบ</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={testDatabaseConnection}
                      disabled={testResults.database === 'testing'}
                      className="w-full font-sarabun"
                    >
                      <DatabaseIcon className="h-4 w-4 mr-2" />
                      {testResults.database === 'testing' ? 'กำลังทดสอบ...' : 'ทดสอบฐานข้อมูล'}
                      {testResults.database === 'success' && <CheckCircleIcon className="h-4 w-4 ml-2 text-green-600" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={testEmailConnection}
                      disabled={testResults.email === 'testing'}
                      className="w-full font-sarabun"
                    >
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      {testResults.email === 'testing' ? 'กำลังทดสอบ...' : 'ทดสอบอีเมล'}
                      {testResults.email === 'success' && <CheckCircleIcon className="h-4 w-4 ml-2 text-green-600" />}
                    </Button>
                  </CardBody>
                </Card>
              </div>

              <div className="lg:col-span-3">
                {activeTab === 'system' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center font-sarabun">
                        <ServerIcon className="h-5 w-5 mr-2" />
                        การตั้งค่าระบบทั่วไป
                      </CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="ชื่อระบบ"
                          value={config.systemName}
                          onChange={(e) => handleConfigChange('systemName', e.target.value)}
                        />
                        <Input
                          label="เวอร์ชันระบบ"
                          value={config.systemVersion}
                          onChange={(e) => handleConfigChange('systemVersion', e.target.value)}
                          disabled
                        />
                        <Input
                          label="ขนาดไฟล์สูงสุด (MB)"
                          type="number"
                          value={config.maxFileUploadSize}
                          onChange={(e) => handleConfigChange('maxFileUploadSize', parseInt(e.target.value))}
                        />
                        <Input
                          label="หมดเวลาเซสชัน (นาที)"
                          type="number"
                          value={config.sessionTimeout}
                          onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-secondary-900 font-sarabun">โหมดบำรุงรักษา</h4>
                            <p className="text-sm text-secondary-600 font-sarabun">ปิดการเข้าถึงสำหรับผู้ใช้ทั่วไป</p>
                          </div>
                          <Switch
                            checked={config.maintenanceMode}
                            onCheckedChange={(checked) => handleConfigChange('maintenanceMode', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-secondary-900 font-sarabun">อนุญาตการสมัครสมาชิก</h4>
                            <p className="text-sm text-secondary-600 font-sarabun">เปิด/ปิดการสมัครสมาชิกใหม่</p>
                          </div>
                          <Switch
                            checked={config.allowRegistration}
                            onCheckedChange={(checked) => handleConfigChange('allowRegistration', checked)}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {activeTab === 'scholarship' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center font-sarabun">
                        <AcademicCapIcon className="h-5 w-5 mr-2" />
                        การตั้งค่าทุนการศึกษา
                      </CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="ปีการศึกษาปัจจุบัน"
                          value={config.currentAcademicYear}
                          onChange={(e) => handleConfigChange('currentAcademicYear', e.target.value)}
                        />
                        <Input
                          label="วันสิ้นสุดการสมัคร"
                          type="date"
                          value={config.applicationDeadline}
                          onChange={(e) => handleConfigChange('applicationDeadline', e.target.value)}
                        />
                        <Input
                          label="จำนวนทุนสูงสุดต่อนักศึกษา"
                          type="number"
                          value={config.maxApplicationsPerStudent}
                          onChange={(e) => handleConfigChange('maxApplicationsPerStudent', parseInt(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-secondary-900 font-sarabun">อนุมัติอัตโนมัติ</h4>
                            <p className="text-sm text-secondary-600 font-sarabun">อนุมัติใบสมัครที่ผ่านเกณฑ์โดยอัตโนมัติ</p>
                          </div>
                          <Switch
                            checked={config.autoApproveApplications}
                            onCheckedChange={(checked) => handleConfigChange('autoApproveApplications', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-secondary-900 font-sarabun">ตรวจสอบเอกสารบังคับ</h4>
                            <p className="text-sm text-secondary-600 font-sarabun">กำหนดให้ต้องตรวจสอบเอกสารก่อนอนุมัติ</p>
                          </div>
                          <Switch
                            checked={config.requireDocumentVerification}
                            onCheckedChange={(checked) => handleConfigChange('requireDocumentVerification', checked)}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {activeTab === 'budget' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center font-sarabun">
                        <BanknotesIcon className="h-5 w-5 mr-2" />
                        การตั้งค่างบประมาณ
                      </CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="งบประมาณรวม (บาท)"
                          type="number"
                          value={config.totalBudget}
                          onChange={(e) => handleConfigChange('totalBudget', parseInt(e.target.value))}
                        />
                        <Input
                          label="เกณฑ์เตือนงบประมาณ (%)"
                          type="number"
                          value={config.budgetWarningThreshold}
                          onChange={(e) => handleConfigChange('budgetWarningThreshold', parseInt(e.target.value))}
                        />
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 font-sarabun mb-2">สถานะงบประมาณปัจจุบัน</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-sarabun">งบประมาณรวม:</span>
                            <span className="font-sarabun font-medium">{config.totalBudget.toLocaleString()} บาท</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-sarabun">ใช้ไปแล้ว:</span>
                            <span className="font-sarabun font-medium">2,450,000 บาท (50.7%)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-sarabun">คงเหลือ:</span>
                            <span className="font-sarabun font-medium text-green-600">2,384,200 บาท (49.3%)</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50.7%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemConfigPage; 