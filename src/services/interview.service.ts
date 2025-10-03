import { apiClient } from '@/utils/api';

export interface InterviewSlot {
  id: number;
  scholarship_id: number;
  interviewer_id: string;
  interview_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  building?: string;
  floor?: string;
  room?: string;
  max_capacity: number;
  current_bookings: number;
  is_available: boolean;
  slot_type: 'individual' | 'group';
  duration_minutes: number;
  preparation_time: number;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  scholarship?: {
    scholarship_name: string;
  };
  interviewer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface InterviewBooking {
  id: number;
  slot_id: number;
  application_id: number;
  student_id: string;
  booking_status: 'booked' | 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'rescheduled';
  booked_at: string;
  confirmed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  student_notes?: string;
  officer_notes?: string;
  reminder_sent_at?: string;
  check_in_time?: string;
  check_out_time?: string;
  actual_duration_minutes?: number;
  created_at: string;
  updated_at: string;
  slot?: InterviewSlot;
  application?: any;
  student?: any;
}

export interface CreateInterviewSlotRequest {
  scholarship_id: number;
  interviewer_id: string;
  interview_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  building?: string;
  floor?: string;
  room?: string;
  max_capacity?: number;
  slot_type?: 'individual' | 'group';
  duration_minutes?: number;
  preparation_time?: number;
  notes?: string;
}

export interface UpdateInterviewSlotRequest {
  location?: string;
  building?: string;
  floor?: string;
  room?: string;
  max_capacity?: number;
  is_available?: boolean;
  duration_minutes?: number;
  preparation_time?: number;
  notes?: string;
}

export interface BookInterviewRequest {
  slot_id: number;
  student_notes?: string;
}

export interface InterviewSlotFilters {
  scholarship_id?: number;
  interviewer_id?: string;
  date_from?: string;
  date_to?: string;
  is_available?: boolean;
  slot_type?: string;
  page?: number;
  limit?: number;
}

export interface DayAvailability {
  date: string;
  day_of_week: string;
  total_slots: number;
  available_slots: number;
  booked_slots: number;
  time_slots: {
    slot_id: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
    is_booked: boolean;
    location: string;
    interviewer: string;
    duration_minutes: number;
  }[];
}

export interface InterviewStatistics {
  total_slots: number;
  available_slots: number;
  booked_slots: number;
  completed_slots: number;
  cancelled_slots: number;
  no_show_slots: number;
  by_status: Record<string, number>;
  by_interviewer: Record<string, number>;
  by_scholarship: Record<string, number>;
  upcoming_today: number;
  upcoming_week: number;
}

class InterviewService {
  // Interview Slot Management
  async createInterviewSlot(slotData: CreateInterviewSlotRequest): Promise<{ success: boolean; message: string; data: InterviewSlot }> {
    return apiClient.post<{ success: boolean; message: string; data: InterviewSlot }>(
      '/interview/slots',
      slotData
    );
  }

