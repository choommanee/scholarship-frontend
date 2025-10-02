'use client';

import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ShieldCheckIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  permissions: Permission[];
}

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role | null;
  permissions: Permission[];
}

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role | null;
}

// Create Role Modal
export function CreateRoleModal({ isOpen, onClose, onSuccess, permissions }: CreateRoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    permissions: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        displayName: '',
        description: '',
        permissions: []
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากระบุชื่อบทบาท (ภาษาอังกฤษ)';
    } else if (!/^[a-z_]+$/.test(formData.name)) {
      newErrors.name = 'ชื่อบทบาทต้องเป็นตัวพิมพ์เล็กและ _ เท่านั้น';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'กรุณากระบุชื่อแสดง';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'กรุณากระบุคำอธิบาย';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'กรุณาเลือกสิทธิ์อย่างน้อย 1 รายการ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // await roleService.createRole(formData);

      console.log('Creating role:', formData);

      toast.success('สร้างบทบาทเรียบร้อยแล้ว');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Create role error:', error);
      toast.error('ไม่สามารถสร้างบทบาทได้');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const toggleCategory = (category: string) => {
    const categoryPermissions = permissions
      .filter(p => p.category === category)
      .map(p => p.id);

    const allSelected = categoryPermissions.every(id =>
      formData.permissions.includes(id)
    );

    if (allSelected) {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !categoryPermissions.includes(id))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermissions])]
      }));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      system: 'text-red-600 bg-red-50 border-red-200',
      user: 'text-blue-600 bg-blue-50 border-blue-200',
      scholarship: 'text-green-600 bg-green-50 border-green-200',
      interview: 'text-purple-600 bg-purple-50 border-purple-200',
      document: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      report: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    };
    return colors[category] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      system: 'ระบบ',
      user: 'ผู้ใช้',
      scholarship: 'ทุนการศึกษา',
      interview: 'การสัมภาษณ์',
      document: 'เอกสาร',
      report: 'รายงาน'
    };
    return names[category] || category;
  };

  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900 font-sarabun">สร้างบทบาทใหม่</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                ชื่อบทบาท (ภาษาอังกฤษ) <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase() })}
                placeholder="เช่น scholarship_reviewer"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 font-sarabun">
                ใช้ตัวพิมพ์เล็กและ _ เท่านั้น
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                ชื่อแสดง <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="เช่น ผู้ตรวจสอบทุนการศึกษา"
                className={errors.displayName ? 'border-red-500' : ''}
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.displayName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
              คำอธิบาย <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 font-sarabun`}
              placeholder="อธิบายหน้าที่และความรับผิดชอบของบทบาทนี้"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.description}</p>
            )}
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 font-sarabun">
              สิทธิ์การเข้าถึง <span className="text-red-500">*</span>
            </label>
            {errors.permissions && (
              <p className="mb-2 text-sm text-red-600 font-sarabun">{errors.permissions}</p>
            )}

            <div className="space-y-4">
              {Object.entries(permissionsByCategory).map(([category, perms]) => {
                const allSelected = perms.every(p => formData.permissions.includes(p.id));
                const someSelected = perms.some(p => formData.permissions.includes(p.id));

                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)} font-sarabun`}>
                        {getCategoryDisplayName(category)} ({perms.length})
                      </span>
                    </div>

                    <div className="ml-7 space-y-2">
                      {perms.map((permission) => (
                        <label key={permission.id} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 font-sarabun">
                            {permission.description}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-sarabun">
                <CheckIcon className="h-4 w-4 inline mr-1" />
                เลือกแล้ว: {formData.permissions.length} สิทธิ์
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="font-sarabun"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="font-sarabun"
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างบทบาท'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Role Modal
export function EditRoleModal({ isOpen, onClose, onSuccess, role, permissions }: EditRoleModalProps) {
  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    permissions: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && role) {
      setFormData({
        displayName: role.displayName,
        description: role.description,
        permissions: role.permissions
      });
      setErrors({});
    }
  }, [isOpen, role]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'กรุณากระบุชื่อแสดง';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'กรุณากระบุคำอธิบาย';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'กรุณาเลือกสิทธิ์อย่างน้อย 1 รายการ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !role) return;

    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // await roleService.updateRole(role.id, formData);

      console.log('Updating role:', role.id, formData);

      toast.success('อัปเดตบทบาทเรียบร้อยแล้ว');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Update role error:', error);
      toast.error('ไม่สามารถอัปเดตบทบาทได้');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const toggleCategory = (category: string) => {
    const categoryPermissions = permissions
      .filter(p => p.category === category)
      .map(p => p.id);

    const allSelected = categoryPermissions.every(id =>
      formData.permissions.includes(id)
    );

    if (allSelected) {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !categoryPermissions.includes(id))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermissions])]
      }));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      system: 'text-red-600 bg-red-50 border-red-200',
      user: 'text-blue-600 bg-blue-50 border-blue-200',
      scholarship: 'text-green-600 bg-green-50 border-green-200',
      interview: 'text-purple-600 bg-purple-50 border-purple-200',
      document: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      report: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    };
    return colors[category] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      system: 'ระบบ',
      user: 'ผู้ใช้',
      scholarship: 'ทุนการศึกษา',
      interview: 'การสัมภาษณ์',
      document: 'เอกสาร',
      report: 'รายงาน'
    };
    return names[category] || category;
  };

  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-sarabun">แก้ไขบทบาท</h2>
              <p className="text-sm text-gray-500 font-sarabun">{role.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {role.isSystem && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 font-sarabun">บทบาทระบบ</h3>
                <p className="mt-1 text-sm text-yellow-700 font-sarabun">
                  นี่คือบทบาทระบบ คุณไม่สามารถเปลี่ยนชื่อหรือลบได้ แต่สามารถปรับสิทธิ์ได้
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                ชื่อแสดง <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className={errors.displayName ? 'border-red-500' : ''}
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.displayName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
                คำอธิบาย <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 font-sarabun`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 font-sarabun">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 font-sarabun">
              สิทธิ์การเข้าถึง <span className="text-red-500">*</span>
            </label>
            {errors.permissions && (
              <p className="mb-2 text-sm text-red-600 font-sarabun">{errors.permissions}</p>
            )}

            <div className="space-y-4">
              {Object.entries(permissionsByCategory).map(([category, perms]) => {
                const allSelected = perms.every(p => formData.permissions.includes(p.id));

                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)} font-sarabun`}>
                        {getCategoryDisplayName(category)} ({perms.length})
                      </span>
                    </div>

                    <div className="ml-7 space-y-2">
                      {perms.map((permission) => (
                        <label key={permission.id} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 font-sarabun">
                            {permission.description}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-sarabun">
                <CheckIcon className="h-4 w-4 inline mr-1" />
                เลือกแล้ว: {formData.permissions.length} สิทธิ์
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="font-sarabun"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="font-sarabun"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Role Modal
export function DeleteRoleModal({ isOpen, onClose, onSuccess, role }: DeleteRoleModalProps) {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (!role || confirmText !== role.name) return;

    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // await roleService.deleteRole(role.id);

      console.log('Deleting role:', role.id);

      toast.success('ลบบทบาทเรียบร้อยแล้ว');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Delete role error:', error);
      toast.error('ไม่สามารถลบบทบาทได้');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900 font-sarabun">ยืนยันการลบบทบาท</h3>
              <p className="text-sm text-gray-500 font-sarabun">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 font-sarabun mb-2">
              คุณกำลังจะลบบทบาท: <strong>{role.displayName}</strong>
            </p>
            <p className="text-sm text-red-700 font-sarabun">
              มีผู้ใช้ {role.userCount} คนที่ใช้บทบาทนี้อยู่ พวกเขาจะถูกลบบทบาทออกทันที
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sarabun">
              พิมพ์ชื่อบทบาท "<strong>{role.name}</strong>" เพื่อยืนยัน:
            </label>
            <Input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={role.name}
              className="font-mono"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="font-sarabun"
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={loading || confirmText !== role.name}
              className="font-sarabun"
            >
              {loading ? 'กำลังลบ...' : 'ลบบทบาท'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
