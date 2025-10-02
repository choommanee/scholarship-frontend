'use client';

import React, { useState } from 'react';
import { 
  DocumentMagnifyingGlassIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  FireIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface EvaluationCriterion {
  id: string;
  name: string;
  weight: number;
  description: string;
  scoreRanges: {
    range: string;
    description: string;
    examples: string[];
  }[];
  tips: string[];
}

interface ScholarshipCriteria {
  id: string;
  scholarshipName: string;
  description: string;
  criteria: EvaluationCriterion[];
  generalGuidelines: string[];
  scoringNotes: string[];
}

export default function EvaluationCriteriaPage() {
  const [selectedScholarship, setSelectedScholarship] = useState('SCH001');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: 'ผศ.ดร. สมปอง วิชาการดี',
    role: 'ผู้สัมภาษณ์',
    email: 'interviewer@university.ac.th',
    department: 'คณะสาธารณสุขศาสตร์'
  };

  // Mock data
  const scholarshipCriterias: ScholarshipCriteria[] = [
    {
      id: 'SCH001',
      scholarshipName: 'ทุนพัฒนาศักยภาพนักศึกษา',
      description: 'ทุนสำหรับนักศึกษาที่มีศักยภาพในการพัฒนาตนเองและสังคม',
      criteria: [
        {
          id: 'academic',
          name: 'ความรู้วิชาการ',
          weight: 25,
          description: 'ประเมินความรู้ในสาขาวิชาและความสามารถในการนำความรู้ไปประยุกต์ใช้',
          scoreRanges: [
            {
              range: '9-10 คะแนน',
              description: 'ดีเยี่ยม - มีความรู้ลึกซึ้งและสามารถประยุกต์ใช้ได้อย่างสร้างสรรค์',
              examples: [
                'อธิบายแนวคิดทางวิชาการได้อย่างชัดเจนและลึกซึ้ง',
                'เชื่อมโยงความรู้จากหลายสาขาได้',
                'มีแนวคิดใหม่ๆ ในการประยุกต์ใช้ความรู้'
              ]
            },
            {
              range: '7-8 คะแนน',
              description: 'ดี - มีความรู้พื้นฐานที่มั่นคงและสามารถอธิบายได้ดี',
              examples: [
                'เข้าใจหลักการพื้นฐานในสาขาวิชา',
                'สามารถยกตัวอย่างการประยุกต์ใช้ได้',
                'ตอบคำถามได้ถูกต้องและเหมาะสม'
              ]
            },
            {
              range: '5-6 คะแนน',
              description: 'ปานกลาง - มีความรู้พื้นฐาน แต่ยังขาดความลึกซึ้ง',
              examples: [
                'รู้หลักการพื้นฐาน แต่อธิบายไม่ชัดเจน',
                'ตอบคำถามได้บางส่วน',
                'ยังไม่สามารถเชื่อมโยงความรู้ได้ดี'
              ]
            },
            {
              range: '1-4 คะแนน',
              description: 'ต้องปรับปรุง - ความรู้พื้นฐานยังไม่เพียงพอ',
              examples: [
                'ไม่สามารถอธิบายหลักการพื้นฐานได้',
                'ตอบคำถามไม่ตรงประเด็น',
                'แสดงให้เห็นว่าขาดความเข้าใจ'
              ]
            }
          ],
          tips: [
            'ถามคำถามเกี่ยวกับสาขาวิชาที่เรียน',
            'ให้อธิบายโครงงานหรือผงานที่เคยทำ',
            'สอบถามแผนการเรียนในอนาคต'
          ]
        },
        {
          id: 'communication',
          name: 'ทักษะการสื่อสาร',
          weight: 20,
          description: 'ประเมินความสามารถในการสื่อสารทั้งการฟังและการพูด',
          scoreRanges: [
            {
              range: '9-10 คะแนน',
              description: 'ดีเยี่ยม - สื่อสารได้อย่างชัดเจน มั่นใจ และน่าสนใจ',
              examples: [
                'พูดชัดเจน เข้าใจง่าย',
                'ใช้ภาษาที่เหมาะสมกับสถานการณ์',
                'มีการติดต่อสายตาที่ดี',
                'ตอบคำถามได้ตรงประเด็น'
              ]
            },
            {
              range: '7-8 คะแนน',
              description: 'ดี - สื่อสารได้ดี มีความมั่นใจพอสมควร',
              examples: [
                'พูดได้ชัดเจน เข้าใจได้',
                'ตอบคำถามได้ครบถ้วน',
                'มีท่าทางที่เหมาะสม'
              ]
            },
            {
              range: '5-6 คะแนน',
              description: 'ปานกลาง - สื่อสารได้ แต่ยังขาดความมั่นใจ',
              examples: [
                'พูดได้ แต่อาจไม่ชัดเจนบางครั้ง',
                'ตอบคำถามได้ แต่อาจไม่ครบถ้วน',
                'แสดงความกังวลหรือไม่มั่นใจ'
              ]
            },
            {
              range: '1-4 คะแนน',
              description: 'ต้องปรับปรุง - มีปัญหาในการสื่อสาร',
              examples: [
                'พูดไม่ชัดเจน หรือเสียงเบา',
                'ไม่สามารถตอบคำถามได้',
                'แสดงความไม่มั่นใจอย่างชัดเจน'
              ]
            }
          ],
          tips: [
            'สังเกตการใช้ภาษาและน้ำเสียง',
            'ดูท่าทางและการติดต่อสายตา',
            'ประเมินความสามารถในการฟังและเข้าใจคำถาม'
          ]
        },
        {
          id: 'leadership',
          name: 'ภาวะผู้นำ',
          weight: 15,
          description: 'ประเมินประสบการณ์และศักยภาพในการเป็นผู้นำ',
          scoreRanges: [
            {
              range: '9-10 คะแนน',
              description: 'ดีเยี่ยม - มีประสบการณ์เป็นผู้นำที่โดดเด่น',
              examples: [
                'เคยเป็นหัวหน้าโครงการหรือกิจกรรมสำคัญ',
                'สามารถสร้างแรงบันดาลใจให้ผู้อื่น',
                'มีวิสัยทัศน์และแผนงานที่ชัดเจน'
              ]
            },
            {
              range: '7-8 คะแนน',
              description: 'ดี - มีประสบการณ์เป็นผู้นำในระดับหนึ่ง',
              examples: [
                'เคยมีบทบาทเป็นผู้นำในกลุม',
                'สามารถทำงานร่วมกับผู้อื่นได้ดี',
                'มีความรับผิดชอบต่อหน้าที่'
              ]
            },
            {
              range: '5-6 คะแนน',
              description: 'ปานกลาง - มีศักยภาพแต่ยังขาดประสบการณ์',
              examples: [
                'เคยช่วยงานในฐานะสมาชิกทีม',
                'แสดงความสนใจในการเป็นผู้นำ',
                'มีความคิดริเริ่มบางประการ'
              ]
            },
            {
              range: '1-4 คะแนน',
              description: 'ต้องปรับปรุง - ยังไม่แสดงศักยภาพด้านภาวะผู้นำ',
              examples: [
                'ไม่เคยมีประสบการณ์เป็นผู้นำ',
                'ไม่แสดงความสนใจในการเป็นผู้นำ',
                'ขาดความมั่นใจในการแสดงความคิดเห็น'
              ]
            }
          ],
          tips: [
            'สอบถามประสบการณ์การเป็นผู้นำ',
            'ถามเกี่ยวกับการแก้ปัญหาในกลุม',
            'ประเมินความมั่นใจและการแสดงออก'
          ]
        },
        {
          id: 'motivation',
          name: 'แรงจูงใจ',
          weight: 20,
          description: 'ประเมินแรงจูงใจในการขอทุนและเป้าหมายในอนาคต',
          scoreRanges: [
            {
              range: '9-10 คะแนน',
              description: 'ดีเยี่ยม - มีแรงจูงใจที่ชัดเจนและแข็งแกร่ง',
              examples: [
                'มีเป้าหมายชีวิตที่ชัดเจน',
                'แสดงความตั้งใจจริงในการเรียน',
                'มีแผนการใช้ความรู้เพื่อพัฒนาสังคม'
              ]
            },
            {
              range: '7-8 คะแนน',
              description: 'ดี - มีแรงจูงใจที่ดีและเหตุผลที่สมเหตุสมผล',
              examples: [
                'อธิบายเหตุผลการขอทุนได้ดี',
                'มีแผนการเรียนที่ชัดเจน',
                'แสดงความกระตือรือร้น'
              ]
            },
            {
              range: '5-6 คะแนน',
              description: 'ปานกลาง - มีแรงจูงใจ แต่ยังไม่ชัดเจนเพียงพอ',
              examples: [
                'อธิบายเหตุผลได้ แต่ไม่ลึกซึ้ง',
                'มีเป้าหมาย แต่ยังไม่ชัดเจน',
                'แสดงความสนใจปานกลาง'
              ]
            },
            {
              range: '1-4 คะแนน',
              description: 'ต้องปรับปรุง - ขาดแรงจูงใจที่ชัดเจน',
              examples: [
                'ไม่สามารถอธิบายเหตุผลได้ดี',
                'ไม่มีเป้าหมายที่ชัดเจน',
                'แสดงความไม่แน่ใจ'
              ]
            }
          ],
          tips: [
            'ถามเหตุผลในการขอทุนการศึกษา',
            'สอบถามเป้าหมายในอนาคต',
            'ประเมินความจริงใจและความตั้งใจ'
          ]
        },
        {
          id: 'financial_need',
          name: 'ความต้องการทางการเงิน',
          weight: 20,
          description: 'ประเมินความจำเป็นในการได้รับทุนการศึกษา',
          scoreRanges: [
            {
              range: '9-10 คะแนน',
              description: 'ต้องการมาก - มีความจำเป็นอย่างยิ่งต่อทุนการศึกษา',
              examples: [
                'ครอบครัวมีรายได้น้อยมาก',
                'มีภาระค่าใช้จ่ายสูง',
                'ไม่มีแหล่งเงินทุนอื่น'
              ]
            },
            {
              range: '7-8 คะแนน',
              description: 'ต้องการ - มีความจำเป็นต่อทุนการศึกษา',
              examples: [
                'ครอบครัวมีรายได้ปานกลาง',
                'มีค่าใช้จ่ายที่จำเป็น',
                'ทุนจะช่วยลดภาระได้'
              ]
            },
            {
              range: '5-6 คะแนน',
              description: 'ต้องการปานกลาง - ทุนจะเป็นประโยชน์',
              examples: [
                'ครอบครัวมีรายได้พอใช้',
                'ทุนจะช่วยเสริมการเรียน',
                'มีแหล่งเงินทุนอื่นบางส่วน'
              ]
            },
            {
              range: '1-4 คะแนน',
              description: 'ต้องการน้อย - ฐานะการเงินดี',
              examples: [
                'ครอบครัวมีรายได้สูง',
                'ไม่มีปัญหาทางการเงิน',
                'มีแหล่งเงินทุนอื่นเพียงพอ'
              ]
            }
          ],
          tips: [
            'ตรวจสอบเอกสารรายได้ครอบครัว',
            'สอบถามสถานการณ์ทางการเงิน',
            'ประเมินความจำเป็นจริง'
          ]
        }
      ],
      generalGuidelines: [
        'ใช้เวลาสัมภาษณ์ประมาณ 30-45 นาที',
        'สร้างบรรยากาศที่เป็นมิตรและผ่อนคลาย',
        'ฟังอย่างตั้งใจและให้โอกาสผู้สมัครอธิบาย',
        'ถามคำถามเพิ่มเติมเพื่อความชัดเจน',
        'บันทึกจุดสำคัญระหว่างการสัมภาษณ์'
      ],
      scoringNotes: [
        'คะแนนรวมคำนวณจากน้ำหนักของแต่ละเกณฑ์',
        'ควรให้คะแนนที่สะท้อนความสามารถจริง',
        'หลีกเลี่ยงการให้คะแนนสุดขั้ว (1 หรือ 10) โดยไม่มีเหตุผล',
        'บันทึกเหตุผลการให้คะแนนในแต่ละด้าน'
      ]
    }
  ];

  const selectedCriteria = scholarshipCriterias.find(sc => sc.id === selectedScholarship) || scholarshipCriterias[0];

  const getCriterionIcon = (criterionId: string) => {
    switch (criterionId) {
      case 'academic': return BookOpenIcon;
      case 'communication': return ChatBubbleLeftRightIcon;
      case 'leadership': return UserGroupIcon;
      case 'motivation': return FireIcon;
      case 'financial_need': return BanknotesIcon;
      default: return StarIcon;
    }
  };

  const getScoreRangeColor = (range: string) => {
    if (range.includes('9-10')) return 'border-l-green-500 bg-green-50';
    if (range.includes('7-8')) return 'border-l-blue-500 bg-blue-50';
    if (range.includes('5-6')) return 'border-l-yellow-500 bg-yellow-50';
    return 'border-l-red-500 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header 
        user={user}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex flex-1 relative">
        <Sidebar 
          userRole="interviewer"
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
                    เกณฑ์การประเมินการสัมภาษณ์
                  </h1>
                  <p className="text-secondary-600 font-sarabun">
                    หลักเกณฑ์และแนวทางการให้คะแนนในการสัมภาษณ์ทุนการศึกษา
                  </p>
                </div>
                <div className="flex space-x-3">
                  <select
                    value={selectedScholarship}
                    onChange={(e) => setSelectedScholarship(e.target.value)}
                    className="px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-sarabun"
                  >
                    {scholarshipCriterias.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.scholarshipName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Scholarship Info */}
            <Card className="mb-8">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-secondary-200">
                <CardTitle className="text-xl font-sarabun text-secondary-900 flex items-center">
                  <DocumentMagnifyingGlassIcon className="h-6 w-6 text-purple-500 mr-2" />
                  {selectedCriteria.scholarshipName}
                </CardTitle>
                <p className="text-sm text-secondary-600 font-sarabun mt-1">
                  {selectedCriteria.description}
                </p>
              </CardHeader>
            </Card>

            {/* Evaluation Criteria */}
            <div className="space-y-8 mb-8">
              {selectedCriteria.criteria.map((criterion) => {
                const IconComponent = getCriterionIcon(criterion.id);
                return (
                  <Card key={criterion.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-secondary-200">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                          <IconComponent className="h-5 w-5 text-blue-500 mr-2" />
                          {criterion.name}
                        </CardTitle>
                        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium font-sarabun">
                          น้ำหนัก {criterion.weight}%
                        </div>
                      </div>
                      <p className="text-sm text-secondary-600 font-sarabun mt-1">
                        {criterion.description}
                      </p>
                    </CardHeader>

                    <CardBody className="p-6">
                      {/* Score Ranges */}
                      <div className="space-y-4 mb-6">
                        <h4 className="font-semibold text-secondary-900 font-sarabun">ช่วงคะแนนและเกณฑ์การประเมิน</h4>
                        {criterion.scoreRanges.map((range, index) => (
                          <div key={index} className={`border-l-4 p-4 rounded-r-lg ${getScoreRangeColor(range.range)}`}>
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-secondary-900 font-sarabun">{range.range}</h5>
                              <span className="text-sm font-medium text-secondary-700 font-sarabun">{range.description}</span>
                            </div>
                            <ul className="space-y-1">
                              {range.examples.map((example, exIndex) => (
                                <li key={exIndex} className="text-sm text-secondary-600 font-sarabun flex items-start">
                                  <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="font-semibold text-secondary-900 font-sarabun mb-3">เทคนิคการสัมภาษณ์</h4>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <ul className="space-y-2">
                            {criterion.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-sm text-blue-700 font-sarabun flex items-start">
                                <InformationCircleIcon className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>

            {/* General Guidelines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-secondary-200">
                  <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    แนวทางทั่วไป
                  </CardTitle>
                </CardHeader>
                <CardBody className="p-6">
                  <ul className="space-y-3">
                    {selectedCriteria.generalGuidelines.map((guideline, index) => (
                      <li key={index} className="text-sm text-secondary-600 font-sarabun flex items-start">
                        <StarIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {guideline}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-secondary-200">
                  <CardTitle className="text-lg font-sarabun text-secondary-900 flex items-center">
                    <InformationCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    หมายเหตุการให้คะแนน
                  </CardTitle>
                </CardHeader>
                <CardBody className="p-6">
                  <ul className="space-y-3">
                    {selectedCriteria.scoringNotes.map((note, index) => (
                      <li key={index} className="text-sm text-secondary-600 font-sarabun flex items-start">
                        <InformationCircleIcon className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
