"use client";
import { useEffect, useState } from 'react';
import { newsService, News } from '@/services/news.service';
import Link from 'next/link';
import Image from 'next/image';
// import { useAuth } from '@/contexts/AuthContext'; // Not needed for public page
import { UserIcon } from '@heroicons/react/24/outline';
import { Pagination } from '@/components/ui/pagination';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function NewsListPage() {
  // Public page - no authentication required
  const user = null;
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await newsService.getNews({
        published_only: true,
        limit: 20,
        page: page
      });
      
      setNews(response.news);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setError('ไม่สามารถโหลดข่าวสารได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
              <Image 
                src="/images/logo.png" 
                alt="Thammasat University Logo" 
                width={40} 
                height={40} 
                className="object-contain"
              />
            </div>
            <div>
              <Link href="/" className="text-2xl font-bold font-sarabun hover:text-primary-200 transition-colors">
                ระบบทุนการศึกษา
              </Link>
              <p className="text-sm text-primary-200 font-inter">Scholarship Management System</p>
            </div>
          </div>
          {user ? (
            <Link
              href="/dashboard"
              className="bg-white text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-50 transition-colors shadow-md"
            >
              ไปที่หน้าควบคุม
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 bg-white text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-50 transition-colors shadow-md"
            >
              <UserIcon className="h-5 w-5" />
              <span>เข้าสู่ระบบ</span>
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 font-sarabun">ข่าวสารและประกาศ</h1>
        <p className="text-gray-600">
          ข่าวสารและประกาศล่าสุดเกี่ยวกับทุนการศึกษาและกิจกรรมต่างๆ
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
            <button 
              onClick={fetchNews}
              className="ml-4 text-red-600 hover:text-red-800 underline"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-lg text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        ) : news.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3v9m0 0h3m-3 0h-3m-3 4h3m6 0a3 3 0 100-6m-3 3h.01"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ไม่มีข่าวสาร
              </h3>
              <p className="text-gray-500">
                ยังไม่มีข่าวสารหรือประกาศที่เผยแพร่ในขณะนี้
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {item.image_url && (
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>
                      {new Date(item.publish_date || '').toLocaleDateString('th-TH')}
                    </span>
                    {item.category && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {item.category === 'scholarship' ? 'ทุนการศึกษา' :
                         item.category === 'announcement' ? 'ประกาศ' :
                         item.category === 'event' ? 'กิจกรรม' : item.category}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.summary || item.content?.substring(0, 150) + '...'}
                  </p>
                  
                  <Link href={`/news/${item.id}`}>
                    <Button variant="outline" className="w-full">
                      อ่านเพิ่มเติม
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
            
            {/* Pagination */}
            <div className="mt-10">
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
                className="py-4"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-secondary-900 to-primary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Image 
                  src="/images/logo.png" 
                  alt="Thammasat University Logo" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold font-sarabun">ระบบทุนการศึกษา</h3>
                <p className="text-sm text-primary-200 font-inter">Scholarship Management System</p>
              </div>
            </div>
            
            <div className="flex space-x-8">
              <div>
                <h4 className="font-semibold text-white mb-3 font-sarabun">เกี่ยวกับเรา</h4>
                <ul className="space-y-2 text-sm text-primary-100">
                  <li><Link href="/about" className="hover:text-white transition-colors">เกี่ยวกับระบบ</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">ติดต่อเรา</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">คำถามที่พบบ่อย</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3 font-sarabun">ช่วยเหลือ</h4>
                <ul className="space-y-2 text-sm text-primary-100">
                  <li><Link href="/help" className="hover:text-white transition-colors">วิธีการใช้งาน</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">เงื่อนไขการใช้งาน</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="font-sarabun">
              2566 ระบบจัดการทุนการศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์
            </p>
            <p className="text-sm text-secondary-400 mt-1 font-inter">
              Faculty of Economics, Thammasat University | Scholarship Management System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 