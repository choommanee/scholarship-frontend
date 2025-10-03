"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  HeartIcon,
  UserGroupIcon,
  SparklesIcon,
  TrophyIcon,
  BeakerIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { scholarshipService, Scholarship } from "@/services/scholarship.service";
import toast from "react-hot-toast";

const ScholarshipsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const user = {
    name: "นางสาว สมใจ ใจดี",
    role: "นักศึกษา",
    email: "somjai.j@student.mahidol.ac.th",
  };

  useEffect(() => {
    loadScholarships();
    loadFavorites();
  }, [page, selectedType, searchTerm]);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      const response = await scholarshipService.getPublicScholarships({
        search: searchTerm || undefined,
        type: selectedType !== "all" ? selectedType : undefined,
        page,
        limit: 10,
      });

      const transformedScholarships = (response.scholarships || []).map((s: any) => {
        const now = new Date();
        const startDate = new Date(s.application_start_date);
        const endDate = new Date(s.application_end_date);
        const isOpen = now >= startDate && now <= endDate && s.is_active;

        return {
          id: s.scholarship_id,
          name: s.scholarship_name,
          description: s.source?.description || "ไม่มีคำอธิบาย",
          amount: s.amount,
          type: s.scholarship_type,
          deadline: s.application_end_date,
          status: isOpen ? "open" : "closed",
          requirements: [],
          applicants: s.total_quota - s.available_quota,
          maxApplicants: s.total_quota,
          isApplied: false,
          provider: s.source?.source_name || "ไม่ระบุ",
          scholarship_id: s.scholarship_id,
          scholarship_name: s.scholarship_name,
          scholarship_type: s.scholarship_type,
          total_quota: s.total_quota,
          available_quota: s.available_quota,
          application_start_date: s.application_start_date,
          application_end_date: s.application_end_date,
          eligibility_criteria: s.eligibility_criteria,
          required_documents: s.required_documents,
          interview_required: s.interview_required,
          is_active: s.is_active,
          source: s.source,
        };
      });

      setScholarships(transformedScholarships);
      setTotalPages(Math.ceil((response.total || 0) / 10));
    } catch (error: any) {
      console.error("Error loading scholarships:", error);
      toast.error(error.message || "ไม่สามารถโหลดข้อมูลทุนการศึกษาได้");
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("scholarship_favorites");
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    }
  };

  const toggleFavorite = (scholarshipId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(scholarshipId)) {
      newFavorites.delete(scholarshipId);
      toast.success("ลบออกจากรายการโปรดแล้ว");
    } else {
      newFavorites.add(scholarshipId);
      toast.success("เพิ่มในรายการโปรดแล้ว");
    }
    setFavorites(newFavorites);
    if (typeof window !== "undefined") {
      localStorage.setItem("scholarship_favorites", JSON.stringify(Array.from(newFavorites)));
    }
  };

  const getTypeGradient = (type: string) => {
    const gradients: { [key: string]: string } = {
      academic_excellence: "from-blue-500 to-indigo-600",
      financial_aid: "from-green-500 to-emerald-600",
      research: "from-purple-500 to-violet-600",
      special_talent: "from-orange-500 to-amber-600",
      athlete: "from-red-500 to-rose-600",
      disability_support: "from-cyan-500 to-teal-600",
      moral_character: "from-pink-500 to-fuchsia-600",
      innovation: "from-yellow-500 to-orange-600",
      exchange_program: "from-indigo-500 to-blue-600",
      default: "from-gray-500 to-slate-600",
    };
    return gradients[type] || gradients.default;
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      academic_excellence: AcademicCapIcon,
      financial_aid: BanknotesIcon,
      research: BeakerIcon,
      special_talent: SparklesIcon,
      athlete: TrophyIcon,
      disability_support: ShieldCheckIcon,
      moral_character: CheckCircleIcon,
      innovation: SparklesIcon,
      exchange_program: GlobeAltIcon,
    };
    return icons[type] || AcademicCapIcon;
  };

  const getTypeName = (type: string) => {
    const names: { [key: string]: string } = {
      academic_excellence: "ทุนส่งเสริมความเป็นเลิศ",
      financial_aid: "ทุนช่วยเหลือทางการเงิน",
      research: "ทุนวิจัย",
      special_talent: "ทุนพัฒนาทักษะพิเศษ",
      athlete: "ทุนนักกีฬา",
      disability_support: "ทุนสนับสนุนผู้พิการ",
      moral_character: "ทุนคุณธรรม",
      innovation: "ทุนนวัตกรรม",
      exchange_program: "ทุนแลกเปลี่ยน",
    };
    return names[type] || "ทุนการศึกษา";
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = scholarship.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userRole="student"
        />
        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <AcademicCapIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-sarabun">
                    ทุนการศึกษา
                  </h1>
                  <p className="text-blue-100 font-sarabun mt-1">
                    ค้นหาทุนการศึกษาที่เหมาะกับคุณ
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-blue-100">ทุนทั้งหมด</p>
                  <p className="text-2xl font-bold">{scholarships.length} ทุน</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-blue-100">เปิดรับสมัคร</p>
                  <p className="text-2xl font-bold">
                    {scholarships.filter((s) => s.status === "open").length} ทุน
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-blue-100">วันนี้</p>
                  <p className="text-2xl font-bold">
                    {new Date().toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <Card className="shadow-lg">
              <CardBody className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="ค้นหาทุนการศึกษา..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 py-3 text-base"
                      />
                    </div>
                  </div>
                  <Button
                    variant={showFilters ? "primary" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2"
                  >
                    <FunnelIcon className="h-5 w-5" />
                    <span>ตัวกรอง</span>
                  </Button>
                </div>

                {showFilters && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: "all", label: "ทั้งหมด" },
                        { value: "academic_excellence", label: "ความเป็นเลิศ" },
                        { value: "financial_aid", label: "ช่วยเหลือการเงิน" },
                        { value: "research", label: "วิจัย" },
                        { value: "athlete", label: "นักกีฬา" },
                        { value: "innovation", label: "นวัตกรรม" },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setSelectedType(type.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedType === type.value
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Scholarships Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">กำลังโหลด...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredScholarships.map((scholarship) => {
                const TypeIcon = getTypeIcon(scholarship.type);
                const daysLeft = getDaysLeft(scholarship.deadline);
                const isFavorite = favorites.has(scholarship.id);
                const progress =
                  (scholarship.applicants / scholarship.maxApplicants) * 100;

                return (
                  <Card
                    key={scholarship.id}
                    className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Gradient Header */}
                    <div
                      className={`h-2 bg-gradient-to-r ${getTypeGradient(
                        scholarship.type
                      )}`}
                    ></div>

                    <CardBody className="p-6">
                      {/* Header with Icon and Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4 flex-1">
                          <div
                            className={`p-4 rounded-2xl bg-gradient-to-br ${getTypeGradient(
                              scholarship.type
                            )} shadow-lg`}
                          >
                            <TypeIcon className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {getTypeName(scholarship.type)}
                              </span>
                              {scholarship.status === "open" && (
                                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                  เปิดรับสมัคร
                                </span>
                              )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 font-sarabun group-hover:text-blue-600 transition-colors">
                              {scholarship.name}
                            </h3>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(scholarship.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {isFavorite ? (
                            <HeartSolidIcon className="h-6 w-6 text-red-500" />
                          ) : (
                            <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
                          )}
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-6 line-clamp-2">
                        {scholarship.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Amount */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <BanknotesIcon className="h-5 w-5 text-green-600" />
                            <p className="text-xs text-green-700 font-medium">
                              จำนวนเงิน
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {scholarship.amount.toLocaleString()}
                            <span className="text-sm font-normal ml-1">บาท</span>
                          </p>
                        </div>

                        {/* Deadline */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <ClockIcon className="h-5 w-5 text-orange-600" />
                            <p className="text-xs text-orange-700 font-medium">
                              เหลือเวลา
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-orange-600">
                            {daysLeft > 0 ? daysLeft : 0}
                            <span className="text-sm font-normal ml-1">วัน</span>
                          </p>
                        </div>

                        {/* Provider */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 col-span-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-blue-700 font-medium mb-1">
                                ผู้สนับสนุน
                              </p>
                              <p className="text-base font-bold text-blue-900">
                                {scholarship.provider}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-blue-700 font-medium mb-1">
                                ผู้สมัคร
                              </p>
                              <div className="flex items-center space-x-2">
                                <UserGroupIcon className="h-5 w-5 text-blue-600" />
                                <p className="text-base font-bold text-blue-900">
                                  {scholarship.applicants}/
                                  {scholarship.maxApplicants}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>ความคืบหน้า</span>
                          <span className="font-bold">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getTypeGradient(
                              scholarship.type
                            )}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/student/scholarships/${scholarship.id}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full font-sarabun group/btn"
                          >
                            <EyeIcon className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                            ดูรายละเอียด
                          </Button>
                        </Link>
                        {scholarship.status === "open" &&
                          !scholarship.isApplied && (
                            <Link
                              href={`/student/scholarships/${scholarship.id}/apply`}
                              className="flex-1"
                            >
                              <Button
                                variant="primary"
                                className={`w-full font-sarabun bg-gradient-to-r ${getTypeGradient(
                                  scholarship.type
                                )} hover:shadow-lg transform hover:scale-105 transition-all`}
                              >
                                สมัครเลย
                              </Button>
                            </Link>
                          )}
                        {scholarship.isApplied && (
                          <Button
                            variant="outline"
                            disabled
                            className="flex-1 font-sarabun"
                          >
                            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
                            สมัครแล้ว
                          </Button>
                        )}
                        {scholarship.status === "closed" && (
                          <Button
                            variant="outline"
                            disabled
                            className="flex-1 font-sarabun"
                          >
                            ปิดรับสมัครแล้ว
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ก่อนหน้า
              </Button>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                ถัดไป
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ScholarshipsPage;
