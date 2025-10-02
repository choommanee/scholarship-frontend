import { apiClient } from '@/utils/api';

// โครงสร้างข้อมูลทุนการศึกษาจาก API
export interface Scholarship {
  // ฟิลด์จาก API
  scholarship_id: number;
  source_id: number;
  scholarship_name: string;
  scholarship_type: string;
  amount: number;
  total_quota: number;
  available_quota: number;
  academic_year: string;
  semester?: string;
  eligibility_criteria?: string;
  required_documents?: string;
  application_start_date: string;
  application_end_date: string;
  interview_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  source?: {
    source_id: number;
    source_name: string;
    source_type: string;
    contact_person?: string;
    contact_email?: string;
    contact_phone?: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  
  // ฟิลด์เดิมสำหรับความเข้ากันได้กับโค้ดเก่า
  id?: number; // map จาก scholarship_id
  name?: string; // map จาก scholarship_name
  description?: string;
  type?: string; // map จาก scholarship_type
  maxRecipients?: number; // map จาก total_quota
  currentApplicants?: number;
  approvedApplicants?: number;
  status?: 'draft' | 'pending' | 'open' | 'closed' | 'suspended';
  createdDate?: string; // map จาก created_at
  applicationDeadline?: string; // map จาก application_end_date
  academicYear?: string; // map จาก academic_year
  requirements?: string[];
  documentsRequired?: string[];
  provider?: string; // map จาก source?.source_name
  budget?: {
    total: number;
    allocated: number;
    remaining: number;
  };
  lastModified?: string; // map จาก updated_at
  createdBy?: string;
  isActive?: boolean; // map จาก is_active
}

export interface ScholarshipFilter {
  status?: string;
  type?: string;
  academicYear?: string;
  provider?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateScholarshipRequest {
  name: string;
  description: string;
  type: string;
  amount: number;
  maxRecipients: number;
  applicationDeadline: string;
  academicYear: string;
  requirements: string[];
  documentsRequired: string[];
  provider: string;
  totalBudget: number;
}

export interface UpdateScholarshipRequest extends Partial<CreateScholarshipRequest> {
  id: number;
  applicationStartDate?: string;
  semester?: string;
  interviewRequired?: boolean;
}

export interface ScholarshipStats {
  total: number;
  draft: number;
  open: number;
  closed: number;
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
}

class ScholarshipService {
  async getScholarships(filter: ScholarshipFilter = {}): Promise<{
    scholarships: Scholarship[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      // For admin routes, always include all scholarships (including inactive ones)
      if (params.get('active_only') === null) {
        params.append('active_only', 'false');
      }
      
      const response = await apiClient.get<{
        scholarships: any[];
        total: number;
        limit: number;
        offset: number;
      }>(`/admin/scholarships?${params.toString()}`);

      // Map API response to expected format
      const scholarships = response.scholarships?.map((s: any) => this.mapScholarshipFromAPI(s)) || [];
      const totalPages = Math.ceil((response.total || 0) / (response.limit || 10));
      const currentPage = Math.floor((response.offset || 0) / (response.limit || 10)) + 1;

      return {
        scholarships,
        pagination: {
          page: currentPage,
          limit: response.limit || 10,
          total: response.total || 0,
          totalPages
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getScholarshipById(id: number): Promise<Scholarship> {
    try {
      const response = await apiClient.get<any>(`/admin/scholarships/${id}`);
      return this.mapScholarshipFromAPI(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createScholarship(scholarshipData: CreateScholarshipRequest): Promise<Scholarship> {
    try {
      // Map frontend format to API format
      const apiData = {
        source_id: 1, // Default to faculty source
        scholarship_name: scholarshipData.name,
        scholarship_type: scholarshipData.type,
        amount: scholarshipData.amount,
        total_quota: scholarshipData.maxRecipients,
        academic_year: scholarshipData.academicYear,
        semester: '', // Optional
        eligibility_criteria: scholarshipData.requirements.join('; '),
        required_documents: scholarshipData.documentsRequired.join(', '),
        application_start_date: new Date().toISOString(), // Default to now
        application_end_date: scholarshipData.applicationDeadline,
        interview_required: false // Default
      };

      const response = await apiClient.post<any>('/admin/scholarships', apiData);
      // Backend returns { message: string, scholarship: object }
      return this.mapScholarshipFromAPI(response.scholarship || response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateScholarship(scholarshipData: UpdateScholarshipRequest): Promise<Scholarship> {
    try {
      const { id, ...updateData } = scholarshipData;
      
      // Map frontend format to API format
      const apiData = {
        source_id: 1, // Default to faculty source
        scholarship_name: updateData.name,
        scholarship_type: updateData.type,
        amount: updateData.amount,
        total_quota: updateData.maxRecipients,
        academic_year: updateData.academicYear,
        semester: updateData.semester || '',
        eligibility_criteria: updateData.requirements?.join('; ') || '',
        required_documents: updateData.documentsRequired?.join(', ') || '',
        application_start_date: updateData.applicationStartDate || new Date().toISOString(),
        application_end_date: updateData.applicationDeadline,
        interview_required: updateData.interviewRequired || false
      };

      const response = await apiClient.put<any>(`/admin/scholarships/${id}`, apiData);
      // Backend returns { message: string, scholarship: object }
      return this.mapScholarshipFromAPI(response.scholarship || response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteScholarship(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/scholarships/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async publishScholarship(id: number): Promise<Scholarship> {
    try {
      const response = await apiClient.post<any>(`/admin/scholarships/${id}/publish`);
      // Backend returns { message: string, scholarship: object }
      return this.mapScholarshipFromAPI(response.scholarship || response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async closeScholarship(id: number): Promise<Scholarship> {
    try {
      const response = await apiClient.post<any>(`/admin/scholarships/${id}/close`);
      // Backend returns { message: string, scholarship: object }
      return this.mapScholarshipFromAPI(response.scholarship || response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async suspendScholarship(id: number): Promise<Scholarship> {
    try {
      const response = await apiClient.post<any>(`/admin/scholarships/${id}/suspend`);
      // Backend returns { message: string, scholarship: object }
      return this.mapScholarshipFromAPI(response.scholarship || response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async duplicateScholarship(id: number): Promise<Scholarship> {
    try {
      const response = await apiClient.post<any>(`/admin/scholarships/${id}/duplicate`);
      // Backend returns { message: string, scholarship: object }
      return this.mapScholarshipFromAPI(response.scholarship || response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getScholarshipStats(): Promise<ScholarshipStats> {
    try {
      const response = await apiClient.get<ScholarshipStats>('/admin/scholarships/stats');
      return {
        total: response.total || 0,
        draft: response.draft || 0,
        open: response.open || 0,
        closed: response.closed || 0,
        totalBudget: response.totalBudget || 0,
        allocatedBudget: 0, // TODO: Get from allocations
        remainingBudget: response.totalBudget || 0
      };
    } catch (error) {
      console.error('Error loading scholarship stats:', error);
      // Return default stats if API fails
      return {
        total: 0,
        draft: 0,
        open: 0,
        closed: 0,
        totalBudget: 0,
        allocatedBudget: 0,
        remainingBudget: 0
      };
    }
  }

  // Helper method to map API response to frontend format
  private mapScholarshipFromAPI(apiScholarship: any): Scholarship {
    if (!apiScholarship) {
      throw new Error('Invalid scholarship data received from API');
    }

    // Handle eligibility_criteria - could be JSON array or string
    let eligibilityCriteria = '';
    if (apiScholarship.eligibility_criteria) {
      if (typeof apiScholarship.eligibility_criteria === 'string') {
        try {
          const parsed = JSON.parse(apiScholarship.eligibility_criteria);
          eligibilityCriteria = Array.isArray(parsed) ? parsed.join('; ') : apiScholarship.eligibility_criteria;
        } catch {
          eligibilityCriteria = apiScholarship.eligibility_criteria;
        }
      } else if (Array.isArray(apiScholarship.eligibility_criteria)) {
        eligibilityCriteria = apiScholarship.eligibility_criteria.join('; ');
      }
    }

    // Handle required_documents - could be JSON array or string
    let requiredDocuments = '';
    let documentsArray: string[] = [];
    if (apiScholarship.required_documents) {
      if (typeof apiScholarship.required_documents === 'string') {
        try {
          const parsed = JSON.parse(apiScholarship.required_documents);
          if (Array.isArray(parsed)) {
            documentsArray = parsed;
            requiredDocuments = parsed.join(', ');
          } else {
            requiredDocuments = apiScholarship.required_documents;
            documentsArray = apiScholarship.required_documents.split(',').map((doc: string) => doc.trim());
          }
        } catch {
          requiredDocuments = apiScholarship.required_documents;
          documentsArray = apiScholarship.required_documents.split(',').map((doc: string) => doc.trim());
        }
      } else if (Array.isArray(apiScholarship.required_documents)) {
        documentsArray = apiScholarship.required_documents;
        requiredDocuments = apiScholarship.required_documents.join(', ');
      }
    }

    return {
      // API fields
      scholarship_id: apiScholarship.scholarship_id || 0,
      source_id: apiScholarship.source_id || 0,
      scholarship_name: apiScholarship.scholarship_name || '',
      scholarship_type: apiScholarship.scholarship_type || '',
      amount: apiScholarship.amount || 0,
      total_quota: apiScholarship.total_quota || 0,
      available_quota: apiScholarship.available_quota || 0,
      academic_year: apiScholarship.academic_year || '',
      semester: apiScholarship.semester || '',
      eligibility_criteria: eligibilityCriteria,
      required_documents: requiredDocuments,
      application_start_date: apiScholarship.application_start_date || '',
      application_end_date: apiScholarship.application_end_date || '',
      interview_required: apiScholarship.interview_required || false,
      is_active: apiScholarship.is_active !== false,
      created_at: apiScholarship.created_at || '',
      updated_at: apiScholarship.updated_at || '',
      source: apiScholarship.source || null,
      
      // Mapped fields for backward compatibility
      id: apiScholarship.scholarship_id || 0,
      name: apiScholarship.scholarship_name || '',
      type: apiScholarship.scholarship_type || '',
      maxRecipients: apiScholarship.total_quota || 0,
      currentApplicants: 0, // TODO: Get from applications count
      approvedApplicants: 0, // TODO: Get from allocations count
      status: this.determineStatus(apiScholarship),
      createdDate: apiScholarship.created_at || '',
      applicationDeadline: apiScholarship.application_end_date || '',
      academicYear: apiScholarship.academic_year || '',
      requirements: eligibilityCriteria ? [eligibilityCriteria] : [],
      documentsRequired: documentsArray,
      provider: apiScholarship.source?.source_name || 'ไม่ระบุแหล่งทุน',
      lastModified: apiScholarship.updated_at || '',
      createdBy: '', // TODO: Get from created_by field
      isActive: apiScholarship.is_active !== false
    };
  }

  // Helper method to determine scholarship status
  private determineStatus(scholarship: any): 'draft' | 'pending' | 'open' | 'closed' | 'suspended' {
    if (!scholarship) return 'draft';
    
    // ตรวจสอบว่าเป็นทุนที่ถูก duplicate หรือไม่ (ชื่อมี "(คัดลอก)")
    const isDuplicated = scholarship.scholarship_name && scholarship.scholarship_name.includes('(คัดลอก)');
    
    // ถ้าเป็นทุนที่ duplicate มาใหม่ และ is_active = false = draft เสมอ
    if (isDuplicated && scholarship.is_active === false) {
      return 'draft';
    }
    
    // ตรวจสอบสถานะพื้นฐาน: ไม่มีวันที่ = draft
    if (!scholarship.application_start_date || !scholarship.application_end_date) {
      return 'draft';
    }
    
    try {
      const now = new Date();
      const startDate = new Date(scholarship.application_start_date);
      const endDate = new Date(scholarship.application_end_date);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'draft';
      }
      
      // ถ้า is_active = false
      if (scholarship.is_active === false) {
        // ถ้าทุนยังไม่เริ่มรับสมัคร = draft (ยังไม่ได้เผยแพร่)
        if (now < startDate) {
          return 'draft';
        }
        // ถ้าทุนเริ่มรับสมัครแล้วหรือผ่านไปแล้ว = suspended (ถูกระงับ)
        else {
          return 'suspended';
        }
      }
      
             // ถ้า is_active = true
       if (now < startDate) return 'pending'; // เตรียมเปิดรับสมัคร (เผยแพร่แล้วแต่ยังไม่ถึงเวลา)
       if (now > endDate) return 'closed';   // ปิดรับสมัครแล้ว
       return 'open';                        // กำลังเปิดรับสมัคร
    } catch {
      return 'draft';
    }
  }

  async getPublicScholarships(filter: Omit<ScholarshipFilter, 'status'> = {}): Promise<{
    scholarships: Scholarship[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<{
        scholarships: Scholarship[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/public/scholarships?${params.toString()}`);

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRecommendedScholarships(): Promise<Scholarship[]> {
    try {
      const response = await apiClient.get<Scholarship[]>('/scholarships/recommended');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.status === 404) {
      return new Error('ไม่พบทุนการศึกษาที่ระบุ');
    }
    
    if (error.response?.status === 403) {
      return new Error('ไม่มีสิทธิ์เข้าถึงข้อมูลนี้');
    }
    
    if (error.response?.status >= 500) {
      return new Error('เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง');
    }
    
    return new Error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  }
}

export const scholarshipService = new ScholarshipService();