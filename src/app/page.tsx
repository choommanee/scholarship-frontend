'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UserIcon } from '@heroicons/react/24/outline';
import { scholarshipService } from '@/services/scholarship.service';
import toast from 'react-hot-toast';
import { newsService } from '@/services/news.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Scholarship } from '@/services/scholarship.service';
import { News } from '@/services/news.service';

// Interface for formatted scholarships for display
interface FormattedScholarship extends Scholarship {
  remainingDays: number;
  applicationProgress: number;
}

// Simple user check without AuthContext
const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

// Mock news data
const newsItems = [
  {
    id: 1,
    title: 'เปิดรับสมัครทุนการศึกษาประจำปี 2566',
    date: '15 มิถุนายน 2566',
    excerpt: 'มหาวิทยาลัยเปิดรับสมัครทุนการศึกษาประจำปี 2566 สำหรับนักศึกษาทุกระดับ',
    image: '/images/news1.jpg',
  },
  {
    id: 2,
    title: 'ประกาศรายชื่อผู้ได้รับทุนประจำปี 2565',
    date: '10 มิถุนายน 2566',
    excerpt: 'ประกาศรายชื่อนักศึกษาที่ได้รับทุนการศึกษาประจำปี 2565 จำนวน 150 ทุน',
    image: '/images/news2.jpg',
  },
  {
    id: 3,
    title: 'การอบรมการเขียนข้อเสนอโครงการวิจัยเพื่อขอรับทุน',
    date: '5 มิถุนายน 2566',
    excerpt: 'ขอเชิญนักศึกษาและคณาจารย์เข้าร่วมการอบรมการเขียนข้อเสนอโครงการวิจัย',
    image: '/images/news3.jpg',
  },
];

