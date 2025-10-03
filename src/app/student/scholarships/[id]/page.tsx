"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { scholarshipService, Scholarship } from "@/services/scholarship.service";
import toast from "react-hot-toast";

const ScholarshipDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = parseInt(params.id as string);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityScore, setEligibilityScore] = useState(0);
  const [eligibilityReasons, setEligibilityReasons] = useState<string[]>([]);

  const user = {
    name: "นางสาว สมใจ ใจดี",
    role: "นักศึกษา",
    email: "somjai.j@student.mahidol.ac.th",
  };

  useEffect(() => {
    loadScholarshipDetail();
  }, [scholarshipId]);

  const loadScholarshipDetail = async () => {
    try {
      setLoading(true);
      const data = await scholarshipService.getPublicScholarshipById(scholarshipId);
      setScholarship(data);
    } catch (error: any) {
      toast.error(error.message || "ไม่สามารถโหลดข้อมูลทุนการศึกษาได้");
      router.push("/student/scholarships");
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    try {
      // Mock eligibility check - replace with real API call
      const mockStudent = {
        gpa: 3.5,
        year: 2,
        faculty: "Engineering",
        family_income: 25000,
      };

      // Parse eligibility criteria
      const criteria = parseEligibilityCriteria(scholarship?.eligibility_criteria || "");

      // Simple validation
      let eligible = true;
      const reasons: string[] = [];

      if (criteria.min_gpa && mockStudent.gpa < criteria.min_gpa) {
        eligible = false;
        reasons.push(`เกรดเฉลี่ยต่ำกว่าที่กำหนด (${mockStudent.gpa} < ${criteria.min_gpa})`);
      }

      if (criteria.max_income && mockStudent.family_income > criteria.max_income) {
        eligible = false;
        reasons.push(`รายได้ครอบครัวสูงกว่าที่กำหนด`);
      }

      setIsEligible(eligible);
      setEligibilityScore(eligible ? 85 : 45);
      setEligibilityReasons(reasons);
      setEligibilityChecked(true);

      if (eligible) {
        toast.success("คุณมีสิทธิ์สมัครทุนนี้");
      } else {
        toast.error("คุณไม่มีสิทธิ์สมัครทุนนี้");
      }
    } catch (error) {
      toast.error("ไม่สามารถตรวจสอบคุณสมบัติได้");
    }
  };

  const parseEligibilityCriteria = (criteriaStr: string) => {
    const criteria: any = {};

    // Parse GPA
    const gpaMatch = criteriaStr.match(/เกรด(?:เฉลี่ย)?[\s:]*[≥>=]+[\s]*([\d.]+)/i);
    if (gpaMatch) {
      criteria.min_gpa = parseFloat(gpaMatch[1]);
    }

    // Parse income
    const incomeMatch = criteriaStr.match(/รายได้(?:ครอบครัว)?[\s<]+[\s]*([\d,]+)/i);
    if (incomeMatch) {
      criteria.max_income = parseInt(incomeMatch[1].replace(/,/g, ""));
    }

    return criteria;
  };

  const parseRequiredDocuments = (docsStr: string): string[] => {
    if (!docsStr) return [];

    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(docsStr);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    // Otherwise split by comma
    return docsStr.split(',').map(d => d.trim()).filter(d => d);
  };

  const getDaysLeft = () => {
    if (!scholarship) return 0;
    const today = new Date();
    const endDate = new Date(scholarship.application_end_date);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatus = () => {
    if (!scholarship) return "closed";
    const now = new Date();
    const startDate = new Date(scholarship.application_start_date);
    const endDate = new Date(scholarship.application_end_date);

    if (now < startDate) return "pending";
    if (now > endDate) return "closed";

    const daysLeft = getDaysLeft();
    if (daysLeft <= 7) return "closing_soon";

    return "open";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closing_soon":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
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
      case "pending":
        return "เตรียมเปิดรับสมัคร";
      default:
        return "ไม่ทราบสถานะ";
    }
  };

  if (loading || !scholarship) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const status = getStatus();
  const daysLeft = getDaysLeft();
  const requiredDocs = parseRequiredDocuments(scholarship.required_documents || "");

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
          <div className="px-4 sm:px-8 lg:px-8 pb-8 max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link
                href="/student/scholarships"
                className="flex items-center text-secondary-600 hover:text-primary-600 font-sarabun"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                กลับไปหน้าทุนการศึกษา
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-3">
                    {scholarship.scholarship_name}
                  </h1>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {scholarship.amount.toLocaleString()} บาท
                    </span>
                  </div>
                  <p className="text-secondary-600 font-sarabun">
                    {scholarship.source?.source_name || scholarship.provider}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Timeline */}
                <Card>
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-4">
                      กำหนดการรับสมัคร
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-secondary-500 font-sarabun mb-1">
                          วันเริ่มรับสมัคร
                        </p>
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon className="h-5 w-5 text-secondary-400" />
                          <span className="font-medium text-secondary-900">
                            {new Date(scholarship.application_start_date).toLocaleDateString("th-TH")}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 font-sarabun mb-1">
                          วันปิดรับสมัคร
                        </p>
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon className="h-5 w-5 text-secondary-400" />
                          <span className="font-medium text-secondary-900">
                            {new Date(scholarship.application_end_date).toLocaleDateString("th-TH")}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 font-sarabun mb-1">
                          เวลาคงเหลือ
                        </p>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-5 w-5 text-secondary-400" />
                          <span className={`font-medium ${daysLeft <= 7 ? "text-red-600" : "text-green-600"}`}>
                            {daysLeft > 0 ? `${daysLeft} วัน` : "ปิดรับสมัครแล้ว"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Eligibility Criteria */}
                <Card>
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-4">
                      คุณสมบัติผู้สมัคร
                    </h3>
                    <div className="space-y-3">
                      {scholarship.eligibility_criteria?.split(';').map((criterion, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-secondary-700 font-sarabun">{criterion.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Required Documents */}
                <Card>
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-4">
                      เอกสารที่ต้องใช้
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {requiredDocs.map((doc, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-secondary-700 font-sarabun">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Scholarship Info */}
                <Card>
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-4">
                      ข้อมูลทุนการศึกษา
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-secondary-500 font-sarabun mb-1">
                          จำนวนทุนทั้งหมด
                        </p>
                        <div className="flex items-center space-x-2">
                          <UsersIcon className="h-5 w-5 text-secondary-400" />
                          <span className="font-medium text-secondary-900">
                            {scholarship.total_quota} ทุน
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 font-sarabun mb-1">
                          ทุนคงเหลือ
                        </p>
                        <div className="flex items-center space-x-2">
                          <UsersIcon className="h-5 w-5 text-secondary-400" />
                          <span className="font-medium text-secondary-900">
                            {scholarship.available_quota} ทุน
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 font-sarabun mb-1">
                          ประเภททุน
                        </p>
                        <span className="font-medium text-secondary-900 font-sarabun">
                          {scholarship.scholarship_type}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 font-sarabun mb-1">
                          ปีการศึกษา
                        </p>
                        <span className="font-medium text-secondary-900">
                          {scholarship.academic_year}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Right Column - Actions */}
              <div className="space-y-6">
                {/* Eligibility Check */}
                {!eligibilityChecked ? (
                  <Card>
                    <CardBody className="p-6">
                      <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-4">
                        ตรวจสอบคุณสมบัติ
                      </h3>
                      <p className="text-secondary-600 font-sarabun mb-4">
                        ตรวจสอบว่าคุณมีคุณสมบัติตรงตามเกณฑ์ของทุนนี้หรือไม่
                      </p>
                      <Button
                        onClick={checkEligibility}
                        variant="primary"
                        className="w-full font-sarabun"
                      >
                        ตรวจสอบคุณสมบัติ
                      </Button>
                    </CardBody>
                  </Card>
                ) : (
                  <Card>
                    <CardBody className="p-6">
                      {isEligible ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <CheckCircleIcon className="h-8 w-8 text-green-600" />
                            <div>
                              <h3 className="text-lg font-semibold text-green-900 font-sarabun">
                                คุณมีสิทธิ์สมัครทุนนี้
                              </h3>
                              <p className="text-sm text-green-700">
                                คะแนนความเหมาะสม: {eligibilityScore}/100
                              </p>
                            </div>
                          </div>
                          {status === "open" && (
                            <Button
                              onClick={() => router.push(`/student/scholarships/${scholarshipId}/apply`)}
                              variant="primary"
                              className="w-full mt-4 font-sarabun"
                            >
                              สมัครทุนเลย
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <XCircleIcon className="h-8 w-8 text-red-600" />
                            <h3 className="text-lg font-semibold text-red-900 font-sarabun">
                              คุณไม่มีสิทธิ์สมัครทุนนี้
                            </h3>
                          </div>
                          <ul className="space-y-2 mt-3">
                            {eligibilityReasons.map((reason, i) => (
                              <li key={i} className="text-sm text-red-700 font-sarabun">
                                • {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                )}

                {/* Quick Info */}
                <Card>
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-4">
                      ข้อมูลสรุป
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600 font-sarabun">จำนวนเงิน</span>
                        <span className="font-semibold text-green-600">
                          {scholarship.amount.toLocaleString()} บาท
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600 font-sarabun">จำนวนทุน</span>
                        <span className="font-semibold text-secondary-900">
                          {scholarship.total_quota} ทุน
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600 font-sarabun">สัมภาษณ์</span>
                        <span className="font-semibold text-secondary-900">
                          {scholarship.interview_required ? "ต้องสัมภาษณ์" : "ไม่ต้องสัมภาษณ์"}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScholarshipDetailPage;
