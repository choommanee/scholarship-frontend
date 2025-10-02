'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { newsService, News, UpdateNewsRequest } from '@/services/news.service';
import NewsForm from '@/components/news/NewsForm';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params?.id as string;

  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch news data
  useEffect(() => {
    if (newsId) {
      fetchNewsData();
    }
  }, [newsId]);

  const fetchNewsData = async () => {
    try {
      setIsLoading(true);
      const newsData = await newsService.getNewsById(newsId);
      setNews(newsData);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      toast.error('ไม่สามารถโหลดข้อมูลข่าวได้');
      router.push('/admin/news');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateNewsRequest) => {
    try {
      setIsSubmitting(true);
      await newsService.updateNews({
        ...data,
        id: newsId
      });
      toast.success('แก้ไขข่าวสำเร็จ');
      router.push('/admin/news');
    } catch (error) {
      console.error('Failed to update news:', error);
      toast.error('ไม่สามารถแก้ไขข่าวได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/news"
          className="inline-flex items-center text-primary-700 hover:text-primary-800 transition-colors font-sarabun"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          กลับไปหน้าจัดการข่าว
        </Link>
      </div>

      {isLoading ? (
        <Card className="mb-6">
          <CardBody>
            <div className="flex justify-center items-center min-h-[300px]">
              <p className="text-gray-500 font-sarabun">กำลังโหลดข้อมูล...</p>
            </div>
          </CardBody>
        </Card>
      ) : !news ? (
        <Card className="mb-6">
          <CardBody>
            <div className="flex justify-center items-center min-h-[300px]">
              <p className="text-red-500 font-sarabun">ไม่พบข้อมูลข่าว</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-sarabun text-2xl">แก้ไขข่าว</CardTitle>
          </CardHeader>
          <CardBody>
            <NewsForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              initialData={news}
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
