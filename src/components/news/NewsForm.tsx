import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { Card, CardBody } from '@/components/ui/Card';
import { format } from 'date-fns';
import { CreateNewsRequest, UpdateNewsRequest } from '@/services/news.service';

const NEWS_CATEGORIES = [
  { value: 'announcement', label: 'ประกาศ' },
  { value: 'event', label: 'กิจกรรม' },
  { value: 'scholarship', label: 'ทุนการศึกษา' },
  { value: 'general', label: 'ทั่วไป' },
];

interface NewsFormProps {
  initialData?: {
    id?: string;
    title: string;
    content: string;
    summary: string;
    image_url?: string;
    publish_date: string;
    expire_date?: string;
    category: string;
    tags: string[];
    is_published: boolean;
  };
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function NewsForm({ initialData, onSubmit, isSubmitting }: NewsFormProps) {
  const isEditing = !!initialData?.id;
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    summary: initialData?.summary || '',
    image_url: initialData?.image_url || '',
    publish_date: initialData?.publish_date ? format(new Date(initialData.publish_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    expire_date: initialData?.expire_date ? format(new Date(initialData.expire_date), 'yyyy-MM-dd') : '',
    category: initialData?.category || 'general',
    tags: initialData?.tags?.join(', ') || '',
    is_published: initialData?.is_published || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_published: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse tags from comma-separated string to array
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    const newsData = {
      ...(isEditing && { id: initialData.id }),
      title: formData.title,
      content: formData.content,
      summary: formData.summary,
      image_url: formData.image_url || undefined,
      publish_date: formData.publish_date,
      expire_date: formData.expire_date || undefined,
      category: formData.category,
      tags,
      is_published: formData.is_published,
    };
    
    await onSubmit(newsData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                  หัวข้อข่าว
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="กรอกหัวข้อข่าว"
                />
              </div>
              
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                  สรุปย่อ
                </label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  placeholder="สรุปเนื้อหาข่าวสั้นๆ"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                  เนื้อหา
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  placeholder="เนื้อหาข่าวโดยละเอียด"
                  rows={10}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                    หมวดหมู่
                  </label>
                  <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    options={NEWS_CATEGORIES}
                  />
                </div>
                
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                    URL รูปภาพ
                  </label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="publish_date" className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                    วันที่เผยแพร่
                  </label>
                  <Input
                    id="publish_date"
                    name="publish_date"
                    type="date"
                    value={formData.publish_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="expire_date" className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                    วันที่หมดอายุ (ถ้ามี)
                  </label>
                  <Input
                    id="expire_date"
                    name="expire_date"
                    type="date"
                    value={formData.expire_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-secondary-700 mb-1 font-sarabun">
                  แท็ก (คั่นด้วยเครื่องหมายจุลภาค)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="ข่าว, ประกาศ, ทุนการศึกษา"
                />
              </div>
              
              <div className="flex items-center">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={handleSwitchChange}
                />
                <label htmlFor="is_published" className="ml-2 text-sm font-medium text-secondary-700 font-sarabun">
                  เผยแพร่ข่าวนี้
                </label>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            variant="mahidol"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEditing ? 'บันทึกการแก้ไข' : 'สร้างข่าวใหม่'}
          </Button>
        </div>
      </div>
    </form>
  );
}
