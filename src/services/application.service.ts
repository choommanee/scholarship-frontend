import { apiClient } from '@/utils/api';

export interface ApplicationDraft {
  application_id?: number;
  scholarship_id: number;
  student_id?: string;
  current_step: number;
  form_data: any;
  last_saved_at?: string;
}

export interface ApplicationSubmit {
  application_id: number;
  terms_accepted: boolean;
}

export interface ApplicationResponse {
  application_id: number;
  status: string;
  submitted_at?: string;
}

class ApplicationService {
  // Create draft application
  async createDraft(scholarshipId: number): Promise<ApplicationDraft> {
    try {
      console.log('createDraft called with scholarshipId:', scholarshipId);
      const response = await apiClient.post<any>('/applications/draft', {
        scholarship_id: scholarshipId
      });
      console.log('createDraft response:', response);

      // Handle response - could be response.data or response.application_id
      const applicationId = response.data?.application_id || response.application_id;
      const draftData = response.data || response;

      return {
        application_id: applicationId,
        scholarship_id: scholarshipId,
        current_step: draftData.current_step || 1,
        form_data: draftData.form_data || {}
      };
    } catch (error: any) {
      console.error('createDraft error:', error.response || error);
      throw this.handleError(error);
    }
  }

  // Get draft application
  async getDraft(scholarshipId: number): Promise<ApplicationDraft | null> {
    try {
      console.log('getDraft called with scholarshipId:', scholarshipId);
      const response = await apiClient.get<any>(
        `/applications/draft?scholarship_id=${scholarshipId}`
      );
      console.log('getDraft response:', response);
      return {
        application_id: response.application_id,
        scholarship_id: scholarshipId,
        current_step: response.current_step || 1,
        form_data: response.form_data || {},
        last_saved_at: response.last_saved_at
      };
    } catch (error: any) {
      console.error('getDraft error:', error.response || error);
      if (error.response?.status === 404 || error.response?.status === 400) {
        // No draft exists yet or bad request - return null to trigger create
        return null;
      }
      throw this.handleError(error);
    }
  }

  // Save application section
  async saveSection(
    applicationId: number,
    sectionName: string,
    data: any,
    autoSave = false
  ): Promise<void> {
    try {
      // Map frontend section names to backend section names
      const sectionMap: { [key: string]: string } = {
        'step1_personal_info': 'personal_info',
        'step2_address_info': 'address_info',
        'step3_education_history': 'education_history',
        'step4_family_info': 'family_info',
        'step5_financial_info': 'financial_info',
        'step6_activities_skills': 'activities_skills',
        'complete_form': 'personal_info' // Fallback for complete form - save as personal_info
      };

      const backendSectionName = sectionMap[sectionName] || sectionName;

      // If saving complete_form, need to save all sections
      if (sectionName === 'complete_form') {
        // Save each section separately
        const formData = data.form_data || data;
        const sections = [
          { name: 'personal_info', data: formData.step1_personal_info },
          { name: 'address_info', data: formData.step2_address_info },
          { name: 'education_history', data: formData.step3_education_history },
          { name: 'family_info', data: formData.step4_family_info },
          { name: 'financial_info', data: formData.step5_financial_info },
          { name: 'activities_skills', data: formData.step6_activities_skills }
        ];

        for (const section of sections) {
          if (section.data) {
            await apiClient.post(
              `/applications/${applicationId}/sections/${section.name}`,
              {
                data: section.data,
                auto_save: autoSave
              }
            );
          }
        }
      } else {
        await apiClient.post(
          `/applications/${applicationId}/sections/${backendSectionName}`,
          {
            data,
            auto_save: autoSave
          }
        );
      }
    } catch (error) {
      if (!autoSave) {
        throw this.handleError(error);
      }
      console.warn('Auto-save failed:', error);
    }
  }

  // Get my applications
  async getMyApplications(filters?: {
    status?: string;
    scholarship_id?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    applications: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = new URLSearchParams();

      if (filters?.status) params.append('status', filters.status);
      if (filters?.scholarship_id) params.append('scholarship_id', filters.scholarship_id.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const queryString = params.toString();
      const url = `/applications/my${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.get<any>(url);

      return {
        applications: response.applications || response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10
      };
    } catch (error) {
      console.error('getMyApplications error:', error);
      throw this.handleError(error);
    }
  }

  // Get complete form data for an application
  async getCompleteForm(applicationId: number): Promise<any> {
    try {
      console.log('getCompleteForm called with applicationId:', applicationId);

      // Get all sections of the application
      const response = await apiClient.get<any>(`/applications/${applicationId}`);
      console.log('getCompleteForm response:', response);

      // Backend returns {application: {...}, documents: [...]}
      const appData = response.application || response;
      const docs = response.documents || [];

      // Transform backend data to frontend format
      const transformedData = {
        application_id: appData.application_id,
        scholarship_id: appData.scholarship_id,
        student_id: appData.student_id,
        application_status: appData.application_status,
        current_step: appData.current_step || 1,
        personal_info: appData.personal_info || {},
        addresses: appData.address_info || {},
        education_history: appData.education_history || {},
        family_members: appData.family_info?.family_members || [],
        guardians: appData.family_info?.guardians || [],
        siblings: appData.family_info?.siblings || [],
        living_situation: appData.family_info?.living_situation || {},
        financial_info: appData.financial_info || {},
        assets: appData.financial_info?.assets || [],
        scholarship_history: appData.financial_info?.scholarship_history || [],
        health_info: appData.financial_info?.health_info || {},
        funding_needs: appData.financial_info?.funding_needs || {},
        activities: appData.activities_skills?.activities || [],
        references: appData.activities_skills?.references || [],
        documents: docs || [],
        created_at: appData.created_at,
        updated_at: appData.updated_at,
        submitted_at: appData.submitted_at
      };

      return {
        success: true,
        data: transformedData
      };
    } catch (error: any) {
      console.error('getCompleteForm error:', error);
      throw this.handleError(error);
    }
  }

  // Submit application
  async submit(submitData: ApplicationSubmit): Promise<ApplicationResponse> {
    try {
      const response = await apiClient.post<any>(
        `/applications/${submitData.application_id}/submit`,
        {
          terms_accepted: submitData.terms_accepted,
          final_review: true
        }
      );
      return {
        application_id: submitData.application_id,
        status: response.status || 'submitted',
        submitted_at: response.submitted_at
      };
    } catch (error) {
      throw this.handleError(error);
    }
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
    if (error.response?.status >= 500) {
      return new Error('เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง');
    }
    return new Error('เกิดข้อผิดพลาดในการดำเนินการ');
  }
}

const applicationService = new ApplicationService();
export { applicationService };
export default applicationService;
