'use client';

import React, { useState } from 'react';
import { 
  CogIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface AllocationRule {
  id: string;
  name: string;
  description: string;
  type: 'automatic' | 'manual' | 'hybrid';
  criteria: {
    minGPA: number;
    maxFamilyIncome: number;
    requiredDocuments: string[];
    interviewRequired: boolean;
    minInterviewScore?: number;
  };
  allocation: {
    method: 'score_based' | 'income_based' | 'quota_based' | 'first_come';
    maxRecipients: number;
    budgetPerRecipient: number;
    paymentSchedule: {
      type: 'monthly' | 'semester' | 'lump_sum';
      installments: number;
      amounts: number[];
    };
  };
  conditions: string[];
  isActive: boolean;
}

interface PaymentRule {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  schedule: {
    frequency: 'monthly' | 'semester' | 'yearly';
    amount: number;
    startDate: string;
    endDate: string;
  };
  requirements: string[];
  penalties: string[];
}

export default function AllocationRulesPage() {
  const [activeTab, setActiveTab] = useState<'allocation' | 'payment'>('allocation');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const user = {
    name: 'ผู้ดูแลระบบ',
    role: 'ผู้ดูแลระบบ',
    email: 'admin@university.ac.th',
    department: 'ฝ่ายเทคโนโลยีสารสนเทศ'
  };

  // Mock data
  const allocationRules: AllocationRule[] = [
    {
      id: 'AR001',
      name: 'กฎการจัดสรรทุนพัฒนาศักยภาพ',
      description: 'กฎการจัดสรรสำหรับทุนพัฒนาศักยภาพนักศึกษา',
      type: 'hybrid',
      criteria: {
        minGPA: 3.0,
        maxFamilyIncome: 300000,
        requiredDocuments: ['ใบแสดงผลการเรียน', 'หนังสือรับรองรายได้', 'เอกสารกิจกรรม'],
        interviewRequired: true,
        minInterviewScore: 7.0
      },
      allocation: {
        method: 'score_based',
        maxRecipients: 50,
        budgetPerRecipient: 30000,
        paymentSchedule: {
          type: 'monthly',
          installments: 4,
          amounts: [7500, 7500, 7500, 7500]
        }
      },
      conditions: [
        'ต้องมีเกรดเฉลี่ยไม่ต่ำกว่า 3.0',
        'รายได้ครอบครัวไม่เกิน 300,000 บาท/ปี',
        'ผ่านการสัมภาษณ์ด้วยคะแนนไม่ต่ำกว่า 7.0',
        'เข้าร่วมกิจกรรมเสริมหลักสูตร'
      ],
      isActive: true
    },
    {
      id: 'AR002',
      name: 'กฎการจัดสรรทุนช่วยเหลือครอบครัวยากจน',
      description: 'กฎการจัดสรรสำหรับทุนช่วยเหลือครอบครัวที่มีฐานะยากจน',
      type: 'automatic',
      criteria: {
        minGPA: 2.5,
        maxFamilyIncome: 150000,
        requiredDocuments: ['หนังสือรับรองรายได้', 'หนังสือรับรองความยากจน'],
        interviewRequired: false
      },
      allocation: {
        method: 'income_based',
        maxRecipients: 100,
        budgetPerRecipient: 20000,
        paymentSchedule: {
          type: 'lump_sum',
          installments: 1,
          amounts: [20000]
        }
      },
      conditions: [
        'ต้องมีเกรดเฉลี่ยไม่ต่ำกว่า 2.5',
        'รายได้ครอบครัวไม่เกิน 150,000 บาท/ปี',
        'มีหนังสือรับรองความยากจนจากผู้นำชุมชน'
      ],
      isActive: true
    }
  ];

  const paymentRules: PaymentRule[] = [
    {
      id: 'PR001',
      name: 'กฎการจ่ายเงินทุนรายเดือน',
      description: 'กฎการจ่ายเงินทุนแบบรายเดือนสำหรับทุนพัฒนาศักยภาพ',
      conditions: [
        'นักศึกษาต้องลงทะเบียนเรียนครบตามที่กำหนด',
        'เกรดเฉลี่ยสะสมไม่ต่ำกว่า 2.75',
        'ไม่มีการลงโทษทางวินัย'
      ],
      schedule: {
        frequency: 'monthly',
        amount: 7500,
        startDate: '2024-01-01',
        endDate: '2024-04-30'
      },
      requirements: [
        'ส่งรายงานผลการเรียนทุกเดือน',
        'เข้าร่วมกิจกรรมพัฒนาทักษะอย่างน้อย 1 ครั้ง/เดือน'
      ],
      penalties: [
        'หากเกรดต่ำกว่า 2.75 จะหยุดจ่ายชั่วคราว',
        'หากขาดเรียนเกิน 20% จะตัดสิทธิ์'
      ]
    },
    {
      id: 'PR002',
      name: 'กฎการจ่ายเงินทุนแบบเหมาจ่าย',
      description: 'กฎการจ่ายเงินทุนแบบครั้งเดียวสำหรับทุนช่วยเหลือ',
      conditions: [
        'ผ่านการตรวจสอบเอกสารครบถ้วน',
        'ไม่เคยได้รับทุนประเภทเดียวกันในปีการศึกษาเดียวกัน'
      ],
      schedule: {
        frequency: 'yearly',
        amount: 20000,
        startDate: '2024-03-01',
        endDate: '2024-03-31'
      },
      requirements: [
        'ยื่นใบเสร็จค่าเทอมภายใน 30 วัน',
        'รายงานการใช้เงินทุนภายใน 60 วัน'
      ],
      penalties: [
        'หากไม่ส่งเอกสารตามกำหนด จะระงับการจ่ายเงิน',
        'หากใช้เงินผิดวัตถุประสงค์ ต้องคืนเงิน'
      ]
    }
  ];

  const getAllocationMethodText = (method: string) => {
    switch (method) {
      case 'score_based': return 'จัดสรรตามคะแนน';
      case 'income_based': return 'จัดสรรตามรายได้';
      case 'quota_based': return 'จัดสรรตามโควตา';
      case 'first_come': return 'จัดสรรตามลำดับ';
      default: return method;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'automatic': return 'text-green-600 bg-green-50';
      case 'manual': return 'text-blue-600 bg-blue-50';
      case 'hybrid': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'automatic': return 'อัตโนมัติ';
      case 'manual': return 'ด้วยตนเอง';
      case 'hybrid': return 'ผสมผสาน';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header 
        user={user}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex flex-1 relative">
        <Sidebar 
          userRole="admin"
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
                    กฎเกณฑ์การจัดสรรและจ่ายเงิน
                  </h1>
                  <p className="text-secondary-600 font-sarabun">
                    จัดการกฎเกณฑ์การจัดสรรทุนและการจ่ายเงินทุนการศึกษา
                  </p>
                </div>
                <Button variant="primary" className="font-sarabun" onClick={() => setShowAddModal(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  เพิ่มกฎใหม่
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-secondary-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('allocation')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm font-sarabun ${
                      activeTab === 'allocation'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                    }`}
                  >
                    <CogIcon className="h-5 w-5 inline mr-2" />
                    กฎการจัดสรร
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm font-sarabun ${
                      activeTab === 'payment'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                    }`}
                  >
                    <BanknotesIcon className="h-5 w-5 inline mr-2" />
                    กฎการจ่ายเงิน
                  </button>
                </nav>
              </div>
            </div>

            {/* Allocation Rules Tab */}
            {activeTab === 'allocation' && (
              <div className="space-y-6">
                {allocationRules.map((rule) => (
                  <Card key={rule.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-secondary-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                            <CogIcon className="h-5 w-5 text-blue-500 mr-2" />
                            {rule.name}
                          </CardTitle>
                          <p className="text-sm text-secondary-600 font-sarabun mt-1">
                            {rule.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full font-sarabun ${getTypeColor(rule.type)}`}>
                            {getTypeText(rule.type)}
                          </span>
                          <div className="flex items-center">
                            {rule.isActive ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            ) : (
                              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                            )}
                            <span className={`ml-1 text-sm font-sarabun ${rule.isActive ? 'text-green-600' : 'text-red-600'}`}>
                              {rule.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardBody className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Criteria */}
                        <div>
                          <h4 className="font-semibold text-secondary-900 font-sarabun mb-3">เกณฑ์การพิจารณา</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">เกรดเฉลี่ยขั้นต่ำ:</span>
                              <span className="font-medium font-sarabun">{rule.criteria.minGPA}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">รายได้ครอบครัวสูงสุด:</span>
                              <span className="font-medium font-sarabun">{rule.criteria.maxFamilyIncome.toLocaleString()} บาท</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">ต้องสัมภาษณ์:</span>
                              <span className="font-medium font-sarabun">{rule.criteria.interviewRequired ? 'ใช่' : 'ไม่'}</span>
                            </div>
                            {rule.criteria.minInterviewScore && (
                              <div className="flex justify-between">
                                <span className="text-secondary-600 font-sarabun">คะแนนสัมภาษณ์ขั้นต่ำ:</span>
                                <span className="font-medium font-sarabun">{rule.criteria.minInterviewScore}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4">
                            <h5 className="font-medium text-secondary-900 font-sarabun mb-2">เอกสารที่ต้องการ</h5>
                            <ul className="space-y-1">
                              {rule.criteria.requiredDocuments.map((doc, index) => (
                                <li key={index} className="text-sm text-secondary-600 font-sarabun flex items-center">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                  {doc}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Allocation Details */}
                        <div>
                          <h4 className="font-semibold text-secondary-900 font-sarabun mb-3">รายละเอียดการจัดสรร</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">วิธีการจัดสรร:</span>
                              <span className="font-medium font-sarabun">{getAllocationMethodText(rule.allocation.method)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">จำนวนผู้รับสูงสุด:</span>
                              <span className="font-medium font-sarabun">{rule.allocation.maxRecipients} คน</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">งบประมาณต่อคน:</span>
                              <span className="font-medium font-sarabun">{rule.allocation.budgetPerRecipient.toLocaleString()} บาท</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">รูปแบบการจ่าย:</span>
                              <span className="font-medium font-sarabun">
                                {rule.allocation.paymentSchedule.type === 'monthly' ? 'รายเดือน' : 
                                 rule.allocation.paymentSchedule.type === 'semester' ? 'รายภาค' : 'ครั้งเดียว'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">จำนวนงวด:</span>
                              <span className="font-medium font-sarabun">{rule.allocation.paymentSchedule.installments} งวด</span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h5 className="font-medium text-secondary-900 font-sarabun mb-2">จำนวนเงินแต่ละงวด</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {rule.allocation.paymentSchedule.amounts.map((amount, index) => (
                                <div key={index} className="bg-secondary-50 rounded p-2 text-center">
                                  <span className="text-xs text-secondary-500 font-sarabun">งวดที่ {index + 1}</span>
                                  <div className="font-medium text-secondary-900 font-sarabun">{amount.toLocaleString()} บาท</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Conditions */}
                      <div className="mt-6">
                        <h4 className="font-semibold text-secondary-900 font-sarabun mb-3">เงื่อนไขการได้รับทุน</h4>
                        <ul className="space-y-2">
                          {rule.conditions.map((condition, index) => (
                            <li key={index} className="text-sm text-secondary-600 font-sarabun flex items-start">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {condition}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <Button size="sm" variant="outline" className="font-sarabun">
                          <PencilIcon className="h-4 w-4 mr-1" />
                          แก้ไข
                        </Button>
                        <Button size="sm" variant="outline" className="font-sarabun text-red-600 border-red-300 hover:bg-red-50">
                          <TrashIcon className="h-4 w-4 mr-1" />
                          ลบ
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}

            {/* Payment Rules Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                {paymentRules.map((rule) => (
                  <Card key={rule.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-secondary-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                            <BanknotesIcon className="h-5 w-5 text-green-500 mr-2" />
                            {rule.name}
                          </CardTitle>
                          <p className="text-sm text-secondary-600 font-sarabun mt-1">
                            {rule.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardBody className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Schedule */}
                        <div>
                          <h4 className="font-semibold text-secondary-900 font-sarabun mb-3">กำหนดการจ่ายเงิน</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">ความถี่:</span>
                              <span className="font-medium font-sarabun">
                                {rule.schedule.frequency === 'monthly' ? 'รายเดือน' : 
                                 rule.schedule.frequency === 'semester' ? 'รายภาค' : 'รายปี'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">จำนวนเงิน:</span>
                              <span className="font-medium font-sarabun">{rule.schedule.amount.toLocaleString()} บาท</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">วันที่เริ่ม:</span>
                              <span className="font-medium font-sarabun">{new Date(rule.schedule.startDate).toLocaleDateString('th-TH')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary-600 font-sarabun">วันที่สิ้นสุด:</span>
                              <span className="font-medium font-sarabun">{new Date(rule.schedule.endDate).toLocaleDateString('th-TH')}</span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h5 className="font-medium text-secondary-900 font-sarabun mb-2">เงื่อนไขการจ่าย</h5>
                            <ul className="space-y-1">
                              {rule.conditions.map((condition, index) => (
                                <li key={index} className="text-sm text-secondary-600 font-sarabun flex items-start">
                                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {condition}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Requirements & Penalties */}
                        <div>
                          <h4 className="font-semibold text-secondary-900 font-sarabun mb-3">ข้อกำหนดและบทลงโทษ</h4>
                          
                          <div className="mb-4">
                            <h5 className="font-medium text-secondary-900 font-sarabun mb-2">ข้อกำหนด</h5>
                            <ul className="space-y-1">
                              {rule.requirements.map((req, index) => (
                                <li key={index} className="text-sm text-secondary-600 font-sarabun flex items-start">
                                  <DocumentTextIcon className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium text-secondary-900 font-sarabun mb-2">บทลงโทษ</h5>
                            <ul className="space-y-1">
                              {rule.penalties.map((penalty, index) => (
                                <li key={index} className="text-sm text-secondary-600 font-sarabun flex items-start">
                                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {penalty}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <Button size="sm" variant="outline" className="font-sarabun">
                          <PencilIcon className="h-4 w-4 mr-1" />
                          แก้ไข
                        </Button>
                        <Button size="sm" variant="outline" className="font-sarabun text-red-600 border-red-300 hover:bg-red-50">
                          <TrashIcon className="h-4 w-4 mr-1" />
                          ลบ
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
