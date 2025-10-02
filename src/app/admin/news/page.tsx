"use client";

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

// Constants
const NEWS_CATEGORIES = [
  { value: 'announcement', label: 'ประกาศ' },
  { value: 'news', label: 'ข่าวสาร' },
  { value: 'event', label: 'กิจกรรม' },
];

const AdminNewsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
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

  // Helper function to check if user has admin role
  const isAdmin = (userRole: any): boolean => {
    if (!userRole) return false;
    if (typeof userRole === 'string') {
      return ['admin', 'superadmin'].includes(userRole);
    }
    if (typeof userRole === 'object' && userRole.role_name) {
      return ['admin', 'superadmin'].includes(userRole.role_name);
    }
    return false;
  };

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin(user?.role)) {
      toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (user && isAdmin(user?.role)) {
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

  if (!user || !isAdmin(user?.role)) {
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
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
              News Management
            </h1>
            <p className="text-secondary-600 font-sarabun">
              Manage news announcements, articles and activities
            </p>
          </div>
          <Link href="/admin/news/create">
            <Button variant="primary" className="font-sarabun">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add News
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
            <p className="text-sm text-secondary-600 font-sarabun">Total News</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900 font-sarabun">{publishedNews}</p>
            <p className="text-sm text-secondary-600 font-sarabun">Published</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-yellow-50 mb-4">
              <XCircleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900 font-sarabun">{draftNews}</p>
            <p className="text-sm text-secondary-600 font-sarabun">Draft</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
              <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900 font-sarabun">{recentNews}</p>
            <p className="text-sm text-secondary-600 font-sarabun">Last 7 Days</p>
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
                <thead>
                  <tr className="bg-secondary-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      หัวข้อ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      หมวดหมู่
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      วันที่เผยแพร่
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      สถานะ
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider font-sarabun">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {news.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 font-sarabun">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 font-sarabun">
                        <Badge variant={item.category === 'announcement' ? 'default' : item.category === 'event' ? 'secondary' : 'outline'}>
                          {NEWS_CATEGORIES.find(cat => cat.value === item.category)?.label || 'ไม่ระบุ'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 font-sarabun">
                        {formatDate(item.publish_date || '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 font-sarabun">
                        {item.is_published ? (
                          <Badge variant="default">เผยแพร่แล้ว</Badge>
                        ) : (
                          <Badge variant="outline">ฉบับร่าง</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/news/${item.id}`} target="_blank">
                            <Button size="sm" variant="ghost" className="text-secondary-600 hover:text-secondary-900">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/news/edit/${item.id}`}>
                            <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-900">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(item.id)}
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
              <DocumentTextIcon className="h-12 w-12 mx-auto text-secondary-300 mb-2" />
              <p className="text-secondary-500 font-sarabun">ไม่พบข่าวสาร</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && news.length > 0 && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-1">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                ก่อนหน้า
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={pagination.page === page ? 'primary' : 'outline'}
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
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminNewsPage;
