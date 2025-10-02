'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { applicationService, Application } from '@/services/application.service';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  FunnelIcon,
  Squares2X2Icon,
  DocumentCheckIcon,
  ArrowPathIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ReviewDecision {
  applicationId: string;
  decision: 'approve' | 'reject' | 'interview' | 'pending';
  score?: number;
  notes?: string;
  interviewDate?: string;
  rejectionReason?: string;
}

export default function BulkReviewPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('submitted,under_review');
  const [sortBy, setSortBy] = useState('gpa');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Track decisions for each application
  const [decisions, setDecisions] = useState<Record<string, ReviewDecision>>({});
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Load applications
  useEffect(() => {
    loadApplications();
  }, [selectedStatus, sortBy, sortOrder]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getApplications({
        status: selectedStatus,
        sortBy,
        sortOrder,
        limit: 50
      });
      setApplications(response.applications);

      // Initialize decisions with pending status
      const initialDecisions: Record<string, ReviewDecision> = {};
      response.applications.forEach(app => {
        initialDecisions[app.id] = {
          applicationId: app.id,
          decision: 'pending',
          score: app.score || 0,
          notes: ''
        };
      });
      setDecisions(initialDecisions);
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  // Update decision for an application
  const updateDecision = (
    applicationId: string,
    field: keyof ReviewDecision,
    value: any
  ) => {
    setDecisions(prev => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        [field]: value
      }
    }));
  };

  // Save all decisions
  const handleSaveAll = async () => {
    const decisionsToSave = Object.values(decisions).filter(d => d.decision !== 'pending');

    if (decisionsToSave.length === 0) {
      toast.error('กรุณาเลือกการตัดสินใจอย่างน้อย 1 รายการ');
      return;
    }

    try {
      setSaving(true);

      // Process each decision
      for (const decision of decisionsToSave) {
        try {
          if (decision.decision === 'approve') {
            await applicationService.reviewApplication({
              applicationId: decision.applicationId,
              status: 'approved',
              score: decision.score,
              notes: decision.notes
            });
          } else if (decision.decision === 'reject') {
            await applicationService.reviewApplication({
              applicationId: decision.applicationId,
              status: 'rejected',
              notes: decision.notes,
              rejectionReason: decision.rejectionReason || decision.notes
            });
          } else if (decision.decision === 'interview') {
            await applicationService.reviewApplication({
              applicationId: decision.applicationId,
              status: 'interview_scheduled',
              notes: decision.notes,
              interviewDate: decision.interviewDate
            });
          }
        } catch (error) {
          console.error(`Failed to save decision for ${decision.applicationId}:`, error);
        }
      }

      toast.success(`บันทึกการตัดสินใจ ${decisionsToSave.length} รายการเรียบร้อยแล้ว`);

      // Reload applications
      await loadApplications();
    } catch (error) {
      console.error('Failed to save decisions:', error);
      toast.error('ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setSaving(false);
    }
  };

  // Toggle compare selection
  const toggleCompare = (applicationId: string) => {
    if (selectedForCompare.includes(applicationId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== applicationId));
    } else if (selectedForCompare.length < 4) {
      setSelectedForCompare([...selectedForCompare, applicationId]);
    } else {
      toast.error('สามารถเปรียบเทียบได้สูงสุด 4 รายการ');
    }
  };

  // Get decision counts
  const getDecisionCounts = () => {
    const counts = {
      approve: 0,
      reject: 0,
      interview: 0,
      pending: 0
    };

    Object.values(decisions).forEach(d => {
      counts[d.decision]++;
    });

    return counts;
  };

  const decisionCounts = getDecisionCounts();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approve':
        return 'border-green-300 bg-green-50';
      case 'reject':
        return 'border-red-300 bg-red-50';
      case 'interview':
        return 'border-blue-300 bg-blue-50';
      default:
        return 'border-secondary-200 bg-white';
    }
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

  // Compare view
  if (compareMode && selectedForCompare.length > 0) {
    const compareApps = applications.filter(app => selectedForCompare.includes(app.id));

    return (
      <div className="min-h-screen bg-secondary-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setCompareMode(false)}
              className="font-sarabun mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              กลับ
            </Button>
            <h1 className="text-2xl font-bold text-secondary-900 font-sarabun">
              เปรียบเทียบใบสมัคร ({compareApps.length} รายการ)
            </h1>
          </div>

          {/* Comparison Grid */}
          <div className={`grid grid-cols-${Math.min(compareApps.length, 4)} gap-4`}>
            {compareApps.map(app => (
              <Card key={app.id} className={`${getDecisionColor(decisions[app.id]?.decision)} border-2`}>
                <CardHeader className="border-b border-secondary-200">
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-3 border-2 border-blue-300">
                      <UserIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg font-sarabun text-secondary-900">
                      {app.personalInfo.firstName} {app.personalInfo.lastName}
                    </h3>
                    <p className="text-sm text-secondary-600 font-sarabun">
                      {app.studentId}
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="p-4 space-y-3">
                  <div className="text-center pb-3 border-b">
                    <p className="text-xs text-secondary-500 font-sarabun">ทุนการศึกษา</p>
                    <p className="font-medium text-sm font-sarabun">{app.scholarshipName}</p>
                    <p className="text-xs text-blue-600 font-sarabun">{formatCurrency(app.scholarshipAmount)}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600 font-sarabun">GPA:</span>
                      <span className="font-bold text-secondary-900 font-sarabun">{app.gpa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 font-sarabun">คณะ:</span>
                      <span className="font-medium text-secondary-900 font-sarabun text-xs">{app.faculty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 font-sarabun">รายได้:</span>
                      <span className="font-medium text-secondary-900 font-sarabun text-xs">
                        {formatCurrency(app.familyIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 font-sarabun">ชั้นปี:</span>
                      <span className="font-medium text-secondary-900 font-sarabun">{app.year}</span>
                    </div>
                  </div>

                  {/* Quick Decision */}
                  <div className="pt-3 border-t space-y-2">
                    <label className="block text-xs font-medium text-secondary-700 font-sarabun">
                      คะแนนประเมิน (0-100)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={decisions[app.id]?.score || 0}
                      onChange={(e) => updateDecision(app.id, 'score', parseInt(e.target.value))}
                      className="text-center font-sarabun"
                    />

                    <div className="grid grid-cols-1 gap-1">
                      <Button
                        size="sm"
                        variant={decisions[app.id]?.decision === 'approve' ? 'success' : 'outline'}
                        onClick={() => updateDecision(app.id, 'decision', 'approve')}
                        className="font-sarabun"
                      >
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        อนุมัติ
                      </Button>
                      <Button
                        size="sm"
                        variant={decisions[app.id]?.decision === 'interview' ? 'primary' : 'outline'}
                        onClick={() => updateDecision(app.id, 'decision', 'interview')}
                        className="font-sarabun"
                      >
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        สัมภาษณ์
                      </Button>
                      <Button
                        size="sm"
                        variant={decisions[app.id]?.decision === 'reject' ? 'danger' : 'outline'}
                        onClick={() => updateDecision(app.id, 'decision', 'reject')}
                        className="font-sarabun"
                      >
                        <XCircleIcon className="h-3 w-3 mr-1" />
                        ปฏิเสธ
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSaveAll}
              disabled={saving}
              className="font-sarabun"
            >
              {saving ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <DocumentCheckIcon className="h-5 w-5 mr-2" />
                  บันทึกการตัดสินใจทั้งหมด
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Button
                variant="outline"
                onClick={() => router.push('/admin/applications')}
                className="font-sarabun mb-4"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                กลับ
              </Button>
              <h1 className="text-3xl font-bold text-secondary-900 font-sarabun mb-2">
                พิจารณาใบสมัครแบบกลุ่ม
              </h1>
              <p className="text-secondary-600 font-sarabun">
                พิจารณาและให้คะแนนใบสมัครหลายรายการพร้อมกัน
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedForCompare.length === 0) {
                    toast.error('กรุณาเลือกใบสมัครที่ต้องการเปรียบเทียบ');
                    return;
                  }
                  setCompareMode(true);
                }}
                disabled={selectedForCompare.length === 0}
                className="font-sarabun"
              >
                <Squares2X2Icon className="h-4 w-4 mr-2" />
                เปรียบเทียบ ({selectedForCompare.length})
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveAll}
                disabled={saving || decisionCounts.pending === applications.length}
                className="font-sarabun"
              >
                {saving ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <DocumentCheckIcon className="h-4 w-4 mr-2" />
                    บันทึกทั้งหมด ({Object.values(decisions).filter(d => d.decision !== 'pending').length})
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardBody className="p-4 text-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900 font-sarabun">{decisionCounts.approve}</p>
                <p className="text-sm text-green-700 font-sarabun">อนุมัติ</p>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardBody className="p-4 text-center">
                <CalendarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900 font-sarabun">{decisionCounts.interview}</p>
                <p className="text-sm text-blue-700 font-sarabun">สัมภาษณ์</p>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardBody className="p-4 text-center">
                <XCircleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-900 font-sarabun">{decisionCounts.reject}</p>
                <p className="text-sm text-red-700 font-sarabun">ปฏิเสธ</p>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardBody className="p-4 text-center">
                <ClockIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 font-sarabun">{decisionCounts.pending}</p>
                <p className="text-sm text-gray-700 font-sarabun">รอพิจารณา</p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                  สถานะที่แสดง
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
                >
                  <option value="submitted,under_review">รอพิจารณา</option>
                  <option value="submitted">ส่งใหม่</option>
                  <option value="under_review">กำลังพิจารณา</option>
                  <option value="">ทั้งหมด</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                  เรียงตาม
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
                >
                  <option value="gpa">GPA</option>
                  <option value="familyIncome">รายได้ครอบครัว</option>
                  <option value="submissionDate">วันที่ส่ง</option>
                  <option value="score">คะแนนประเมิน</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                  ลำดับ
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-sarabun"
                >
                  <option value="desc">มากไปน้อย</option>
                  <option value="asc">น้อยไปมาก</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Applications Grid */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardBody className="p-8 text-center">
                <p className="text-secondary-600 font-sarabun">ไม่พบใบสมัครที่รอพิจารณา</p>
              </CardBody>
            </Card>
          ) : (
            applications.map((app) => (
              <Card
                key={app.id}
                className={`${getDecisionColor(decisions[app.id]?.decision)} border-2 hover:shadow-lg transition-all`}
              >
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Student Info */}
                    <div className="lg:col-span-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedForCompare.includes(app.id)}
                          onChange={() => toggleCompare(app.id)}
                          className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <h3 className="font-bold text-lg font-sarabun text-secondary-900">
                            {app.personalInfo.firstName} {app.personalInfo.lastName}
                          </h3>
                          <p className="text-sm text-secondary-600 font-sarabun">{app.studentId}</p>
                          <p className="text-xs text-secondary-500 font-sarabun mt-1">
                            {app.personalInfo.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Center: Details */}
                    <div className="lg:col-span-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-secondary-500 font-sarabun text-xs">ทุนการศึกษา</p>
                          <p className="font-medium font-sarabun">{app.scholarshipName}</p>
                          <p className="text-blue-600 font-sarabun text-xs">{formatCurrency(app.scholarshipAmount)}</p>
                        </div>
                        <div>
                          <p className="text-secondary-500 font-sarabun text-xs">คณะ</p>
                          <p className="font-medium font-sarabun">{app.faculty}</p>
                          <p className="text-secondary-500 font-sarabun text-xs">ชั้นปีที่ {app.year}</p>
                        </div>
                        <div>
                          <p className="text-secondary-500 font-sarabun text-xs">GPA</p>
                          <p className="font-bold text-lg font-sarabun text-green-600">{app.gpa}</p>
                        </div>
                        <div>
                          <p className="text-secondary-500 font-sarabun text-xs">รายได้ครอบครัว</p>
                          <p className="font-medium font-sarabun text-xs">{formatCurrency(app.familyIncome)}/ปี</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Decision Panel */}
                    <div className="lg:col-span-5">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                            คะแนนประเมิน (0-100)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={decisions[app.id]?.score || 0}
                            onChange={(e) => updateDecision(app.id, 'score', parseInt(e.target.value))}
                            className="font-sarabun"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                            การตัดสินใจ
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              size="sm"
                              variant={decisions[app.id]?.decision === 'approve' ? 'success' : 'outline'}
                              onClick={() => updateDecision(app.id, 'decision', 'approve')}
                              className="font-sarabun"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              อนุมัติ
                            </Button>
                            <Button
                              size="sm"
                              variant={decisions[app.id]?.decision === 'interview' ? 'primary' : 'outline'}
                              onClick={() => {
                                updateDecision(app.id, 'decision', 'interview');
                                const date = prompt('วันที่สัมภาษณ์ (YYYY-MM-DD):');
                                if (date) {
                                  updateDecision(app.id, 'interviewDate', date);
                                }
                              }}
                              className="font-sarabun"
                            >
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              สัมภาษณ์
                            </Button>
                            <Button
                              size="sm"
                              variant={decisions[app.id]?.decision === 'reject' ? 'danger' : 'outline'}
                              onClick={() => {
                                updateDecision(app.id, 'decision', 'reject');
                                const reason = prompt('เหตุผลในการปฏิเสธ:');
                                if (reason) {
                                  updateDecision(app.id, 'rejectionReason', reason);
                                }
                              }}
                              className="font-sarabun"
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              ปฏิเสธ
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Input
                            type="text"
                            placeholder="หมายเหตุ..."
                            value={decisions[app.id]?.notes || ''}
                            onChange={(e) => updateDecision(app.id, 'notes', e.target.value)}
                            className="font-sarabun text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
