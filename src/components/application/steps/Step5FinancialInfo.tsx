'use client';

import React, { useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PlusIcon, TrashIcon, CurrencyDollarIcon, HomeModernIcon } from '@heroicons/react/24/outline';

export interface Asset {
  id: string;
  type: string;
  description: string;
  value: string;
  monthly_cost: string;
}

export interface FinancialInfoData {
  family_income: string;
  monthly_expenses: string;
  income_per_member: string;
  debt_amount: string;
  assets: Asset[];
  living_with: string;
  house_type: string;
  house_ownership: string;
  utilities: string[];
  monthly_rent: string;
  house_condition: string;
}

export interface Step5FinancialInfoProps {
  data: FinancialInfoData;
  onChange: (field: keyof FinancialInfoData, value: any) => void;
  errors: Record<string, string>;
  familyMemberCount?: number;
}

const assetTypeOptions = [
  { value: 'land', label: 'ที่ดิน' },
  { value: 'house', label: 'บ้าน' },
  { value: 'vehicle', label: 'ยานพาหนะ' },
  { value: 'savings', label: 'เงินฝากธนาคาร' },
  { value: 'investment', label: 'การลงทุน' },
  { value: 'other', label: 'อื่นๆ' }
];

const houseTypeOptions = [
  { value: 'detached_house', label: 'บ้านเดี่ยว' },
  { value: 'townhouse', label: 'ทาวน์เฮ้าส์' },
  { value: 'condo', label: 'คอนโดมิเนียม' },
  { value: 'apartment', label: 'อพาร์ทเมนท์' },
  { value: 'dormitory', label: 'หอพัก' },
  { value: 'hut', label: 'กระท่อม' },
  { value: 'other', label: 'อื่นๆ' }
];

const houseOwnershipOptions = [
  { value: 'own', label: 'เป็นของตนเอง' },
  { value: 'rent', label: 'เช่า' },
  { value: 'relatives', label: 'อาศัยญาติ' },
  { value: 'free_stay', label: 'อยู่ฟรี' },
  { value: 'other', label: 'อื่นๆ' }
];

const utilitiesOptions = [
  { value: 'electricity', label: 'ไฟฟ้า' },
  { value: 'water', label: 'น้ำประปา' },
  { value: 'internet', label: 'อินเทอร์เน็ต' },
  { value: 'gas', label: 'แก๊ส' },
  { value: 'phone', label: 'โทรศัพท์' }
];

const houseConditionOptions = [
  { value: 'good', label: 'ดี - มั่นคงแข็งแรง' },
  { value: 'fair', label: 'พอใช้ - ซ่อมแซมได้' },
  { value: 'poor', label: 'ทรุดโทรม - ต้องซ่อมแซม' },
  { value: 'very_poor', label: 'ทรุดโทรมมาก - อยู่ได้ยาก' }
];