// ฟังก์ชันสำหรับจัดรูปแบบวันที่ที่ปลอดภัย
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // ตรวจสอบว่าวันที่ถูกต้องหรือไม่
    if (isNaN(date.getTime())) {
      return 'กำลังดำเนินการ'; // หากวันที่ไม่ถูกต้อง
    }
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'กำลังดำเนินการ';
  }
};

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [scholarships, setScholarships] = useState<FormattedScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<News[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Check user without AuthContext
    setUser(getCurrentUser());
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load scholarships and news in parallel
        const [scholarshipsResponse, newsResponse] = await Promise.allSettled([
          scholarshipService.getPublicScholarships({ limit: 6 }),
          newsService.getNews({ published_only: true, limit: 3 })
        ]);

        // Handle scholarships
        if (scholarshipsResponse.status === 'fulfilled') {
          const formattedScholarships = scholarshipsResponse.value.scholarships.map(scholarship => {
            const endDate = scholarship.application_end_date ? new Date(scholarship.application_end_date) : new Date();
            const today = new Date();
            const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
            const applicationProgress = (scholarship.total_quota && scholarship.total_quota > 0)
              ? Math.round(((scholarship.total_quota - (scholarship.available_quota || 0)) / scholarship.total_quota) * 100)
              : 0;

            return {
              ...scholarship,
              remainingDays,
              applicationProgress
            };
          });
          
          setScholarships(formattedScholarships);
        } else {
          console.error('Failed to load scholarships:', scholarshipsResponse.reason);
        }

        // Handle news
        if (newsResponse.status === 'fulfilled') {
          setNews(newsResponse.value.news);
        } else {
          console.error('Failed to load news:', newsResponse.reason);
        }

      } catch (error) {
        console.error('Failed to load data:', error);
        setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle scholarship detail click - ไม่ต้องตรวจสอบ login เพราะหน้ารายละเอียดทุนเป็น public
  const handleScholarshipClick = (scholarshipId: number | undefined) => {
    // ตรวจสอบค่า scholarshipId ก่อนนำทางไปยังหน้ารายละเอียด
    if (scholarshipId === undefined || isNaN(Number(scholarshipId))) {
      console.error('Invalid scholarship ID:', scholarshipId);
      toast.error('ไม่พบข้อมูลทุนการศึกษา');
      return;
    }
    // ไปที่หน้ารายละเอียดทุนโดยตรง ไม่ว่าจะ login หรือไม่
    router.push(`/scholarships/${scholarshipId}`);
  };

  const handleAllScholarshipsClick = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/scholarships')}`);
    } else {
      router.push('/scholarships');
    }
  };

  // If not mounted yet, show nothing to avoid hydration errors
  if (!mounted) return null;

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
              <h1 className="text-2xl font-bold font-sarabun">ระบบทุนการศึกษา</h1>
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

      {/* Hero section with background image */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-bg.jpg" 
            alt="University Campus" 
            fill 
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 py-24 bg-gradient-to-r from-primary-900/80 to-primary-800/70 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:w-2/3">
              <h2 className="text-4xl md:text-5xl font-bold font-sarabun mb-4 drop-shadow-lg">
                ค้นหาทุนการศึกษาที่เหมาะกับคุณ
              </h2>
              <p className="text-xl font-light font-sarabun mb-8 max-w-3xl drop-shadow-md">
                ระบบจัดการทุนการศึกษาที่ช่วยให้คุณค้นหา สมัคร และติดตามทุนการศึกษาได้อย่างง่ายดาย
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/scholarships"
                  className="bg-white text-primary-700 px-6 py-3 rounded-md text-base font-medium hover:bg-primary-50 transition-colors shadow-md"
                >
                  ค้นหาทุนการศึกษา
                </Link>
                <Link
                  href="/register"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md text-base font-medium hover:bg-white/20 transition-colors shadow-md"
                >
                  ลงทะเบียนเพื่อสมัครทุน
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Scholarships Section with Featured Image */}
          <section className="py-16 bg-gradient-to-b from-white to-secondary-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 font-sarabun mb-4">
                    ทุนการศึกษาที่เปิดรับสมัคร
                  </h2>
                  <p className="text-lg text-secondary-600 font-sarabun max-w-2xl">
                    ทุนการศึกษาจากคณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ที่กำลังเปิดรับสมัครในขณะนี้ โอกาสสำหรับนักศึกษาที่ต้องการพัฒนาศักยภาพและความสามารถ
                  </p>
                </div>
                <div className="md:w-1/3 relative h-64 rounded-2xl overflow-hidden shadow-xl">
                  <Image 
                    src="/images/scholarship1.jpg" 
                    alt="Scholarship Students" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  // Loading skeleton
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-secondary-200 p-6">
                      <div className="animate-pulse">
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-6 w-24 bg-secondary-200 rounded-full"></div>
                          <div className="h-6 w-24 bg-secondary-200 rounded-full"></div>
                        </div>
                        <div className="h-8 w-3/4 bg-secondary-200 rounded mb-4"></div>
                        <div className="space-y-2 mb-4">
                          <div className="h-5 w-full bg-secondary-200 rounded"></div>
                          <div className="h-5 w-full bg-secondary-200 rounded"></div>
                        </div>
                        <div className="h-10 w-32 bg-secondary-200 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : scholarships.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-secondary-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="h-3 bg-gradient-to-r from-primary-500 to-primary-700"></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {scholarship.type}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          {scholarship.status}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold text-secondary-900 font-sarabun line-clamp-2">
                        {scholarship.scholarship_name}
                      </h3>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-secondary-700">
                          <span className="text-sm font-sarabun">จำนวนเงิน:</span>
                          <span className="ml-2 text-sm font-medium font-sarabun">
                            {scholarship.amount.toLocaleString()} บาท
                          </span>
                        </div>
                        <div className="flex items-center text-secondary-700">
                          <span className="text-sm font-sarabun">วันปิดรับสมัคร:</span>
                          <span className="ml-2 text-sm font-medium font-sarabun">
                            {scholarship.application_end_date ? new Date(scholarship.application_end_date).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => handleScholarshipClick(scholarship.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-sarabun"
                        >
                          ดูรายละเอียด
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <button
                  onClick={handleAllScholarshipsClick}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-sarabun transition-all duration-300 hover:scale-105"
                >
                  ดูทุนการศึกษาทั้งหมด
                </button>
              </div>
            </div>
          </section>

          {/* News section */}
          <div>
            <h2 className="text-3xl font-light text-gray-900 mb-6">ข่าวสารและประกาศ</h2>
            <div className="space-y-6">
              {newsLoading ? (
                <div>Loading...</div>
              ) : !news || news.length === 0 ? (
                <div>ไม่พบข่าวสาร</div>
              ) : (
                news.map((item) => (
                  <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{new Date(item.publish_date).toLocaleDateString('th-TH')}</p>
                      <div className="mt-4">
                        <p className="text-base text-gray-500">{item.summary}</p>
                      </div>
                      <div className="mt-4">
                        <Link href={`/news/${item.id}`} className="text-base font-medium text-primary-600 hover:text-primary-500">
                          อ่านเพิ่มเติม
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 text-center">
              <Link href="/news" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                ดูข่าวทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with enhanced design */}
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
              Scholarship Management System, Economics at Thammasat university
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}