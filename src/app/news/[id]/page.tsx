"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { newsService, News } from '@/services/news.service';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const newsId = params?.id as string;

  useEffect(() => {
    if (newsId) {
      fetchNews();
      markNewsAsRead();
    }
  }, [newsId]);
  
  const markNewsAsRead = async () => {
    try {
      await newsService.markNewsAsRead(newsId);
    } catch (error) {
      console.error('Failed to mark news as read:', error);
      // Silent fail - don't show error to user as this is a background operation
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getNewsById(newsId);
      setNews(data);
    } catch (error) {
      toast.error('ไม่พบข่าวนี้');
      router.push('/news');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!news) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Link href="/news" className="text-primary-600 hover:underline">← กลับไปหน้าข่าวสาร</Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{news.title}</h1>
      <p className="text-gray-500 mb-4">{new Date(news.publish_date).toLocaleDateString('th-TH')}</p>
      {news.image_url && (
        <div className="mb-6">
          <Image src={news.image_url} alt={news.title} width={800} height={400} className="rounded-lg object-cover" />
        </div>
      )}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
    </div>
  );
} 