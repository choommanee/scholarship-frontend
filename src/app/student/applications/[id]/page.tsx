'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PencilIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import applicationService from '@/services/application.service';
import scholarshipService from '@/services/scholarship.service';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [scholarship, setScholarship] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadApplicationData();
  }, []);

  const loadApplicationData = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getCompleteForm(applicationId);

      if (response.success && response.data) {
        setApplication(response.data);

        // Load scholarship details
        const scholarshipData = await scholarshipService.getPublicScholarshipById(response.data.scholarship_id);
        setScholarship(scholarshipData);
      }
    } catch (err) {
      console.error('Failed to load application:', err);
      setError('ไม่สามารถโหลดข้อมูลใบสมัครได้');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/student/applications');
  };

  const handleEdit = () => {
    router.push(`/student/applications/${applicationId}/edit`);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      draft: { label: 'แบบร่าง', className: 'bg-gray-100 text-gray-800' },
      submitted: { label: 'ส่งแล้ว', className: 'bg-blue-100 text-blue-800' },
      under_review: { label: 'กำลังพิจารณา', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'อนุมัติ', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'ไม่อนุมัติ', className: 'bg-red-100 text-red-800' },
      pending_interview: { label: 'รอสัมภาษณ์', className: 'bg-purple-100 text-purple-800' },
      interviewed: { label: 'สัมภาษณ์แล้ว', className: 'bg-indigo-100 text-indigo-800' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 relative">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="student" />
          <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gray-50">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 relative">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="student" />
          <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gray-50">
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <p>{error}</p>
                <button
                  onClick={handleGoBack}
                  className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md"
                >
                  กลับ
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="student" />
        <main className="flex-1 min-w-0 w-full lg:ml-4 pt-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGoBack}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-1" />
                  กลับ
                </button>
              </div>
              {application?.application_status === 'draft' && (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  แก้ไขใบสมัคร
                </button>
              )}
            </div>

            {/* Scholarship Info */}
            {scholarship && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {scholarship.scholarship_name}
                    </h1>
                    <p className="text-gray-600 mb-4">{scholarship.description}</p>
                  </div>
                  {getStatusBadge(application?.application_status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                  <div>
                    <span className="text-gray-500">จำนวนเงิน:</span>
                    <span className="ml-2 font-medium">
                      {scholarship.amount.toLocaleString()} บาท
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">วันที่สมัคร:</span>
                    <span className="ml-2 font-medium">
                      {application?.created_at ? new Date(application.created_at).toLocaleDateString('th-TH') : '-'}
                    </span>
                  </div>
                  {application?.submitted_at && (
                    <div>
                      <span className="text-gray-500">วันที่ส่งใบสมัคร:</span>
                      <span className="ml-2 font-medium">
                        {new Date(application.submitted_at).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Application Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">รายละเอียดใบสมัคร</h2>

              {/* Personal Info */}
              {application?.personal_info && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-primary-600" />
                    ข้อมูลส่วนตัว
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">ชื่อ-นามสกุล (ไทย):</span>
                      <span className="ml-2 font-medium">
                        {application.personal_info.prefix_th} {application.personal_info.first_name_th} {application.personal_info.last_name_th}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">ชื่อ-นามสกุล (อังกฤษ):</span>
                      <span className="ml-2 font-medium">
                        {application.personal_info.prefix_en} {application.personal_info.first_name_en} {application.personal_info.last_name_en}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">เลขบัตรประชาชน:</span>
                      <span className="ml-2 font-medium">{application.personal_info.citizen_id || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">วันเกิด:</span>
                      <span className="ml-2 font-medium">
                        {application.personal_info.birth_date ? new Date(application.personal_info.birth_date).toLocaleDateString('th-TH') : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">เพศ:</span>
                      <span className="ml-2 font-medium">{application.personal_info.gender || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">สัญชาติ:</span>
                      <span className="ml-2 font-medium">{application.personal_info.nationality || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ศาสนา:</span>
                      <span className="ml-2 font-medium">{application.personal_info.religion || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">รหัสนักศึกษา:</span>
                      <span className="ml-2 font-medium">{application.personal_info.student_id || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">อีเมล:</span>
                      <span className="ml-2 font-medium">{application.personal_info.email || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">เบอร์โทรศัพท์:</span>
                      <span className="ml-2 font-medium">{application.personal_info.phone || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">LINE ID:</span>
                      <span className="ml-2 font-medium">{application.personal_info.line_id || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">คณะ:</span>
                      <span className="ml-2 font-medium">{application.personal_info.faculty || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ภาควิชา:</span>
                      <span className="ml-2 font-medium">{application.personal_info.department || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">สาขา:</span>
                      <span className="ml-2 font-medium">{application.personal_info.major || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ชั้นปี:</span>
                      <span className="ml-2 font-medium">{application.personal_info.year_level || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ประเภทการเข้าศึกษา:</span>
                      <span className="ml-2 font-medium">{application.personal_info.admission_type || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ปีการศึกษาที่เข้า:</span>
                      <span className="ml-2 font-medium">{application.personal_info.admission_year || '-'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Info */}
              {application?.addresses && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ที่อยู่</h3>

                  {application.addresses.current_address && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">ที่อยู่ปัจจุบัน:</h4>
                      <p className="text-sm text-gray-700">
                        {application.addresses.current_address.house_number}
                        {application.addresses.current_address.village_number && ` หมู่ ${application.addresses.current_address.village_number}`}
                        {application.addresses.current_address.alley && ` ซอย ${application.addresses.current_address.alley}`}
                        {application.addresses.current_address.road && ` ถนน ${application.addresses.current_address.road}`}
                        {` ตำบล ${application.addresses.current_address.subdistrict}`}
                        {` อำเภอ ${application.addresses.current_address.district}`}
                        {` จังหวัด ${application.addresses.current_address.province}`}
                        {` ${application.addresses.current_address.postal_code}`}
                      </p>
                    </div>
                  )}

                  {!application.addresses.same_as_current && application.addresses.permanent_address && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">ที่อยู่ตามทะเบียนบ้าน:</h4>
                      <p className="text-sm text-gray-700">
                        {application.addresses.permanent_address.house_number}
                        {application.addresses.permanent_address.village_number && ` หมู่ ${application.addresses.permanent_address.village_number}`}
                        {application.addresses.permanent_address.alley && ` ซอย ${application.addresses.permanent_address.alley}`}
                        {application.addresses.permanent_address.road && ` ถนน ${application.addresses.permanent_address.road}`}
                        {` ตำบล ${application.addresses.permanent_address.subdistrict}`}
                        {` อำเภอ ${application.addresses.permanent_address.district}`}
                        {` จังหวัด ${application.addresses.permanent_address.province}`}
                        {` ${application.addresses.permanent_address.postal_code}`}
                      </p>
                    </div>
                  )}

                  {application.addresses.same_as_current && (
                    <p className="text-sm text-gray-500 italic">ที่อยู่ตามทะเบียนบ้านเหมือนกับที่อยู่ปัจจุบัน</p>
                  )}
                </div>
              )}

              {/* Education History */}
              {application?.education_history?.education_records?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ประวัติการศึกษา</h3>
                  <div className="space-y-4">
                    {application.education_history.education_records.map((record: any, index: number) => (
                      <div key={index} className="border-l-4 border-primary-600 pl-4">
                        <div className="font-medium text-gray-900">{record.institution_name}</div>
                        <div className="text-sm text-gray-600">{record.degree} - {record.field_of_study}</div>
                        <div className="text-sm text-gray-500">
                          {record.start_year} - {record.end_year} | GPA: {record.gpa}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Family Info */}
              {(application?.family_members?.length > 0 || application?.guardians?.length > 0 || application?.living_situation) && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลครอบครัว</h3>

                  {application.living_situation && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">สถานะครอบครัว:</span>
                          <span className="ml-2 font-medium">{application.living_situation.family_status || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">อาศัยอยู่กับ:</span>
                          <span className="ml-2 font-medium">{application.living_situation.living_with || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">จำนวนพี่น้อง:</span>
                          <span className="ml-2 font-medium">{application.living_situation.number_of_siblings || '-'} คน</span>
                        </div>
                        <div>
                          <span className="text-gray-500">เป็นบุตรคนที่:</span>
                          <span className="ml-2 font-medium">{application.living_situation.birth_order || '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.guardians?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">ผู้ปกครอง:</h4>
                      <div className="space-y-3">
                        {application.guardians.map((guardian: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">ชื่อ:</span>
                                <span className="ml-2 font-medium">{guardian.name}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">ความสัมพันธ์:</span>
                                <span className="ml-2 font-medium">{guardian.relationship}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">อาชีพ:</span>
                                <span className="ml-2 font-medium">{guardian.occupation || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">รายได้:</span>
                                <span className="ml-2 font-medium">{guardian.income || '-'} บาท/เดือน</span>
                              </div>
                              <div>
                                <span className="text-gray-500">เบอร์โทร:</span>
                                <span className="ml-2 font-medium">{guardian.phone || '-'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {application.family_members?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">สมาชิกในครอบครัว:</h4>
                      <div className="space-y-2">
                        {application.family_members.map((member: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <div>
                              <span className="font-medium">{member.name}</span>
                              <span className="text-gray-500 ml-2">({member.relationship})</span>
                            </div>
                            <div className="text-gray-600">
                              {member.occupation} - {member.income || '0'} บาท/เดือน
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Financial Info */}
              {application?.financial_info && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลทางการเงิน</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">รายได้ครอบครัว:</span>
                      <span className="ml-2 font-medium">{application.financial_info.family_income || '-'} บาท/เดือน</span>
                    </div>
                    <div>
                      <span className="text-gray-500">แหล่งรายได้:</span>
                      <span className="ml-2 font-medium">{application.financial_info.income_source || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ค่าใช้จ่ายครอบครัว:</span>
                      <span className="ml-2 font-medium">{application.financial_info.family_expenses || '-'} บาท/เดือน</span>
                    </div>
                    <div>
                      <span className="text-gray-500">หนี้สิน:</span>
                      <span className="ml-2 font-medium">{application.financial_info.debts || '-'}</span>
                    </div>
                    {application.financial_info.other_income && (
                      <div className="md:col-span-2">
                        <span className="text-gray-500">รายได้อื่นๆ:</span>
                        <span className="ml-2 font-medium">{application.financial_info.other_income}</span>
                      </div>
                    )}
                  </div>

                  {application.assets?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">ทรัพย์สิน:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {application.assets.map((asset: any, index: number) => (
                          <li key={index}>
                            {asset.type}: {asset.description} - มูลค่า {asset.value?.toLocaleString() || '-'} บาท
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Scholarship History */}
              {application?.scholarship_history?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ประวัติการได้รับทุนการศึกษา</h3>
                  <div className="space-y-3">
                    {application.scholarship_history.map((scholarship: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <div className="font-medium text-gray-900">{scholarship.scholarship_name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span>ปีการศึกษา: {scholarship.academic_year}</span>
                          <span className="mx-2">•</span>
                          <span>จำนวนเงิน: {scholarship.amount?.toLocaleString() || '-'} บาท</span>
                        </div>
                        {scholarship.organization && (
                          <div className="text-sm text-gray-500 mt-1">
                            องค์กรผู้ให้ทุน: {scholarship.organization}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities and Skills */}
              {application?.activities?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">กิจกรรมและผลงาน</h3>
                  <div className="space-y-3">
                    {application.activities.map((activity: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <div className="font-medium text-gray-900">{activity.activity_name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span>{activity.activity_type}</span>
                          {activity.year && (
                            <>
                              <span className="mx-2">•</span>
                              <span>ปี {activity.year}</span>
                            </>
                          )}
                          {activity.position && (
                            <>
                              <span className="mx-2">•</span>
                              <span>ตำแหน่ง: {activity.position}</span>
                            </>
                          )}
                        </div>
                        {activity.description && (
                          <p className="text-sm text-gray-700 mt-2">{activity.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reference Person */}
              {application?.references?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">บุคคลอ้างอิง</h3>
                  <div className="space-y-3">
                    {application.references.map((reference: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">ชื่อ:</span>
                            <span className="ml-2 font-medium">
                              {reference.title} {reference.first_name} {reference.last_name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">ความสัมพันธ์:</span>
                            <span className="ml-2 font-medium">{reference.relationship || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">ตำแหน่ง:</span>
                            <span className="ml-2 font-medium">{reference.position || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">องค์กร:</span>
                            <span className="ml-2 font-medium">{reference.organization || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">เบอร์โทร:</span>
                            <span className="ml-2 font-medium">{reference.phone || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">อีเมล:</span>
                            <span className="ml-2 font-medium">{reference.email || '-'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {application?.documents?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">เอกสารประกอบ</h3>
                  <div className="space-y-2">
                    {application.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-700">{doc.document_type}</span>
                        </div>
                        <a
                          href={doc.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          ดูเอกสาร
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
