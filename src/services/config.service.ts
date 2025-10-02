import { apiClient } from '@/utils/api';

export interface SystemConfig {
  systemName: string;
  systemVersion: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxFileUploadSize: number;
  sessionTimeout: number;
  currentAcademicYear: string;
  applicationDeadline: string;
  maxApplicationsPerStudent: number;
  autoApproveApplications: boolean;
  requireDocumentVerification: boolean;
  emailEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  notificationEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  enforcePasswordPolicy: boolean;
  minPasswordLength: number;
  requireTwoFactor: boolean;
  loginAttemptLimit: number;
  lockoutDuration: number;
  totalBudget: number;
  budgetWarningThreshold: number;
  autoCloseBudgetExceeded: boolean;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalScholarships: number;
  activeScholarships: number;
  totalApplications: number;
  pendingApplications: number;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  budgetUsagePercent: number;
}

export interface ActivityLog {
  id: number;
  userId: string;
  userName: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface ActivityLogResponse {
  data: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ConfigService {
  async getSystemConfig(): Promise<SystemConfig> {
    try {
      const response = await apiClient.get<{success: boolean; data: SystemConfig}>('/admin/config');
      return response.data;
    } catch (error) {
      console.error('Get system config error:', error);
      throw new Error('ไม่สามารถโหลดการตั้งค่าระบบได้');
    }
  }

  async updateSystemConfig(config: SystemConfig): Promise<void> {
    try {
      await apiClient.put<{success: boolean; message: string}>('/admin/config', config);
    } catch (error) {
      console.error('Update system config error:', error);
      throw new Error('ไม่สามารถบันทึกการตั้งค่าระบบได้');
    }
  }

  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await apiClient.get<{success: boolean; data: SystemStats}>('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Get system stats error:', error);
      throw new Error('ไม่สามารถโหลดสถิติระบบได้');
    }
  }

  async getActivityLog(page: number = 1, limit: number = 20): Promise<ActivityLogResponse> {
    try {
      const response = await apiClient.get<{success: boolean; data: ActivityLog[]; pagination: any}>(
        `/admin/activity-log?page=${page}&limit=${limit}`
      );
      return {
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error('Get activity log error:', error);
      throw new Error('ไม่สามารถโหลดบันทึกกิจกรรมได้');
    }
  }

  async testEmailConnection(): Promise<void> {
    try {
      await apiClient.post<{success: boolean; message: string}>('/admin/test-email');
    } catch (error) {
      console.error('Test email connection error:', error);
      throw new Error('การทดสอบการเชื่อมต่ออีเมลไม่สำเร็จ');
    }
  }

  async testDatabaseConnection(): Promise<void> {
    try {
      await apiClient.post<{success: boolean; message: string}>('/admin/test-database');
    } catch (error) {
      console.error('Test database connection error:', error);
      throw new Error('การทดสอบการเชื่อมต่อฐานข้อมูลไม่สำเร็จ');
    }
  }
}

export const configService = new ConfigService(); 