export function Step5FinancialInfo({ data, onChange, errors, familyMemberCount = 1 }: Step5FinancialInfoProps) {
  // Auto-calculate income per member
  useEffect(() => {
    const income = parseFloat(data.family_income) || 0;
    const count = familyMemberCount || 1;
    const perMember = (income / count).toFixed(2);
    if (data.income_per_member !== perMember) {
      onChange('income_per_member', perMember);
    }
  }, [data.family_income, familyMemberCount]);

  const addAsset = () => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      type: '',
      description: '',
      value: '',
      monthly_cost: ''
    };
    onChange('assets', [...data.assets, newAsset]);
  };

  const removeAsset = (id: string) => {
    onChange('assets', data.assets.filter(a => a.id !== id));
  };

  const updateAsset = (id: string, field: keyof Asset, value: string) => {
    onChange('assets', data.assets.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const toggleUtility = (utility: string) => {
    const current = data.utilities || [];
    if (current.includes(utility)) {
      onChange('utilities', current.filter(u => u !== utility));
    } else {
      onChange('utilities', [...current, utility]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <Card>
        <CardBody>
          <div className="flex items-center space-x-2 mb-4">
            <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">สรุปรายได้และค่าใช้จ่าย</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="รายได้ครอบครัวต่อเดือน (บาท)"
              type="text"
              value={data.family_income}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                onChange('family_income', value);
              }}
              placeholder="เช่น 20000"
              error={errors.family_income}
              helperText="รวมรายได้ทุกคนในครอบครัว"
              required
            />

            <Input
              label="ค่าใช้จ่ายต่อเดือน (บาท)"
              type="text"
              value={data.monthly_expenses}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                onChange('monthly_expenses', value);
              }}
              placeholder="เช่น 15000"
              error={errors.monthly_expenses}
              helperText="ค่าใช้จ่ายทั้งหมดของครอบครัว"
              required
            />

            <Input
              label="รายได้ต่อหัว (บาท)"
              type="text"
              value={data.income_per_member}
              disabled
              helperText={`คำนวณจาก: ${data.family_income || 0} ÷ ${familyMemberCount} คน`}
            />

            <Input
              label="หนี้สินครอบครัว (บาท)"
              type="text"
              value={data.debt_amount}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                onChange('debt_amount', value);
              }}
              placeholder="เช่น 100000"
              error={errors.debt_amount}
              helperText="หนี้สินทั้งหมด (ถ้าไม่มีให้ใส่ 0)"
            />
          </div>

          {/* Financial Status Alert */}
          {data.family_income && data.monthly_expenses && (
            <div className="mt-4">
              {parseFloat(data.family_income) < parseFloat(data.monthly_expenses) ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    <strong>คำเตือน:</strong> รายได้ต่อเดือนต่ำกว่าค่าใช้จ่าย
                    (ขาดดุล {(parseFloat(data.monthly_expenses) - parseFloat(data.family_income)).toLocaleString()} บาท)
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>สถานะ:</strong> รายได้เพียงพอ
                    (เหลือ {(parseFloat(data.family_income) - parseFloat(data.monthly_expenses)).toLocaleString()} บาท)
                  </p>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Assets & Liabilities */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">สินทรัพย์และทรัพย์สิน</h3>
            <Button
              variant="primary"
              size="sm"
              onClick={addAsset}
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              เพิ่มสินทรัพย์
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            กรุณาระบุสินทรัพย์และทรัพย์สินของครอบครัว เช่น ที่ดิน บ้าน รถยนต์ เงินฝาก
          </p>

          {data.assets.length === 0 ? (
            <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
              ยังไม่มีข้อมูลสินทรัพย์ (กดปุ่ม "เพิ่มสินทรัพย์" หากมี)
            </div>
          ) : (
            <div className="space-y-4">
              {data.assets.map((asset, index) => (
                <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      สินทรัพย์ที่ {index + 1}
                    </h4>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ประเภทสินทรัพย์ <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={asset.type}
                        onChange={(e) => updateAsset(asset.id, 'type', e.target.value)}
                        options={assetTypeOptions}
                        placeholder="เลือกประเภท"
                        required
                      />
                    </div>

                    <Input
                      label="มูลค่าโดยประมาณ (บาท)"
                      type="text"
                      value={asset.value}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        updateAsset(asset.id, 'value', value);
                      }}
                      placeholder="เช่น 500000"
                      required
                    />

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        รายละเอียด <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={asset.description}
                        onChange={(e) => updateAsset(asset.id, 'description', e.target.value)}
                        placeholder="เช่น ที่ดิน 2 ไร่ ที่ จ.นครปฐม"
                        rows={2}
                        required
                      />
                    </div>

                    <Input
                      label="ค่าใช้จ่ายต่อเดือน (บาท)"
                      type="text"
                      value={asset.monthly_cost}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        updateAsset(asset.id, 'monthly_cost', value);
                      }}
                      placeholder="เช่น 5000"
                      helperText="ค่าผ่อน/ค่าบำรุง (ถ้ามี)"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Living Conditions */}
      <Card>
        <CardBody>
          <div className="flex items-center space-x-2 mb-4">
            <HomeModernIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">สภาพความเป็นอยู่</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทที่อยู่อาศัย <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.house_type}
                onChange={(e) => onChange('house_type', e.target.value)}
                options={houseTypeOptions}
                placeholder="เลือกประเภทที่อยู่"
                error={errors.house_type}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                สถานะความเป็นเจ้าของ <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.house_ownership}
                onChange={(e) => onChange('house_ownership', e.target.value)}
                options={houseOwnershipOptions}
                placeholder="เลือกสถานะ"
                error={errors.house_ownership}
                required
              />
            </div>

            {data.house_ownership === 'rent' && (
              <Input
                label="ค่าเช่าต่อเดือน (บาท)"
                type="text"
                value={data.monthly_rent}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  onChange('monthly_rent', value);
                }}
                placeholder="เช่น 3000"
                error={errors.monthly_rent}
                required
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                สภาพของที่อยู่อาศัย <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.house_condition}
                onChange={(e) => onChange('house_condition', e.target.value)}
                options={houseConditionOptions}
                placeholder="เลือกสภาพ"
                error={errors.house_condition}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สาธารณูปโภคในบ้าน <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {utilitiesOptions.map((utility) => (
                  <div key={utility.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`utility-${utility.value}`}
                      checked={data.utilities?.includes(utility.value) || false}
                      onChange={() => toggleUtility(utility.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`utility-${utility.value}`} className="ml-2 block text-sm text-gray-900">
                      {utility.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.utilities && (
                <p className="mt-1 text-sm text-red-600">{errors.utilities}</p>
              )}
            </div>
          </div>
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
            <h3 className="text-sm font-medium text-blue-800">ข้อมูลสำคัญ</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>ข้อมูลทางการเงินจะใช้ในการพิจารณาคุณสมบัติและความเหมาะสมในการรับทุน</li>
                <li>กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน เพื่อประโยชน์ในการพิจารณาทุน</li>
                <li>ข้อมูลจะถูกเก็บเป็นความลับและใช้เฉพาะการพิจารณาทุนการศึกษาเท่านั้น</li>
                <li>ท่านจะต้องแนบเอกสารหลักฐานทางการเงินในขั้นตอนถัดไป</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
