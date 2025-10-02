"use client";

import React, { useState } from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import InterviewCalendar, { InterviewSlot } from "@/components/interview/InterviewCalendar";

interface Interview {
  id: string;
  applicationId: string;
  scholarshipName: string;
  scholarshipAmount: number;
  date: string;
  time: string;
  duration: number;
  location: string;
  building?: string;
  floor?: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
  interviewers: Interviewer[];
  instructions?: string;
  requirements?: string[];
  result?: InterviewResult;
  bookingDeadline?: string;
  canReschedule?: boolean;
  confirmationRequired?: boolean;
}

interface Interviewer {
  id: string;
  name: string;
  title: string;
  department: string;
  email?: string;
  phone?: string;
}

interface InterviewResult {
  overallScore: number;
  maxScore: number;
  recommendation: "highly_recommended" | "recommended" | "not_recommended";
  feedback: string;
  submittedDate: string;
}

const InterviewsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<'scheduled' | 'book'>('scheduled');

  const user = {
    name: "นางสาว สมใจ ใจดี",
    role: "นักศึกษา",
    email: "somjai.j@student.mahidol.ac.th",
  };

  const interviews: Interview[] = [
    {
      id: "INT001",
      applicationId: "APP001",
      scholarshipName: "ทุนพัฒนาศักยภาพนักศึกษา",
      scholarshipAmount: 20000,
      date: "2024-12-18",
      time: "14:00",
      duration: 30,
      location: "ห้อง SC 301",
      building: "อาคารศูนย์การเรียนรู้",
      floor: "ชั้น 3",
      status: "confirmed",
      interviewers: [
        {
          id: "INT_001",
          name: "ผศ.ดร. สมปอง วิชาการดี",
          title: "ผู้อำนวยการกองทุน",
          department: "คณะสาธารณสุขศาสตร์",
          email: "sompong.w@mahidol.ac.th",
          phone: "02-441-9000 ต่อ 1234",
        },
        {
          id: "INT_002",
          name: "อ.ดร. วิไลวรรณ จัดการดี",
          title: "เจ้าหน้าที่ทุนการศึกษา",
          department: "งานกิจการนักศึกษา",
          email: "wilaiwan.j@mahidol.ac.th",
        },
      ],
      instructions: "กรุณามาถึงก่อนเวลา 15 นาที และนำเอกสารประจำตัวมาด้วย",
      requirements: [
        "บัตรประชาชนหรือบัตรนักศึกษา",
        "สำเนาใบแสดงผลการเรียนล่าสุด",
        "แผนการใช้ทุนการศึกษา (1 หน้า)",
      ],
      confirmationRequired: true,
    },
    {
      id: "INT002",
      applicationId: "APP002",
      scholarshipName: "ทุนเรียนดี",
      scholarshipAmount: 15000,
      date: "2024-12-05",
      time: "10:00",
      duration: 45,
      location: "ห้อง AD 205",
      building: "อาคารบริหาร",
      floor: "ชั้น 2",
      status: "completed",
      interviewers: [
        {
          id: "INT_003",
          name: "รศ.ดร. อนุชา เก่งมาก",
          title: "หัวหน้าคณะกรรมการทุน",
          department: "คณะแพทยศาสตร์",
          email: "anucha.k@mahidol.ac.th",
        },
      ],
      result: {
        overallScore: 85,
        maxScore: 100,
        recommendation: "highly_recommended",
        feedback:
          "นักศึกษามีแรงจูงใจในการเรียนสูง มีแผนการใช้ทุนที่ชัดเจน และมีความรับผิดชอบต่อสังคม",
        submittedDate: "2024-12-05",
      },
    },
    {
      id: "INT003",
      applicationId: "APP003",
      scholarshipName: "ทุนช่วยเหลือการศึกษา",
      scholarshipAmount: 12000,
      date: "2024-12-22",
      time: "09:30",
      duration: 30,
      location: "ห้อง SW 102",
      building: "อาคารสวัสดิการนักศึกษา",
      floor: "ชั้น 1",
      status: "scheduled",
      interviewers: [
        {
          id: "INT_004",
          name: "อ.สมหมาย ช่วยเหลือ",
          title: "เจ้าหน้าที่สวัสดิการ",
          department: "กองกิจการนักศึกษา",
          email: "sommai.c@mahidol.ac.th",
          phone: "02-441-9000 ต่อ 5678",
        },
      ],
      bookingDeadline: "2024-12-20",
      canReschedule: true,
      confirmationRequired: true,
      instructions: "กรุณาเตรียมเอกสารรับรองรายได้ครอบครัวมาด้วย",
    },
    {
      id: "INT004",
      applicationId: "APP004",
      scholarshipName: "ทุนวิจัยระดับปริญญาตรี",
      scholarshipAmount: 25000,
      date: "2024-11-28",
      time: "16:00",
      duration: 60,
      location: "ห้อง RS 401",
      building: "อาคารวิจัย",
      floor: "ชั้น 4",
      status: "no_show",
      interviewers: [
        {
          id: "INT_005",
          name: "ศ.ดร. วิจัย ค้นคว้า",
          title: "หัวหน้าศูนย์วิจัย",
          department: "สำนักงานคณะกรรมการวิจัย",
          email: "wichai.k@mahidol.ac.th",
        },
      ],
    },
  ];

  const statusOptions = [
    { value: "all", label: "ทุกสถานะ" },
    { value: "scheduled", label: "จองแล้ว" },
    { value: "confirmed", label: "ยืนยันแล้ว" },
    { value: "completed", label: "เสร็จสิ้น" },
    { value: "cancelled", label: "ยกเลิก" },
    { value: "no_show", label: "ไม่มาสัมภาษณ์" },
  ];

  const filteredInterviews = interviews.filter((interview) => {
    return selectedStatus === "all" || interview.status === selectedStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "no_show":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "จองแล้ว";
      case "confirmed":
        return "ยืนยันแล้ว";
      case "completed":
        return "เสร็จสิ้น";
      case "cancelled":
        return "ยกเลิก";
      case "no_show":
        return "ไม่มาสัมภาษณ์";
      default:
        return "ไม่ทราบสถานะ";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return CalendarDaysIcon;
      case "confirmed":
        return CheckCircleIcon;
      case "completed":
        return StarIcon;
      case "cancelled":
        return XCircleIcon;
      case "no_show":
        return ExclamationTriangleIcon;
      default:
        return CalendarDaysIcon;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "highly_recommended":
        return "text-green-600";
      case "recommended":
        return "text-blue-600";
      case "not_recommended":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case "highly_recommended":
        return "แนะนำอย่างยิ่ง";
      case "recommended":
        return "แนะนำ";
      case "not_recommended":
        return "ไม่แนะนำ";
      default:
        return "ไม่ระบุ";
    }
  };

  const getDaysUntil = (date: string) => {
    const today = new Date();
    const interviewDate = new Date(date);
    const diffTime = interviewDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statistics = {
    total: interviews.length,
    upcoming: interviews.filter((i) =>
      ["scheduled", "confirmed"].includes(i.status)
    ).length,
    completed: interviews.filter((i) => i.status === "completed").length,
    cancelled: interviews.filter((i) =>
      ["cancelled", "no_show"].includes(i.status)
    ).length,
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
                การสัมภาษณ์
              </h1>
              <p className="text-secondary-600 font-sarabun">
                ติดตามและจัดการนัดหมายสัมภาษณ์ทุนการศึกษา
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                    <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.total}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    การสัมภาษณ์ทั้งหมด
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.upcoming}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    กำลังจะมา
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
                    <StarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.completed}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    เสร็จสิ้นแล้ว
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-red-50 mb-4">
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.cancelled}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    ยกเลิก/ไม่มา
                  </p>
                </CardBody>
              </Card>
            </div>

                        {/* Tab Navigation */}
            <Card className="mb-8">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('scheduled')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'scheduled'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      การสัมภาษณ์ที่จอง
                    </button>
                    <button
                      onClick={() => setActiveTab('book')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'book'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      จองสล็อตใหม่
                    </button>
                  </div>

                  {activeTab === 'scheduled' && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-secondary-700 font-sarabun">
                        สถานะ:
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                        aria-label="เลือกสถานะการสัมภาษณ์"
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Content based on active tab */}
            {activeTab === 'scheduled' ? (
              /* Scheduled Interviews */
              <div className="space-y-6">
                {filteredInterviews.length === 0 ? (
                <Card>
                  <CardBody className="p-12 text-center">
                    <div className="inline-flex p-4 rounded-full bg-secondary-100 mb-4">
                      <CalendarDaysIcon className="h-8 w-8 text-secondary-400" />
                    </div>
                    <h3 className="text-lg font-medium text-secondary-900 font-sarabun mb-2">
                      ไม่พบการสัมภาษณ์
                    </h3>
                    <p className="text-secondary-600 font-sarabun">
                      ยังไม่มีการสัมภาษณ์ในหมวดหมู่นี้
                    </p>
                  </CardBody>
                </Card>
              ) : (
                filteredInterviews.map((interview) => {
                  const StatusIcon = getStatusIcon(interview.status);
                  const daysUntil = getDaysUntil(interview.date);
                  const isUpcoming =
                    ["scheduled", "confirmed"].includes(interview.status) &&
                    daysUntil >= 0;

                  return (
                    <Card
                      key={interview.id}
                      className="hover:shadow-lg transition-shadow duration-200"
                    >
                      <CardBody className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="inline-flex p-3 rounded-xl bg-blue-50">
                            <StatusIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-xl font-bold text-secondary-900 font-sarabun">
                                    {interview.scholarshipName}
                                  </h3>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                                      interview.status
                                    )}`}
                                  >
                                    {getStatusText(interview.status)}
                                  </span>
                                  {isUpcoming && daysUntil <= 3 && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                                      {daysUntil === 0
                                        ? "วันนี้"
                                        : `อีก ${daysUntil} วัน`}
                                    </span>
                                  )}
                                </div>
                                <p className="text-green-600 font-semibold mb-2">
                                  จำนวนเงิน:{" "}
                                  {interview.scholarshipAmount.toLocaleString()}{" "}
                                  บาท
                                </p>
                                <p className="text-sm text-secondary-600 mb-2">
                                  รหัสใบสมัคร: {interview.applicationId}
                                </p>
                              </div>
                            </div>

                            {/* Interview details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className="flex items-center space-x-2">
                                <CalendarDaysIcon className="h-5 w-5 text-secondary-400" />
                                <div>
                                  <p className="text-sm text-secondary-500">
                                    วันที่สัมภาษณ์
                                  </p>
                                  <p className="font-medium text-secondary-900">
                                    {new Date(
                                      interview.date
                                    ).toLocaleDateString("th-TH", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <ClockIcon className="h-5 w-5 text-secondary-400" />
                                <div>
                                  <p className="text-sm text-secondary-500">
                                    เวลา
                                  </p>
                                  <p className="font-medium text-secondary-900">
                                    {interview.time} น. ({interview.duration}{" "}
                                    นาที)
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPinIcon className="h-5 w-5 text-secondary-400" />
                                <div>
                                  <p className="text-sm text-secondary-500">
                                    สถานที่
                                  </p>
                                  <p className="font-medium text-secondary-900">
                                    {interview.location}
                                  </p>
                                  {interview.building && (
                                    <p className="text-xs text-secondary-500">
                                      {interview.building} {interview.floor}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Interviewers */}
                            <div className="mb-6">
                              <h4 className="font-medium text-secondary-700 font-sarabun mb-3">
                                ผู้สัมภาษณ์
                              </h4>
                              <div className="space-y-3">
                                {interview.interviewers.map((interviewer) => (
                                  <div
                                    key={interviewer.id}
                                    className="flex items-start space-x-3 bg-secondary-50 rounded-lg p-3"
                                  >
                                    <div className="inline-flex p-2 rounded-full bg-blue-100">
                                      <UserIcon className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-secondary-900 font-sarabun">
                                        {interviewer.name}
                                      </p>
                                      <p className="text-sm text-secondary-600">
                                        {interviewer.title} |{" "}
                                        {interviewer.department}
                                      </p>
                                      <div className="flex items-center space-x-4 mt-1">
                                        {interviewer.email && (
                                          <div className="flex items-center space-x-1 text-xs text-secondary-500">
                                            <EnvelopeIcon className="h-3 w-3" />
                                            <span>{interviewer.email}</span>
                                          </div>
                                        )}
                                        {interviewer.phone && (
                                          <div className="flex items-center space-x-1 text-xs text-secondary-500">
                                            <PhoneIcon className="h-3 w-3" />
                                            <span>{interviewer.phone}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Instructions and requirements */}
                            {(interview.instructions ||
                              interview.requirements) && (
                              <div className="mb-6">
                                {interview.instructions && (
                                  <div className="mb-4">
                                    <h4 className="font-medium text-secondary-700 font-sarabun mb-2">
                                      คำแนะนำ
                                    </h4>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                      <p className="text-blue-800 text-sm">
                                        {interview.instructions}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {interview.requirements &&
                                  interview.requirements.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-secondary-700 font-sarabun mb-2">
                                        เอกสารที่ต้องนำมา
                                      </h4>
                                      <ul className="space-y-1">
                                        {interview.requirements.map(
                                          (req, index) => (
                                            <li
                                              key={index}
                                              className="flex items-center space-x-2 text-sm text-secondary-600"
                                            >
                                              <DocumentTextIcon className="h-4 w-4 text-secondary-400" />
                                              <span>{req}</span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            )}

                            {/* Interview result */}
                            {interview.result && (
                              <div className="mb-6">
                                <h4 className="font-medium text-secondary-700 font-sarabun mb-3">
                                  ผลการสัมภาษณ์
                                </h4>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                    <div>
                                      <p className="text-sm text-purple-600">
                                        คะแนนรวม
                                      </p>
                                      <p className="text-lg font-bold text-purple-700">
                                        {interview.result.overallScore}/
                                        {interview.result.maxScore}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-purple-600">
                                        ข้อเสนอแนะ
                                      </p>
                                      <p
                                        className={`font-medium ${getRecommendationColor(
                                          interview.result.recommendation
                                        )}`}
                                      >
                                        {getRecommendationText(
                                          interview.result.recommendation
                                        )}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-purple-600">
                                        วันที่ประเมิน
                                      </p>
                                      <p className="font-medium text-purple-700">
                                        {new Date(
                                          interview.result.submittedDate
                                        ).toLocaleDateString("th-TH")}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-purple-600 mb-2">
                                      ความเห็นของผู้สัมภาษณ์
                                    </p>
                                    <p className="text-purple-800 text-sm">
                                      {interview.result.feedback}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between border-t border-secondary-200 pt-4">
                              <div className="flex space-x-3">
                                {interview.status === "scheduled" &&
                                  interview.confirmationRequired && (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      className="font-sarabun"
                                    >
                                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                                      ยืนยันการเข้าร่วม
                                    </Button>
                                  )}
                                {interview.canReschedule &&
                                  ["scheduled", "confirmed"].includes(
                                    interview.status
                                  ) && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="font-sarabun"
                                    >
                                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                      ขอเลื่อนนัด
                                    </Button>
                                  )}
                                {interview.status === "no_show" && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="font-sarabun"
                                  >
                                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                    ขอนัดใหม่
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="font-sarabun"
                                >
                                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                                  ติดต่อผู้สัมภาษณ์
                                </Button>
                              </div>
                              <div className="text-xs text-secondary-500">
                                ID: {interview.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })
              )}
            </div>
            ) : (
              /* Interview Booking Calendar */
              <InterviewCalendar
                applicationId="APP001" // Mock application ID
                scholarshipId={1} // Mock scholarship ID
                onSlotBooked={(slot: InterviewSlot) => {
                  console.log('Slot booked:', slot);
                  // Add logic here to update the interviews list
                  // or redirect to the scheduled tab
                  setActiveTab('scheduled');
                }}
                className=""
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewsPage;
