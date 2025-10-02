import { Scholarship } from '@/services/scholarship.service';

// Sample scholarship data from Economics at Thammasat university
export const mahidolScholarships: Omit<Scholarship, 'id' | 'currentApplicants' | 'approvedApplicants' | 'lastModified' | 'createdBy' | 'isActive'>[] = [
  {
    name: 'ทุนเฉลิมพระเกียรติ 60 ปี ครองราชสมบัติ',
    description: 'โครงการทุนการศึกษา "ทุนเฉลิมพระเกียรติ 60 ปี ครองราชสมบัติ" จัดขึ้นเป็นพิเศษเพื่อจัดสรรทุนสนับสนุนค่าเล่าเรียน สําหรับนักศึกษาที่มีผลการเรียนดี แต่ขาดแคลนทุนทรัพย์ให้มีโอกาสได้เข้าศึกษาต่อในระดับปริญญาโท หรือปริญญาเอก ในหลักสูตร/สาขาวิชาต่างๆ ของคณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
    type: 'ทุนสำหรับนักศึกษาแรกเข้า',
    amount: 100000,
    maxRecipients: 20,
    status: 'open',
    createdDate: '2025-03-01T00:00:00Z',
    applicationDeadline: '2025-07-11T00:00:00Z',
    academicYear: '2568',
    requirements: [
      'เป็นผู้มีผลการเรียนดี',
      'ขาดแคลนทุนทรัพย์',
      'กำลังศึกษาต่อในระดับปริญญาโท หรือปริญญาเอก'
    ],
    documentsRequired: [
      'ใบสมัคร',
      'แบบฟอร์มการเสนอรายชื่อ',
      'แบบแจ้งความจำนงการขอรับทุน (MUGR SS01.2)',
      'แบบแสดงรายงานผลการศึกษา และความก้าวหน้าของนักศึกษา (MUGR SS01.3)'
    ],
    provider: 'บัณฑิตวิทยาลัย คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
    budget: {
      total: 2000000,
      allocated: 0,
      remaining: 2000000
    }
  },
  {
    name: 'ทุนอุดหนุนการศึกษาระดับบัณฑิตศึกษา บัณฑิตวิทยาลัย',
    description: 'ทุนอุดหนุนการศึกษาสำหรับนักศึกษาระดับบัณฑิตศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ที่กำลังศึกษาอยู่ และมีความจำเป็นต้องได้รับการสนับสนุนค่าใช้จ่ายในการศึกษา',
    type: 'ทุนการศึกษาในระหว่างที่ศึกษาระดับบัณฑิตศึกษา',
    amount: 50000,
    maxRecipients: 30,
    status: 'open',
    createdDate: '2025-02-15T00:00:00Z',
    applicationDeadline: '2025-08-30T00:00:00Z',
    academicYear: '2568',
    requirements: [
      'เป็นนักศึกษาระดับบัณฑิตศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
      'มีความจำเป็นต้องได้รับการสนับสนุนค่าใช้จ่ายในการศึกษา',
      'มีผลการเรียนเฉลี่ยสะสมไม่ต่ำกว่า 3.25'
    ],
    documentsRequired: [
      'แบบฟอร์มขอรับทุน',
      'หนังสือรับรองจากอาจารย์ที่ปรึกษา',
      'ใบแสดงผลการศึกษา',
      'หลักฐานแสดงความจำเป็นในการขอรับทุน'
    ],
    provider: 'บัณฑิตวิทยาลัย คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
    budget: {
      total: 1500000,
      allocated: 0,
      remaining: 1500000
    }
  },
  {
    name: 'ทุนสนับสนุนนักศึกษาระดับบัณฑิตศึกษา ในการเสนอผลงานทางวิชาการ ณ ต่างประเทศ',
    description: 'ทุนสนับสนุนนักศึกษาระดับบัณฑิตศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ในการเสนอผลงานวิจัย/ผลงานวิชาการ ณ ต่างประเทศ เพื่อส่งเสริมและสนับสนุนให้นักศึกษาได้มีโอกาสนำเสนอผลงานวิจัย/ผลงานวิชาการ ในที่ประชุมวิชาการระดับนานาชาติ',
    type: 'ทุนสนับสนุนการนำเสนอผลงาน',
    amount: 40000,
    maxRecipients: 50,
    status: 'open',
    createdDate: '2025-01-10T00:00:00Z',
    applicationDeadline: '2025-12-31T00:00:00Z',
    academicYear: '2568',
    requirements: [
      'เป็นนักศึกษาระดับบัณฑิตศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
      'มีผลงานวิจัย/ผลงานวิชาการที่ได้รับการตอบรับให้นำเสนอในที่ประชุมวิชาการระดับนานาชาติ',
      'ไม่เคยได้รับทุนประเภทนี้มาก่อน หรือได้รับไม่เกิน 1 ครั้ง'
    ],
    documentsRequired: [
      'แบบฟอร์มขอรับทุน',
      'หนังสือตอบรับการนำเสนอผลงาน',
      'บทคัดย่อผลงานที่จะนำเสนอ',
      'หนังสือรับรองจากอาจารย์ที่ปรึกษา'
    ],
    provider: 'บัณฑิตวิทยาลัย คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
    budget: {
      total: 2000000,
      allocated: 0,
      remaining: 2000000
    }
  },
  {
    name: 'ทุนอุดหนุนการทำวิทยานิพนธ์บางส่วน',
    description: 'ทุนอุดหนุนการทำวิทยานิพนธ์บางส่วน สำหรับนักศึกษาระดับบัณฑิตศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เพื่อสนับสนุนค่าใช้จ่ายในการทำวิทยานิพนธ์',
    type: 'ทุน/รางวัลเมื่อนักศึกษาสอบผ่านโครงร่างวิทยานิพนธ์',
    amount: 30000,
    maxRecipients: 40,
    status: 'open',
    createdDate: '2025-02-01T00:00:00Z',
    applicationDeadline: '2025-09-30T00:00:00Z',
    academicYear: '2568',
    requirements: [
      'เป็นนักศึกษาระดับบัณฑิตศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
      'สอบผ่านโครงร่างวิทยานิพนธ์แล้ว',
      'มีความจำเป็นต้องได้รับการสนับสนุนค่าใช้จ่ายในการทำวิทยานิพนธ์'
    ],
    documentsRequired: [
      'แบบฟอร์มขอรับทุน',
      'โครงร่างวิทยานิพนธ์ที่ผ่านการสอบแล้ว',
      'หนังสือรับรองจากอาจารย์ที่ปรึกษาวิทยานิพนธ์',
      'แผนการใช้จ่ายเงินทุน'
    ],
    provider: 'บัณฑิตวิทยาลัย คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
    budget: {
      total: 1200000,
      allocated: 0,
      remaining: 1200000
    }
  },
  {
    name: 'รางวัลวิทยานิพนธ์ดีเด่น',
    description: 'รางวัลวิทยานิพนธ์ดีเด่น สำหรับนักศึกษาระดับบัณฑิตศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ที่มีวิทยานิพนธ์ที่มีคุณภาพดีเด่น เพื่อเป็นการยกย่องและประกาศเกียรติคุณ',
    type: 'รางวัลสำหรับนักศึกษา',
    amount: 20000,
    maxRecipients: 10,
    status: 'open',
    createdDate: '2025-03-15T00:00:00Z',
    applicationDeadline: '2025-10-31T00:00:00Z',
    academicYear: '2568',
    requirements: [
      'เป็นนักศึกษาระดับบัณฑิตศึกษา คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
      'สอบผ่านวิทยานิพนธ์แล้ว',
      'วิทยานิพนธ์มีคุณภาพดีเด่น'
    ],
    documentsRequired: [
      'แบบฟอร์มเสนอชื่อเข้ารับรางวัล',
      'บทคัดย่อวิทยานิพนธ์',
      'หนังสือรับรองจากอาจารย์ที่ปรึกษาวิทยานิพนธ์',
      'ผลงานตีพิมพ์ที่เกี่ยวข้องกับวิทยานิพนธ์ (ถ้ามี)'
    ],
    provider: 'บัณฑิตวิทยาลัย คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
    budget: {
      total: 200000,
      allocated: 0,
      remaining: 200000
    }
  }
];

