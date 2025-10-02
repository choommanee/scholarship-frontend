'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { newsService, CreateNewsRequest } from '@/services/news.service';
import NewsForm from '@/components/news/NewsForm';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CreateNewsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateNewsRequest) => {
    try {
      setIsSubmitting(true);
      await newsService.createNews(data);
      toast.success('สร้างข่าวใหม่สำเร็จ');
      router.push('/admin/news');
    } catch (error) {
      console.error('Failed to create news:', error);
      toast.error('ไม่สามารถสร้างข่าวใหม่ได้');
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-sarabun text-2xl">สร้างข่าวใหม่</CardTitle>
        </CardHeader>
        <CardBody>
          <NewsForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardBody>
      </Card>
    </div>
  );
}
