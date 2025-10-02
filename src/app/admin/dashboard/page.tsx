'use client';

import React, { useState } from 'react';
import { 
  UsersIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ChartPieIcon,
  ClipboardIcon,
  KeyIcon,
  BuildingOfficeIcon,
  BellIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
  ArrowRightIcon,
  EyeIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface SystemStat {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
}

interface SystemAlert {
  id: string;
  title: string;
  description: string;
  type: 'error' | 'warning' | 'info';
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'pending';
}

interface SystemResource {
  name: string;
  usage: number;
  total: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
}

const AdminDashboard: React.FC = () => {
  const systemStats: SystemStat[] = [
    {
      title: 'ผู้ใช้ทั้งหมด',
      value: 1247,
      subtitle: 'บัญชีผู้ใช้ในระบบ',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: { value: 23, isPositive: true, period: 'เดือนนี้' }
    },
    {
      title: 'เซสชันที่ใช้งาน',
      value: 89,
      subtitle: 'ผู้ใช้ที่เข้าสู่ระบบอยู่',
      icon: ShieldCheckIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: { value: 12, isPositive: true, period: 'ตอนนี้' }
    },
    {
      title: 'สถานะระบบ',
      value: '99.8%',
      subtitle: 'เวลาทำงาน (Uptime)',
      icon: ServerIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'การใช้พื้นที่',
      value: '68%',
      subtitle: 'พื้นที่จัดเก็บข้อมูล',
      icon: CircleStackIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: { value: 5, isPositive: false, period: 'สัปดาห์นี้' }
    }
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: '1',
      title: 'การใช้พื้นที่เก็บข้อมูลสูง',
      description: 'พื้นที่เก็บข้อมูลใช้ไปแล้ว 85% ควรทำการล้างข้อมูลเก่าหรือเพิ่มพื้นที่',
      type: 'warning',
      severity: 'medium',
      timestamp: '10 นาทีที่แล้ว',
      status: 'active'
    },
    {
      id: '2',
      title: 'การเข้าสู่ระบบผิดปกติ',
      description: 'พบการพยายามเข้าสู่ระบบที่ล้มเหลวจาก IP 192.168.1.100 มากกว่า 5 ครั้ง',
      type: 'error',
      severity: 'high',
      timestamp: '25 นาทีที่แล้ว',
      status: 'active'
    },
    {
      id: '3',
      title: 'การสำรองข้อมูลเสร็จสิ้น',
      description: 'การสำรองข้อมูลประจำวันเสร็จสิ้นเรียบร้อยแล้ว ขนาดไฟล์ 2.3 GB',
      type: 'info',
      severity: 'low',
      timestamp: '2 ชั่วโมงที่แล้ว',
      status: 'acknowledged'
    }
  ];

  const recentActivities: UserActivity[] = [
    {
      id: '1',
      userId: 'officer_001',
      userName: 'วิไลวรรณ จัดการดี',
      action: 'อนุมัติใบสมัครทุน',
      resource: 'ทุนพัฒนาศักยภาพนักศึกษา',
      timestamp: '5 นาทีที่แล้ว',
      ipAddress: '192.168.1.50',
      userAgent: 'Chrome 120.0',
      status: 'success'
    },
    {
      id: '2',
      userId: 'student_6388001',
      userName: 'สมชาย ใจดี',
      action: 'อัปโหลดเอกสาร',
      resource: 'ใบแสดงผลการเรียน',
      timestamp: '12 นาทีที่แล้ว',
      ipAddress: '192.168.1.75',
      userAgent: 'Safari 17.0',
      status: 'success'
    },
    {
      id: '3',
      userId: 'interviewer_001',
      userName: 'สมปอง วิชาการดี',
      action: 'ส่งผลการประเมิน',
      resource: 'การสัมภาษณ์ทุนเรียนดี',
      timestamp: '18 นาทีที่แล้ว',
      ipAddress: '192.168.1.60',
      userAgent: 'Firefox 119.0',
      status: 'success'
    },
    {
      id: '4',
      userId: 'student_6388005',
      userName: 'ประยุทธ ตั้งใจเรียน',
      action: 'เข้าสู่ระบบ',
      resource: 'หน้าแรกนักศึกษา',
      timestamp: '22 นาทีที่แล้ว',
      ipAddress: '192.168.1.85',
      userAgent: 'Chrome 120.0',
      status: 'failed'
    }
  ];

  const systemResources: SystemResource[] = [
    {
      name: 'CPU',
      usage: 45,
      total: 100,
      unit: '%',
      status: 'healthy'
    },
    {
      name: 'Memory',
      usage: 6.2,
      total: 16,
      unit: 'GB',
      status: 'healthy'
    },
    {
      name: 'Storage',
      usage: 68,
      total: 100,
      unit: '%',
      status: 'warning'
    },
    {
      name: 'Network',
      usage: 23,
      total: 100,
      unit: 'Mbps',
      status: 'healthy'
    }
  ];

  const getAlertColor = (type: string, severity: string) => {
    if (type === 'error') return 'border-l-red-500 bg-red-50';
    if (type === 'warning') return 'border-l-yellow-500 bg-yellow-50';
    return 'border-l-blue-500 bg-blue-50';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return XCircleIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'info': return CheckCircleIcon;
      default: return ClockIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getResourceStatus = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-sarabun">
                แดชบอร์ดระบบ
              </h1>
              <p className="text-red-100 mt-1 font-sarabun">
                แผงควบคุมผู้ดูแลระบบ | ระบบจัดการทุนการศึกษา
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-red-100">สถานะระบบ</p>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-lg font-semibold">ปกติ</p>
                </div>
              </div>
              <Cog6ToothIcon className="h-12 w-12 text-red-200" />
            </div>
          </div>
        </div>
      </div>

      {/* System statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-secondary-700 font-sarabun">
                    {stat.title}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {stat.subtitle}
                  </p>
                </div>
                {stat.trend && (
                  <div className={`text-right ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <p className="text-lg font-semibold">
                      {stat.trend.isPositive ? '+' : '-'}{stat.trend.value}
                    </p>
                    <p className="text-xs">{stat.trend.period}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System alerts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                  การแจ้งเตือนระบบ
                </CardTitle>
                <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  {systemAlerts.filter(alert => alert.status === 'active').length} ใหม่
                </span>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="space-y-0">
                {systemAlerts.map((alert, index) => {
                  const IconComponent = getAlertIcon(alert.type);
                  return (
                    <div key={alert.id} className={`p-6 border-l-4 ${getAlertColor(alert.type, alert.severity)} ${index !== systemAlerts.length - 1 ? 'border-b border-secondary-100' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <IconComponent className="h-5 w-5 text-current mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-secondary-900 font-sarabun">
                                {alert.title}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {alert.severity === 'high' ? 'สูง' : 
                                 alert.severity === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                alert.status === 'active' ? 'bg-red-100 text-red-600' :
                                alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-green-100 text-green-600'
                              }`}>
                                {alert.status === 'active' ? 'ใหม่' : 
                                 alert.status === 'acknowledged' ? 'รับทราบแล้ว' : 'แก้ไขแล้ว'}
                              </span>
                            </div>
                            <p className="text-sm text-secondary-600 mb-2 font-sarabun">
                              {alert.description}
                            </p>
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <p className="text-xs text-secondary-500">{alert.timestamp}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {alert.status === 'active' && (
                            <>
                              <Button size="sm" variant="outline" className="font-sarabun">
                                รับทราบ
                              </Button>
                              <Button size="sm" variant="primary" className="font-sarabun">
                                แก้ไข
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Recent activities */}
          <Card className="mt-8">
            <CardHeader className="border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-sarabun text-secondary-900">
                  กิจกรรมล่าสุด
                </CardTitle>
                <Button variant="outline" size="sm" className="font-sarabun">
                  ดูทั้งหมด
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="space-y-0">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className={`p-6 ${index !== recentActivities.length - 1 ? 'border-b border-secondary-100' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-secondary-900 font-sarabun">
                            {activity.userName}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                            {activity.status === 'success' ? 'สำเร็จ' :
                             activity.status === 'failed' ? 'ล้มเหลว' : 'กำลังดำเนินการ'}
                          </span>
                        </div>
                        <p className="text-sm text-secondary-600 font-sarabun mb-1">
                          {activity.action}: {activity.resource}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-secondary-500">
                          <p>รหัส: {activity.userId}</p>
                          <p>IP: {activity.ipAddress}</p>
                          <p>เบราว์เซอร์: {activity.userAgent}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-secondary-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun text-secondary-900">
                การดำเนินการด่วน
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <Button variant="primary" size="sm" className="w-full justify-start font-sarabun">
                <UsersIcon className="h-4 w-4 mr-2" />
                จัดการผู้ใช้
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                จัดการสิทธิ์
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                <ChartPieIcon className="h-4 w-4 mr-2" />
                รายงานรวม
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                สำรองข้อมูล
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                <Cog6ToothIcon className="h-4 w-4 mr-2" />
                ตั้งค่าระบบ
              </Button>
            </CardBody>
          </Card>

          {/* System resources */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                <ServerIcon className="h-5 w-5 text-blue-500 mr-2" />
                ทรัพยากรระบบ
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              {systemResources.map((resource, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-secondary-700 font-sarabun">
                      {resource.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-semibold ${getResourceStatus(resource.status)}`}>
                        {resource.usage}{resource.unit}
                      </span>
                      <span className="text-xs text-secondary-500">
                        / {resource.total}{resource.unit}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        resource.status === 'healthy' ? 'bg-green-500' :
                        resource.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(resource.usage / (resource.total || 100)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* System status */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-secondary-200">
              <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                สถานะบริการ
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 font-sarabun">เว็บเซอร์วิส</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">ปกติ</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 font-sarabun">ฐานข้อมูล</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">ปกติ</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 font-sarabun">อีเมลเซอร์วิส</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-600 font-medium">ช้า</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 font-sarabun">ไฟล์เซอร์วิส</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">ปกติ</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-secondary-200">
                <Button variant="outline" size="sm" className="w-full font-sarabun">
                  <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                  ดูรายละเอียดระบบ
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
