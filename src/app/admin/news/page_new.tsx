'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { newsService, News, NewsFilter } from '@/services/news.service';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  BellIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

// Constants
const NEWS_CATEGORIES = [
  { value: 'announcement', label: 'ประกาศ' },
  { value: 'news', label: 'ข่าวสาร' },
  { value: 'event', label: 'กิจกรรม' },
];

const AdminNewsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filter, setFilter] = useState<NewsFilter>({
    page: 1,
    limit: 10,
  });

  // Redirect if not admin
  useEffect(() => {
    if (user && !['admin', 'superadmin'].includes(user?.role || '')) {
      toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (user && ['admin', 'superadmin'].includes(user?.role || '')) {
      fetchNews();
    }
  }, [user, filter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getNews(filter);
      setNews(response.news);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      toast.error('ไม่สามารถโหลดข้อมูลข่าวได้');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setFilter({
      ...filter,
      page,
    });
  };

  const handleSearch = () => {
    setFilter({
      ...filter,
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
      page: 1,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณต้องการลบข่าวนี้ใช่หรือไม่?')) {
      try {
        await newsService.deleteNews(id);
        toast.success('ลบข่าวเรียบร้อยแล้ว');
        fetchNews();
      } catch (error) {
        console.error('Failed to delete news:', error);
        toast.error('ไม่สามารถลบข่าวได้');
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: th });
    } catch (error) {
      return 'วันที่ไม่ถูกต้อง';
    }
  };

  if (!user || !['admin', 'superadmin'].includes(user?.role || '')) {
    return null;
  }

  // Calculate statistics
  const totalNews = pagination.total || 0;
  const publishedNews = news?.filter(item => item.is_published)?.length || 0;
  const draftNews = news?.filter(item => !item.is_published)?.length || 0;
  const recentNews = news?.filter(item => {
    const publishDate = new Date(item.publish_date || '');
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return publishDate >= oneWeekAgo;
  })?.length || 0;

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
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                    จัดการข่าวสาร
                  </h1>
                  <p className="text-secondary-600 font-sarabun">
                    จัดการข่าวประชาสัมพันธ์ ประกาศ และกิจกรรมต่างๆ
                  </p>
                </div>
                <Link href="/admin/news/create">
                  <Button variant="primary" className="font-sarabun">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    เพิ่มข่าวใหม่
                  </Button>
                </Link>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                    <BellIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">{totalNews}</p>
                  <p className="text-sm text-secondary-600 font-sarabun">ข่าวทั้งหมด</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">{publishedNews}</p>
                  <p className="text-sm text-secondary-600 font-sarabun">เผยแพร่แล้ว</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-yellow-50 mb-4">
                    <XCircleIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">{draftNews}</p>
                  <p className="text-sm text-secondary-600 font-sarabun">ฉบับร่าง</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
                    <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">{recentNews}</p>
                  <p className="text-sm text-secondary-600 font-sarabun">7 วันล่าสุด</p>
                </CardBody>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="font-sarabun"
                  >
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    ตัวกรอง
                  </Button>
                  {(searchTerm || selectedCategory) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                        setFilter({
                          page: 1,
                          limit: 10,
                        });
                      }}
                      className="font-sarabun text-red-600 border-red-300 hover:bg-red-50"
                    >
                      ล้างตัวกรอง
                    </Button>
                  )}
                </div>
              </div>

              {showFilters && (
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                          หมวดหมู่
                        </label>
                        <Select
                          placeholder="เลือกหมวดหมู่"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          options={[
                            { value: '', label: 'ทั้งหมด' },
                            ...NEWS_CATEGORIES,
                          ]}
                          className="w-full"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-end">
                        <Button onClick={handleSearch} variant="primary" className="font-sarabun">
                          <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                          ค้นหา
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>

            {/* News List */}
            <Card>
              <CardHeader>
                <CardTitle>รายการข่าวสาร</CardTitle>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-secondary-500">กำลังโหลดข้อมูล...</p>
                  </div>
                ) : news && news.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-200">
                      <thead className="bg-secondary-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            หัวข้อ
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            หมวดหมู่
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            วันที่เผยแพร่
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            สถานะ
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            จัดการ
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-secondary-200">
                        {news.map((item) => (
                          <tr key={item.id} className="hover:bg-secondary-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-secondary-900">{item.title}</div>
                                  <div className="text-sm text-secondary-500 truncate max-w-xs">
                                    {item.short_description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={
                                item.category === 'announcement' ? 'warning' : 
                                item.category === 'news' ? 'info' : 
                                'success'
                              }>
                                {item.category === 'announcement' ? 'ประกาศ' : 
                                 item.category === 'news' ? 'ข่าวสาร' : 
                                 'กิจกรรม'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                              {formatDate(item.publish_date || '')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={item.is_published ? 'success' : 'warning'}>
                                {item.is_published ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Link href={`/news/${item.id}`} target="_blank">
                                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/admin/news/edit/${item.id}`}>
                                  <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-800">
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleDelete(item.id || '')}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-secondary-500">ไม่พบข้อมูลข่าวสาร</p>
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-secondary-700">
                      แสดง {(pagination.page - 1) * pagination.limit + 1} ถึง {Math.min(pagination.page * pagination.limit, pagination.total)} จากทั้งหมด {pagination.total} รายการ
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        ก่อนหน้า
                      </Button>
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === pagination.page ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        ถัดไป
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminNewsPage;
