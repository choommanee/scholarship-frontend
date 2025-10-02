import { apiClient } from '@/utils/api';

// Payment Method Types
export interface PaymentMethod {
  method_id: string;
  method_name: string;
  method_code: string;
  description: string;
  is_active: boolean;
  configuration: any;
  created_at: string;
}

// Payment Transaction Types
export interface PaymentTransaction {
  transaction_id: string;
  allocation_id: number;
  amount: number;
  payment_method: string;
  bank_code?: string;
  account_number?: string;
  payment_date: string;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  reference_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Disbursement Schedule Types
export interface DisbursementSchedule {
  schedule_id: string;
  allocation_id: number;
  installment_number: number;
  due_date: string;
  amount: number;
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  paid_date?: string;
  created_at: string;
  updated_at: string;
}

// Request Types
export interface CreateTransactionRequest {
  allocation_id: number;
  amount: number;
  payment_method: string;
  bank_code?: string;
  account_number?: string;
  payment_date: string;
  reference_number?: string;
  notes?: string;
}

export interface CreateDisbursementRequest {
  allocation_id: number;
  installment_number: number;
  due_date: string;
  amount: number;
}

export interface UpdateTransactionStatusRequest {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  notes?: string;
}

class PaymentService {
  /**
   * Get all available payment methods
   * @returns Array of payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await apiClient.get<PaymentMethod[]>('/payments/methods');
      return response;
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลวิธีการชำระเงินได้');
    }
  }

  /**
   * Create a new payment transaction
   * @param data Transaction data
   * @returns Created transaction
   */
  async createTransaction(data: CreateTransactionRequest): Promise<PaymentTransaction> {
    try {
      const response = await apiClient.post<PaymentTransaction>('/payments/transactions', data);
      return response;
    } catch (error) {
      console.error('Failed to create payment transaction:', error);
      throw this.handleError(error, 'ไม่สามารถสร้างรายการชำระเงินได้');
    }
  }

  /**
   * Get transaction by ID
   * @param id Transaction ID
   * @returns Transaction details
   */
  async getTransaction(id: string): Promise<PaymentTransaction> {
    try {
      const response = await apiClient.get<PaymentTransaction>(`/payments/transactions/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลรายการชำระเงินได้');
    }
  }

  /**
   * Get all transactions for a specific allocation
   * @param allocationId Allocation ID
   * @returns Array of transactions
   */
  async getAllocationTransactions(allocationId: number): Promise<PaymentTransaction[]> {
    try {
      const response = await apiClient.get<PaymentTransaction[]>(
        `/payments/allocations/${allocationId}/transactions`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch allocation transactions:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลรายการชำระเงินสำหรับการจัดสรรนี้ได้');
    }
  }

  /**
   * Update transaction status
   * @param id Transaction ID
   * @param data Status update data
   */
  async updateTransactionStatus(id: string, data: UpdateTransactionStatusRequest): Promise<void> {
    try {
      await apiClient.put(`/payments/transactions/${id}/status`, data);
    } catch (error) {
      console.error('Failed to update transaction status:', error);
      throw this.handleError(error, 'ไม่สามารถอัพเดทสถานะรายการชำระเงินได้');
    }
  }

  /**
   * Create a new disbursement schedule
   * @param data Disbursement data
   * @returns Created disbursement schedule
   */
  async createDisbursement(data: CreateDisbursementRequest): Promise<DisbursementSchedule> {
    try {
      const response = await apiClient.post<DisbursementSchedule>('/payments/disbursements', data);
      return response;
    } catch (error) {
      console.error('Failed to create disbursement schedule:', error);
      throw this.handleError(error, 'ไม่สามารถสร้างตารางการเบิกจ่ายได้');
    }
  }

  /**
   * Get all disbursement schedules for a specific allocation
   * @param allocationId Allocation ID
   * @returns Array of disbursement schedules
   */
  async getAllocationDisbursements(allocationId: number): Promise<DisbursementSchedule[]> {
    try {
      const response = await apiClient.get<DisbursementSchedule[]>(
        `/payments/allocations/${allocationId}/disbursements`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch allocation disbursements:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลตารางการเบิกจ่ายสำหรับการจัดสรรนี้ได้');
    }
  }

  /**
   * Get all pending disbursements across all allocations
   * @returns Array of pending disbursement schedules
   */
  async getPendingDisbursements(): Promise<DisbursementSchedule[]> {
    try {
      const response = await apiClient.get<DisbursementSchedule[]>('/payments/disbursements/pending');
      return response;
    } catch (error) {
      console.error('Failed to fetch pending disbursements:', error);
      throw this.handleError(error, 'ไม่สามารถดึงข้อมูลรายการเบิกจ่ายที่รอดำเนินการได้');
    }
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

export const paymentService = new PaymentService();
