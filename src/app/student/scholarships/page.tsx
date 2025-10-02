"use client";

import React, { useState } from "react";
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
} from "@heroicons/react/24/outline";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: number;
  type: string;
  deadline: string;
  status: "open" | "closing_soon" | "closed";
  applicants: number;
  maxApplicants: number;
  requirements: string[];
  provider: string;
  academicYear: string;
  isApplied?: boolean;
  isFavorite?: boolean;
}

const ScholarshipsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const user = {
    name: "นางสาว สมใจ ใจดี",
    role: "นักศึกษา",
    email: "somjai.j@student.mahidol.ac.th",
  };

  const scholarships: Scholarship[] = [
    {
      id: 1,
      name: "ทุนพัฒนาศักยภาพนักศึกษา",
      description:
        "ทุนการศึกษาสำหรับนักศึกษาที่มีผลการเรียนดีและต้องการพัฒนาทักษะในด้านต่างๆ มุ่งเน้นการพัฒนาความเป็นผู้นำและการทำงานเป็นทีม",
      amount: 20000,
      type: "development",
      deadline: "2024-12-31",
      status: "open",
      applicants: 45,
      maxApplicants: 100,
      requirements: [
        "เกรดเฉลีย์ ≥ 3.00",
        "ไม่เคยได้ทุนประเภทนี้",
        "มีกิจกรรมเสริม",
      ],
      provider: "คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
      academicYear: "2567",
      isApplied: false,
      isFavorite: true,
    },
    {
      id: 2,
      name: "ทุนเรียนดี",
      description:
        "ทุนการศึกษาสำหรับนักศึกษาที่มีผลการเรียนดีเยี่ยม มุ่งเน้นการส่งเสริมความเป็นเลิศทางวิชาการ",
      amount: 15000,
      type: "academic",
      deadline: "2024-12-25",
      status: "closing_soon",
      applicants: 78,
      maxApplicants: 80,
      requirements: [
        "เกรดเฉลีย์ ≥ 3.50",
        "นักศึกษาชั้นปีที่ 2-4",
        "ไม่มีวิชา F",
      ],
      provider: "มูลนิธิเพื่อการศึกษา",
      academicYear: "2567",
      isApplied: true,
      isFavorite: false,
    },
    {
      id: 3,
      name: "ทุนช่วยเหลือการศึกษา",
      description:
        "ทุนการศึกษาสำหรับนักศึกษาที่มีฐานะทางเศรษฐกิจยากจน เพื่อสนับสนุนค่าใช้จ่ายในการศึกษา",
      amount: 12000,
      type: "financial_aid",
      deadline: "2024-12-20",
      status: "closing_soon",
      applicants: 120,
      maxApplicants: 150,
      requirements: [
        "รายได้ครอบครัว < 30,000 บาท/เดือน",
        "เกรดเฉลีย์ ≥ 2.50",
        "มีเอกสารรับรองรายได้",
      ],
      provider: "กองทุนสวัสดิการนักศึกษา",
      academicYear: "2567",
      isApplied: false,
      isFavorite: false,
    },
    {
      id: 4,
      name: "ทุนวิจัยระดับปริญญาตรี",
      description:
        "ทุนสนับสนุนการทำวิจัยสำหรับนักศึกษาปริญญาตรี เพื่อส่งเสริมการเรียนรู้และการค้นคว้า",
      amount: 25000,
      type: "research",
      deadline: "2025-01-15",
      status: "open",
      applicants: 23,
      maxApplicants: 50,
      requirements: [
        "นักศึกษาชั้นปีที่ 3-4",
        "มีโครงการวิจัย",
        "เกรดเฉลีย์ ≥ 3.25",
      ],
      provider: "สำนักงานคณะกรรมการวิจัยแห่งชาติ",
      academicYear: "2567",
      isApplied: false,
      isFavorite: true,
    },
    {
      id: 5,
      name: "ทุนกิจกรรมนักศึกษา",
      description:
        "ทุนสำหรับนักศึกษาที่เข้าร่วมกิจกรรมเสริมหลักสูตรและกิจกรรมเพื่อสังคม",
      amount: 8000,
      type: "activity",
      deadline: "2024-12-15",
      status: "closed",
      applicants: 200,
      maxApplicants: 200,
      requirements: [
        "เข้าร่วมกิจกรรม ≥ 20 ชั่วโมง",
        "มีใบรับรองจากอาจารย์ที่ปรึกษา",
      ],
      provider: "กองกิจการนักศึกษา",
      academicYear: "2567",
      isApplied: false,
      isFavorite: false,
    },
    {
      id: 6,
      name: "ทุนความเป็นเลิศทางวิชาการ",
      description:
        "ทุนสำหรับนักศึกษาที่มีผลการเรียนดีเยี่ยมและมีความสามารถพิเศษ",
      amount: 30000,
      type: "excellence",
      deadline: "2025-01-31",
      status: "open",
      applicants: 12,
      maxApplicants: 25,
      requirements: [
        "เกรดเฉลีย์ ≥ 3.75",
        "อันดับ 10% แรกของคณะ",
        "มีผลงานพิเศษ",
      ],
      provider: "คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
      academicYear: "2567",
      isApplied: false,
      isFavorite: false,
    },
  ];

  const scholarshipTypes = [
    { value: "all", label: "ทุกประเภท" },
    { value: "academic", label: "ทุนเรียนดี" },
    { value: "financial_aid", label: "ทุนช่วยเหลือ" },
    { value: "research", label: "ทุนวิจัย" },
    { value: "development", label: "ทุนพัฒนาศักยภาพ" },
    { value: "activity", label: "ทุนกิจกรรม" },
    { value: "excellence", label: "ทุนความเป็นเลิศ" },
  ];

  const statusOptions = [
    { value: "all", label: "ทุกสถานะ" },
    { value: "open", label: "เปิดรับสมัคร" },
    { value: "closing_soon", label: "ใกล้ปิดรับสมัคร" },
    { value: "closed", label: "ปิดรับสมัครแล้ว" },
  ];

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || scholarship.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || scholarship.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closing_soon":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "เปิดรับสมัคร";
      case "closing_soon":
        return "ใกล้ปิดรับสมัคร";
      case "closed":
        return "ปิดรับสมัครแล้ว";
      default:
        return "ไม่ทราบสถานะ";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "academic":
      case "excellence":
        return AcademicCapIcon;
      case "research":
        return ClockIcon;
      default:
        return BanknotesIcon;
    }
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative">
        <Sidebar
          userRole="student"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8">
          <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-8xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                ทุนการศึกษา
              </h1>
              <p className="text-secondary-600 font-sarabun">
                ค้นหาและสมัครทุนการศึกษาที่เหมาะสมกับคุณ
              </p>
            </div>

            {/* Search and filters */}
            <Card className="mb-8">
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="ค้นหาทุนการศึกษา..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="font-sarabun"
                  >
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    ตัวกรอง
                  </Button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-secondary-200">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        ประเภททุน
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      >
                        {scholarshipTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        สถานะ
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {scholarships.length}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    ทุนทั้งหมด
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {scholarships.filter((s) => s.status === "open").length}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    เปิดรับสมัคร
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-yellow-50 mb-4">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {
                      scholarships.filter((s) => s.status === "closing_soon")
                        .length
                    }
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    ใกล้ปิดรับสมัคร
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
                    <HeartIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {scholarships.filter((s) => s.isFavorite).length}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    ทุนที่สนใจ
                  </p>
                </CardBody>
              </Card>
            </div>

            {/* Scholarships list */}
            <div className="space-y-6">
              {filteredScholarships.length === 0 ? (
                <Card>
                  <CardBody className="p-12 text-center">
                    <div className="inline-flex p-4 rounded-full bg-secondary-100 mb-4">
                      <AcademicCapIcon className="h-8 w-8 text-secondary-400" />
                    </div>
                    <h3 className="text-lg font-medium text-secondary-900 font-sarabun mb-2">
                      ไม่พบทุนการศึกษา
                    </h3>
                    <p className="text-secondary-600 font-sarabun">
                      ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูทุนการศึกษาอื่นๆ
                    </p>
                  </CardBody>
                </Card>
              ) : (
                filteredScholarships.map((scholarship) => {
                  const TypeIcon = getTypeIcon(scholarship.type);
                  const daysLeft = getDaysLeft(scholarship.deadline);

                  return (
                    <Card
                      key={scholarship.id}
                      className="hover:shadow-lg transition-shadow duration-200"
                    >
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="inline-flex p-3 rounded-xl bg-blue-50">
                              <TypeIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-xl font-bold text-secondary-900 font-sarabun">
                                  {scholarship.name}
                                </h3>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                    scholarship.status
                                  )}`}
                                >
                                  {getStatusText(scholarship.status)}
                                </span>
                                {scholarship.isApplied && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                                    สมัครแล้ว
                                  </span>
                                )}
                                {scholarship.isFavorite && (
                                  <HeartIcon className="h-5 w-5 text-red-500 fill-current" />
                                )}
                              </div>
                              <p className="text-secondary-600 font-sarabun mb-4">
                                {scholarship.description}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-secondary-500 font-sarabun">
                                    จำนวนเงิน
                                  </p>
                                  <p className="font-semibold text-green-600">
                                    {scholarship.amount.toLocaleString()} บาท
                                  </p>
                                </div>
                                <div>
                                  <p className="text-secondary-500 font-sarabun">
                                    ผู้สนับสนุน
                                  </p>
                                  <p className="font-medium text-secondary-900 font-sarabun">
                                    {scholarship.provider}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-secondary-500 font-sarabun">
                                    ผู้สมัคร
                                  </p>
                                  <p className="font-medium text-secondary-900">
                                    {scholarship.applicants}/
                                    {scholarship.maxApplicants} คน
                                  </p>
                                </div>
                                <div>
                                  <p className="text-secondary-500 font-sarabun">
                                    กำหนดปิดรับสมัคร
                                  </p>
                                  <div className="flex items-center space-x-1">
                                    <CalendarDaysIcon className="h-4 w-4 text-secondary-400" />
                                    <p className="font-medium text-secondary-900">
                                      {new Date(
                                        scholarship.deadline
                                      ).toLocaleDateString("th-TH")}
                                    </p>
                                  </div>
                                  {daysLeft > 0 &&
                                    scholarship.status !== "closed" && (
                                      <p
                                        className={`text-xs ${
                                          daysLeft <= 7
                                            ? "text-red-600"
                                            : "text-green-600"
                                        }`}
                                      >
                                        เหลือ {daysLeft} วัน
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Requirements */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-secondary-700 font-sarabun mb-2">
                            คุณสมบัติผู้สมัคร:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {scholarship.requirements.map((req, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-secondary-600 mb-1">
                            <span>ความคืบหน้าการสมัคร</span>
                            <span>
                              {Math.round(
                                (scholarship.applicants /
                                  scholarship.maxApplicants) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-secondary-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (scholarship.applicants /
                                    scholarship.maxApplicants) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <Link
                              href={`/student/scholarships/${scholarship.id}`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="font-sarabun"
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                ดูรายละเอียด
                              </Button>
                            </Link>
                            {scholarship.status === "open" &&
                              !scholarship.isApplied && (
                                <Link
                                  href={`/student/scholarships/${scholarship.id}/apply`}
                                >
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="font-sarabun"
                                  >
                                    สมัครเลย
                                  </Button>
                                </Link>
                              )}
                            {scholarship.isApplied && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="font-sarabun"
                              >
                                สมัครแล้ว
                              </Button>
                            )}
                            {scholarship.status === "closed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="font-sarabun"
                              >
                                ปิดรับสมัครแล้ว
                              </Button>
                            )}
                          </div>
                          <button className="p-2 hover:bg-secondary-50 rounded-lg transition-colors">
                            <HeartIcon
                              className={`h-5 w-5 ${
                                scholarship.isFavorite
                                  ? "text-red-500 fill-current"
                                  : "text-secondary-400"
                              }`}
                            />
                          </button>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Load more button */}
            {filteredScholarships.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" className="font-sarabun">
                  โหลดเพิ่มเติม
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScholarshipsPage;