// Function to import scholarships into the system
export async function importMahidolScholarships() {
  try {
    // This would typically make API calls to your backend to create these scholarships
    // For now, we'll just log them
    console.log('Importing Economics at Thammasat university scholarships...');
    console.log(`Total scholarships to import: ${mahidolScholarships.length}`);
    
    // In a real implementation, you would use your API client to send these to your backend
    // Example:
    // const importedScholarships = await Promise.all(
    //   mahidolScholarships.map(scholarship => 
    //     apiClient.post('/api/scholarships', scholarship)
    //   )
    // );
    
    // For now, just return the mock data
    return {
      success: true,
      count: mahidolScholarships.length,
      message: `Successfully prepared ${mahidolScholarships.length} scholarships for import`
    };
  } catch (error: unknown) {
    console.error('Error importing scholarships:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      count: 0,
      message: `Error importing scholarships: ${errorMessage}`
    };
  }
}

// Function to get the imported scholarships for display on the homepage
export function getImportedScholarships() {
  // In a real implementation, you would fetch these from your API
  // For now, return the mock data
  return mahidolScholarships.map((scholarship, index) => ({
    ...scholarship,
    id: index + 1,
    currentApplicants: 0,
    approvedApplicants: 0,
    lastModified: new Date().toISOString(),
    createdBy: 'system',
    isActive: true
  }));
}
