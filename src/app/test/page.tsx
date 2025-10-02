'use client';

import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const TestPage: React.FC = () => {
  const systemStats = {
    totalUsers: 156,
    activeApplications: 89,
    pendingApplications: 23,
    availableScholarships: 15,
    totalBudget: 2500000,
    allocatedBudget: 1850000
  };

  const recentActivities = [
    {
      id: 1,
      type: 'application',
      message: 'นางสาว สมใจ ใจดี ส่งใบสมัครทุนการศึกษา',
      time: '10 นาทีที่แล้ว',
      icon: DocumentTextIcon,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'approval',
      message: 'ทุนเพื่อการศึกษา ปี 2568 ได้รับการอนุมัติ',
      time: '25 นาทีที่แล้ว',
      icon: CurrencyDollarIcon,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'interview',
      message: 'กำหนดการสัมภาษณ์นักศึกษา 15 คน',
      time: '1 ชั่วโมงที่แล้ว',
      icon: UserIcon,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'budget',
      message: 'อัปเดตงบประมาณทุนการศึกษาไตรมาส 4',
      time: '2 ชั่วโมงที่แล้ว',
      icon: ChartBarIcon,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
            ระบบทดสอบ - Dashboard Overview
          </h1>
          <p className="text-secondary-600 font-sarabun">
            ภาพรวมของระบบจัดการทุนการศึกษา
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardBody className="p-6 text-center">
              <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                {systemStats.totalUsers}
              </p>
              <p className="text-sm text-secondary-600 font-sarabun">ผู้ใช้ทั้งหมด</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
                <AcademicCapIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                {systemStats.activeApplications}
              </p>
              <p className="text-sm text-secondary-600 font-sarabun">ใบสมัครที่ใช้งาน</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <div className="inline-flex p-3 rounded-xl bg-yellow-50 mb-4">
                <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                {systemStats.pendingApplications}
              </p>
              <p className="text-sm text-secondary-600 font-sarabun">รอพิจารณา</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                {systemStats.availableScholarships}
              </p>
              <p className="text-sm text-secondary-600 font-sarabun">ทุนที่เปิดรับ</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <div className="inline-flex p-3 rounded-xl bg-indigo-50 mb-4">
                <ChartBarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                ฿{(systemStats.totalBudget / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-secondary-600 font-sarabun">งบประมาณรวม</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <div className="inline-flex p-3 rounded-xl bg-red-50 mb-4">
                <BellIcon className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                ฿{(systemStats.allocatedBudget / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-secondary-600 font-sarabun">จัดสรรแล้ว</p>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sarabun">กิจกรรมล่าสุด</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-opacity-10 ${activity.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900 font-sarabun">
                          {activity.message}
                        </p>
                        <p className="text-xs text-secondary-500 font-sarabun">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sarabun">สถานะระบบ</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-700 font-sarabun">
                    ฐานข้อมูล
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-sarabun">ปกติ</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-700 font-sarabun">
                    API Server
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-sarabun">ออนไลน์</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-700 font-sarabun">
                    Storage
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600 font-sarabun">75% ใช้งาน</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-700 font-sarabun">
                    Email Service
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-sarabun">พร้อมใช้งาน</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-sarabun">การดำเนินการด่วน</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-1 font-sarabun"
              >
                <UserIcon className="h-5 w-5" />
                <span className="text-sm">จัดการผู้ใช้</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-1 font-sarabun"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span className="text-sm">ตรวจสอบใบสมัคร</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-1 font-sarabun"
              >
                <CurrencyDollarIcon className="h-5 w-5" />
                <span className="text-sm">จัดการทุนการศึกษา</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-1 font-sarabun"
              >
                <ChartBarIcon className="h-5 w-5" />
                <span className="text-sm">รายงานสรุป</span>
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Development Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-sarabun">ข้อมูลการพัฒนา</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-sarabun">
              <div>
                <h4 className="font-medium text-secondary-900 mb-2">เทคโนโลยี Frontend</h4>
                <ul className="space-y-1 text-secondary-600">
                  <li>• Next.js 14.0.4</li>
                  <li>• React 18.2.0</li>
                  <li>• TypeScript 5.3.3</li>
                  <li>• Tailwind CSS 3.4.0</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-secondary-900 mb-2">เทคโนโลยี Backend</h4>
                <ul className="space-y-1 text-secondary-600">
                  <li>• Go 1.23+</li>
                  <li>• Fiber v2.52.8</li>
                  <li>• PostgreSQL</li>
                  <li>• JWT Authentication</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-secondary-900 mb-2">คุณสมบัติ</h4>
                <ul className="space-y-1 text-secondary-600">
                  <li>• ✅ User Management</li>
                  <li>• ✅ Role-based Access</li>
                  <li>• 🔄 Scholarship System</li>
                  <li>• 🔄 Application Process</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;
