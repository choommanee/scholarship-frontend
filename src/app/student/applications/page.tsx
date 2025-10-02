"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { applicationService, Application } from '@/services/application.service';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';

const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to calculate progress based on status
  const calculateProgress = (status: string): number => {
    switch (status) {
      case 'draft': return 20;
      case 'submitted': return 40;
      case 'under_review': return 60;
      case 'document_pending': return 50;
      case 'interview_scheduled': return 80;
      case 'approved': return 100;
      case 'rejected': return 100;
      default: return 0;
    }
  };

  // Load applications data
  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await applicationService.getMyApplications({
        page: 1,
        limit: 20,
        sortBy: 'submissionDate',
        sortOrder: 'desc'
      });
      
      setApplications(response.applications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setError('ไม่สามารถโหลดข้อมูลใบสมัครได้ กรุณาลองใหม่อีกครั้ง');
      toast.error('ไม่สามารถโหลดข้อมูลใบสมัครได้');
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: "all", label: "ทุกสถานะ" },
    { value: "draft", label: "ร่าง" },
    { value: "submitted", label: "ส่งแล้ว" },
    { value: "under_review", label: "กำลังพิจารณา" },
    { value: "document_pending", label: "รอเอกสาร" },
    { value: "interview_scheduled", label: "นัดสัมภาษณ์" },
    { value: "approved", label: "อนุมัติ" },
    { value: "rejected", label: "ไม่อนุมัติ" },
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "document_pending":
        return "bg-orange-100 text-orange-800";
      case "interview_scheduled":
        return "bg-purple-100 text-purple-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "draft":
        return "ร่าง";
      case "submitted":
        return "ส่งแล้ว";
      case "under_review":
        return "อยู่ระหว่างพิจารณา";
      case "document_pending":
        return "รอเอกสาร";
      case "interview_scheduled":
        return "นัดสัมภาษณ์";
      case "approved":
        return "อนุมัติแล้ว";
      case "rejected":
        return "ไม่อนุมัติ";
      default:
        return "ไม่ทราบสถานะ";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return DocumentTextIcon;
      case "submitted":
        return ArrowPathIcon;
      case "under_review":
        return ClockIcon;
      case "document_pending":
        return ExclamationTriangleIcon;
      case "interview_scheduled":
        return CalendarDaysIcon;
      case "approved":
        return CheckCircleIcon;
      case "rejected":
        return XCircleIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const statistics = {
    total: applications.length,
    draft: applications.filter((app) => app.status === "draft").length,
    submitted: applications.filter((app) => app.status === "submitted").length,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะถอนใบสมัครนี้?')) {
      return;
    }

    try {
      await applicationService.withdrawApplication(applicationId);
      toast.success('ถอนใบสมัครเรียบร้อยแล้ว');
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Failed to withdraw application:', error);
      toast.error('ไม่สามารถถอนใบสมัครได้');
    }
  };

  // Loading state
  if (isLoading) {
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
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-secondary-600 font-sarabun">กำลังโหลดข้อมูลใบสมัคร...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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
              <Card>
                <CardBody className="p-12 text-center">
                  <div className="inline-flex p-4 rounded-full bg-red-100 mb-4">
                    <XCircleIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-secondary-900 font-sarabun mb-2">
                    เกิดข้อผิดพลาด
                  </h3>
                  <p className="text-secondary-600 font-sarabun mb-4">{error}</p>
                  <Button variant="primary" onClick={fetchApplications} className="font-sarabun">
                    ลองใหม่
                  </Button>
                </CardBody>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                ใบสมัครของฉัน
              </h1>
              <p className="text-secondary-600 font-sarabun">
                ติดตามสถานะการสมัครทุนการศึกษาของคุณ
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.total}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    ทั้งหมด
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-gray-50 mb-4">
                    <PencilIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.draft}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    ร่าง
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-yellow-50 mb-4">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.submitted}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    รอพิจารณา
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.approved}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    อนุมัติ
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-red-50 mb-4">
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.rejected}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    ไม่อนุมัติ
                  </p>
                </CardBody>
              </Card>
            </div>

            {/* Search and filters */}
            <Card className="mb-8">
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="ค้นหาใบสมัคร..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                  <div className="mt-4 pt-4 border-t border-secondary-200">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        สถานะ
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full md:w-64 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                        title="เลือกสถานะใบสมัคร"
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

            {/* Applications list */}
            <div className="space-y-6">
              {filteredApplications.length === 0 ? (
                <Card>
                  <CardBody className="p-12 text-center">
                    <div className="inline-flex p-4 rounded-full bg-secondary-100 mb-4">
                      <DocumentTextIcon className="h-8 w-8 text-secondary-400" />
                    </div>
                    <h3 className="text-lg font-medium text-secondary-900 font-sarabun mb-2">
                      ไม่พบใบสมัคร
                    </h3>
                    <p className="text-secondary-600 font-sarabun mb-4">
                      ยังไม่มีใบสมัครทุนการศึกษา หรือลองเปลี่ยนตัวกรอง
                    </p>
                    <Link href="/student/scholarships">
                      <Button variant="primary" className="font-sarabun">
                        ค้นหาทุนการศึกษา
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                filteredApplications.map((application) => {
                  const StatusIcon = getStatusIcon(application.status);

                  return (
                    <Card
                      key={application.id}
                      className="hover:shadow-lg transition-shadow duration-200"
                    >
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="inline-flex p-3 rounded-xl bg-blue-50">
                              <StatusIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-xl font-bold text-secondary-900 font-sarabun">
                                  {application.scholarshipName}
                                </h3>
                                <Badge className={getStatusColor(application.status)}>
                                  {getStatusText(application.status)}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                                <div>
                                  <p className="text-secondary-500 font-sarabun">
                                    รหัสใบสมัคร
                                  </p>
                                  <p className="font-medium text-secondary-900">
                                    {application.id}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-secondary-500 font-sarabun">
                                    จำนวนเงิน
                                  </p>
                                  <p className="font-semibold text-green-600">
                                    {application.scholarshipAmount.toLocaleString()}{" "}
                                    บาท
                                  </p>
                                </div>
                                <div>
                                  <p className="text-secondary-500 font-sarabun">
                                    วันที่สมัคร
                                  </p>
                                  <p className="font-medium text-secondary-900">
                                    {new Date(
                                      application.submissionDate
                                    ).toLocaleDateString("th-TH")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-secondary-500 font-sarabun">
                                    อัปเดตล่าสุด
                                  </p>
                                  <p className="font-medium text-secondary-900">
                                    {new Date(
                                      application.lastUpdate
                                    ).toLocaleDateString("th-TH")}
                                  </p>
                                </div>
                              </div>

                              {/* Interview info */}
                              {application.status === "interview_scheduled" &&
                                application.interviewDate && (
                                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
                                      <h4 className="font-semibold text-purple-800 font-sarabun">
                                        การสัมภาษณ์
                                      </h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                      <p className="text-purple-700">
                                        วันที่:{" "}
                                        {new Date(
                                          application.interviewDate
                                        ).toLocaleDateString("th-TH")}
                                      </p>
                                      <p className="text-purple-700">
                                        สถานที่: {application.interviewLocation}
                                      </p>
                                    </div>
                                  </div>
                                )}

                              {/* Rejection reason */}
                              {application.status === "rejected" &&
                                application.rejectionReason && (
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                    <h4 className="font-semibold text-red-800 font-sarabun mb-2">
                                      เหตุผลที่ไม่อนุมัติ
                                    </h4>
                                    <p className="text-red-700 text-sm">
                                      {application.rejectionReason}
                                    </p>
                                  </div>
                                )}

                              {/* Progress bar */}
                              <div className="mb-4">
                                <div className="flex justify-between text-sm text-secondary-600 mb-1">
                                  <span className="font-sarabun">
                                    ความคืบหน้า
                                  </span>
                                  <span>{calculateProgress(application.status)}%</span>
                                </div>
                                <div className="w-full bg-secondary-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      application.status === "approved"
                                        ? "bg-green-500"
                                        : application.status === "rejected"
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                    }`}
                                    style={{
                                      width: `${calculateProgress(application.status)}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              {/* Documents status */}
                              <div className="mb-4">
                                <h4 className="font-medium text-secondary-700 font-sarabun mb-2">
                                  สถานะเอกสาร
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                  {Object.entries(
                                    application.documentsStatus
                                  ).map(([doc, status]) => (
                                    <div key={doc} className="text-center">
                                      <div
                                        className={`w-8 h-8 mx-auto mb-1 rounded-full border-2 flex items-center justify-center ${
                                          status === "approved"
                                            ? "border-green-500 bg-green-50"
                                            : status === "rejected"
                                            ? "border-red-500 bg-red-50"
                                            : "border-yellow-500 bg-yellow-50"
                                        }`}
                                      >
                                        {status === "approved" && (
                                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                        )}
                                        {status === "rejected" && (
                                          <XCircleIcon className="h-4 w-4 text-red-500" />
                                        )}
                                        {status === "pending" && (
                                          <ClockIcon className="h-4 w-4 text-yellow-500" />
                                        )}
                                      </div>
                                      <p
                                        className={`text-xs ${getDocumentStatusColor(
                                          status
                                        )}`}
                                      >
                                        {doc === "transcript" && "ใบแสดงผล"}
                                        {doc === "income_certificate" &&
                                          "รับรองรายได้"}
                                        {doc === "id_card" && "บัตรประชาชน"}
                                        {doc === "photo" && "รูปถ่าย"}
                                        {doc === "recommendation" &&
                                          "หนังสือรับรอง"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Notes */}
                              {application.notes && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <p className="text-blue-800 text-sm font-sarabun">
                                    {application.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-secondary-200 pt-4">
                          <div className="flex space-x-3">
                            <Link
                              href={`/student/applications/${application.id}`}
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
                            {application.status === "draft" && (
                              <Link
                                href={`/student/applications/${application.id}/edit`}
                              >
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="font-sarabun"
                                >
                                  <PencilIcon className="h-4 w-4 mr-2" />
                                  แก้ไขและส่ง
                                </Button>
                              </Link>
                            )}
                            {(application.status === "draft" || application.status === "submitted") && (
                              <Button
                                variant="outline"
                                onClick={() => handleWithdraw(application.id)}
                                className="text-red-600 hover:text-red-700 font-sarabun"
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                ถอน
                              </Button>
                            )}
                          </div>
                          <div className="text-xs text-secondary-500">
                            อัปเดต:{" "}
                            {new Date(
                              application.lastUpdate
                            ).toLocaleDateString("th-TH")}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationsPage;
