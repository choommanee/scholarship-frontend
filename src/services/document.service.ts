import { apiClient } from '@/utils/api';

export interface DocumentUpload {
  document_id: number;
  document_type: string;
  file_name: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  upload_status: string;
  verification_status: string;
  is_required: boolean;
  uploaded_at?: string;
  created_at: string;
}

export interface DocumentTypeInfo {
  type: string;
  label: string;
  required: boolean;
  maxSize: number;
  acceptedFormats: string[];
  description?: string;
}

class DocumentService {
  // Document type definitions
  private readonly DOCUMENT_TYPES: Record<string, DocumentTypeInfo> = {
    id_card: {
      type: 'id_card',
      label: 'บัตรประชาชน',
      required: true,
      maxSize: 5 * 1024 * 1024, // 5MB
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
      description: 'สำเนาบัตรประชาชน'
    },
    transcript: {
      type: 'transcript',
      label: 'ใบแสดงผลการเรียน',
      required: true,
      maxSize: 10 * 1024 * 1024, // 10MB
      acceptedFormats: ['application/pdf'],
      description: 'Transcript ฉบับจริง'
    },
    house_registration: {
      type: 'house_registration',
      label: 'ทะเบียนบ้าน',
      required: true,
      maxSize: 5 * 1024 * 1024,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
      description: 'สำเนาทะเบียนบ้าน'
    },
    income_certificate: {
      type: 'income_certificate',
      label: 'หนังสือรับรองรายได้',
      required: true,
      maxSize: 5 * 1024 * 1024,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
      description: 'หนังสือรับรองรายได้ครอบครัว'
    },
    parent_id_card: {
      type: 'parent_id_card',
      label: 'บัตรประชาชนผู้ปกครอง',
      required: true,
      maxSize: 5 * 1024 * 1024,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
      description: 'สำเนาบัตรประชาชนบิดา/มารดา'
    },
    bank_statement: {
      type: 'bank_statement',
      label: 'หนังสือรับรองบัญชี',
      required: false,
      maxSize: 10 * 1024 * 1024,
      acceptedFormats: ['application/pdf'],
      description: 'Statement บัญชีธนาคาร (ถ้ามี)'
    },
    recommendation_letter: {
      type: 'recommendation_letter',
      label: 'จดหมายแนะนำ',
      required: false,
      maxSize: 5 * 1024 * 1024,
      acceptedFormats: ['application/pdf'],
      description: 'จดหมายแนะนำจากอาจารย์ที่ปรึกษา'
    },
    photo: {
      type: 'photo',
      label: 'รูปถ่าย',
      required: true,
      maxSize: 2 * 1024 * 1024, // 2MB
      acceptedFormats: ['image/jpeg', 'image/png'],
      description: 'รูปถ่ายหน้าตรงไม่สวมหมวก'
    },
    medical_certificate: {
      type: 'medical_certificate',
      label: 'ใบรับรองแพทย์',
      required: false,
      maxSize: 5 * 1024 * 1024,
      acceptedFormats: ['application/pdf'],
      description: 'ใบรับรองแพทย์ (ถ้ามีความจำเป็น)'
    },
    scholarship_history: {
      type: 'scholarship_history',
      label: 'หลักฐานการได้รับทุน',
      required: false,
      maxSize: 5 * 1024 * 1024,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
      description: 'หลักฐานการได้รับทุนในอดีต (ถ้ามี)'
    },
    activity_certificate: {
      type: 'activity_certificate',
      label: 'หลักฐานกิจกรรม',
      required: false,
      maxSize: 10 * 1024 * 1024,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
      description: 'ใบประกาศนียบัตรกิจกรรม/รางวัล'
    },
    other: {
      type: 'other',
      label: 'เอกสารอื่นๆ',
      required: false,
      maxSize: 10 * 1024 * 1024,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
      description: 'เอกสารเพิ่มเติมอื่นๆ'
    }
  };

  // Get document type info
  getDocumentTypeInfo(documentType: string): DocumentTypeInfo {
    return this.DOCUMENT_TYPES[documentType] || this.DOCUMENT_TYPES.other;
  }

