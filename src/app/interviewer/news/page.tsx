'use client';

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  UserIcon,
  EyeIcon,
  TagIcon,
  ClockIcon,
  BellIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'scholarship' | 'interview' | 'system';
  author: string;
  publishDate: string;
  isImportant: boolean;
  tags: string[];
  readCount: number;
}

export default function InterviewerNewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: 'ผศ.ดร. สมปอง วิชาการดี',
    role: 'ผู้สัมภาษณ์',
    email: 'interviewer@university.ac.th',
    department: 'คณะสาธารณสุขศาสตร์'
  };

  // Mock news data
  const newsItems: NewsItem[] = [
    {
      id: 'NEWS001',
      title: 'แนวทางการสัมภาษณ์ทุนการศึกษา ประจำปี 2567',
      content: 'ประกาศแนวทางและเกณฑ์การสัมภาษณ์ทุนการศึกษาสำหรับผู้สัมภาษณ์ ประจำปีการศึกษา 2567 เพื่อให้การประเมินเป็นไปในทิศทางเดียวกัน...',
      category: 'interview',
      author: 'งานทุนการศึกษา',
      publishDate: '2024-01-20',
      isImportant: true,
      tags: ['การสัมภาษณ์', 'เกณฑ์การประเมิน', 'แนวทาง'],
      readCount: 245
    },
    {
      id: 'NEWS002',
      title: 'กำหนดการสัมภาษณ์ทุนการศึกษา เดือนกุมภาพันธ์ 2567',
      content: 'ประกาศกำหนดการสัมภาษณ์ทุนการศึกษาประจำเดือนกุมภาพันธ์ 2567 โดยจะมีการสัมภาษณ์ทั้งหมด 5 รอบ ในช่วงวันที่ 5-25 กุมภาพันธ์...',
      category: 'announcement',
      author: 'งานทุนการศึกษา',
      publishDate: '2024-01-18',
      isImportant: true,
      tags: ['กำหนดการ', 'การสัมภาษณ์', 'กุมภาพันธ์'],
      readCount: 189
    },
    {
      id: 'NEWS003',
      title: 'อัปเดตระบบการประเมินออนไลน์',
      content: 'ระบบการประเมินผลการสัมภาษณ์ออนไลน์ได้รับการปรับปรุงใหม่ เพิ่มฟีเจอร์การบันทึกเสียงและการให้คะแนนแบบละเอียด...',
      category: 'system',
      author: 'ฝ่ายเทคโนโลยี',
      publishDate: '2024-01-15',
      isImportant: false,
      tags: ['ระบบ', 'การประเมิน', 'ออนไลน์'],
      readCount: 156
    },
    {
      id: 'NEWS004',
      title: 'ทุนการศึกษาใหม่ "ทุนเพื่อความเป็นเลิศ"',
      content: 'เปิดรับสมัครทุนการศึกษาใหม่ "ทุนเพื่อความเป็นเลิศ" สำหรับนักศึกษาที่มีผลการเรียนดีเยี่ยม จำนวน 50,000 บาท...',
      category: 'scholarship',
      author: 'งานทุนการศึกษา',
      publishDate: '2024-01-12',
      isImportant: false,
      tags: ['ทุนใหม่', 'ความเป็นเลิศ', 'รับสมัคร'],
      readCount: 298
    },
    {
      id: 'NEWS005',
      title: 'การประชุมผู้สัมภาษณ์ประจำเดือน',
      content: 'ขอเชิญผู้สัมภาษณ์ทุกท่านเข้าร่วมการประชุมประจำเดือน วันที่ 30 มกราคม 2567 เวลา 14:00 น. ณ ห้องประชุมใหญ่...',
      category: 'announcement',
      author: 'งานทุนการศึกษา',
      publishDate: '2024-01-10',
      isImportant: false,
      tags: ['การประชุม', 'ผู้สัมภาษณ์', 'ประจำเดือน'],
      readCount: 123
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'text-blue-600 bg-blue-50';
      case 'scholarship': return 'text-green-600 bg-green-50';
      case 'interview': return 'text-purple-600 bg-purple-50';
      case 'system': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'announcement': return 'ประกาศ';
      case 'scholarship': return 'ทุนการศึกษา';
      case 'interview': return 'การสัมภาษณ์';
      case 'system': return 'ระบบ';
      default: return 'อื่นๆ';
    }
  };

  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: newsItems.length,
    important: newsItems.filter(n => n.isImportant).length,
    interview: newsItems.filter(n => n.category === 'interview').length,
    announcement: newsItems.filter(n => n.category === 'announcement').length
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
                    ข่าวสารและประกาศ
                  </h1>
                  <p className="text-secondary-600 font-sarabun">
                    ข่าวสารและประกาศสำหรับผู้สัมภาษณ์
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <BellIcon className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-blue-600 font-sarabun">ทั้งหมด</p>
                      <p className="text-2xl font-bold text-blue-900 font-sarabun">{stats.total}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-8 w-8 text-red-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-red-600 font-sarabun">สำคัญ</p>
                      <p className="text-2xl font-bold text-red-900 font-sarabun">{stats.important}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <UserIcon className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-purple-600 font-sarabun">การสัมภาษณ์</p>
                      <p className="text-2xl font-bold text-purple-900 font-sarabun">{stats.interview}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-8 w-8 text-green-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-green-600 font-sarabun">ประกาศ</p>
                      <p className="text-2xl font-bold text-green-900 font-sarabun">{stats.announcement}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                      <Input
                        type="text"
                        placeholder="ค้นหาข่าวสาร..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 font-sarabun"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-48">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-sarabun"
                    >
                      <option value="all">หมวดหมู่ทั้งหมด</option>
                      <option value="announcement">ประกาศ</option>
                      <option value="interview">การสัมภาษณ์</option>
                      <option value="scholarship">ทุนการศึกษา</option>
                      <option value="system">ระบบ</option>
                    </select>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* News List */}
            <div className="space-y-6">
              {filteredNews.map((news) => (
                <Card key={news.id} className="hover:shadow-lg transition-shadow">
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {news.isImportant && (
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sarabun ${getCategoryColor(news.category)}`}>
                            <TagIcon className="h-3 w-3 mr-1" />
                            {getCategoryText(news.category)}
                          </span>
                          <span className="text-sm text-secondary-500 font-sarabun">
                            {new Date(news.publishDate).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-secondary-900 font-sarabun mb-2">
                          {news.title}
                        </h3>
                        
                        <p className="text-secondary-600 font-sarabun mb-4 line-clamp-2">
                          {news.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-secondary-500 font-sarabun">
                            <span>โดย {news.author}</span>
                            <span className="flex items-center">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              {news.readCount} ครั้ง
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {news.tags.map((tag, index) => (
                              <span key={index} className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded font-sarabun">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <Button size="sm" variant="outline" className="font-sarabun">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          อ่านเพิ่มเติม
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}

              {filteredNews.length === 0 && (
                <Card>
                  <CardBody className="text-center py-12">
                    <BellIcon className="mx-auto h-12 w-12 text-secondary-400" />
                    <h3 className="mt-2 text-sm font-medium text-secondary-900 font-sarabun">ไม่พบข่าวสาร</h3>
                    <p className="mt-1 text-sm text-secondary-500 font-sarabun">
                      ไม่มีข่าวสารที่ตรงกับเงื่อนไขการค้นหา
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
