import { apiClient } from '@/utils/api';
import type {
  CompleteApplicationForm,
  ApplicationPersonalInfo,
  ApplicationAddress,
  ApplicationEducationHistory,
  ApplicationFamilyMember,
  ApplicationGuardian,
  ApplicationSibling,
  ApplicationLivingSituation,
  ApplicationFinancialInfo,
  ApplicationAsset,
  ApplicationScholarshipHistory,
  ApplicationActivity,
  ApplicationReference,
  ApplicationHealthInfo,
  ApplicationFundingNeeds,
  ApiResponse,
  SavePersonalInfoRequest,
  SaveAddressesRequest,
  SaveEducationRequest,
  SaveFamilyRequest,
  SaveFinancialRequest,
  SaveActivitiesRequest,
  SaveCompleteFormRequest
} from '@/types/application';

export interface Application {
  id: string;
  studentId: string;
  scholarshipId: number;
  scholarshipName: string;
  scholarshipAmount: number;
  submissionDate: string;
  lastUpdate: string;
  status: 'draft' | 'submitted' | 'under_review' | 'document_pending' | 'interview_scheduled' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  reviewedBy?: string;
  reviewDate?: string;
  score?: number;
  gpa: number;
  faculty: string;
  year: number;
  familyIncome: number;
  documentsStatus: {
    transcript: 'pending' | 'approved' | 'rejected';
    income_certificate: 'pending' | 'approved' | 'rejected';
    id_card: 'pending' | 'approved' | 'rejected';
    photo: 'pending' | 'approved' | 'rejected';
    recommendation: 'pending' | 'approved' | 'rejected';
  };
  notes?: string;
  interviewDate?: string;
  rejectionReason?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  financialInfo: {
    familyIncome: number;
    familySize: number;
    expenses: number;
    otherScholarships: Array<{
      name: string;
      amount: number;
      year: string;
    }>;
  };
  activities: Array<{
    name: string;
    role: string;
    year: string;
    hours: number;
    description: string;
  }>;
}

export interface ApplicationFilter {
  status?: string;
  priority?: string;
  faculty?: string;
  scholarshipId?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateApplicationRequest {
  scholarshipId: number;
  personalInfo: Application['personalInfo'];
  financialInfo: Application['financialInfo'];
  activities: Application['activities'];
}

export interface UpdateApplicationRequest extends Partial<CreateApplicationRequest> {
  id: string;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  interview: number;
  approved: number;
  rejected: number;
  overdue: number;
}

export interface ReviewApplicationRequest {
  applicationId: string;
  status: 'approved' | 'rejected' | 'interview_scheduled' | 'document_pending';
  notes?: string;
  score?: number;
  rejectionReason?: string;
  interviewDate?: string;
  interviewLocation?: string;
}

export interface BulkActionRequest {
  applicationIds: string[];
  action: 'approve' | 'reject' | 'schedule_interview' | 'request_documents';
  data?: {
    notes?: string;
    interviewDate?: string;
    interviewLocation?: string;
    rejectionReason?: string;
  };
}

class ApplicationService {
  async getApplications(filter: ApplicationFilter = {}): Promise<{
    applications: Application[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();

      // Map frontend filter to API parameters
      if (filter.page) params.append('page', filter.page.toString());
      if (filter.limit) params.append('limit', filter.limit.toString());
      if (filter.search) params.append('search', filter.search);
      if (filter.status) params.append('status', filter.status);
      if (filter.priority) params.append('priority', filter.priority);
      if (filter.faculty) params.append('faculty', filter.faculty);
      if (filter.scholarshipId) params.append('scholarship_id', filter.scholarshipId.toString());
      if (filter.sortBy) params.append('sort_by', filter.sortBy);
      if (filter.sortOrder) params.append('sort_order', filter.sortOrder);

      const response = await apiClient.get<any>(`/admin/applications?${params.toString()}`);

      // Map API response to frontend format
      return {
        applications: response.applications || [],
        pagination: {
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 10,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.total_pages || 1
        }
      };
    } catch (error: any) {
      // Fallback to mock data if API fails
      console.warn('API failed, using mock data:', error.message);
      return this.getMockApplications(filter);
    }
  }

