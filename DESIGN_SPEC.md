# Frontend Design Specification - Scholarship Management System
## Based on Economics at Thammasat university Design Language

### Design Principles
- **Academic Institution Look**: Clean, professional, trustworthy
- **Thai University Standard**: Similar to Mahidol's design approach
- **Accessibility**: Easy navigation for all user types
- **Responsive**: Mobile-first design approach

## Color Scheme (Inspired by Academic Institutions)
```css
:root {
  --primary-blue: #1e40af;      /* Deep blue for headers */
  --secondary-blue: #3b82f6;    /* Medium blue for accents */
  --light-blue: #dbeafe;        /* Light blue for backgrounds */
  --success-green: #059669;     /* Success states */
  --warning-orange: #d97706;    /* Warning states */
  --danger-red: #dc2626;        /* Error states */
  --neutral-gray: #6b7280;      /* Text and borders */
  --light-gray: #f9fafb;        /* Background */
  --white: #ffffff;             /* Cards and modals */
}
```

## Typography
- **Headers**: Sarabun (Thai), Inter (English) - Clean, modern
- **Body**: Sarabun (Thai), Inter (English) - High readability
- **Sizes**: 
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

## Layout Structure

### 1. Authentication Pages
```
┌─────────────────────────────────────┐
│            Top Banner               │
│    [University Logo] [System Name]  │
├─────────────────────────────────────┤
│                                     │
│        ┌─────────────────┐         │
│        │   Login Form    │         │
│        │                 │         │
│        │ [Username]      │         │
│        │ [Password]      │         │
│        │ [Role Select]   │         │
│        │ [Login Button]  │         │
│        │                 │         │
│        └─────────────────┘         │
│                                     │
└─────────────────────────────────────┘
```

### 2. Main Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│                    Header                               │
│ [Logo] [Nav Menu]              [Notifications] [User]   │
├─────────────────────────────────────────────────────────┤
│ Sidebar    │              Main Content                  │
│            │                                           │
│ [Menu 1]   │  ┌─────────────────────────────────────┐  │
│ [Menu 2]   │  │         Page Content                │  │
│ [Menu 3]   │  │                                     │  │
│ [Menu 4]   │  │                                     │  │
│            │  └─────────────────────────────────────┘  │
│            │                                           │
└────────────┴───────────────────────────────────────────┘
```

## User Interface Specifications

### 1. Student Interface
#### Main Navigation:
- หน้าแรก (Dashboard)
- ทุนการศึกษา (Available Scholarships)  
- ใบสมัครของฉัน (My Applications)
- เอกสารประกอบ (Documents)
- การสัมภาษณ์ (Interviews)
- ประวัติการได้รับทุน (Award History)
- ข้อมูลส่วนตัว (Profile)

#### Dashboard Cards:
- สถานะใบสมัครล่าสุด
- ทุนที่เปิดรับสมัคร
- การแจ้งเตือนสำคัญ
- ขั้นตอนการสมัครทุน

### 2. Scholarship Officer Interface
#### Main Navigation:
- หน้าแรก (Dashboard)
- จัดการทุน (Manage Scholarships)
- ตรวจสอบใบสมัคร (Review Applications)
- จัดการเอกสาร (Document Verification)
- จัดการสัมภาษณ์ (Interview Management)
- จัดสรรทุน (Fund Allocation)
- รายงาน (Reports)

#### Dashboard Widgets:
- สถิติใบสมัครรวม
- ทุนที่ต้องดำเนินการ
- เอกสารรอตรวจสอบ
- การสัมภาษณ์วันนี้

### 3. Admin Interface
#### Main Navigation:
- หน้าแรก (Dashboard)
- จัดการผู้ใช้ (User Management)
- จัดการระบบ (System Settings)
- รายงานสรุป (Comprehensive Reports)
- บันทึกกิจกรรม (Activity Logs)
- สำรองข้อมูล (Data Backup)

## Component Design Standards

### Buttons
```css
.btn-primary {
  background: var(--primary-blue);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
}

.btn-secondary {
  background: white;
  color: var(--primary-blue);
  border: 2px solid var(--primary-blue);
  padding: 10px 22px;
  border-radius: 8px;
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border: 1px solid #e5e7eb;
}
```

### Forms
```css
.form-input {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: var(--primary-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

## Page Flow Specifications

### Student Journey:
1. **Login** → Student Dashboard
2. **Browse Scholarships** → Scholarship Details → Apply
3. **Fill Application** → Upload Documents → Submit
4. **Track Status** → Interview Booking → Attend Interview
5. **Receive Results** → Accept/Decline Award

### Officer Journey:
1. **Login** → Officer Dashboard
2. **Create Scholarship** → Set Criteria → Publish
3. **Review Applications** → Verify Documents → Schedule Interviews
4. **Manage Interviews** → Review Results → Make Decisions
5. **Allocate Funds** → Process Disbursements → Generate Reports

### Admin Journey:
1. **Login** → Admin Dashboard
2. **Monitor System** → Manage Users → Review Reports
3. **System Configuration** → Backup Management → Security Audits

## Responsive Design Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Thai language support with proper fonts

## Security Features
- Session timeout warnings
- Secure file upload with virus scanning
- Input validation and sanitization
- CSRF protection
- Rate limiting on login attempts

## Performance Targets
- Page load time: < 3 seconds
- Time to interactive: < 5 seconds
- Lighthouse score: > 90
- Bundle size: < 500KB initial load