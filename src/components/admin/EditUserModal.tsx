import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { User, UpdateUserRequest } from '@/services/user.service';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string, userData: UpdateUserRequest) => Promise<void>;
  user: User | null;
  isLoading?: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    is_active: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
        is_active: user.is_active
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UpdateUserRequest, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.username || !formData.email || !formData.first_name || !formData.last_name) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    try {
      await onSubmit(user.user_id, formData);
      onClose();
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-sarabun">แก้ไขข้อมูลผู้ใช้</CardTitle>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="ชื่อ *"
                placeholder="ชื่อจริง"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
              <Input
                label="นามสกุล *"
                placeholder="นามสกุล"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="ชื่อผู้ใช้ *"
                placeholder="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
              />
              <Input
                label="อีเมล *"
                type="email"
                placeholder="email@mahidol.ac.th"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="เบอร์โทรศัพท์"
                placeholder="081-234-5678"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-secondary-700 font-sarabun mb-2">
                  สถานะการใช้งาน
                </label>
                <select
                  value={formData.is_active ? 'active' : 'inactive'}
                  onChange={(e) => handleInputChange('is_active', e.target.value === 'active')}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                >
                  <option value="active">ใช้งานได้</option>
                  <option value="inactive">ไม่ใช้งาน</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 font-sarabun">
                <strong>หมายเหตุ:</strong> การแก้ไขข้อมูลผู้ใช้จะมีผลทันที ผู้ใช้อาจต้องเข้าสู่ระบบใหม่หากข้อมูลการยืนยันตัวตนเปลี่ยนแปลง
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 font-sarabun"
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 font-sarabun"
                disabled={isLoading}
              >
                {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditUserModal;
