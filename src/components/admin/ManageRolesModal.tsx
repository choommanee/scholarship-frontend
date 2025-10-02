import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { User, Role, userService } from '@/services/user.service';

interface ManageRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onRoleUpdated?: () => void;
}

const ManageRolesModal: React.FC<ManageRolesModalProps> = ({
  isOpen,
  onClose,
  user,
  onRoleUpdated
}) => {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadRoles();
      if (Array.isArray(user.roles)) {
        setUserRoles(user.roles);
      }
    }
  }, [isOpen, user]);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const roles = await userService.getRoles();
      setAvailableRoles(roles);
    } catch (error) {
      console.error('Failed to load roles:', error);
      alert('ไม่สามารถโหลดข้อมูลบทบาทได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!user || !selectedRoleId) return;

    try {
      setIsAssigning(true);
      await userService.assignRole(user.user_id, { role_id: Number(selectedRoleId) });
      
      // Add role to local state
      const assignedRole = availableRoles.find(role => role.role_id === Number(selectedRoleId));
      if (assignedRole) {
        setUserRoles(prev => [...prev, {
          ...assignedRole,
          assigned_at: new Date().toISOString()
        }]);
      }
      
      setSelectedRoleId('');
      onRoleUpdated?.();
      alert('กำหนดบทบาทเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Failed to assign role:', error);
      alert('ไม่สามารถกำหนดบทบาทได้');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveRole = async (roleId: number) => {
    if (!user) return;

    if (!confirm('คุณต้องการยกเลิกบทบาทนี้หรือไม่?')) return;

    try {
      await userService.removeRole(user.user_id, roleId.toString());
      
      // Remove role from local state
      setUserRoles(prev => prev.filter(role => role.role_id !== roleId));
      onRoleUpdated?.();
      alert('ยกเลิกบทบาทเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Failed to remove role:', error);
      alert('ไม่สามารถยกเลิกบทบาทได้');
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'officer': return 'bg-purple-100 text-purple-800';
      case 'interviewer': return 'bg-orange-100 text-orange-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !user) return null;

  const unassignedRoles = availableRoles.filter(role => 
    !userRoles.some(userRole => userRole.role_id === role.role_id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-sarabun">
            จัดการบทบาท - {userService.formatFullName(user)}
          </CardTitle>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Current Roles */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-4">
              บทบาทปัจจุบัน
            </h3>
            {userRoles.length === 0 ? (
              <div className="text-secondary-500 text-center py-8">
                ยังไม่มีบทบาทที่กำหนด
              </div>
            ) : (
              <div className="space-y-3">
                {userRoles.map((role) => (
                  <div
                    key={role.role_id}
                    className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`text-sm px-3 py-1 rounded-full ${getRoleColor(role.role_name)}`}>
                          {role.role_name}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600">{role.role_description}</p>
                      <p className="text-xs text-secondary-500 mt-1">
                        กำหนดเมื่อ: {new Date(role.assigned_at).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveRole(role.role_id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300 font-sarabun"
                    >
                      ยกเลิก
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assign New Role */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 font-sarabun mb-4">
              กำหนดบทบาทใหม่
            </h3>
            {unassignedRoles.length === 0 ? (
              <div className="text-secondary-500 text-center py-8">
                ไม่มีบทบาทอื่นที่สามารถกำหนดได้
              </div>
            ) : (
              <div className="flex space-x-3">
                <div className="flex-1">
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-sarabun"
                    disabled={isLoading}
                  >
                    <option value="">เลือกบทบาทที่ต้องการกำหนด</option>
                    {unassignedRoles.map((role) => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name} - {role.role_description}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="primary"
                  onClick={handleAssignRole}
                  disabled={!selectedRoleId || isAssigning}
                  className="font-sarabun"
                >
                  {isAssigning ? 'กำลังกำหนด...' : 'กำหนดบทบาท'}
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-secondary-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="font-sarabun"
            >
              ปิด
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ManageRolesModal;
