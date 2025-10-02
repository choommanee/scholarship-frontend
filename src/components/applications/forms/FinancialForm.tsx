'use client';

import { useState } from 'react';
import {
  ApplicationFinancialInfo,
  ApplicationAsset,
  ApplicationScholarshipHistory,
  ApplicationHealthInfo,
  ApplicationFundingNeeds,
} from '@/types/application';

interface FinancialFormProps {
  data?: {
    financial_info?: ApplicationFinancialInfo;
    assets?: ApplicationAsset[];
    scholarship_history?: ApplicationScholarshipHistory[];
    health_info?: ApplicationHealthInfo;
    funding_needs?: ApplicationFundingNeeds;
  };
  onSave: (data: any) => Promise<void>;
  onNext?: () => void;
  onBack?: () => void;
}

export default function FinancialForm({ data, onSave, onNext, onBack }: FinancialFormProps) {
  const [financialInfo, setFinancialInfo] = useState<ApplicationFinancialInfo>(
    data?.financial_info || {
      application_id: 0,
      monthly_income_from_family: 0,
      monthly_expenses: 0,
      part_time_income: 0,
    }
  );

  const [assets, setAssets] = useState<ApplicationAsset[]>(data?.assets || []);
  const [scholarshipHistory, setScholarshipHistory] = useState<ApplicationScholarshipHistory[]>(
    data?.scholarship_history || []
  );
  const [healthInfo, setHealthInfo] = useState<ApplicationHealthInfo>(
    data?.health_info || {
      application_id: 0,
      has_health_issues: false,
    }
  );
  const [fundingNeeds, setFundingNeeds] = useState<ApplicationFundingNeeds>(
    data?.funding_needs || {
      application_id: 0,
      tuition_fees: 0,
      living_expenses: 0,
    }
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        financial_info: financialInfo,
        assets,
        scholarship_history: scholarshipHistory,
        health_info: healthInfo,
        funding_needs: fundingNeeds,
      });
      if (onNext) onNext();
    } catch (error) {
      console.error('Failed to save financial info:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Financial Info */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">ข้อมูลการเงิน</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เงินจากบ้าน/เดือน (บาท)
            </label>
            <input
              type="number"
              value={financialInfo.monthly_income_from_family || ''}
              onChange={(e) =>
                setFinancialInfo({
                  ...financialInfo,
                  monthly_income_from_family: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ค่าใช้จ่าย/เดือน (บาท)
            </label>
            <input
              type="number"
              value={financialInfo.monthly_expenses || ''}
              onChange={(e) =>
                setFinancialInfo({
                  ...financialInfo,
                  monthly_expenses: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รายได้พิเศษ/เดือน (บาท)
            </label>
            <input
              type="number"
              value={financialInfo.part_time_income || ''}
              onChange={(e) =>
                setFinancialInfo({
                  ...financialInfo,
                  part_time_income: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            แหล่งที่มาของรายได้พิเศษ
          </label>
          <textarea
            value={financialInfo.income_sources || ''}
            onChange={(e) =>
              setFinancialInfo({ ...financialInfo, income_sources: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="เช่น งานพาร์ทไทม์, ค่าสอนพิเศษ"
          />
        </div>
      </div>

      {/* Assets */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">ทรัพย์สินและหนี้สิน</h3>
          <button
            type="button"
            onClick={() =>
              setAssets([
                ...assets,
                {
                  application_id: 0,
                  asset_type: '',
                  description: '',
                  estimated_value: 0,
                },
              ])
            }
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + เพิ่มทรัพย์สิน
          </button>
        </div>

        {assets.map((asset, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
                <select
                  value={asset.asset_type || ''}
                  onChange={(e) => {
                    const newAssets = [...assets];
                    newAssets[index].asset_type = e.target.value;
                    setAssets(newAssets);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">เลือก</option>
                  <option value="ที่ดิน">ที่ดิน</option>
                  <option value="บ้าน">บ้าน/อาคาร</option>
                  <option value="รถยนต์">รถยนต์</option>
                  <option value="เงินฝาก">เงินฝาก</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                <input
                  type="text"
                  value={asset.description || ''}
                  onChange={(e) => {
                    const newAssets = [...assets];
                    newAssets[index].description = e.target.value;
                    setAssets(newAssets);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">มูลค่า (บาท)</label>
                  <input
                    type="number"
                    value={asset.estimated_value || ''}
                    onChange={(e) => {
                      const newAssets = [...assets];
                      newAssets[index].estimated_value = parseFloat(e.target.value);
                      setAssets(newAssets);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setAssets(assets.filter((_, i) => i !== index))}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scholarship History */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">ประวัติการรับทุนการศึกษา</h3>
          <button
            type="button"
            onClick={() =>
              setScholarshipHistory([
                ...scholarshipHistory,
                {
                  application_id: 0,
                  scholarship_name: '',
                  provider: '',
                  amount: 0,
                  year_received: new Date().getFullYear(),
                },
              ])
            }
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + เพิ่มทุนการศึกษา
          </button>
        </div>

        {scholarshipHistory.map((scholarship, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อทุน</label>
                <input
                  type="text"
                  value={scholarship.scholarship_name || ''}
                  onChange={(e) => {
                    const newHistory = [...scholarshipHistory];
                    newHistory[index].scholarship_name = e.target.value;
                    setScholarshipHistory(newHistory);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ผู้ให้ทุน</label>
                <input
                  type="text"
                  value={scholarship.provider || ''}
                  onChange={(e) => {
                    const newHistory = [...scholarshipHistory];
                    newHistory[index].provider = e.target.value;
                    setScholarshipHistory(newHistory);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเงิน</label>
                <input
                  type="number"
                  value={scholarship.amount || ''}
                  onChange={(e) => {
                    const newHistory = [...scholarshipHistory];
                    newHistory[index].amount = parseFloat(e.target.value);
                    setScholarshipHistory(newHistory);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ปีที่ได้รับ</label>
                  <input
                    type="number"
                    value={scholarship.year_received || ''}
                    onChange={(e) => {
                      const newHistory = [...scholarshipHistory];
                      newHistory[index].year_received = parseInt(e.target.value);
                      setScholarshipHistory(newHistory);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() =>
                      setScholarshipHistory(scholarshipHistory.filter((_, i) => i !== index))
                    }
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Health Info */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">ข้อมูลสุขภาพ</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={healthInfo.has_health_issues}
              onChange={(e) =>
                setHealthInfo({ ...healthInfo, has_health_issues: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-sm">มีปัญหาด้านสุขภาพ</span>
          </label>

          {healthInfo.has_health_issues && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รายละเอียดปัญหาสุขภาพ
              </label>
              <textarea
                value={healthInfo.health_issues_description || ''}
                onChange={(e) =>
                  setHealthInfo({
                    ...healthInfo,
                    health_issues_description: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      {/* Funding Needs */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">ความต้องการทุนอุดหนุน</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ค่าเทอม/ภาคการศึกษา (บาท)
            </label>
            <input
              type="number"
              value={fundingNeeds.tuition_fees || ''}
              onChange={(e) =>
                setFundingNeeds({
                  ...fundingNeeds,
                  tuition_fees: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ค่าใช้จ่ายรายเดือน (บาท)
            </label>
            <input
              type="number"
              value={fundingNeeds.living_expenses || ''}
              onChange={(e) =>
                setFundingNeeds({
                  ...fundingNeeds,
                  living_expenses: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            เหตุผลความจำเป็นในการขอรับทุน
          </label>
          <textarea
            value={fundingNeeds.reason || ''}
            onChange={(e) => setFundingNeeds({ ...fundingNeeds, reason: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

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
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 ml-auto"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกและดำเนินการต่อ'}
        </button>
      </div>
    </form>
  );
}