  async getInterviewSlots(filters?: InterviewSlotFilters): Promise<{
    success: boolean;
    data: InterviewSlot[];
    meta: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
    filters: InterviewSlotFilters;
  }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    return apiClient.get<{
      success: boolean;
      data: InterviewSlot[];
      meta: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
      };
      filters: InterviewSlotFilters;
    }>(`/interview/slots?${params.toString()}`);
  }

  async getInterviewSlot(id: number): Promise<{ success: boolean; data: InterviewSlot }> {
    return apiClient.get<{ success: boolean; data: InterviewSlot }>(`/interview/slots/${id}`);
  }

  async updateInterviewSlot(id: number, updates: UpdateInterviewSlotRequest): Promise<{ success: boolean; message: string; data: InterviewSlot }> {
    return apiClient.put<{ success: boolean; message: string; data: InterviewSlot }>(
      `/interview/slots/${id}`,
      updates
    );
  }

  async deleteInterviewSlot(id: number): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/interview/slots/${id}`);
  }

  // Interview Booking
  async getAvailableSlots(scholarshipId: number, dateFrom?: string, dateTo?: string): Promise<{
    success: boolean;
    data: DayAvailability[];
  }> {
    const params = new URLSearchParams();
    params.append('scholarship_id', scholarshipId.toString());
    
    if (dateFrom) {
      params.append('date_from', dateFrom);
    }
    
    if (dateTo) {
      params.append('date_to', dateTo);
    }

    return apiClient.get<{ success: boolean; data: DayAvailability[] }>(
      `/interview/availability?${params.toString()}`
    );
  }

  async bookInterviewSlot(bookingData: BookInterviewRequest): Promise<{ success: boolean; message: string; data: InterviewBooking }> {
    return apiClient.post<{ success: boolean; message: string; data: InterviewBooking }>(
      '/interview/book',
      bookingData
    );
  }

  async getMyInterviewBookings(): Promise<{
    success: boolean;
    data: InterviewBooking[];
  }> {
    return apiClient.get<{ success: boolean; data: InterviewBooking[] }>(
      '/interview/bookings/my'
    );
  }

  async getInterviewBookings(filters?: {
    student_id?: string;
    scholarship_id?: number;
    booking_status?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: InterviewBooking[];
    meta: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    return apiClient.get<{
      success: boolean;
      data: InterviewBooking[];
      meta: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
      };
    }>(`/interview/bookings?${params.toString()}`);
  }

  async getInterviewBooking(id: number): Promise<{ success: boolean; data: InterviewBooking }> {
    return apiClient.get<{ success: boolean; data: InterviewBooking }>(
      `/interview/bookings/${id}`
    );
  }

  async updateInterviewBooking(id: number, updates: {
    booking_status?: string;
    cancellation_reason?: string;
    student_notes?: string;
    officer_notes?: string;
  }): Promise<{ success: boolean; message: string; data: InterviewBooking }> {
    return apiClient.put<{ success: boolean; message: string; data: InterviewBooking }>(
      `/interview/bookings/${id}`,
      updates
    );
  }

  async cancelInterviewBooking(id: number, reason?: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/interview/bookings/${id}`, {
      data: { cancellation_reason: reason }
    });
  }

  async rescheduleInterview(id: number, newSlotId: number, reason?: string): Promise<{ success: boolean; message: string; data: InterviewBooking }> {
    return apiClient.post<{ success: boolean; message: string; data: InterviewBooking }>(
      `/interview/bookings/${id}/reschedule`,
      {
        new_slot_id: newSlotId,
        reason
      }
    );
  }

  async confirmInterviewBooking(id: number): Promise<{ success: boolean; message: string; data: InterviewBooking }> {
    return apiClient.post<{ success: boolean; message: string; data: InterviewBooking }>(
      `/interview/bookings/${id}/confirm`
    );
  }

  async checkInInterview(id: number): Promise<{ success: boolean; message: string; data: InterviewBooking }> {
    return apiClient.post<{ success: boolean; message: string; data: InterviewBooking }>(
      `/interview/bookings/${id}/checkin`
    );
  }

  async checkOutInterview(id: number): Promise<{ success: boolean; message: string; data: InterviewBooking }> {
    return apiClient.post<{ success: boolean; message: string; data: InterviewBooking }>(
      `/interview/bookings/${id}/checkout`
    );
  }

  // Statistics
  async getInterviewStatistics(dateFrom?: string, dateTo?: string): Promise<{
    success: boolean;
    data: InterviewStatistics;
  }> {
    const params = new URLSearchParams();
    
    if (dateFrom) {
      params.append('date_from', dateFrom);
    }
    
    if (dateTo) {
      params.append('date_to', dateTo);
    }

    return apiClient.get<{ success: boolean; data: InterviewStatistics }>(
      `/interview/statistics?${params.toString()}`
    );
  }

  async getInterviewerCalendar(interviewerId: string, month?: string): Promise<{
    success: boolean;
    data: {
      interviewer: any;
      calendar: Array<{
        date: string;
        slots: InterviewSlot[];
        bookings: InterviewBooking[];
      }>;
    };
  }> {
    const params = new URLSearchParams();
    
    if (month) {
      params.append('month', month);
    }

    return apiClient.get<{
      success: boolean;
      data: {
        interviewer: any;
        calendar: Array<{
          date: string;
          slots: InterviewSlot[];
          bookings: InterviewBooking[];
        }>;
      };
    }>(`/interview/calendar/${interviewerId}?${params.toString()}`);
  }

  // Utility functions
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  formatTime(timeString: string): string {
    return timeString.substring(0, 5); // HH:MM
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'booked': 'จองแล้ว',
      'confirmed': 'ยืนยันแล้ว',
      'completed': 'เสร็จสิ้น',
      'cancelled': 'ยกเลิก',
      'no_show': 'ไม่มาสัมภาษณ์',
      'rescheduled': 'เลื่อนนัด'
    };
    return statusMap[status] || 'ไม่ทราบสถานะ';
  }

  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      'booked': 'bg-blue-100 text-blue-800 border-blue-200',
      'confirmed': 'bg-green-100 text-green-800 border-green-200',
      'completed': 'bg-purple-100 text-purple-800 border-purple-200',
      'cancelled': 'bg-gray-100 text-gray-800 border-gray-200',
      'no_show': 'bg-red-100 text-red-800 border-red-200',
      'rescheduled': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getDaysUntil(dateString: string): number {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isSlotAvailable(slot: InterviewSlot): boolean {
    return slot.is_available && slot.current_bookings < slot.max_capacity;
  }

  validateTimeSequence(startTime: string, endTime: string): boolean {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return end > start;
  }

  validateDateInFuture(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }
}

const interviewService = new InterviewService();
export { interviewService };
export default interviewService; 
