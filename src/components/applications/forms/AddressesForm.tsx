'use client';

import { useState } from 'react';
import { ApplicationAddress } from '@/types/application';

interface AddressesFormProps {
  data?: ApplicationAddress[];
  onSave: (data: ApplicationAddress[]) => Promise<void>;
  onNext?: () => void;
  onBack?: () => void;
}

export default function AddressesForm({ data, onSave, onNext, onBack }: AddressesFormProps) {
  const [addresses, setAddresses] = useState<ApplicationAddress[]>(
    data && data.length > 0
      ? data
      : [
          {
            application_id: 0,
            address_type: 'current',
            house_number: '',
            village_no: '',
            village_name: '',
            alley: '',
            road: '',
            sub_district: '',
            district: '',
            province: '',
            postal_code: '',
          },
          {
            application_id: 0,
            address_type: 'permanent',
            house_number: '',
            village_no: '',
            village_name: '',
            alley: '',
            road: '',
            sub_district: '',
            district: '',
            province: '',
            postal_code: '',
          },
        ]
  );

  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    addresses.forEach((addr, index) => {
      const prefix = `${addr.address_type}_`;
      if (!addr.house_number) newErrors[`${prefix}house_number`] = 'กรุณากรอกบ้านเลขที่';
      if (!addr.sub_district) newErrors[`${prefix}sub_district`] = 'กรุณากรอกตำบล/แขวง';
      if (!addr.district) newErrors[`${prefix}district`] = 'กรุณากรอกอำเภอ/เขต';
      if (!addr.province) newErrors[`${prefix}province`] = 'กรุณากรอกจังหวัด';
      if (!addr.postal_code) newErrors[`${prefix}postal_code`] = 'กรุณากรอกรหัสไปรษณีย์';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(addresses);
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error('Failed to save addresses:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (index: number, field: keyof ApplicationAddress, value: any) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);

    // Clear errors
    const errorKey = `${newAddresses[index].address_type}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleSameAddressChange = (checked: boolean) => {
    setSameAsCurrentAddress(checked);
    if (checked && addresses.length >= 2) {
      // Copy current address to permanent address
      const currentAddr = addresses[0];
      const newAddresses = [...addresses];
      newAddresses[1] = {
        ...currentAddr,
        address_id: addresses[1].address_id, // Keep original ID if exists
        address_type: 'permanent',
      };
      setAddresses(newAddresses);
    }
  };

  const renderAddressForm = (address: ApplicationAddress, index: number, title: string) => {
    const isDisabled = index === 1 && sameAsCurrentAddress;
    const prefix = `${address.address_type}_`;

    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        {index === 1 && (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sameAsCurrentAddress}
                onChange={(e) => handleSameAddressChange(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">ที่อยู่ตามภูมิลำเนาเดียวกับที่อยู่ปัจจุบัน</span>
            </label>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              บ้านเลขที่ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.house_number || ''}
              onChange={(e) => handleAddressChange(index, 'house_number', e.target.value)}
              disabled={isDisabled}
              className={`w-full px-3 py-2 border rounded-md ${
                errors[`${prefix}house_number`] ? 'border-red-500' : 'border-gray-300'
              } ${isDisabled ? 'bg-gray-100' : ''}`}
            />
            {errors[`${prefix}house_number`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${prefix}house_number`]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมู่ที่</label>
            <input
              type="text"
              value={address.village_no || ''}
              onChange={(e) => handleAddressChange(index, 'village_no', e.target.value)}
              disabled={isDisabled}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isDisabled ? 'bg-gray-100' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมู่บ้าน</label>
            <input
              type="text"
              value={address.village_name || ''}
              onChange={(e) => handleAddressChange(index, 'village_name', e.target.value)}
              disabled={isDisabled}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isDisabled ? 'bg-gray-100' : ''}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ซอย</label>
            <input
              type="text"
              value={address.alley || ''}
              onChange={(e) => handleAddressChange(index, 'alley', e.target.value)}
              disabled={isDisabled}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isDisabled ? 'bg-gray-100' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ถนน</label>
            <input
              type="text"
              value={address.road || ''}
              onChange={(e) => handleAddressChange(index, 'road', e.target.value)}
              disabled={isDisabled}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isDisabled ? 'bg-gray-100' : ''}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ตำบล/แขวง <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.sub_district || ''}
              onChange={(e) => handleAddressChange(index, 'sub_district', e.target.value)}
              disabled={isDisabled}
              className={`w-full px-3 py-2 border rounded-md ${
                errors[`${prefix}sub_district`] ? 'border-red-500' : 'border-gray-300'
              } ${isDisabled ? 'bg-gray-100' : ''}`}
            />
            {errors[`${prefix}sub_district`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${prefix}sub_district`]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อำเภอ/เขต <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.district || ''}
              onChange={(e) => handleAddressChange(index, 'district', e.target.value)}
              disabled={isDisabled}
              className={`w-full px-3 py-2 border rounded-md ${
                errors[`${prefix}district`] ? 'border-red-500' : 'border-gray-300'
              } ${isDisabled ? 'bg-gray-100' : ''}`}
            />
            {errors[`${prefix}district`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${prefix}district`]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จังหวัด <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.province || ''}
              onChange={(e) => handleAddressChange(index, 'province', e.target.value)}
              disabled={isDisabled}
              className={`w-full px-3 py-2 border rounded-md ${
                errors[`${prefix}province`] ? 'border-red-500' : 'border-gray-300'
              } ${isDisabled ? 'bg-gray-100' : ''}`}
            />
            {errors[`${prefix}province`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${prefix}province`]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสไปรษณีย์ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.postal_code || ''}
              onChange={(e) => handleAddressChange(index, 'postal_code', e.target.value)}
              disabled={isDisabled}
              maxLength={5}
              className={`w-full px-3 py-2 border rounded-md ${
                errors[`${prefix}postal_code`] ? 'border-red-500' : 'border-gray-300'
              } ${isDisabled ? 'bg-gray-100' : ''}`}
            />
            {errors[`${prefix}postal_code`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${prefix}postal_code`]}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderAddressForm(addresses[0], 0, 'ที่อยู่ปัจจุบัน')}
      {renderAddressForm(addresses[1], 1, 'ที่อยู่ตามภูมิลำเนา')}

      {/* Action Buttons */}
      <div className="flex justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ย้อนกลับ
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกและดำเนินการต่อ'}
        </button>
      </div>
    </form>
  );
}
