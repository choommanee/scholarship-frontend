import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { CreateUserRequest } from '@/services/user.service';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserRequest) => Promise<void>;
  isLoading?: boolean;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password_hash: '',
    role: 'user',
    student_id: '',
    employee_id: '',
    faculty: '',
    department: '',
    address: '',
    notes: ''
  });

  const [sendEmail, setSendEmail] = useState(true);
  const [forcePasswordChange, setForcePasswordChange] = useState(true);

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.first_name || !formData.last_name) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        password_hash: '',
        role: 'user',
        student_id: '',
        employee_id: '',
        faculty: '',
        department: '',
        address: '',
        notes: ''
      });
      onClose();
    } catch (error) {
      console.error('Create user error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-sarabun">เพิ่มผู้ใช้ใหม่</CardTitle>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ข้อมูลส่วนตัว */}
            <div className="border-b border-secondary-200 pb-4">
              <h3 className="text-lg font-medium text-secondary-900 mb-4 font-sarabun">ข้อมูลส่วนตัว</h3>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
            </div>

            {/* บทบาทและหน่วยงาน */}
            <div className="border-b border-secondary-200 pb-4">
              <h3 className="text-lg font-medium text-secondary-900 mb-4 font-sarabun">บทบาทและหน่วยงาน</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                    บทบาท
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                  >
                    <option value="">เลือกบทบาท</option>
                    <option value="admin">ผู้ดูแลระบบ</option>
                    <option value="committee">คณะกรรมการ</option>
                    <option value="student">นักศึกษา</option>
                    <option value="staff">เจ้าหน้าที่</option>
                    <option value="user">ผู้ใช้ทั่วไป</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                    หน่วยงาน
                  </label>
                  <select
                    value={formData.faculty || ''}
                    onChange={(e) => handleInputChange('faculty', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                  >
                    <option value="">เลือกหน่วยงาน</option>
                    <option value="คณะแพทยศาสตร์">คณะแพทยศาสตร์</option>
                    <option value="คณะวิศวกรรมศาสตร์">คณะวิศวกรรมศาสตร์</option>
                    <option value="คณะวิทยาศาสตร์">คณะวิทยาศาสตร์</option>
                    <option value="คณะทันตแพทยศาสตร์">คณะทันตแพทยศาสตร์</option>
                    <option value="คณะเภสัชศาสตร์">คณะเภสัชศาสตร์</option>
                    <option value="คณะสาธารณสุขศาสตร์">คณะสาธารณสุขศาสตร์</option>
                    <option value="คณะพยาบาลศาสตร์">คณะพยาบาลศาสตร์</option>
                    <option value="คณะเทคนิคการแพทย์">คณะเทคนิคการแพทย์</option>
                    <option value="คณะสิ่งแวดล้อมและทรัพยากรศาสตร์">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์</option>
                    <option value="คณะสังคมศาสตร์และมนุษยศาสตร์">คณะสังคมศาสตร์และมนุษยศาสตร์</option>
                    <option value="วิทยาลัยดุริยางคศิลป์">วิทยาลัยดุริยางคศิลป์</option>
                    <option value="วิทยาลัยการจัดการ">วิทยาลัยการจัดการ</option>
                    <option value="วิทยาลัยนานาชาติ">วิทยาลัยนานาชาติ</option>
                    <option value="สำนักงานอธิการบดี">สำนักงานอธิการบดี</option>
                  </select>
                </div>
              </div>
            </div>

            {/* รหัสประจำตัว */}
            <div className="border-b border-secondary-200 pb-4">
              <h3 className="text-lg font-medium text-secondary-900 mb-4 font-sarabun">รหัสประจำตัว (สำหรับนักศึกษา)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="รหัสนักศึกษา (สำหรับนักศึกษา)"
                  placeholder="6388001"
                  value={formData.student_id || ''}
                  onChange={(e) => handleInputChange('student_id', e.target.value)}
                />
                <Input
                  label="เบอร์โทรศัพท์"
                  placeholder="02-441-9000"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="mt-4">
                <Input
                  label="รหัสเจ้าหน้าที่ (สำหรับเจ้าหน้าที่)"
                  placeholder="รหัสเจ้าหน้าที่หรือรหัสประจำตัวบุคลากร"
                  value={formData.employee_id || ''}
                  onChange={(e) => handleInputChange('employee_id', e.target.value)}
                />
              </div>
            </div>

            {/* ข้อมูลเพิ่มเติม */}
            <div className="border-b border-secondary-200 pb-4">
              <h3 className="text-lg font-medium text-secondary-900 mb-4 font-sarabun">รายละเอียดเพิ่มเติม</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                    ที่อยู่
                  </label>
                  <textarea
                    placeholder="ที่อยู่สำหรับติดต่อ"
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-sarabun">
                    หมายเหตุ
                  </label>
                  <textarea
                    placeholder="หมายเหตุเพิ่มเติมเกี่ยวกับผู้ใช้คนนี้"
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                  />
                </div>
              </div>
            </div>

            {/* รหัสผ่านและการตั้งค่า */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 mb-4 font-sarabun">การตั้งค่าบัญชี</h3>
              <div className="mb-4">
                <Input
                  label="รหัสผ่านชั่วคราว"
                  type="password"
                  placeholder="รหัสผ่านที่ผู้ใช้จะต้องเปลี่ยนในการเข้าสู่ระบบครั้งแรก"
                  value={formData.password_hash || ''}
                  onChange={(e) => handleInputChange('password_hash', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded" 
                  />
                  <span className="ml-2 text-sm text-secondary-700 font-sarabun">
                    ส่งข้อมูลการเข้าสู่ระบบทางอีเมล
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={forcePasswordChange}
                    onChange={(e) => setForcePasswordChange(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded" 
                  />
                  <span className="ml-2 text-sm text-secondary-700 font-sarabun">
                    บังคับเปลี่ยนรหัสผ่านในการเข้าสู่ระบบครั้งแรก
                  </span>
                </label>
              </div>
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
                {isLoading ? 'กำลังสร้าง...' : 'สร้างผู้ใช้ใหม่'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateUserModal;
