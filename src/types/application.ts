// Application Types for Scholarship Management System
// Matches Backend API models

// ============================================================================
// Main Application
// ============================================================================

export interface ScholarshipApplication {
  application_id: number;
  scholarship_id: number;
  student_id: string;
  application_status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'waitlisted';
  submission_date?: string;
  review_status?: string;
  reviewer_id?: string;
  review_date?: string;
  review_notes?: string;
  final_decision?: string;
  decision_date?: string;
  created_at: string;
  updated_at: string;
  scholarship?: Scholarship;
}

export interface Scholarship {
  scholarship_id: number;
  scholarship_name: string;
  scholarship_type: string;
  amount: number;
  total_quota: number;
  available_quota: number;
  academic_year: string;
  semester?: string;
  application_start_date: string;
  application_end_date: string;
  is_active: boolean;
}

// ============================================================================
// Section 1: Personal Information (ข้อมูลส่วนตัว)
// ============================================================================

export interface ApplicationPersonalInfo {
  info_id?: string;
  application_id: number;
  prefix_th?: string;
  first_name_th: string;
  last_name_th: string;
  prefix_en?: string;
  first_name_en?: string;
  last_name_en?: string;
  email: string;
  phone?: string;
  line_id?: string;
  citizen_id?: string;
  birth_date?: string;
  nationality?: string;
  religion?: string;
  student_id?: string;
  faculty?: string;
  department?: string;
  program?: string;
  year_level?: number;
  gpa?: number;
  admission_type?: string; // Portfolio, Quota, Admission
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 2: Address (ที่อยู่)
// ============================================================================

export interface ApplicationAddress {
  address_id?: string;
  application_id: number;
  address_type: 'registered' | 'current'; // ทะเบียนบ้าน, ที่อยู่ปัจจุบัน
  address_line1?: string;
  address_line2?: string;
  sub_district?: string; // ตำบล/แขวง
  district?: string; // อำเภอ/เขต
  province: string;
  postal_code?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 3: Education History (ประวัติการศึกษา)
// ============================================================================

export interface ApplicationEducationHistory {
  history_id?: string;
  application_id: number;
  education_level: string; // มัธยมต้น, มัธยมปลาย, ปวช., ปวส.
  institution_name: string;
  major?: string;
  gpa?: number;
  graduation_year?: number;
  province?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 4: Family Members (ข้อมูลครอบครัว)
// ============================================================================

export interface ApplicationFamilyMember {
  member_id?: string;
  application_id: number;
  relationship: string; // บิดา, มารดา, ผู้ปกครอง
  prefix?: string;
  first_name: string;
  last_name: string;
  age?: number;
  status?: string; // มีชีวิต, เสียชีวิต, หย่าร้าง
  occupation?: string;
  position?: string;
  monthly_income?: number;
  workplace?: string;
  workplace_province?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 5: Guardian (ผู้อุปการะ)
// ============================================================================

export interface ApplicationGuardian {
  guardian_id?: string;
  application_id: number;
  prefix?: string;
  first_name: string;
  last_name: string;
  relationship: string;
  address?: string;
  phone?: string;
  occupation?: string;
  position?: string;
  workplace?: string;
  workplace_phone?: string;
  monthly_income?: number;
  debts?: number;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 6: Siblings (พี่น้อง)
// ============================================================================

export interface ApplicationSibling {
  sibling_id?: string;
  application_id: number;
  prefix?: string;
  first_name: string;
  last_name: string;
  age?: number;
  education_level?: string;
  occupation?: string;
  status?: string; // กำลังศึกษา, ทำงาน, อื่นๆ
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 7: Living Situation (สภาพความเป็นอยู่)
// ============================================================================

export interface ApplicationLivingSituation {
  living_id?: string;
  application_id: number;
  house_type?: string; // บ้านเดี่ยว, ทาวน์เฮาส์, คอนโด, อพาร์ทเมนท์
  ownership?: string; // เป็นเจ้าของ, เช่า, อาศัย
  people_count?: number;
  has_electricity?: boolean;
  has_water?: boolean;
  area_type?: string; // ชุมชนเมือง, ชนบท, ห่างไกล
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 8: Financial Information (ข้อมูลทางการเงิน)
// ============================================================================

export interface ApplicationFinancialInfo {
  financial_id?: string;
  application_id: number;
  total_family_income?: number;
  monthly_expenses?: number;
  debt_amount?: number;
  num_dependents?: number;
  has_other_income?: boolean;
  other_income_details?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 9: Assets (ทรัพย์สินและหนี้สิน)
// ============================================================================

export interface ApplicationAsset {
  asset_id?: string;
  application_id: number;
  asset_type: string; // บ้าน, ที่ดิน, รถยนต์, อื่นๆ
  description?: string;
  estimated_value?: number;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 10: Scholarship History (ประวัติการรับทุน)
// ============================================================================

export interface ApplicationScholarshipHistory {
  history_id?: string;
  application_id: number;
  scholarship_name: string;
  amount: number;
  year_received: number;
  source?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 11: Activities (กิจกรรม/ผลงาน)
// ============================================================================

export interface ApplicationActivity {
  activity_id?: string;
  application_id: number;
  activity_type: string; // กิจกรรมชุมชน, กีฬา, วิชาการ, อื่นๆ
  activity_name: string;
  role?: string;
  year?: number;
  hours?: number;
  achievement?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 12: References (ผู้ให้ข้อมูลอ้างอิง)
// ============================================================================

export interface ApplicationReference {
  reference_id?: string;
  application_id: number;
  prefix?: string;
  first_name: string;
  last_name: string;
  position?: string;
  organization?: string;
  phone?: string;
  email?: string;
  relationship?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 13: Health Information (ข้อมูลสุขภาพ)
// ============================================================================

export interface ApplicationHealthInfo {
  health_id?: string;
  application_id: number;
  has_chronic_disease?: boolean;
  chronic_disease_details?: string;
  has_disability?: boolean;
  disability_details?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 14: Funding Needs (ความต้องการใช้ทุน)
// ============================================================================

export interface ApplicationFundingNeeds {
  funding_id?: string;
  application_id: number;
  tuition_fee?: number;
  living_expenses?: number;
  books_supplies?: number;
  other_expenses?: number;
  total_needed?: number;
  justification?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 15: House Documents (เอกสารบ้าน)
// ============================================================================

export interface ApplicationHouseDocument {
  document_id?: string;
  application_id: number;
  document_type: string; // ทะเบียนบ้าน, รูปบ้าน
  document_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Section 16: Income Certificates (หนังสือรับรองรายได้)
// ============================================================================

export interface ApplicationIncomeCertificate {
  certificate_id?: string;
  application_id: number;
  certificate_type: string; // บิดา, มารดา, ผู้ปกครอง
  document_url?: string;
  issued_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Complete Application Form (all 18 sections)
// ============================================================================

export interface CompleteApplicationForm {
  application?: ScholarshipApplication;
  personal_info?: ApplicationPersonalInfo;
  addresses?: ApplicationAddress[];
  education_history?: ApplicationEducationHistory[];
  family_members?: ApplicationFamilyMember[];
  assets?: ApplicationAsset[];
  guardians?: ApplicationGuardian[];
  siblings?: ApplicationSibling[];
  living_situation?: ApplicationLivingSituation;
  financial_info?: ApplicationFinancialInfo;
  scholarship_history?: ApplicationScholarshipHistory[];
  activities?: ApplicationActivity[];
  references?: ApplicationReference[];
  health_info?: ApplicationHealthInfo;
  funding_needs?: ApplicationFundingNeeds;
  house_documents?: ApplicationHouseDocument[];
  income_certificates?: ApplicationIncomeCertificate[];
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface SavePersonalInfoRequest {
  personal_info: ApplicationPersonalInfo;
}

export interface SaveAddressesRequest {
  addresses: ApplicationAddress[];
}

export interface SaveEducationRequest {
  education_history: ApplicationEducationHistory[];
}

export interface SaveFamilyRequest {
  family_members: ApplicationFamilyMember[];
  guardians?: ApplicationGuardian[];
  siblings?: ApplicationSibling[];
  living_situation?: ApplicationLivingSituation;
}

export interface SaveFinancialRequest {
  financial_info: ApplicationFinancialInfo;
  assets?: ApplicationAsset[];
  scholarship_history?: ApplicationScholarshipHistory[];
  health_info?: ApplicationHealthInfo;
  funding_needs?: ApplicationFundingNeeds;
}

export interface SaveActivitiesRequest {
  activities: ApplicationActivity[];
  references?: ApplicationReference[];
}

export interface SaveCompleteFormRequest {
  complete_form: CompleteApplicationForm;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ============================================================================
// Form State Types
// ============================================================================

export type FormSection =
  | 'personal'
  | 'address'
  | 'education'
  | 'family'
  | 'guardian'
  | 'sibling'
  | 'living'
  | 'financial'
  | 'assets'
  | 'scholarship_history'
  | 'activities'
  | 'references'
  | 'health'
  | 'funding'
  | 'house_documents'
  | 'income_certificates'
  | 'review';

export interface FormProgress {
  currentSection: FormSection;
  completedSections: FormSection[];
  isDirty: boolean;
  lastSaved?: string;
}
