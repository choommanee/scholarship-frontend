'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileUpload } from '@/components/application/FileUpload';
import { documentService, DocumentUpload } from '@/services/document.service';
import { DocumentIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export interface Step7DocumentsProps {
  applicationId?: number;
  onDocumentsChange?: (documents: DocumentUpload[]) => void;
  errors: Record<string, string>;
}

export function Step7Documents({ applicationId, onDocumentsChange, errors }: Step7DocumentsProps) {
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const allDocumentTypes = documentService.getAllDocumentTypes();
  const requiredTypes = documentService.getRequiredDocumentTypes();

  // Load existing documents
  useEffect(() => {
    if (applicationId) {
      loadDocuments();
    }
  }, [applicationId]);

  const loadDocuments = async () => {
    if (!applicationId) return;

    setIsLoading(true);
    try {
      const docs = await documentService.getDocuments(applicationId);
      setDocuments(docs);
      onDocumentsChange?.(docs);
    } catch (error: any) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File, documentType: string, isRequired: boolean) => {
    if (!applicationId) {
      toast.error('กรุณาบันทึกแบบร่างก่อนอัปโหลดเอกสาร');
      return;
    }

    try {
      const uploadedDoc = await documentService.uploadDocument(
        applicationId,
        file,
        documentType,
        isRequired
      );

      setDocuments(prev => {
        // Remove old document of same type (if exists)
        const filtered = prev.filter(d => d.document_type !== documentType);
        return [...filtered, uploadedDoc];
      });

      onDocumentsChange?.([...documents.filter(d => d.document_type !== documentType), uploadedDoc]);
    } catch (error: any) {
      throw error;
    }
  };

  const handleDelete = async (documentId: number, documentType: string) => {
    try {
      await documentService.deleteDocument(documentId);

      setDocuments(prev => prev.filter(d => d.document_id !== documentId));
      onDocumentsChange?.(documents.filter(d => d.document_id !== documentId));
    } catch (error: any) {
      throw error;
    }
  };

  const getDocumentByType = (documentType: string): DocumentUpload | undefined => {
    return documents.find(d => d.document_type === documentType);
  };

  const calculateProgress = (): { uploaded: number; total: number; percentage: number } => {
    const uploadedRequired = requiredTypes.filter(type =>
      documents.some(d => d.document_type === type.type)
    ).length;

    return {
      uploaded: uploadedRequired,
      total: requiredTypes.length,
      percentage: Math.round((uploadedRequired / requiredTypes.length) * 100)
    };
  };

  const progress = calculateProgress();
  const missingRequired = documentService.checkRequiredDocuments(documents);

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DocumentIcon className="h-6 w-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">เอกสารประกอบการสมัคร</h3>
            </div>
            <Badge color={progress.percentage === 100 ? 'success' : 'warning'}>
              {progress.uploaded} / {progress.total} เอกสารบังคับ
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>ความคืบหน้าการอัปโหลด</span>
              <span className="font-semibold">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  progress.percentage === 100
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600'
                }`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Missing Documents Alert */}
          {!missingRequired.allUploaded && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">
                    ยังไม่ครบเอกสารบังคับ
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    กรุณาอัปโหลดเอกสารที่ยังขาดหาย: {missingRequired.missing.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {missingRequired.allUploaded && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">
                    เอกสารครบถ้วน
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    ท่านได้อัปโหลดเอกสารบังคับครบถ้วนแล้ว สามารถดำเนินการต่อได้
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Required Documents */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2">บังคับ</span>
          เอกสารที่ต้องอัปโหลด
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredTypes.map((docType) => (
            <Card key={docType.type}>
              <CardBody>
                <FileUpload
                  documentType={docType.type}
                  isRequired={true}
                  applicationId={applicationId}
                  currentFile={getDocumentByType(docType.type)}
                  onUpload={(file) => handleUpload(file, docType.type, true)}
                  onDelete={() => {
                    const doc = getDocumentByType(docType.type);
                    if (doc) {
                      return handleDelete(doc.document_id, docType.type);
                    }
                    return Promise.resolve();
                  }}
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2">ไม่บังคับ</span>
          เอกสารเพิ่มเติม (ถ้ามี)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allDocumentTypes
            .filter(docType => !docType.required)
            .map((docType) => (
              <Card key={docType.type}>
                <CardBody>
                  <FileUpload
                    documentType={docType.type}
                    isRequired={false}
                    applicationId={applicationId}
                    currentFile={getDocumentByType(docType.type)}
                    onUpload={(file) => handleUpload(file, docType.type, false)}
                    onDelete={() => {
                      const doc = getDocumentByType(docType.type);
                      if (doc) {
                        return handleDelete(doc.document_id, docType.type);
                      }
                      return Promise.resolve();
                    }}
                  />
                </CardBody>
              </Card>
            ))}
        </div>
      </div>

      {/* Helper Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">ข้อกำหนดการอัปโหลดเอกสาร</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>รองรับไฟล์ PDF, JPG, PNG เท่านั้น</li>
                <li>ขนาดไฟล์ไม่เกิน 10 MB ต่อไฟล์</li>
                <li>เอกสารต้องชัดเจน อ่านได้ และเป็นฉบับจริง</li>
                <li>สำเนาเอกสารต้องลงนามรับรองสำเนาถูกต้อง</li>
                <li>หากอัปโหลดผิดพลาด สามารถลบและอัปโหลดใหม่ได้</li>
                <li>ระบบจะตรวจสอบเอกสารหลังจากท่านส่งใบสมัคร</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">คำเตือนสำคัญ</h3>
            <p className="text-sm text-red-700 mt-1">
              การปลอมแปลงเอกสารหรือให้ข้อมูลเท็จ จะถูกดำเนินคดีตามกฎหมาย
              และถูกยกเลิกทุนการศึกษาทันที โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