  private getMockApplications(filter: ApplicationFilter = {}): {
    applications: Application[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  } {
    const mockData: Application[] = [
      {
        id: '1',
        studentId: 'STU001',
        scholarshipId: 1,
        scholarshipName: 'ทุนเรียนดี',
        scholarshipAmount: 50000,
        submissionDate: '2024-12-01T10:00:00Z',
        lastUpdate: '2024-12-01T10:00:00Z',
        status: 'submitted',
        priority: 'high',
        gpa: 3.85,
        faculty: 'คณะวิศวกรรมศาสตร์',
        year: 3,
        familyIncome: 180000,
        documentsStatus: {
          transcript: 'approved',
          income_certificate: 'approved',
          id_card: 'approved',
          photo: 'approved',
          recommendation: 'pending'
        },
        personalInfo: {
          firstName: 'สมชาย',
          lastName: 'ใจดี',
          email: 'somchai@university.ac.th',
          phone: '081-234-5678',
          address: '123 ถนนพระราม 4 เขตปทุมวัน กรุงเทพฯ 10330',
          emergencyContact: {
            name: 'สมหญิง ใจดี',
            relationship: 'มารดา',
            phone: '082-345-6789'
          }
        },
        financialInfo: {
          familyIncome: 180000,
          familySize: 4,
          expenses: 150000,
          otherScholarships: []
        },
        activities: []
      },
      {
        id: '2',
        studentId: 'STU002',
        scholarshipId: 2,
        scholarshipName: 'ทุนผู้มีรายได้น้อย',
        scholarshipAmount: 30000,
        submissionDate: '2024-12-02T14:30:00Z',
        lastUpdate: '2024-12-02T14:30:00Z',
        status: 'under_review',
        priority: 'medium',
        gpa: 3.25,
        faculty: 'คณะเศรษฐศาสตร์',
        year: 2,
        familyIncome: 95000,
        documentsStatus: {
          transcript: 'approved',
          income_certificate: 'approved',
          id_card: 'approved',
          photo: 'approved',
          recommendation: 'approved'
        },
        personalInfo: {
          firstName: 'สมหญิง',
          lastName: 'รักดี',
          email: 'somying@university.ac.th',
          phone: '089-876-5432',
          address: '456 ซอยลาดพร้าว 101 เขตบางกะปิ กรุงเทพฯ 10240',
          emergencyContact: {
            name: 'สมศักดิ์ รักดี',
            relationship: 'บิดา',
            phone: '081-999-8888'
          }
        },
        financialInfo: {
          familyIncome: 95000,
          familySize: 5,
          expenses: 85000,
          otherScholarships: []
        },
        activities: []
      }
    ];

    // Apply filters
    let filtered = mockData;
    if (filter.status) {
      filtered = filtered.filter(app => app.status === filter.status);
    }
    if (filter.priority) {
      filtered = filtered.filter(app => app.priority === filter.priority);
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(app =>
        app.personalInfo.firstName.toLowerCase().includes(searchLower) ||
        app.personalInfo.lastName.toLowerCase().includes(searchLower) ||
        app.personalInfo.email.toLowerCase().includes(searchLower) ||
        app.scholarshipName.toLowerCase().includes(searchLower)
      );
    }

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);

    return {
      applications: filtered.slice((page - 1) * limit, page * limit),
      pagination: { page, limit, total, totalPages }
    };
  }

