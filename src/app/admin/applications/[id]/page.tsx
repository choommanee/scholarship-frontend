'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { applicationService, Application } from '@/services/application.service';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import {
  ArrowLeftIcon,
  UserIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PencilIcon,
  DocumentCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ApplicationDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'interview' | 'document'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewScore, setReviewScore] = useState<number>(85);
  const [interviewDate, setInterviewDate] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplicationById(applicationId);
      setApplication(data);
    } catch (error) {
      console.error('Failed to load application:', error);
      toast.error('ไม่สามารถโหลดข้อมูลใบสมัครได้');
      router.push('/admin/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!application) return;

    try {
      setActionLoading(prev => ({ ...prev, 'review': true }));

      const reviewData: any = {
        applicationId: application.id,
        status: reviewAction === 'approve' ? 'approved' : 
                reviewAction === 'reject' ? 'rejected' : 
                reviewAction === 'interview' ? 'interview_scheduled' : 'document_pending',
        notes: reviewNotes
      };

      if (reviewAction === 'approve') {
        reviewData.score = reviewScore;
      } else if (reviewAction === 'reject') {
        reviewData.rejectionReason = rejectionReason;
      } else if (reviewAction === 'interview') {
        reviewData.interviewDate = interviewDate;
      }

      await applicationService.reviewApplication(reviewData);
      
      await loadApplication();
      setShowReviewModal(false);
      setReviewNotes('');
      setReviewScore(85);
      setInterviewDate('');
      setRejectionReason('');
      
      toast.success(`${reviewAction === 'approve' ? 'อนุมัติ' : 
                     reviewAction === 'reject' ? 'ปฏิเสธ' : 
                     reviewAction === 'interview' ? 'นัดสัมภาษณ์' : 'ขอเอกสาร'}ใบสมัครเรียบร้อยแล้ว`);
    } catch (error) {
      console.error('Review error:', error);
      toast.error('ไม่สามารถดำเนินการได้');
    } finally {
      setActionLoading(prev => ({ ...prev, 'review': false }));
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    const statusConfig = {
      'draft': { color: 'secondary', label: 'แบบร่าง', icon: DocumentTextIcon },
      'submitted': { color: 'primary', label: 'ส่งแล้ว', icon: CheckCircleIcon },
      'under_review': { color: 'warning', label: 'กำลังพิจารณา', icon: ClockIcon },
      'document_pending': { color: 'warning', label: 'รอเอกสาร', icon: ExclamationTriangleIcon },
      'interview_scheduled': { color: 'info', label: 'นัดสัมภาษณ์', icon: CalendarIcon },
      'approved': { color: 'success', label: 'อนุมัติ', icon: CheckCircleIcon },
      'rejected': { color: 'danger', label: 'ปฏิเสธ', icon: XCircleIcon }
    };

    const config = statusConfig[status] || statusConfig['draft'];
    const Icon = config.icon;

    return (
      <Badge variant={config.color as any} className="inline-flex items-center text-sm px-3 py-1">
        <Icon className="w-4 h-4 mr-2" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Application['priority']) => {
    const priorityConfig = {
      'high': { color: 'danger', label: 'สูง' },
      'medium': { color: 'warning', label: 'ปานกลาง' },
      'low': { color: 'secondary', label: 'ต่ำ' }
    };

    const config = priorityConfig[priority] || priorityConfig['medium'];
    
    return (
      <Badge variant={config.color as any} className="text-sm px-3 py-1">
        {config.label}
      </Badge>
    );
  };

  const getDocumentStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    const statusConfig = {
      'pending': { color: 'warning', label: 'รอตรวจสอบ' },
      'approved': { color: 'success', label: 'อนุมัติ' },
      'rejected': { color: 'danger', label: 'ไม่อนุมัติ' }
    };

    const config = statusConfig[status];
    
    return (
      <Badge variant={config.color as any} className="text-xs px-2 py-0.5">
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-sarabun">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2 font-sarabun">
            ไม่พบใบสมัคร
          </h3>
          <p className="text-secondary-600 font-sarabun mb-4">
            ไม่พบใบสมัครที่คุณต้องการ
          </p>
          <Button variant="outline" onClick={() => router.push('/admin/applications')} className="font-sarabun">
            กลับไปหน้ารายการ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="outline"
                onClick={() => router.push('/admin/applications')}
                className="mb-4 font-sarabun"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                กลับไปรายการใบสมัคร
              </Button>
              <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                รายละเอียดใบสมัครทุนการศึกษา
              </h1>
              <div className="flex items-center space-x-4">
                {getStatusBadge(application.status)}
                {getPriorityBadge(application.priority)}
                <span className="text-secondary-600 font-sarabun">
                  ส่งเมื่อ: {formatDate(application.submissionDate)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {(application.status === 'submitted' || application.status === 'under_review') && (
                <>
                  <Button
                    variant="success"
                    onClick={() => { setReviewAction('approve'); setShowReviewModal(true); }}
                    className="font-sarabun"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    อนุมัติ
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => { setReviewAction('interview'); setShowReviewModal(true); }}
                    className="font-sarabun"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    นัดสัมภาษณ์
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => { setReviewAction('document'); setShowReviewModal(true); }}
                    className="font-sarabun"
                  >
                    <DocumentCheckIcon className="h-4 w-4 mr-2" />
                    ขอเอกสาร
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => { setReviewAction('reject'); setShowReviewModal(true); }}
                    className="font-sarabun"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    ปฏิเสธ
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card>
              <CardBody className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-300">
                      <UserIcon className="h-10 w-10 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-secondary-900 font-sarabun mb-2">
                      {application.personalInfo?.firstName || 'ไม่ระบุ'} {application.personalInfo?.lastName || ''}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sarabun">
                      <div className="flex items-center text-secondary-600">
                        <span className="font-medium mr-2">อีเมล:</span>
                        <a href={`mailto:${application.personalInfo?.email || ''}`} className="text-primary-600 hover:underline">
                          {application.personalInfo?.email || 'ไม่ระบุ'}
                        </a>
                      </div>
                      <div className="flex items-center text-secondary-600">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        <a href={`tel:${application.personalInfo?.phone || ''}`} className="text-primary-600 hover:underline">
                          {application.personalInfo?.phone || 'ไม่ระบุ'}
                        </a>
                      </div>
                      <div className="flex items-start text-secondary-600 md:col-span-2">
                        <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{application.personalInfo?.address || 'ไม่ระบุที่อยู่'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <h3 className="text-lg font-medium text-secondary-900 mb-3 font-sarabun">ติดต่อฉุกเฉิน</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-sarabun">
                    <div>
                      <span className="font-medium text-secondary-700">ชื่อ:</span>
                      <p className="text-secondary-600">{application.personalInfo?.emergencyContact?.name || 'ไม่ระบุ'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-secondary-700">ความสัมพันธ์:</span>
                      <p className="text-secondary-600">{application.personalInfo?.emergencyContact?.relationship || 'ไม่ระบุ'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-secondary-700">โทรศัพท์:</span>
                      <p className="text-secondary-600">{application.personalInfo?.emergencyContact?.phone || 'ไม่ระบุ'}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4 font-sarabun flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  ข้อมูลการศึกษา
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <span className="font-medium text-secondary-700 font-sarabun">คณะ:</span>
                    <p className="text-secondary-900 font-sarabun">{application.faculty}</p>
                  </div>
                  <div>
                    <span className="font-medium text-secondary-700 font-sarabun">ชั้นปี:</span>
                    <p className="text-secondary-900 font-sarabun">ปี {application.year}</p>
                  </div>
                  <div>
                    <span className="font-medium text-secondary-700 font-sarabun">เกรดเฉลี่ย:</span>
                    <p className="text-secondary-900 font-sarabun text-lg font-semibold">{application.gpa}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4 font-sarabun flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  ข้อมูลทางการเงิน
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="font-medium text-secondary-700 font-sarabun">รายได้ครอบครัว:</span>
                    <p className="text-secondary-900 font-sarabun text-lg font-semibold">
                      {formatCurrency(application.financialInfo?.familyIncome || 0)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-secondary-700 font-sarabun">จำนวนสมาชิกในครอบครัว:</span>
                    <p className="text-secondary-900 font-sarabun">{application.financialInfo?.familySize || 0} คน</p>
                  </div>
                  <div>
                    <span className="font-medium text-secondary-700 font-sarabun">รายจ่ายต่อเดือน:</span>
                    <p className="text-secondary-900 font-sarabun">
                      {formatCurrency(application.financialInfo?.expenses || 0)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-secondary-700 font-sarabun">ทุนการศึกษาอื่น:</span>
                    <p className="text-secondary-900 font-sarabun">
                      {application.financialInfo?.otherScholarships?.length || 0} ทุน
                    </p>
                  </div>
                </div>

                {(application.financialInfo?.otherScholarships?.length || 0) > 0 && (
                  <div className="mt-6 pt-6 border-t border-secondary-200">
                    <h4 className="font-medium text-secondary-900 mb-3 font-sarabun">ทุนการศึกษาอื่นที่ได้รับ:</h4>
                    <div className="space-y-3">
                      {application.financialInfo.otherScholarships.map((scholarship, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                          <div>
                            <p className="font-medium text-secondary-900 font-sarabun">{scholarship.name}</p>
                            <p className="text-sm text-secondary-600 font-sarabun">ปี {scholarship.year}</p>
                          </div>
                          <div className="font-semibold text-secondary-900 font-sarabun">
                            {formatCurrency(scholarship.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Activities */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4 font-sarabun">
                  กิจกรรมและผลงาน
                </h2>
                {(application.activities?.length || 0) > 0 ? (
                  <div className="space-y-4">
                    {application.activities?.map((activity, index) => (
                      <div key={index} className="p-4 border border-secondary-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-secondary-900 font-sarabun">{activity.name}</h4>
                          <Badge variant="secondary" className="font-sarabun">{activity.hours} ชั่วโมง</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sarabun mb-3">
                          <div>
                            <span className="font-medium text-secondary-700">ตำแหน่ง:</span>
                            <span className="ml-2 text-secondary-600">{activity.role}</span>
                          </div>
                          <div>
                            <span className="font-medium text-secondary-700">ปี:</span>
                            <span className="ml-2 text-secondary-600">{activity.year}</span>
                          </div>
                        </div>
                        <p className="text-secondary-600 font-sarabun">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-500 text-center py-8 font-sarabun">ไม่มีข้อมูลกิจกรรม</p>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scholarship Information */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                  ทุนการศึกษาที่สมัคร
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 font-sarabun mb-2">{application.scholarshipName}</h4>
                    <div className="text-2xl font-bold text-primary-600 font-sarabun">
                      {formatCurrency(application.scholarshipAmount)}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Documents Status */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                  สถานะเอกสาร
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-sarabun text-secondary-700">ใบแสดงผลการศึกษา</span>
                    {getDocumentStatusBadge(application.documentsStatus?.transcript || 'pending')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-sarabun text-secondary-700">หนังสือรับรองรายได้</span>
                    {getDocumentStatusBadge(application.documentsStatus?.income_certificate || 'pending')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-sarabun text-secondary-700">สำเนาบัตรประชาชน</span>
                    {getDocumentStatusBadge(application.documentsStatus?.id_card || 'pending')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-sarabun text-secondary-700">รูปถ่าย</span>
                    {getDocumentStatusBadge(application.documentsStatus?.photo || 'pending')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-sarabun text-secondary-700">จดหมายแนะนำตัว</span>
                    {getDocumentStatusBadge(application.documentsStatus?.recommendation || 'pending')}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Review Information */}
            {(application.reviewDate || application.score || application.notes) && (
              <Card>
                <CardBody className="p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    ข้อมูลการพิจารณา
                  </h3>
                  <div className="space-y-3">
                    {application.score && (
                      <div>
                        <span className="text-sm font-medium text-secondary-700 font-sarabun">คะแนน:</span>
                        <div className="text-2xl font-bold text-primary-600 font-sarabun">
                          {application.score}/100
                        </div>
                      </div>
                    )}
                    {application.reviewDate && (
                      <div>
                        <span className="text-sm font-medium text-secondary-700 font-sarabun">วันที่พิจารณา:</span>
                        <p className="text-secondary-900 font-sarabun">{formatDate(application.reviewDate)}</p>
                      </div>
                    )}
                    {application.reviewedBy && (
                      <div>
                        <span className="text-sm font-medium text-secondary-700 font-sarabun">ผู้พิจารณา:</span>
                        <p className="text-secondary-900 font-sarabun">{application.reviewedBy}</p>
                      </div>
                    )}
                    {application.interviewDate && (
                      <div>
                        <span className="text-sm font-medium text-secondary-700 font-sarabun">วันที่สัมภาษณ์:</span>
                        <p className="text-secondary-900 font-sarabun">{formatDateTime(application.interviewDate)}</p>
                      </div>
                    )}
                    {application.rejectionReason && (
                      <div>
                        <span className="text-sm font-medium text-secondary-700 font-sarabun">เหตุผลที่ปฏิเสธ:</span>
                        <p className="text-red-600 font-sarabun">{application.rejectionReason}</p>
                      </div>
                    )}
                    {application.notes && (
                      <div>
                        <span className="text-sm font-medium text-secondary-700 font-sarabun">หมายเหตุ:</span>
                        <p className="text-secondary-900 font-sarabun">{application.notes}</p>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-lg w-full">
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-sarabun">
                  {reviewAction === 'approve' && 'อนุมัติใบสมัคร'}
                  {reviewAction === 'reject' && 'ปฏิเสธใบสมัคร'}
                  {reviewAction === 'interview' && 'นัดสัมภาษณ์'}
                  {reviewAction === 'document' && 'ขอเอกสารเพิ่มเติม'}
                </h3>

                <div className="space-y-4">
                  {reviewAction === 'approve' && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                        คะแนน (0-100)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={reviewScore}
                        onChange={(e) => setReviewScore(Number(e.target.value))}
                        className="font-sarabun"
                      />
                    </div>
                  )}

                  {reviewAction === 'reject' && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                        เหตุผลในการปฏิเสธ *
                      </label>
                      <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="กรุณาระบุเหตุผลในการปฏิเสธใบสมัคร"
                        rows={4}
                        className="font-sarabun"
                      />
                    </div>
                  )}

                  {reviewAction === 'interview' && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                        วันที่และเวลาสัมภาษณ์ *
                      </label>
                      <Input
                        type="datetime-local"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="font-sarabun"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                      หมายเหตุ
                    </label>
                    <Textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="หมายเหตุเพิ่มเติม"
                      rows={3}
                      className="font-sarabun"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 font-sarabun"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    variant={reviewAction === 'approve' ? 'success' : 
                            reviewAction === 'reject' ? 'danger' : 'primary'}
                    onClick={handleReview}
                    disabled={actionLoading.review || 
                             (reviewAction === 'reject' && !rejectionReason) ||
                             (reviewAction === 'interview' && !interviewDate)}
                    className="flex-1 font-sarabun"
                  >
                    {actionLoading.review ? (
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    ยืนยัน
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailPage; 