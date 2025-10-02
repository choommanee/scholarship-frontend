import { apiClient } from '@/utils/api';

export interface PriorityScoreRequest {
  gpa: number;
  family_income: number;
  activity_count: number;
}

export interface PriorityScoreResponse {
  total_score: number;
  gpa_score: number;
  financial_score: number;
  activity_score: number;
  score_level: string;
  recommendations: string[];
}

export interface StudentProfile {
  user_id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  faculty: string;
  year: number;
  current_gpa: number;
  family_income: number;
  monthly_expenses: number;
  activities: string[];
  priority_score: number;
}

export interface EligibleScholarship {
  scholarship_id: number;
  scholarship_name: string;
  amount: number;
  deadline: string;
  days_left: number;
  type: string;
  is_eligible: boolean;
  eligibility_reason: string;
}

export interface ApplicationHistory {
  application_id: number;
  scholarship_id: number;
  application_status: string;
  submitted_at: string;
  priority_score: number;
  scholarship_name?: string;
  scholarship_amount?: number;
  allocated_amount?: number;
  allocation_status?: string;
}

export interface StudentStats {
  total_applications: number;
  approved_applications: number;
  pending_applications: number;
  total_awarded_amount: number;
  average_priority_score: number;
}

export interface UpdateStudentProfileRequest {
  first_name?: string;
  last_name?: string;
  family_income?: number;
  monthly_expenses?: number;
  activities?: string[];
}

class StudentService {
  async calculatePriorityScore(data: PriorityScoreRequest): Promise<PriorityScoreResponse> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: PriorityScoreResponse;
        message: string;
      }>('/student/calculate-score', data);
      
      return response.data;
    } catch (error) {
      console.error('Priority score calculation error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<StudentProfile>('/students/profile');
    return response;
  }

  async updateProfile(profileData: UpdateStudentProfileRequest): Promise<StudentProfile> {
    const response = await apiClient.put<StudentProfile>('/students/profile', profileData);
    return response;
  }

  async getApplicationHistory(): Promise<ApplicationHistory[]> {
    const response = await apiClient.get<ApplicationHistory[]>('/students/applications/history');
    return response;
  }

  async getStats(): Promise<StudentStats> {
    const response = await apiClient.get<StudentStats>('/students/stats');
    return response;
  }

  async uploadDocument(file: File, documentType: string): Promise<{ url: string; id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const response = await apiClient.post<{ url: string; id: string }>('/students/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  }

  async getEligibleScholarships(gpa?: number, income?: number): Promise<EligibleScholarship[]> {
    try {
      const params = new URLSearchParams();
      if (gpa !== undefined) params.append('gpa', gpa.toString());
      if (income !== undefined) params.append('income', income.toString());
      
      const response = await apiClient.get<{
        success: boolean;
        data: EligibleScholarship[];
        message: string;
      }>(`/student/eligible-scholarships?${params.toString()}`);
      
      return response.data;
    } catch (error) {
      console.error('Get eligible scholarships error:', error);
      throw error;
    }
  }

  // Calculate priority score locally (same algorithm as backend)
  calculatePriorityScoreLocally(gpa: number, income: number, activityCount: number): PriorityScoreResponse {
    // GPA Score (40% weight)
    let gpaScore = 50.0;
    if (gpa >= 4.0) {
      gpaScore = 100.0;
    } else if (gpa > 2.0) {
      gpaScore = 50.0 + ((gpa - 2.0) / 2.0) * 50.0;
    }

    // Financial Score (30% weight) - Lower income = higher score
    let financialScore = 20.0;
    if (income <= 15000) {
      financialScore = 100.0;
    } else if (income < 50000) {
      financialScore = 100.0 - ((income - 15000) / (50000 - 15000)) * 80.0;
    }

    // Activity Score (30% weight)
    let activityScore = Math.min(activityCount * 20, 100);

    // Calculate weighted total
    const totalScore = Math.round(((gpaScore * 0.4) + (financialScore * 0.3) + (activityScore * 0.3)) * 100) / 100;

    // Determine score level
    let scoreLevel = "ต่ำ";
    if (totalScore >= 80) scoreLevel = "สูงมาก";
    else if (totalScore >= 60) scoreLevel = "สูง";
    else if (totalScore >= 40) scoreLevel = "ปานกลาง";

    // Generate recommendations
    const recommendations: string[] = [];
    if (gpa < 3.0) {
      recommendations.push("เพิ่มเกรดเฉลี่ยให้สูงขึ้นเพื่อเพิ่มโอกาสได้รับทุน");
    }
    if (activityCount < 3) {
      recommendations.push("เข้าร่วมกิจกรรมเสริมหลักสูตรเพิ่มเติมเพื่อเพิ่มคะแนน");
    }
    if (income > 30000) {
      recommendations.push("พิจารณาสมัครทุนประเภทเรียนดีมากกว่าทุนขาดแคลน");
    }
    if (totalScore < 60) {
      recommendations.push("ควรปรับปรุงผลการเรียนและเพิ่มกิจกรรมเพื่อเพิ่มโอกาสได้รับทุน");
    }
    if (recommendations.length === 0) {
      recommendations.push("คะแนนของคุณอยู่ในระดับดี สามารถสมัครทุนได้อย่างมั่นใจ");
    }

    return {
      total_score: totalScore,
      gpa_score: Math.round(gpaScore * 100) / 100,
      financial_score: Math.round(financialScore * 100) / 100,
      activity_score: activityScore,
      score_level: scoreLevel,
      recommendations
    };
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.status === 404) {
      return new Error('ไม่พบข้อมูลนักศึกษา');
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

export const studentService = new StudentService();
export default studentService; 