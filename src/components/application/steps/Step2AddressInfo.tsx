'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { HomeIcon } from '@heroicons/react/24/outline';

export interface AddressData {
  house_number: string;
  village_number: string;
  alley: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  postal_code: string;
  latitude: string;
  longitude: string;
}

export interface AddressInfoData {
  current_address: AddressData;
  permanent_address: AddressData;
  same_as_current: boolean;
}

export interface Step2AddressInfoProps {
  data: AddressInfoData;
  onChange: (field: 'current_address' | 'permanent_address' | 'same_as_current', value: any) => void;
  errors: Record<string, string>;
}

const emptyAddress: AddressData = {
  house_number: '',
  village_number: '',
  alley: '',
  road: '',
  subdistrict: '',
  district: '',
  province: '',
  postal_code: '',
  latitude: '',
  longitude: ''
};

export function Step2AddressInfo({ data, onChange, errors }: Step2AddressInfoProps) {
  const handleCurrentAddressChange = (field: keyof AddressData, value: string) => {
    const newAddress = { ...data.current_address, [field]: value };
    onChange('current_address', newAddress);

    // Auto-copy to permanent if checkbox is checked
    if (data.same_as_current) {
      onChange('permanent_address', newAddress);
    }
  };

  const handlePermanentAddressChange = (field: keyof AddressData, value: string) => {
    const newAddress = { ...data.permanent_address, [field]: value };
    onChange('permanent_address', newAddress);
  };

  const handleSameAddressChange = (checked: boolean) => {
    onChange('same_as_current', checked);
    if (checked) {
      onChange('permanent_address', { ...data.current_address });
    }
  };

  const renderAddressFields = (
    address: AddressData,
    onFieldChange: (field: keyof AddressData, value: string) => void,
    prefix: string,
    disabled: boolean = false
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="บ้านเลขที่"
        type="text"
        value={address.house_number}
        onChange={(e) => onFieldChange('house_number', e.target.value)}
        placeholder="เช่น 123"
        error={errors[`${prefix}.house_number`]}
        disabled={disabled}
        required
      />

      <Input
        label="หมู่ที่"
        type="text"
        value={address.village_number}
        onChange={(e) => onFieldChange('village_number', e.target.value)}
        placeholder="เช่น 5"
        error={errors[`${prefix}.village_number`]}
        disabled={disabled}
      />

      <Input
        label="ตรอก / ซอย"
        type="text"
        value={address.alley}
        onChange={(e) => onFieldChange('alley', e.target.value)}
        placeholder="เช่น ซอยพหลโยธิน 32"
        error={errors[`${prefix}.alley`]}
        disabled={disabled}
      />

      <Input
        label="ถนน"
        type="text"
        value={address.road}
        onChange={(e) => onFieldChange('road', e.target.value)}
        placeholder="เช่น ถนนพหลโยธิน"
        error={errors[`${prefix}.road`]}
        disabled={disabled}
      />

      <Input
        label="ตำบล / แขวง"
        type="text"
        value={address.subdistrict}
        onChange={(e) => onFieldChange('subdistrict', e.target.value)}
        placeholder="เช่น ลาดยาว"
        error={errors[`${prefix}.subdistrict`]}
        disabled={disabled}
        required
      />

      <Input
        label="อำเภอ / เขต"
        type="text"
        value={address.district}
        onChange={(e) => onFieldChange('district', e.target.value)}
        placeholder="เช่น จตุจักร"
        error={errors[`${prefix}.district`]}
        disabled={disabled}
        required
      />

      <Input
        label="จังหวัด"
        type="text"
        value={address.province}
        onChange={(e) => onFieldChange('province', e.target.value)}
        placeholder="เช่น กรุงเทพมหานคร"
        error={errors[`${prefix}.province`]}
        disabled={disabled}
        required
      />

      <Input
        label="รหัสไปรษณีย์"
        type="text"
        value={address.postal_code}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 5);
          onFieldChange('postal_code', value);
        }}
        placeholder="10900"
        maxLength={5}
        error={errors[`${prefix}.postal_code`]}
        disabled={disabled}
        required
      />

      <Input
        label="ละติจูด (ถ้ามี)"
        type="text"
        value={address.latitude}
        onChange={(e) => onFieldChange('latitude', e.target.value)}
        placeholder="13.7563"
        error={errors[`${prefix}.latitude`]}
        disabled={disabled}
        helperText="สามารถหาได้จาก Google Maps"
      />

      <Input
        label="ลองจิจูด (ถ้ามี)"
        type="text"
        value={address.longitude}
        onChange={(e) => onFieldChange('longitude', e.target.value)}
        placeholder="100.5018"
        error={errors[`${prefix}.longitude`]}
        disabled={disabled}
        helperText="สามารถหาได้จาก Google Maps"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Current Address */}
      <Card>
        <CardBody>
          <div className="flex items-center space-x-2 mb-4">
            <HomeIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">ที่อยู่ปัจจุบัน (ที่ติดต่อได้)</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            กรุณากรอกที่อยู่ที่สามารถติดต่อได้สะดวก (ที่พักอาศัยขณะศึกษา)
          </p>
          {renderAddressFields(data.current_address, handleCurrentAddressChange, 'current_address', false)}
        </CardBody>
      </Card>

      {/* Same Address Checkbox */}
      <Card>
        <CardBody>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="same_address"
              checked={data.same_as_current}
              onChange={(e) => handleSameAddressChange(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="same_address" className="ml-2 block text-sm text-gray-900 cursor-pointer">
              ที่อยู่ตามทะเบียนบ้านเหมือนกับที่อยู่ปัจจุบัน
            </label>
          </div>
        </CardBody>
      </Card>

      {/* Permanent Address */}
      <Card>
        <CardBody>
          <div className="flex items-center space-x-2 mb-4">
            <HomeIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">ที่อยู่ตามทะเบียนบ้าน</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            กรุณากรอกที่อยู่ตามทะเบียนบ้าน (ต้องตรงกับเอกสารทะเบียนบ้าน)
          </p>
          {renderAddressFields(
            data.permanent_address,
            handlePermanentAddressChange,
            'permanent_address',
            data.same_as_current
          )}
        </CardBody>
      </Card>

      {/* Helper Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">ข้อมูลเพิ่มเติม</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน เพื่อใช้ในการจัดส่งเอกสารและติดต่อสื่อสาร</li>
                <li>ที่อยู่ตามทะเบียนบ้านจะใช้ในการตรวจสอบเอกสารและยืนยันตัวตน</li>
                <li>หากที่อยู่ทั้งสองแห่งเหมือนกัน สามารถเลือกช่อง "ที่อยู่ตามทะเบียนบ้านเหมือนกับที่อยู่ปัจจุบัน"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
