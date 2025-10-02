"use client";
import { useEffect, useState } from 'react';
import { scholarshipService, Scholarship } from '@/services/scholarship.service';
import Link from 'next/link';

export default function ScholarshipsListPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchScholarships();
  }, [page]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const response = await scholarshipService.getScholarships({ status: 'open', page, limit: 10 });
      setScholarships(response.scholarships);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">ทุนการศึกษาที่เปิดรับสมัคร</h1>
      {loading ? (
        <div>Loading...</div>
      ) : scholarships.length === 0 ? (
        <div>ไม่พบทุนการศึกษา</div>
      ) : (
        <div className="space-y-6">
          {scholarships.map((item) => (
            <div key={item.id} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="mb-2">จำนวนเงิน: {item.amount.toLocaleString()} บาท</p>
              <p className="mb-2">วันปิดรับสมัคร: {new Date(item.applicationDeadline).toLocaleDateString('th-TH')}</p>
              <Link href={`/scholarships/${item.id}`} className="text-primary-600 hover:underline">ดูรายละเอียด</Link>
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${p === page ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
} 