  // Get all document types
  getAllDocumentTypes(): DocumentTypeInfo[] {
    return Object.values(this.DOCUMENT_TYPES);
  }

  // Get required document types
  getRequiredDocumentTypes(): DocumentTypeInfo[] {
    return Object.values(this.DOCUMENT_TYPES).filter(doc => doc.required);
  }

  // Upload document
  async uploadDocument(
    applicationId: number,
    file: File,
    documentType: string,
    isRequired: boolean = false
  ): Promise<DocumentUpload> {
    try {
      // Validate file first
      const validation = this.validateFile(file, documentType);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);
      formData.append('is_required', isRequired.toString());

      const response = await apiClient.post<any>(
        `/documents/applications/${applicationId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return this.mapDocumentFromAPI(response);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get application documents
  async getDocuments(applicationId: number): Promise<DocumentUpload[]> {
    try {
      const response = await apiClient.get<any>(
        `/documents/applications/${applicationId}`
      );
      const documents = response.documents || [];
      return documents.map((doc: any) => this.mapDocumentFromAPI(doc));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete document
  async deleteDocument(documentId: number): Promise<void> {
    try {
      await apiClient.delete(`/documents/${documentId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Download document
  async downloadDocument(documentId: number): Promise<Blob> {
    try {
      const response = await apiClient.get(
        `/documents/${documentId}/download`,
        { responseType: 'blob' } as any
      );
      return response as any;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Validate file
  validateFile(
    file: File,
    documentType: string
  ): { valid: boolean; error?: string } {
    const docInfo = this.getDocumentTypeInfo(documentType);

    // Check file type
    if (!docInfo.acceptedFormats.includes(file.type)) {
      const formats = docInfo.acceptedFormats
        .map(f => f.split('/')[1].toUpperCase())
        .join(', ');
      return {
        valid: false,
        error: `ไฟล์ต้องเป็น ${formats} เท่านั้น`
      };
    }

    // Check file size
    if (file.size > docInfo.maxSize) {
      const maxSizeMB = docInfo.maxSize / 1024 / 1024;
      return {
        valid: false,
        error: `ไฟล์มีขนาดเกิน ${maxSizeMB} MB`
      };
    }

    return { valid: true };
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Check if all required documents are uploaded
  checkRequiredDocuments(documents: DocumentUpload[]): {
    allUploaded: boolean;
    missing: string[];
  } {
    const requiredTypes = this.getRequiredDocumentTypes();
    const uploadedTypes = new Set(documents.map(doc => doc.document_type));

    const missing = requiredTypes
      .filter(type => !uploadedTypes.has(type.type))
      .map(type => type.label);

    return {
      allUploaded: missing.length === 0,
      missing
    };
  }

  // Map API response to DocumentUpload
  private mapDocumentFromAPI(apiDoc: any): DocumentUpload {
    return {
      document_id: apiDoc.document_id || 0,
      document_type: apiDoc.document_type || '',
      file_name: apiDoc.file_name || apiDoc.original_filename || '',
      original_filename: apiDoc.original_filename || apiDoc.file_name || '',
      file_path: apiDoc.file_path || '',
      file_size: apiDoc.file_size || 0,
      mime_type: apiDoc.mime_type || '',
      upload_status: apiDoc.upload_status || 'uploaded',
      verification_status: apiDoc.verification_status || 'pending',
      is_required: apiDoc.is_required || false,
      uploaded_at: apiDoc.uploaded_at || apiDoc.created_at,
      created_at: apiDoc.created_at || new Date().toISOString()
    };
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error.response?.status === 413) {
      return new Error('ไฟล์มีขนาดใหญ่เกินไป');
    }

    if (error.response?.status === 415) {
      return new Error('ประเภทไฟล์ไม่ถูกต้อง');
    }

    if (error.response?.status >= 500) {
      return new Error('เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง');
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error('เกิดข้อผิดพลาดในการจัดการเอกสาร');
  }
}

export const documentService = new DocumentService();
