'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  XMarkIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface DocumentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  applicationId: string;
  scholarshipName: string;
  documentType: 'transcript' | 'income_certificate' | 'id_card' | 'photo' | 'recommendation' | 'other';
  documentName: string;
  filename: string;
  fileSize: number;
  uploadDate: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_resubmission';
  priority: 'high' | 'medium' | 'low';
  reviewedBy?: string;
  reviewDate?: string;
  rejectionReason?: string;
  notes?: string;
  expiryDate?: string;
  faculty: string;
  year: number;
  gpa: number;
  daysOverdue?: number;
}

const OfficerDocumentsPage: React.FC = () => {
  const { toasts, removeToast, success, error, warning, info } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDocumentType, setSelectedDocumentType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentSubmission | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [rejectionReason, setRejectionReason] = useState('');
  const [requireResubmission, setRequireResubmission] = useState(false);
  const [contactMessage, setContactMessage] = useState('');


  const documentSubmissions: DocumentSubmission[] = [
    {
      id: 'DOC001',
      studentId: '6388001',
      studentName: 'นางสาว สมใจ ใจดี',
      studentEmail: 'somjai.j@student.mahidol.ac.th',
      applicationId: 'APP001',
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      documentType: 'transcript',
      documentName: 'ใบแสดงผลการเรียน ภาคเรียนที่ 1/2567',
      filename: 'transcript_2567_s1.pdf',
      fileSize: 2048576,
      uploadDate: '2024-12-01',
      submissionDate: '2024-12-01',
      status: 'pending',
      priority: 'high',
      faculty: 'คณะสาธารณสุขศาสตร์',
      year: 3,
      gpa: 3.75,
      daysOverdue: 2,
      expiryDate: '2025-05-31'
    },
    {
      id: 'DOC002',
      studentId: '6388002',
      studentName: 'นายสมชาย ขยันเรียน',
      studentEmail: 'somchai.k@student.mahidol.ac.th',
      applicationId: 'APP002',
      scholarshipName: 'ทุนเรียนดี',
      documentType: 'income_certificate',
      documentName: 'หนังสือรับรองรายได้ผู้ปกครอง',
      filename: 'income_cert_2024.pdf',
      fileSize: 1536000,
      uploadDate: '2024-12-05',
      submissionDate: '2024-12-05',
      status: 'approved',
      priority: 'medium',
      reviewedBy: 'วิไลวรรณ จัดการดี',
      reviewDate: '2024-12-06',
      faculty: 'คณะแพทยศาสตร์',
      year: 2,
      gpa: 3.85,
      expiryDate: '2025-02-28'
    },
    {
      id: 'DOC003',
      studentId: '6388003',
      studentName: 'นางสาว อานิสา เก่งมาก',
      studentEmail: 'anisa.k@student.mahidol.ac.th',
      applicationId: 'APP003',
      scholarshipName: 'ทุนช่วยเหลือการศึกษา',
      documentType: 'recommendation',
      documentName: 'หนังสือรับรองจากอาจารย์ที่ปรึกษา',
      filename: 'recommendation_letter.pdf',
      fileSize: 1024000,
      uploadDate: '2024-11-28',
      submissionDate: '2024-11-28',
      status: 'rejected',
      priority: 'high',
      reviewedBy: 'วิไลวรรณ จัดการดี',
      reviewDate: '2024-11-30',
      rejectionReason: 'เอกสารไม่ชัดเจน ข้อมูลไม่ครบถ้วน กรุณาให้อาจารย์ที่ปรึกษาออกหนังสือใหม่',
      faculty: 'คณะพยาบาลศาสตร์',
      year: 4,
      gpa: 3.25
    },
    {
      id: 'DOC004',
      studentId: '6388004',
      studentName: 'นายธนกร เรียนเก่ง',
      studentEmail: 'thanakorn.r@student.mahidol.ac.th',
      applicationId: 'APP004',
      scholarshipName: 'ทุนวิจัยระดับปริญญาตรี',
      documentType: 'photo',
      documentName: 'รูปถ่าย 1 นิ้ว',
      filename: 'photo_1inch.jpg',
      fileSize: 256000,
      uploadDate: '2024-12-08',
      submissionDate: '2024-12-08',
      status: 'pending',
      priority: 'medium',
      faculty: 'คณะวิทยาศาสตร์',
      year: 4,
      gpa: 3.90,
      daysOverdue: 4
    },
    {
      id: 'DOC005',
      studentId: '6388005',
      studentName: 'นางสาว มาลี สวยงาม',
      studentEmail: 'malee.s@student.mahidol.ac.th',
      applicationId: 'APP005',
      scholarshipName: 'ทุนกิจกรรมนักศึกษา',
      documentType: 'id_card',
      documentName: 'สำเนาบัตรประชาชน',
      filename: 'id_card_copy.jpg',
      fileSize: 512000,
      uploadDate: '2024-12-10',
      submissionDate: '2024-12-10',
      status: 'requires_resubmission',
      priority: 'low',
      reviewedBy: 'วิไลวรรณ จัดการดี',
      reviewDate: '2024-12-11',
      rejectionReason: 'รูปภาพไม่ชัดเจน กรุณาแสกนใหม่ด้วยความละเอียดสูง',
      faculty: 'คณะศิลปศาสตร์',
      year: 2,
      gpa: 2.85,
      notes: 'ให้ความช่วยเหลือนักศึกษาในการแสกนเอกสาร'
    },
    {
      id: 'DOC006',
      studentId: '6388006',
      studentName: 'นายวิชัย ทำดี',
      studentEmail: 'wichai.t@student.mahidol.ac.th',
      applicationId: 'APP006',
      scholarshipName: 'ทุนความเป็นเลิศทางวิชาการ',
      documentType: 'transcript',
      documentName: 'ใบแสดงผลการเรียนรวม 4 ปี',
      filename: 'transcript_cumulative.pdf',
      fileSize: 3072000,
      uploadDate: '2024-12-12',
      submissionDate: '2024-12-12',
      status: 'pending',
      priority: 'high',
      faculty: 'คณะวิศวกรรมศาสตร์',
      year: 4,
      gpa: 3.95,
      daysOverdue: 1,
      expiryDate: '2025-04-30'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'ทุกสถานะ' },
    { value: 'pending', label: 'รอตรวจสอบ' },
    { value: 'approved', label: 'อนุมัติ' },
    { value: 'rejected', label: 'ไม่อนุมัติ' },
    { value: 'requires_resubmission', label: 'ต้องส่งใหม่' }
  ];

  const documentTypeOptions = [
    { value: 'all', label: 'ทุกประเภท' },
    { value: 'transcript', label: 'ใบแสดงผลการเรียน' },
    { value: 'income_certificate', label: 'หนังสือรับรองรายได้' },
    { value: 'id_card', label: 'สำเนาบัตรประชาชน' },
    { value: 'photo', label: 'รูปถ่าย' },
    { value: 'recommendation', label: 'หนังสือรับรอง' },
    { value: 'other', label: 'อื่นๆ' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'ทุกระดับ' },
    { value: 'high', label: 'สูง' },
    { value: 'medium', label: 'ปานกลาง' },
    { value: 'low', label: 'ต่ำ' }
  ];

  const filteredDocuments = documentSubmissions.filter(doc => {
    const matchesSearch = doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.studentId.includes(searchTerm) ||
                         doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    const matchesType = selectedDocumentType === 'all' || doc.documentType === selectedDocumentType;
    const matchesPriority = selectedPriority === 'all' || doc.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'requires_resubmission': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'รอตรวจสอบ';
      case 'approved': return 'อนุมัติ';
      case 'rejected': return 'ไม่อนุมัติ';
      case 'requires_resubmission': return 'ต้องส่งใหม่';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return ClockIcon;
      case 'approved': return CheckCircleIcon;
      case 'rejected': return XCircleIcon;
      case 'requires_resubmission': return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'สูง';
      case 'medium': return 'ปานกลาง';
      case 'low': return 'ต่ำ';
      default: return 'ไม่ระบุ';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'transcript': return DocumentTextIcon;
      case 'income_certificate': return DocumentIcon;
      case 'id_card': return DocumentIcon;
      case 'photo': return DocumentIcon;
      case 'recommendation': return DocumentTextIcon;
      default: return DocumentIcon;
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'transcript': return 'ใบแสดงผลการเรียน';
      case 'income_certificate': return 'หนังสือรับรองรายได้';
      case 'id_card': return 'สำเนาบัตรประชาชน';
      case 'photo': return 'รูปถ่าย';
      case 'recommendation': return 'หนังสือรับรอง';
      case 'other': return 'อื่นๆ';
      default: return 'ไม่ระบุ';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDaysOverdue = (submissionDate: string) => {
    const today = new Date();
    const submission = new Date(submissionDate);
    const diffTime = today.getTime() - submission.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7 ? diffDays - 7 : 0;
  };

  const statistics = {
    total: documentSubmissions.length,
    pending: documentSubmissions.filter(doc => doc.status === 'pending').length,
    approved: documentSubmissions.filter(doc => doc.status === 'approved').length,
    rejected: documentSubmissions.filter(doc => doc.status === 'rejected').length,
    resubmission: documentSubmissions.filter(doc => doc.status === 'requires_resubmission').length,
    overdue: documentSubmissions.filter(doc => doc.daysOverdue && doc.daysOverdue > 0).length
  };

  const handleSelectDocument = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for documents:`, selectedDocuments);
    setSelectedDocuments([]);
  };

  const handleViewDocument = (doc: DocumentSubmission) => {
    setCurrentDocument(doc);
    setShowViewModal(true);
  };

  const handleApprove = (doc: DocumentSubmission) => {
    setCurrentDocument(doc);
    setShowApproveModal(true);
  };

  const handleReject = (doc: DocumentSubmission) => {
    setCurrentDocument(doc);
    setRejectionReason('');
    setRequireResubmission(false);
    setShowRejectModal(true);
  };

  const handleContact = (doc: DocumentSubmission) => {
    setCurrentDocument(doc);
    setContactMessage('');
    setShowContactModal(true);
  };

  const handleDownload = (doc: DocumentSubmission) => {
    info('กำลังดาวน์โหลด', `กำลังดาวน์โหลดไฟล์ ${doc.filename}`);
    // Simulate download
    setTimeout(() => {
      success('ดาวน์โหลดสำเร็จ', `ดาวน์โหลด ${doc.filename} เรียบร้อยแล้ว`);
    }, 1500);
  };

  const confirmApprove = async () => {
    if (!currentDocument) return;

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('อนุมัติสำเร็จ', `อนุมัติเอกสาร ${currentDocument.documentName} แล้ว`);
      setShowApproveModal(false);
      setCurrentDocument(null);
    } catch (err) {
      error('เกิดข้อผิดพลาด', 'ไม่สามารถอนุมัติเอกสารได้');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!currentDocument) return;

    if (!rejectionReason.trim()) {
      warning('กรุณาระบุเหตุผล', 'กรุณาระบุเหตุผลที่ไม่อนุมัติเอกสาร');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusText = requireResubmission ? 'ต้องส่งเอกสารใหม่' : 'ไม่อนุมัติ';
      success(statusText, `${statusText}เอกสาร ${currentDocument.documentName} แล้ว`);
      setShowRejectModal(false);
      setCurrentDocument(null);
      setRejectionReason('');
    } catch (err) {
      error('เกิดข้อผิดพลาด', 'ไม่สามารถดำเนินการได้');
    } finally {
      setIsProcessing(false);
    }
  };

  const sendContactMessage = async () => {
    if (!currentDocument) return;

    if (!contactMessage.trim()) {
      warning('กรุณากรอกข้อความ', 'กรุณากรอกข้อความที่ต้องการส่ง');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('ส่งข้อความสำเร็จ', `ส่งข้อความถึง ${currentDocument.studentName} แล้ว`);
      setShowContactModal(false);
      setCurrentDocument(null);
      setContactMessage('');
    } catch (err) {
      error('เกิดข้อผิดพลาด', 'ไม่สามารถส่งข้อความได้');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      <ToastContainer toasts={toasts} onClose={removeToast} />
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                  ตรวจสอบเอกสาร
                </h1>
                <p className="text-secondary-600 font-sarabun">
                  ตรวจสอบและอนุมัติเอกสารประกอบการสมัครทุนการศึกษา
                </p>
              </div>
              {selectedDocuments.length > 0 && (
                <div className="flex space-x-2">
                  <Button variant="primary" size="sm" onClick={() => handleBulkAction('approve')} className="font-sarabun">
                    อนุมัติ ({selectedDocuments.length})
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('reject')} className="font-sarabun">
                    ไม่อนุมัติ ({selectedDocuments.length})
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-blue-50 mb-4">
                  <DocumentIcon className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.total}</p>
                <p className="text-sm text-secondary-600 font-sarabun">ทั้งหมด</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-yellow-50 mb-4">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.pending}</p>
                <p className="text-sm text-secondary-600 font-sarabun">รอตรวจสอบ</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-green-50 mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.approved}</p>
                <p className="text-sm text-secondary-600 font-sarabun">อนุมัติ</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-red-50 mb-4">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.rejected}</p>
                <p className="text-sm text-secondary-600 font-sarabun">ไม่อนุมัติ</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-orange-50 mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.resubmission}</p>
                <p className="text-sm text-secondary-600 font-sarabun">ต้องส่งใหม่</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-purple-50 mb-4">
                  <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900 font-sarabun">{statistics.overdue}</p>
                <p className="text-sm text-secondary-600 font-sarabun">เกินกำหนด</p>
              </CardBody>
            </Card>
          </div>

          {/* Search and filters */}
          <Card className="mb-8">
            <CardBody className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="ค้นหาด้วยชื่อนักศึกษา รหัสนักศึกษา หรือชื่อเอกสาร..."
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-secondary-200">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      สถานะ
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      ประเภทเอกสาร
                    </label>
                    <select
                      value={selectedDocumentType}
                      onChange={(e) => setSelectedDocumentType(e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      {documentTypeOptions.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                      ความสำคัญ
                    </label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    >
                      {priorityOptions.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" size="sm" className="font-sarabun">
                      ล้างตัวกรอง
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Bulk actions */}
          {filteredDocuments.length > 0 && (
            <Card className="mb-6">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.length === filteredDocuments.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="text-sm font-medium text-secondary-700 font-sarabun">
                      เลือกทั้งหมด ({selectedDocuments.length}/{filteredDocuments.length})
                    </span>
                  </div>
                  {selectedDocuments.length > 0 && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('download')} className="font-sarabun">
                        ดาวน์โหลดทั้งหมด
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('assign')} className="font-sarabun">
                        มอบหมายผู้ตรวจ
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

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
                  <p className="text-secondary-600 font-sarabun">
                    ไม่มีเอกสารที่ตรงกับเงื่อนไขการค้นหา
                  </p>
                </CardBody>
              </Card>
            ) : (
              filteredDocuments.map((document) => {
                const StatusIcon = getStatusIcon(document.status);
                const TypeIcon = getDocumentTypeIcon(document.documentType);
                
                return (
                  <Card key={document.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardBody className="p-6">
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(document.id)}
                          onChange={() => handleSelectDocument(document.id)}
                          className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded mt-1"
                        />
                        <div className="inline-flex p-3 rounded-xl bg-blue-50">
                          <TypeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-xl font-bold text-secondary-900 font-sarabun">
                                  {document.documentName}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(document.status)}`}>
                                  {getStatusText(document.status)}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(document.priority)}`}>
                                  {getPriorityText(document.priority)}
                                </span>
                                {document.daysOverdue && document.daysOverdue > 0 && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                                    เกิน {document.daysOverdue} วัน
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-secondary-600 font-sarabun mb-2">
                                ประเภท: {getDocumentTypeName(document.documentType)}
                              </p>
                              <p className="text-sm text-secondary-600 font-sarabun mb-2">
                                ไฟล์: {document.filename}
                              </p>
                              <p className="text-lg font-semibold text-blue-600 font-sarabun">
                                {document.scholarshipName}
                              </p>
                            </div>
                          </div>

                          {/* Student details */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-secondary-500">นักศึกษา</p>
                              <p className="font-medium text-secondary-900">{document.studentName}</p>
                              <p className="text-xs text-secondary-600">{document.studentId}</p>
                            </div>
                            <div>
                              <p className="text-sm text-secondary-500">คณะ</p>
                              <p className="font-medium text-secondary-900">{document.faculty}</p>
                              <p className="text-xs text-secondary-600">ชั้นปีที่ {document.year}</p>
                            </div>
                            <div>
                              <p className="text-sm text-secondary-500">เกรดเฉลีย์</p>
                              <p className="font-medium text-secondary-900">{document.gpa}</p>
                            </div>
                            <div>
                              <p className="text-sm text-secondary-500">ขนาดไฟล์</p>
                              <p className="font-medium text-secondary-900">{formatFileSize(document.fileSize)}</p>
                            </div>
                          </div>

                          {/* Document details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-secondary-600">
                            <div>
                              <p className="text-secondary-500">วันที่อัปโหลด</p>
                              <p>{new Date(document.uploadDate).toLocaleDateString('th-TH')}</p>
                            </div>
                            <div>
                              <p className="text-secondary-500">วันที่ส่ง</p>
                              <p>{new Date(document.submissionDate).toLocaleDateString('th-TH')}</p>
                            </div>
                            {document.expiryDate && (
                              <div>
                                <p className="text-secondary-500">วันหมดอายุ</p>
                                <p>{new Date(document.expiryDate).toLocaleDateString('th-TH')}</p>
                              </div>
                            )}
                          </div>

                          {/* Review info */}
                          {document.reviewedBy && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-green-600">ตรวจสอบโดย</p>
                                  <p className="text-green-800 font-medium">{document.reviewedBy}</p>
                                </div>
                                <div>
                                  <p className="text-green-600">วันที่ตรวจสอบ</p>
                                  <p className="text-green-800 font-medium">
                                    {document.reviewDate && new Date(document.reviewDate).toLocaleDateString('th-TH')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Rejection reason */}
                          {(document.status === 'rejected' || document.status === 'requires_resubmission') && document.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                              <div className="flex items-start space-x-2">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="font-medium text-red-800 font-sarabun">เหตุผลที่ไม่อนุมัติ</h4>
                                  <p className="text-red-700 text-sm">{document.rejectionReason}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {document.notes && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                              <h4 className="font-medium text-blue-800 font-sarabun mb-1">หมายเหตุ</h4>
                              <p className="text-blue-700 text-sm">{document.notes}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between border-t border-secondary-200 pt-4">
                            <div className="flex space-x-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="font-sarabun"
                                onClick={() => handleViewDocument(document)}
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                ดูเอกสาร
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="font-sarabun"
                                onClick={() => handleDownload(document)}
                              >
                                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                ดาวน์โหลด
                              </Button>
                              {document.status === 'pending' && (
                                <>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="font-sarabun"
                                    onClick={() => handleApprove(document)}
                                  >
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    อนุมัติ
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 font-sarabun"
                                    onClick={() => handleReject(document)}
                                  >
                                    <XCircleIcon className="h-4 w-4 mr-2" />
                                    ไม่อนุมัติ
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="font-sarabun"
                                onClick={() => handleContact(document)}
                              >
                                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                                ติดต่อนักศึกษา
                              </Button>
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

      {/* View Document Modal */}
      {showViewModal && currentDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 font-sarabun">
                  {currentDocument.documentName}
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Document info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 font-sarabun">นักศึกษา</p>
                  <p className="text-base font-semibold text-gray-900 font-sarabun">
                    {currentDocument.studentName}
                  </p>
                  <p className="text-sm text-gray-600">{currentDocument.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-sarabun">ทุนการศึกษา</p>
                  <p className="text-base font-semibold text-gray-900 font-sarabun">
                    {currentDocument.scholarshipName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-sarabun">ประเภทเอกสาร</p>
                  <p className="text-base font-semibold text-gray-900 font-sarabun">
                    {getDocumentTypeName(currentDocument.documentType)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-sarabun">ขนาดไฟล์</p>
                  <p className="text-base font-semibold text-gray-900 font-sarabun">
                    {formatFileSize(currentDocument.fileSize)}
                  </p>
                </div>
              </div>

              {/* Document preview */}
              <div className="bg-gray-100 rounded-lg p-12 text-center mb-6">
                <DocumentIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-sarabun mb-2">{currentDocument.filename}</p>
                <p className="text-sm text-gray-500 font-sarabun">
                  ตัวอย่างเอกสาร (ในระบบจริงจะแสดงเอกสารที่นี่)
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowViewModal(false)}
                  className="font-sarabun"
                >
                  ปิด
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleDownload(currentDocument)}
                  className="font-sarabun"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  ดาวน์โหลด
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && currentDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 font-sarabun flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                ยืนยันการอนุมัติ
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 font-sarabun mb-4">
                คุณต้องการอนุมัติเอกสารนี้ใช่หรือไม่?
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-green-900 font-sarabun">
                  {currentDocument.documentName}
                </p>
                <p className="text-sm text-green-700 font-sarabun mt-1">
                  นักศึกษา: {currentDocument.studentName}
                </p>
                <p className="text-sm text-green-700 font-sarabun">
                  ทุน: {currentDocument.scholarshipName}
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowApproveModal(false)}
                  disabled={isProcessing}
                  className="flex-1 font-sarabun"
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmApprove}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 font-sarabun"
                >
                  {isProcessing ? 'กำลังดำเนินการ...' : 'อนุมัติ'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && currentDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 font-sarabun flex items-center">
                <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
                ไม่อนุมัติเอกสาร
              </h2>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-red-900 font-sarabun">
                  {currentDocument.documentName}
                </p>
                <p className="text-sm text-red-700 font-sarabun mt-1">
                  นักศึกษา: {currentDocument.studentName}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  เหตุผลที่ไม่อนุมัติ <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-sarabun"
                  placeholder="ระบุเหตุผลที่ไม่อนุมัติเอกสาร เช่น เอกสารไม่ชัดเจน, ข้อมูลไม่ครบถ้วน"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={requireResubmission}
                    onChange={(e) => setRequireResubmission(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 font-sarabun">
                    ให้นักศึกษาส่งเอกสารใหม่
                  </span>
                </label>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectModal(false)}
                  disabled={isProcessing}
                  className="flex-1 font-sarabun"
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmReject}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 hover:bg-red-700 font-sarabun"
                >
                  {isProcessing ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Student Modal */}
      {showContactModal && currentDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 font-sarabun flex items-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-2" />
                ติดต่อนักศึกษา
              </h2>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-blue-900 font-sarabun">
                  {currentDocument.studentName}
                </p>
                <p className="text-sm text-blue-700 font-sarabun mt-1">
                  อีเมล: {currentDocument.studentEmail}
                </p>
                <p className="text-sm text-blue-700 font-sarabun">
                  เรื่อง: {currentDocument.documentName}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 font-sarabun mb-2">
                  ข้อความ <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sarabun"
                  placeholder="พิมพ์ข้อความที่ต้องการส่งถึงนักศึกษา..."
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowContactModal(false)}
                  disabled={isProcessing}
                  className="flex-1 font-sarabun"
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="primary"
                  onClick={sendContactMessage}
                  disabled={isProcessing}
                  className="flex-1 font-sarabun"
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  {isProcessing ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerDocumentsPage;