"use client";

import React, { useState } from "react";
import {
  DocumentIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  FolderIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

interface Document {
  id: string;
  name: string;
  type:
    | "transcript"
    | "income_certificate"
    | "id_card"
    | "photo"
    | "recommendation"
    | "other";
  filename: string;
  size: number;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
  applicationId?: string;
  applicationName?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  expiryDate?: string;
}

const DocumentsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const user = {
    name: "นางสาว สมใจ ใจดี",
    role: "นักศึกษา",
    email: "somjai.j@student.mahidol.ac.th",
  };

  const documents: Document[] = [
    {
      id: "DOC001",
      name: "ใบแสดงผลการเรียน (Transcript)",
      type: "transcript",
      filename: "transcript_2567_semester1.pdf",
      size: 2048576, // 2MB
      uploadDate: "2024-12-01",
      status: "approved",
      applicationId: "APP001",
      applicationName: "ทุนพัฒนาศักยภาพนักศึกษา",
      verifiedBy: "วิไลวรรณ จัดการดี",
      verifiedDate: "2024-12-02",
      expiryDate: "2025-05-31",
    },
    {
      id: "DOC002",
      name: "หนังสือรับรองรายได้ผู้ปกครอง",
      type: "income_certificate",
      filename: "income_certificate_2024.pdf",
      size: 1536000, // 1.5MB
      uploadDate: "2024-12-01",
      status: "approved",
      applicationId: "APP001",
      applicationName: "ทุนพัฒนาศักยภาพนักศึกษา",
      verifiedBy: "วิไลวรรณ จัดการดี",
      verifiedDate: "2024-12-02",
      expiryDate: "2025-02-28",
    },
    {
      id: "DOC003",
      name: "สำเนาบัตรประชาชน",
      type: "id_card",
      filename: "id_card_copy.jpg",
      size: 512000, // 500KB
      uploadDate: "2024-12-01",
      status: "approved",
      applicationId: "APP001",
      applicationName: "ทุนพัฒนาศักยภาพนักศึกษา",
      verifiedBy: "วิไลวรรณ จัดการดี",
      verifiedDate: "2024-12-02",
    },
    {
      id: "DOC004",
      name: "รูปถ่าย 1 นิ้ว",
      type: "photo",
      filename: "photo_1inch.jpg",
      size: 256000, // 250KB
      uploadDate: "2024-12-08",
      status: "pending",
      applicationId: "APP003",
      applicationName: "ทุนวิจัยระดับปริญญาตรี",
    },
    {
      id: "DOC005",
      name: "หนังสือรับรองจากอาจารย์ที่ปรึกษา",
      type: "recommendation",
      filename: "recommendation_letter.pdf",
      size: 1024000, // 1MB
      uploadDate: "2024-11-25",
      status: "rejected",
      applicationId: "APP002",
      applicationName: "ทุนเรียนดี",
      rejectionReason: "เอกสารไม่ชัดเจน กรุณาอัปโหลดใหม่",
    },
    {
      id: "DOC006",
      name: "ใบแสดงผลการเรียนเพิ่มเติม",
      type: "transcript",
      filename: "transcript_additional.pdf",
      size: 1800000, // 1.8MB
      uploadDate: "2024-12-10",
      status: "pending",
      applicationId: "APP004",
      applicationName: "ทุนช่วยเหลือการศึกษา",
    },
  ];

  const documentTypes = [
    { value: "all", label: "ทุกประเภท" },
    { value: "transcript", label: "ใบแสดงผลการเรียน" },
    { value: "income_certificate", label: "หนังสือรับรองรายได้" },
    { value: "id_card", label: "สำเนาบัตรประชาชน" },
    { value: "photo", label: "รูปถ่าย" },
    { value: "recommendation", label: "หนังสือรับรอง" },
    { value: "other", label: "อื่นๆ" },
  ];

  const statusOptions = [
    { value: "all", label: "ทุกสถานะ" },
    { value: "pending", label: "รอตรวจสอบ" },
    { value: "approved", label: "อนุมัติ" },
    { value: "rejected", label: "ไม่อนุมัติ" },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesType = selectedType === "all" || doc.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || doc.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "อนุมัติ";
      case "rejected":
        return "ไม่อนุมัติ";
      case "pending":
        return "รอตรวจสอบ";
      default:
        return "ไม่ทราบสถานะ";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircleIcon;
      case "rejected":
        return XCircleIcon;
      case "pending":
        return ClockIcon;
      default:
        return ClockIcon;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "transcript":
        return DocumentTextIcon;
      case "photo":
        return DocumentIcon;
      default:
        return DocumentIcon;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: "expired", days: Math.abs(diffDays) };
    if (diffDays <= 30) return { status: "expiring", days: diffDays };
    return { status: "valid", days: diffDays };
  };

  const statistics = {
    total: documents.length,
    approved: documents.filter((doc) => doc.status === "approved").length,
    pending: documents.filter((doc) => doc.status === "pending").length,
    rejected: documents.filter((doc) => doc.status === "rejected").length,
  };

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setShowUploadModal(false);
    }, 2000);
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                    เอกสารของฉัน
                  </h1>
                  <p className="text-secondary-600 font-sarabun">
                    จัดการและติดตามสถานะเอกสารประกอบการสมัครทุน
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowUploadModal(true)}
                  className="font-sarabun"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  อัปโหลดเอกสาร
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                    <FolderIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.total}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    เอกสารทั้งหมด
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
                    อนุมัติแล้ว
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-yellow-50 mb-4">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 font-sarabun">
                    {statistics.pending}
                  </p>
                  <p className="text-sm text-secondary-600 font-sarabun">
                    รอตรวจสอบ
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

            {/* Filters */}
            <Card className="mb-8">
              <CardBody className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      ประเภทเอกสาร
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      {documentTypes.map((type) => (
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
              </CardBody>
            </Card>

            {/* Documents list */}
            <div className="space-y-4">
              {filteredDocuments.length === 0 ? (
                <Card>
                  <CardBody className="p-12 text-center">
                    <div className="inline-flex p-4 rounded-full bg-secondary-100 mb-4">
                      <DocumentIcon className="h-8 w-8 text-secondary-400" />
                    </div>
                    <h3 className="text-lg font-medium text-secondary-900 font-sarabun mb-2">
                      ไม่พบเอกสาร
                    </h3>
                    <p className="text-secondary-600 font-sarabun mb-4">
                      ยังไม่มีเอกสารในหมวดหมู่นี้ หรือลองเปลี่ยนตัวกรอง
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => setShowUploadModal(true)}
                      className="font-sarabun"
                    >
                      อัปโหลดเอกสารแรก
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                filteredDocuments.map((document) => {
                  const StatusIcon = getStatusIcon(document.status);
                  const TypeIcon = getTypeIcon(document.type);
                  const expiryStatus = getExpiryStatus(document.expiryDate);

                  return (
                    <Card
                      key={document.id}
                      className="hover:shadow-md transition-shadow duration-200"
                    >
                      <CardBody className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="inline-flex p-3 rounded-xl bg-blue-50">
                            <TypeIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="text-lg font-semibold text-secondary-900 font-sarabun">
                                    {document.name}
                                  </h3>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                                      document.status
                                    )}`}
                                  >
                                    {getStatusText(document.status)}
                                  </span>
                                  {expiryStatus &&
                                    expiryStatus.status === "expiring" && (
                                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                                        หมดอายุใน {expiryStatus.days} วัน
                                      </span>
                                    )}
                                  {expiryStatus &&
                                    expiryStatus.status === "expired" && (
                                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                                        หมดอายุแล้ว
                                      </span>
                                    )}
                                </div>
                                <p className="text-sm text-secondary-600 font-sarabun mb-2">
                                  {document.filename}
                                </p>
                                {document.applicationName && (
                                  <p className="text-sm text-blue-600 font-sarabun">
                                    สำหรับ: {document.applicationName}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <StatusIcon
                                  className={`h-5 w-5 ${
                                    document.status === "approved"
                                      ? "text-green-500"
                                      : document.status === "rejected"
                                      ? "text-red-500"
                                      : "text-yellow-500"
                                  }`}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-secondary-600 mb-4">
                              <div>
                                <p className="text-secondary-500">ขนาดไฟล์</p>
                                <p>{formatFileSize(document.size)}</p>
                              </div>
                              <div>
                                <p className="text-secondary-500">
                                  วันที่อัปโหลด
                                </p>
                                <p>
                                  {new Date(
                                    document.uploadDate
                                  ).toLocaleDateString("th-TH")}
                                </p>
                              </div>
                              {document.verifiedBy && (
                                <div>
                                  <p className="text-secondary-500">
                                    ตรวจสอบโดย
                                  </p>
                                  <p>{document.verifiedBy}</p>
                                </div>
                              )}
                              {document.expiryDate && (
                                <div>
                                  <p className="text-secondary-500">
                                    วันหมดอายุ
                                  </p>
                                  <p
                                    className={
                                      expiryStatus?.status === "expired"
                                        ? "text-red-600"
                                        : expiryStatus?.status === "expiring"
                                        ? "text-orange-600"
                                        : ""
                                    }
                                  >
                                    {new Date(
                                      document.expiryDate
                                    ).toLocaleDateString("th-TH")}
                                  </p>
                                </div>
                              )}
                            </div>

                            {document.status === "rejected" &&
                              document.rejectionReason && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                  <div className="flex items-start space-x-2">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <h4 className="font-medium text-red-800 font-sarabun">
                                        เหตุผลที่ไม่อนุมัติ
                                      </h4>
                                      <p className="text-red-700 text-sm">
                                        {document.rejectionReason}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                            <div className="flex items-center justify-between">
                              <div className="flex space-x-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="font-sarabun"
                                >
                                  <EyeIcon className="h-4 w-4 mr-2" />
                                  ดูเอกสาร
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="font-sarabun"
                                >
                                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                  ดาวน์โหลด
                                </Button>
                                {document.status === "rejected" && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="font-sarabun"
                                  >
                                    <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                                    อัปโหลดใหม่
                                  </Button>
                                )}
                                {document.status === "pending" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 font-sarabun"
                                  >
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    ลบ
                                  </Button>
                                )}
                              </div>
                              <div className="text-xs text-secondary-500">
                                ID: {document.id}
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

            {/* Upload Modal */}
            {showUploadModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="font-sarabun">
                      อัปโหลดเอกสาร
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        ประเภทเอกสาร
                      </label>
                      <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun">
                        <option value="">เลือกประเภทเอกสาร</option>
                        <option value="transcript">ใบแสดงผลการเรียน</option>
                        <option value="income_certificate">
                          หนังสือรับรองรายได้
                        </option>
                        <option value="id_card">สำเนาบัตรประชาชน</option>
                        <option value="photo">รูปถ่าย</option>
                        <option value="recommendation">หนังสือรับรอง</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                        เลือกไฟล์
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="w-full p-2 border border-secondary-300 rounded-lg"
                      />
                      <p className="text-xs text-secondary-500 mt-1">
                        รองรับไฟล์: PDF, JPG, PNG, DOC, DOCX (ขนาดไม่เกิน 10MB)
                      </p>
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowUploadModal(false)}
                        className="flex-1 font-sarabun"
                        disabled={uploading}
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleUpload}
                        className="flex-1 font-sarabun"
                        loading={uploading}
                      >
                        {uploading ? "กำลังอัปโหลด..." : "อัปโหลด"}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;