  async getMyApplications(filter: Omit<ApplicationFilter, 'search'> = {}): Promise<{
    applications: Application[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = new URLSearchParams();
    
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<{
      applications: Application[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/applications/my?${params.toString()}`);

    return response;
  }

  async getApplicationById(id: string): Promise<Application> {
    try {
      const response = await apiClient.get<Application>(`/admin/applications/${id}`);

      // Ensure all required nested objects exist with defaults
      return {
        ...response,
        personalInfo: response.personalInfo || {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
          }
        },
        financialInfo: response.financialInfo || {
          familyIncome: 0,
          familySize: 0,
          expenses: 0,
          otherScholarships: []
        },
        activities: response.activities || []
      };
    } catch (error: any) {
      console.warn('API failed, using mock application data:', error.message);
      return this.getMockApplicationById(id);
    }
  }

  private getMockApplicationById(id: string): Application {
    return {
      id: id,
      studentId: '6512345678',
      scholarshipId: 1,
      scholarshipName: 'ทุนส่งเสริมการศึกษานักศึกษาดีเด่น',
      scholarshipAmount: 25000,
      submissionDate: '2024-01-15T10:30:00Z',
      lastUpdate: '2024-01-20T14:45:00Z',
      status: 'submitted',
      priority: 'high',
      reviewedBy: 'อ.สมชาย ใจดี',
      reviewDate: '2024-01-20T14:45:00Z',
      score: 85,
      gpa: 3.75,
      faculty: 'คณะเศรษฐศาสตร์',
      year: 3,
      familyIncome: 180000,
      documentsStatus: {
        transcript: 'approved',
        income_certificate: 'approved',
        id_card: 'approved',
        photo: 'approved',
        recommendation: 'pending'
      },
      notes: 'นักศึกษามีผลการเรียนดี มีกิจกรรมเสริมหลากหลาย',
      personalInfo: {
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        email: 'somchai.j@student.mahidol.ac.th',
        phone: '081-234-5678',
        address: '123 ถ.พญาไท แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400',
        emergencyContact: {
          name: 'นางสาวสมหญิง ใจดี',
          relationship: 'มารดา',
          phone: '081-234-5679'
        }
      },
      financialInfo: {
        familyIncome: 180000,
        familySize: 4,
        expenses: 25000,
        otherScholarships: [
          {
            name: 'ทุนพัฒนาทักษะภาษาอังกฤษ',
            amount: 10000,
            year: '2566'
          },
          {
            name: 'ทุนสนับสนุนนักศึกษาจากมูลนิธิ ABC',
            amount: 15000,
            year: '2565'
          }
        ]
      },
      activities: [
        {
          name: 'ชมรมนักศึกษาอาสา',
          role: 'ประธานชมรม',
          year: '2566',
          hours: 120,
          description: 'จัดกิจกรรมบำเพ็ญประโยชน์ช่วยเหลือสังคม'
        },
        {
          name: 'โครงการพัฒนาชุมชน',
          role: 'หัวหน้าทีม',
          year: '2566',
          hours: 80,
          description: 'พัฒนาคุณภาพชีวิตชุมชนในพื้นที่ห่างไกล'
        },
        {
          name: 'การแข่งขันเศรษฐศาสตร์ระดับชาติ',
          role: 'ผู้เข้าแข่งขัน',
          year: '2565',
          hours: 60,
          description: 'ได้รับรางวัลชนะเลิศอันดับ 2 ระดับประเทศ'
        }
      ]
    };
  }

  async createApplication(applicationData: CreateApplicationRequest): Promise<Application> {
    const response = await apiClient.post<Application>('/applications', applicationData);
    return response;
  }

  async updateApplication(applicationData: UpdateApplicationRequest): Promise<Application> {
    const { id, ...data } = applicationData;
    const response = await apiClient.put<Application>(`/applications/${id}`, data);
    return response;
  }

  async submitApplication(id: string): Promise<Application> {
    const response = await apiClient.post<Application>(`/applications/${id}/submit`);
    return response;
  }

  async withdrawApplication(id: string): Promise<void> {
    await apiClient.post(`/applications/${id}/withdraw`);
  }

  async deleteApplication(id: string): Promise<void> {
    await apiClient.delete(`/applications/${id}`);
  }

  async reviewApplication(reviewData: ReviewApplicationRequest): Promise<Application> {
    const { applicationId, ...data } = reviewData;
    const response = await apiClient.post<Application>(`/admin/applications/${applicationId}/review`, data);
    return response;
  }

  async bulkAction(actionData: BulkActionRequest): Promise<{ success: number; failed: number }> {
    const response = await apiClient.post<{ success: number; failed: number }>('/admin/applications/bulk-action', actionData);
    return response;
  }

  async getApplicationStats(): Promise<ApplicationStats> {
    try {
      const response = await apiClient.get<any>('/admin/applications/stats');
      return {
        total: response.total || 0,
        pending: response.pending || 0,
        interview: response.interview || 0,
        approved: response.approved || 0,
        rejected: response.rejected || 0,
        overdue: response.overdue || 0
      };
    } catch (error: any) {
      // Fallback to mock stats if API fails
      console.warn('API stats failed, using mock data:', error.message);
      return {
        total: 247,
        pending: 45,
        interview: 18,
        approved: 156,
        rejected: 23,
        overdue: 5
      };
    }
  }

  async exportApplications(filter: ApplicationFilter = {}): Promise<Blob> {
    const params = new URLSearchParams();
    
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/admin/applications/export?${params.toString()}`, {
      responseType: 'blob'
    });

    return response as any; // Type assertion since apiClient.get returns T but we need Blob
  }

  async getApplicationsByScholarship(scholarshipId: number, filter: ApplicationFilter = {}): Promise<{
    applications: Application[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = new URLSearchParams();
    
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<{
      applications: Application[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/scholarships/${scholarshipId}/applications?${params.toString()}`);

    return response;
  }

  // ============================================================================
  // NEW: Application Details API Methods (18-section form)
  // ============================================================================

  /**
   * Save Personal Information (Section 1)
   * POST /api/v1/applications/:id/personal-info
   */
  async savePersonalInfo(
    applicationId: number,
    personalInfo: ApplicationPersonalInfo
  ): Promise<ApiResponse<ApplicationPersonalInfo>> {
    const response = await apiClient.post<ApiResponse<ApplicationPersonalInfo>>(
      `/applications/${applicationId}/personal-info`,
      personalInfo
    );
    return response;
  }

  /**
   * Save Addresses (Section 2)
   * POST /api/v1/applications/:id/addresses
   */
  async saveAddresses(
    applicationId: number,
    addresses: ApplicationAddress[]
  ): Promise<ApiResponse<ApplicationAddress[]>> {
    const response = await apiClient.post<ApiResponse<ApplicationAddress[]>>(
      `/applications/${applicationId}/addresses`,
      { addresses }
    );
    return response;
  }

  /**
   * Save Education History (Section 3)
   * POST /api/v1/applications/:id/education
   */
  async saveEducation(
    applicationId: number,
    educationHistory: ApplicationEducationHistory[]
  ): Promise<ApiResponse<ApplicationEducationHistory[]>> {
    const response = await apiClient.post<ApiResponse<ApplicationEducationHistory[]>>(
      `/applications/${applicationId}/education`,
      { education_history: educationHistory }
    );
    return response;
  }

  /**
   * Save Family Information (Sections 4-7: Family, Guardian, Siblings, Living)
   * POST /api/v1/applications/:id/family
   */
  async saveFamily(
    applicationId: number,
    familyData: {
      family_members?: ApplicationFamilyMember[];
      guardians?: ApplicationGuardian[];
      siblings?: ApplicationSibling[];
      living_situation?: ApplicationLivingSituation;
    }
  ): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/applications/${applicationId}/family`,
      familyData
    );
    return response;
  }

  /**
   * Save Financial Information (Sections 8-14: Financial, Assets, Scholarship History, Health, Funding)
   * POST /api/v1/applications/:id/financial
   */
  async saveFinancial(
    applicationId: number,
    financialData: {
      financial_info?: ApplicationFinancialInfo;
      assets?: ApplicationAsset[];
      scholarship_history?: ApplicationScholarshipHistory[];
      health_info?: ApplicationHealthInfo;
      funding_needs?: ApplicationFundingNeeds;
    }
  ): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/applications/${applicationId}/financial`,
      financialData
    );
    return response;
  }

  /**
   * Save Activities & References (Sections 11-12)
   * POST /api/v1/applications/:id/activities
   */
  async saveActivities(
    applicationId: number,
    activitiesData: {
      activities?: ApplicationActivity[];
      references?: ApplicationReference[];
    }
  ): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/applications/${applicationId}/activities`,
      activitiesData
    );
    return response;
  }

  /**
   * Save Complete Form (All 18 sections at once)
   * POST /api/v1/applications/:id/complete-form
   */
  async saveCompleteForm(
    applicationId: number,
    completeForm: Partial<CompleteApplicationForm>
  ): Promise<ApiResponse<CompleteApplicationForm>> {
    const response = await apiClient.post<ApiResponse<CompleteApplicationForm>>(
      `/applications/${applicationId}/complete-form`,
      completeForm
    );
    return response;
  }

  /**
   * Get Complete Form (Retrieve all 18 sections)
   * GET /api/v1/applications/:id/complete-form
   */
  async getCompleteForm(applicationId: number): Promise<ApiResponse<CompleteApplicationForm>> {
    const response = await apiClient.get<ApiResponse<CompleteApplicationForm>>(
      `/applications/${applicationId}/complete-form`
    );
    return response;
  }

  /**
   * Submit Application (Final submission)
   * PUT /api/v1/applications/:id/submit
   */
  async submitApplicationForm(applicationId: number): Promise<ApiResponse<any>> {
    const response = await apiClient.put<ApiResponse<any>>(
      `/applications/${applicationId}/submit`
    );
    return response;
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Auto-save form section
   * Debounced save for better UX
   */
  async autoSave(
    applicationId: number,
    section: string,
    data: any
  ): Promise<void> {
    try {
      switch (section) {
        case 'personal':
          await this.savePersonalInfo(applicationId, data);
          break;
        case 'address':
          await this.saveAddresses(applicationId, data);
          break;
        case 'education':
          await this.saveEducation(applicationId, data);
          break;
        case 'family':
          await this.saveFamily(applicationId, data);
          break;
        case 'financial':
          await this.saveFinancial(applicationId, data);
          break;
        case 'activities':
          await this.saveActivities(applicationId, data);
          break;
        default:
          console.warn(`Unknown section: ${section}`);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate form section before saving
   */
  validateSection(section: string, data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (section) {
      case 'personal':
        if (!data.first_name_th) errors.push('กรุณากรอกชื่อภาษาไทย');
        if (!data.last_name_th) errors.push('กรุณากรอกนามสกุลภาษาไทย');
        if (!data.email) errors.push('กรุณากรอกอีเมล');
        break;

      case 'address':
        if (!data.addresses || data.addresses.length === 0) {
          errors.push('กรุณากรอกข้อมูลที่อยู่อย่างน้อย 1 รายการ');
        }
        break;

      case 'education':
        if (!data.education_history || data.education_history.length === 0) {
          errors.push('กรุณากรอกประวัติการศึกษา');
        }
        break;

      // Add more validation as needed
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error.response?.status === 404) {
      return new Error('ไม่พบใบสมัครที่ระบุ');
    }

    if (error.response?.status === 403) {
      return new Error('ไม่มีสิทธิ์เข้าถึงข้อมูลนี้');
    }

    if (error.response?.status === 400) {
      return new Error('ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่');
    }

    if (error.response?.status >= 500) {
      return new Error('เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง');
    }

    return new Error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  }
}

export const applicationService = new ApplicationService();