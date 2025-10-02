"use client";

import React, { useState, useCallback } from 'react';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  maxSize: number; // in MB
  allowedTypes: string[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
  file?: File;
}

interface DocumentUploaderProps {
  applicationId?: string;
  documentType: DocumentType;
  onUploadComplete?: (document: UploadedDocument) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  className?: string;
}

export default function DocumentUploader({
  applicationId,
  documentType,
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  className = ''
}: DocumentUploaderProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSizeBytes = documentType.maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `ไฟล์มีขนาดใหญ่เกินไป (สูงสุด ${documentType.maxSize} MB)`;
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isValidType = documentType.allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type.substring(1);
      }
      return file.type.includes(type);
    });

    if (!isValidType) {
      return `ประเภทไฟล์ไม่ถูกต้อง (รองรับ: ${documentType.allowedTypes.join(', ')})`;
    }

    return null;
  };

  // Handle file upload
  const uploadFile = async (file: File): Promise<void> => {
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newDocument: UploadedDocument = {
      id: documentId,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: 'uploading',
      file
    };

    setDocuments(prev => [...prev, newDocument]);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType.id);
      if (applicationId) {
        formData.append('application_id', applicationId);
      }

      // Simulate upload progress
      const updateProgress = (progress: number) => {
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, uploadProgress: progress }
            : doc
        ));
      };

      // Simulate upload with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(i);
      }

      // TODO: Replace with actual API call
      // const response = await apiClient.post(`/documents/applications/${applicationId}/upload`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   onUploadProgress: (progressEvent) => {
      //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     updateProgress(progress);
      //   }
      // });

      // Mock successful upload
      const uploadedDoc = {
        ...newDocument,
        uploadProgress: 100,
        status: 'success' as const
      };

      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? uploadedDoc : doc
      ));

      onUploadComplete?.(uploadedDoc);
      toast.success(`อัปโหลด ${file.name} สำเร็จ`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปโหลด';
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'error', errorMessage }
          : doc
      ));

      onUploadError?.(errorMessage);
      toast.error(`อัปโหลด ${file.name} ไม่สำเร็จ: ${errorMessage}`);
    }
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList) => {
    if (documents.length + files.length > maxFiles) {
      toast.error(`สามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์`);
      return;
    }

    setUploading(true);

    for (const file of Array.from(files)) {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(`${file.name}: ${validationError}`);
        continue;
      }

      await uploadFile(file);
    }

    setUploading(false);
  }, [documents.length, maxFiles, documentType]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Remove document
  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <Card>
        <CardBody className="p-6">
          {/* Document Type Info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-2">
              {documentType.name}
              {documentType.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </h3>
            <p className="text-sm text-secondary-600 font-sarabun mb-2">
              {documentType.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-secondary-500">
              <span>ขนาดสูงสุด: {documentType.maxSize} MB</span>
              <span>ประเภทไฟล์: {documentType.allowedTypes.join(', ')}</span>
              <span>จำนวนสูงสุด: {maxFiles} ไฟล์</span>
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-300 hover:border-secondary-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CloudArrowUpIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-secondary-900 font-sarabun mb-2">
              ลากไฟล์มาวางที่นี่ หรือ
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept={documentType.allowedTypes.join(',')}
                onChange={handleInputChange}
                className="hidden"
                disabled={uploading || documents.length >= maxFiles}
              />
              <Button
                variant="primary"
                disabled={uploading || documents.length >= maxFiles}
                className="font-sarabun"
              >
                เลือกไฟล์
              </Button>
            </label>
            <p className="text-sm text-secondary-500 font-sarabun mt-2">
              {uploading ? 'กำลังอัปโหลด...' : `เหลืออีก ${maxFiles - documents.length} ไฟล์`}
            </p>
          </div>

          {/* Uploaded Documents List */}
          {documents.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-secondary-900 font-sarabun mb-3">
                ไฟล์ที่อัปโหลด ({documents.length}/{maxFiles})
              </h4>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <DocumentIcon className="h-6 w-6 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {formatFileSize(doc.size)}
                        </p>
                        
                        {/* Progress Bar */}
                        {doc.status === 'uploading' && (
                          <div className="mt-1">
                            <div className="w-full bg-secondary-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${doc.uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-secondary-500 mt-1">
                              {doc.uploadProgress}%
                            </p>
                          </div>
                        )}

                        {/* Error Message */}
                        {doc.status === 'error' && doc.errorMessage && (
                          <p className="text-xs text-red-600 mt-1">
                            {doc.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Status Icon */}
                      {doc.status === 'success' && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )}
                      {doc.status === 'error' && (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="p-1 hover:bg-red-50 rounded-full"
                        disabled={doc.status === 'uploading'}
                        title="ลบไฟล์"
                        aria-label="ลบไฟล์"
                      >
                        <XMarkIcon className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">คำแนะนำการอัปโหลด:</p>
                <ul className="text-xs space-y-1">
                  <li>• ตรวจสอบให้แน่ใจว่าเอกสารชัดเจนและอ่านได้</li>
                  <li>• ไฟล์ PDF มีความปลอดภัยสูงสุด</li>
                  <li>• หลีกเลี่ยงการอัปโหลดไฟล์ที่มีชื่อเป็นภาษาอื่น</li>
                  <li>• สามารถอัปโหลดทีละหลายไฟล์ได้</li>
                </ul>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 