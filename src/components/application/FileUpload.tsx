'use client';

import React, { useCallback, useState } from 'react';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';
import { documentService, DocumentUpload as DocumentUploadType } from '@/services/document.service';
import toast from 'react-hot-toast';

export interface FileUploadProps {
  documentType: string;
  isRequired: boolean;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  onUpload: (file: File) => Promise<void>;
  currentFile?: DocumentUploadType;
  onDelete?: () => Promise<void>;
  applicationId?: number;
}

export function FileUpload({
  documentType,
  isRequired,
  maxSizeMB,
  acceptedTypes,
  onUpload,
  currentFile,
  onDelete,
  applicationId
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const docInfo = documentService.getDocumentTypeInfo(documentType);
  const maxSize = maxSizeMB ? maxSizeMB * 1024 * 1024 : docInfo.maxSize;
  const accepted = acceptedTypes || docInfo.acceptedFormats;

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (!accepted.includes(file.type)) {
      const formats = accepted.map(f => f.split('/')[1].toUpperCase()).join(', ');
      setError(`ไฟล์ต้องเป็น ${formats} เท่านั้น`);
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / 1024 / 1024;
      setError(`ไฟล์มีขนาดเกิน ${maxSizeMB} MB`);
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(file);

      clearInterval(progressInterval);
      setUploadProgress(100);
      toast.success('อัปโหลดไฟล์สำเร็จ');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
      toast.error(err.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  }, [onUpload]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmed = window.confirm('คุณต้องการลบไฟล์นี้หรือไม่?');
    if (!confirmed) return;

    try {
      await onDelete();
      toast.success('ลบไฟล์สำเร็จ');
    } catch (err: any) {
      toast.error(err.message || 'เกิดข้อผิดพลาดในการลบไฟล์');
    }
  };

  const getFileIcon = () => {
    if (currentFile?.mime_type?.includes('image')) {
      return (
        <img
          src={currentFile.file_path}
          alt={currentFile.original_filename}
          className="h-full w-full object-cover rounded-lg"
        />
      );
    }
    return <DocumentIcon className="h-12 w-12 text-primary-600" />;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {docInfo.label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        {currentFile && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            อัปโหลดแล้ว
          </span>
        )}
      </div>

      {docInfo.description && (
        <p className="text-xs text-gray-500 mb-2">{docInfo.description}</p>
      )}

      {currentFile ? (
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                {getFileIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentFile.original_filename}
                </p>
                <p className="text-xs text-gray-500">
                  {documentService.formatFileSize(currentFile.file_size)}
                </p>
                {currentFile.uploaded_at && (
                  <p className="text-xs text-gray-400">
                    อัปโหลดเมื่อ: {new Date(currentFile.uploaded_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="ลบไฟล์"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
            isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400',
            error && 'border-red-500 bg-red-50'
          )}
        >
          <input
            type="file"
            id={`file-${documentType}`}
            className="hidden"
            accept={accepted.join(',')}
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          <label htmlFor={`file-${documentType}`} className="cursor-pointer">
            <CloudArrowUpIcon className={cn(
              'mx-auto h-12 w-12 mb-3',
              isDragging ? 'text-primary-500' : 'text-gray-400'
            )} />

            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-primary-600">คลิกเพื่อเลือกไฟล์</span>
              {' '}หรือลากไฟล์มาวางที่นี่
            </p>

            <p className="text-xs text-gray-500">
              รองรับ: {accepted.map(f => f.split('/')[1].toUpperCase()).join(', ')}
              {' '}(สูงสุด {(maxSize / 1024 / 1024).toFixed(0)} MB)
            </p>
          </label>

          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-600 h-2 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">กำลังอัปโหลด... {uploadProgress}%</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}
