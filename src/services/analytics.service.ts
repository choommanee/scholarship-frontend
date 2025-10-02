import { apiClient } from '@/utils/api';

// Dashboard Summary Types
export interface DashboardSummary {
  total_periods: number;
  latest_statistics: ScholarshipStatistics | null;
  average_processing_time: number;
  bottlenecks: Record<string, number>;
}

// Scholarship Statistics Types
export interface ScholarshipStatistics {
  stat_id: string;
  academic_year: string;
  scholarship_round: string;
  total_applications: number;
  approved_applications: number;
  rejected_applications: number;
  pending_applications?: number;
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  average_amount: number;
  success_rate: number;
  processing_time_avg: number;
  total_faculties: number;
  most_popular_scholarship?: string;
  created_at: string;
}

// Application Analytics Types
export interface ApplicationAnalytics {
  analytics_id: string;
  application_id: number;
  processing_time: number;
  total_steps: number;
  completed_steps: number;
  bottleneck_step?: string;
  time_in_each_step?: Record<string, number>;
  document_upload_time?: number;
  review_time?: number;
  interview_score?: number;
  final_score?: number;
  created_at: string;
}

// Request Types
export interface CreateStatisticsRequest {
  academic_year: string;
  scholarship_round: string;
  total_applications: number;
  approved_applications: number;
  rejected_applications: number;
  pending_applications?: number;
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  average_amount: number;
  success_rate: number;
  processing_time_avg: number;
  total_faculties: number;
  most_popular_scholarship?: string;
}

export interface CreateApplicationAnalyticsRequest {
  application_id: number;
  processing_time: number;
  total_steps: number;
  completed_steps: number;
  bottleneck_step?: string;
  time_in_each_step?: Record<string, number>;
  document_upload_time?: number;
  review_time?: number;
  interview_score?: number;
  final_score?: number;
}

export interface StatisticsFilters {
  year?: string;
  round?: string;
}

class AnalyticsService {
  /**
   * Get dashboard summary with key metrics
   * @returns Dashboard summary data
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<DashboardSummary>('/analytics/dashboard');
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลสรุปแดชบอร์ดได้');
    }
  }

  /**
   * Get scholarship statistics for specific year and round
   * @param year Academic year
   * @param round Scholarship round
   * @returns Statistics data
   */
  async getStatistics(year: string, round: string): Promise<ScholarshipStatistics> {
    try {
      const response = await apiClient.get<ScholarshipStatistics>('/analytics/statistics', {
        params: { year, round }
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลสถิติได้');
    }
  }

  /**
   * Get all scholarship statistics
   * @returns Array of statistics
   */
  async getAllStatistics(): Promise<ScholarshipStatistics[]> {
    try {
      const response = await apiClient.get<ScholarshipStatistics[]>('/analytics/statistics/all');
      return response;
    } catch (error) {
      console.error('Failed to fetch all statistics:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลสถิติทั้งหมดได้');
    }
  }

  /**
   * Create or update scholarship statistics
   * @param data Statistics data
   */
  async createStatistics(data: CreateStatisticsRequest): Promise<void> {
    try {
      await apiClient.post('/analytics/statistics', data);
    } catch (error) {
      console.error('Failed to create statistics:', error);
      throw this.handleError(error, 'ไม่สามารถสร้างข้อมูลสถิติได้');
    }
  }

  /**
   * Get application analytics by application ID
   * @param applicationId Application ID
   * @returns Application analytics data
   */
  async getApplicationAnalytics(applicationId: number): Promise<ApplicationAnalytics> {
    try {
      const response = await apiClient.get<ApplicationAnalytics>(
        `/analytics/applications/${applicationId}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch application analytics:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลวิเคราะห์ใบสมัครได้');
    }
  }

  /**
   * Create application analytics
   * @param data Application analytics data
   */
  async createApplicationAnalytics(data: CreateApplicationAnalyticsRequest): Promise<void> {
    try {
      await apiClient.post('/analytics/applications', data);
    } catch (error) {
      console.error('Failed to create application analytics:', error);
      throw this.handleError(error, 'ไม่สามารถสร้างข้อมูลวิเคราะห์ใบสมัครได้');
    }
  }

  /**
   * Get average processing time across all applications
   * @returns Average processing time in days
   */
  async getAverageProcessingTime(): Promise<number> {
    try {
      const response = await apiClient.get<{ average_processing_time_days: number }>(
        '/analytics/processing-time'
      );
      return response.average_processing_time_days;
    } catch (error) {
      console.error('Failed to fetch average processing time:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลเวลาดำเนินการเฉลี่ยได้');
    }
  }

  /**
   * Get bottlenecks analysis
   * @returns Bottlenecks by step
   */
  async getBottlenecks(): Promise<Record<string, number>> {
    try {
      const response = await apiClient.get<{ bottlenecks: Record<string, number> }>(
        '/analytics/bottlenecks'
      );
      return response.bottlenecks;
    } catch (error) {
      console.error('Failed to fetch bottlenecks:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลจุดคอขวดได้');
    }
  }

  /**
   * Calculate success rate percentage
   * @param approved Number of approved applications
   * @param total Total number of applications
   * @returns Success rate as percentage
   */
  calculateSuccessRate(approved: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((approved / total) * 100 * 100) / 100;
  }

  /**
   * Calculate remaining budget percentage
   * @param remaining Remaining budget
   * @param total Total budget
   * @returns Remaining percentage
   */
  calculateRemainingBudgetPercentage(remaining: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((remaining / total) * 100 * 100) / 100;
  }

  /**
   * Format processing time for display
   * @param days Number of days
   * @returns Formatted string
   */
  formatProcessingTime(days: number): string {
    if (days < 1) {
      return `${Math.round(days * 24)} ชั่วโมง`;
    }
    if (days < 30) {
      return `${Math.round(days)} วัน`;
    }
    const months = Math.floor(days / 30);
    const remainingDays = Math.round(days % 30);
    if (remainingDays === 0) {
      return `${months} เดือน`;
    }
    return `${months} เดือน ${remainingDays} วัน`;
  }

  /**
   * Format currency for display
   * @param amount Amount in baht
   * @returns Formatted currency string
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Get status color for UI display
   * @param status Status value
   * @returns Color class name
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      completed: 'text-green-600',
      processing: 'text-blue-600',
      pending: 'text-yellow-600',
      failed: 'text-red-600',
      cancelled: 'text-gray-600'
    };
    return colors[status] || 'text-gray-600';
  }

  /**
   * Handle errors and provide user-friendly messages
   * @param error Error object
   * @param defaultMessage Default error message
   * @returns Error object
   */
  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }

    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error.response?.status === 401) {
      return new Error('กรุณาเข้าสู่ระบบใหม่');
    }

    if (error.response?.status === 403) {
      return new Error('ไม่มีสิทธิ์เข้าถึงข้อมูลนี้');
    }

    if (error.response?.status === 404) {
      return new Error('ไม่พบข้อมูลที่ต้องการ');
    }

    if (error.response?.status >= 500) {
      return new Error('เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง');
    }

    return new Error(defaultMessage);
  }
}

export const analyticsService = new AnalyticsService();
