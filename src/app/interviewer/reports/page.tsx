'use client';

import React, { useState } from 'react';
import { 
  ChartBarIcon,
  DocumentChartBarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface ReportData {
  month: string;
  interviews: number;
  evaluations: number;
  avgScore: number;
  recommendations: {
    highly_recommended: number;
    recommended: number;
    not_recommended: number;
  };
}

export default function InterviewerReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: 'ผศ.ดร. สมปอง วิชาการดี',
    role: 'ผู้สัมภาษณ์',
    email: 'interviewer@university.ac.th',
    department: 'คณะสาธารณสุขศาสตร์'
  };

  // Mock report data
  const reportData: ReportData[] = [
    {
      month: 'มกราคม 2567',
      interviews: 25,
      evaluations: 23,
      avgScore: 7.8,
      recommendations: {
        highly_recommended: 8,
        recommended: 12,
        not_recommended: 3
      }
    },
    {
      month: 'ธันวาคม 2566',
      interviews: 30,
      evaluations: 28,
      avgScore: 8.1,
      recommendations: {
        highly_recommended: 12,
        recommended: 14,
        not_recommended: 2
      }
    },
    {
      month: 'พฤศจิกายน 2566',
      interviews: 22,
      evaluations: 22,
      avgScore: 7.5,
      recommendations: {
        highly_recommended: 6,
        recommended: 13,
        not_recommended: 3
      }
    }
  ];

  const currentMonthData = reportData[0];
  
  const stats = [
    {
      title: 'การสัมภาษณ์ทั้งหมด',
      value: currentMonthData.interviews,
      subtitle: 'เดือนนี้',
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'ส่งผลประเมินแล้ว',
      value: currentMonthData.evaluations,
      subtitle: `จาก ${currentMonthData.interviews} ครั้ง`,
      icon: ClipboardDocumentCheckIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%'
    },
    {
      title: 'คะแนนเฉลี่ย',
      value: currentMonthData.avgScore,
      subtitle: 'จากคะแนนเต็ม 10',
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+0.3'
    },
    {
      title: 'แนะนำอย่างยิ่ง',
      value: currentMonthData.recommendations.highly_recommended,
      subtitle: 'จากทั้งหมด',
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5'
    }
  ];

  const getRecommendationPercentage = (type: keyof typeof currentMonthData.recommendations) => {
    const total = Object.values(currentMonthData.recommendations).reduce((sum, val) => sum + val, 0);
    return Math.round((currentMonthData.recommendations[type] / total) * 100);
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      {/* Header - Fixed at top */}
      <Header 
        user={user}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Content Area - Flexbox layout */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar 
          userRole="interviewer"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8">
          <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-8xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                    รายงานการสัมภาษณ์
                  </h1>
                  <p className="text-secondary-600 font-sarabun">
                    สถิติและรายงานการสัมภาษณ์ของคุณ
                  </p>
                </div>
                <div className="flex space-x-3">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-sarabun"
                  >
                    <option value="current_month">เดือนปัจจุบัน</option>
                    <option value="last_month">เดือนที่แล้ว</option>
                    <option value="last_3_months">3 เดือนที่แล้ว</option>
                    <option value="current_year">ปีปัจจุบัน</option>
                  </select>
                  <Button variant="outline" className="font-sarabun">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    ส่งออกรายงาน
                  </Button>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
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
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">
                          {stat.change}
                        </p>
                        <p className="text-xs text-secondary-500">เทียบเดือนก่อน</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Monthly Performance */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-secondary-200">
                    <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                      <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
                      ประสิทธิภาพรายเดือน
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="space-y-6">
                      {reportData.map((data, index) => (
                        <div key={index} className="border-b border-secondary-100 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-secondary-900 font-sarabun">
                              {data.month}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-secondary-600">
                              <span>คะแนนเฉลี่ย: {data.avgScore}</span>
                              <span>ส่งผลแล้ว: {data.evaluations}/{data.interviews}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-700 font-sarabun">แนะนำอย่างยิ่ง</span>
                                <span className="text-lg font-bold text-green-900">{data.recommendations.highly_recommended}</span>
                              </div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-700 font-sarabun">แนะนำ</span>
                                <span className="text-lg font-bold text-blue-900">{data.recommendations.recommended}</span>
                              </div>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-red-700 font-sarabun">ไม่แนะนำ</span>
                                <span className="text-lg font-bold text-red-900">{data.recommendations.not_recommended}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Interview Quality Analysis */}
                <Card className="mt-8">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-secondary-200">
                    <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                      <DocumentChartBarIcon className="h-5 w-5 text-green-500 mr-2" />
                      การวิเคราะห์คุณภาพการสัมภาษณ์
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-secondary-900 font-sarabun mb-3">คะแนนเฉลี่ยตามหมวด</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-secondary-600 font-sarabun">ความรู้วิชาการ</span>
                            <div className="flex items-center">
                              <div className="w-24 bg-secondary-200 rounded-full h-2 mr-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                              <span className="text-sm font-medium">8.5</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-secondary-600 font-sarabun">ทักษะการสื่อสาร</span>
                            <div className="flex items-center">
                              <div className="w-24 bg-secondary-200 rounded-full h-2 mr-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                              </div>
                              <span className="text-sm font-medium">7.8</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-secondary-600 font-sarabun">ภาวะผู้นำ</span>
                            <div className="flex items-center">
                              <div className="w-24 bg-secondary-200 rounded-full h-2 mr-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                              </div>
                              <span className="text-sm font-medium">7.2</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-secondary-600 font-sarabun">แรงจูงใจ</span>
                            <div className="flex items-center">
                              <div className="w-24 bg-secondary-200 rounded-full h-2 mr-2">
                                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                              </div>
                              <span className="text-sm font-medium">8.8</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-secondary-900 font-sarabun mb-3">เวลาเฉลี่ยต่อการสัมภาษณ์</h4>
                        <div className="bg-secondary-50 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-secondary-900 font-sarabun">32</div>
                            <div className="text-sm text-secondary-600 font-sarabun">นาที</div>
                          </div>
                          <div className="mt-4 text-xs text-secondary-500 text-center font-sarabun">
                            เหมาะสมสำหรับการประเมินที่ครอบคลุม
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Sidebar widgets */}
              <div className="space-y-6">
                {/* Recommendation Distribution */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-secondary-200">
                    <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                      <ChartPieIcon className="h-5 w-5 text-purple-500 mr-2" />
                      การแนะนำ (เดือนนี้)
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm font-sarabun">แนะนำอย่างยิ่ง</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{currentMonthData.recommendations.highly_recommended}</span>
                          <span className="text-xs text-secondary-500 ml-1">
                            ({getRecommendationPercentage('highly_recommended')}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm font-sarabun">แนะนำ</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{currentMonthData.recommendations.recommended}</span>
                          <span className="text-xs text-secondary-500 ml-1">
                            ({getRecommendationPercentage('recommended')}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm font-sarabun">ไม่แนะนำ</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{currentMonthData.recommendations.not_recommended}</span>
                          <span className="text-xs text-secondary-500 ml-1">
                            ({getRecommendationPercentage('not_recommended')}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-secondary-200">
                    <CardTitle className="text-lg font-sarabun text-secondary-900">
                      การดำเนินการด่วน
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <Button variant="primary" size="sm" className="w-full justify-start font-sarabun">
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      ส่งออกรายงานเดือนนี้
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                      <DocumentChartBarIcon className="h-4 w-4 mr-2" />
                      รายงานเปรียบเทียบ
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start font-sarabun">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      กำหนดการสัมภาษณ์
                    </Button>
                  </CardBody>
                </Card>

                {/* Performance Tips */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-secondary-200">
                    <CardTitle className="text-lg font-sarabun text-secondary-900">
                      เคล็ดลับการปรับปรุง
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="font-medium text-blue-700 text-sm font-sarabun mb-1">
                        เวลาการสัมภาษณ์
                      </h4>
                      <p className="text-xs text-blue-600">
                        ควรใช้เวลา 30-45 นาที เพื่อการประเมินที่ครอบคลุม
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="font-medium text-green-700 text-sm font-sarabun mb-1">
                        คะแนนสมดุล
                      </h4>
                      <p className="text-xs text-green-600">
                        ให้คะแนนที่สะท้อนความสามารถจริงของผู้สมัคร
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
