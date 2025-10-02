# User Roles and Permissions Specification
## Scholarship Management System

## Authentication Flow

### Login Process
```
1. User visits login page
2. Selects user type (Student/Officer/Interviewer/Admin)
3. Enters credentials (ID + Password)
4. System validates and redirects to appropriate dashboard
5. Session established with role-based permissions
```

### Password Policy
- Minimum 8 characters
- Must include uppercase, lowercase, number
- Password expiry: 90 days for staff, 180 days for students
- Account lockout after 5 failed attempts

## Role-Based Access Control (RBAC)

### 1. STUDENT (นักศึกษา)
**Login Credentials:** Student ID + Password

#### Permissions:
✅ **Can Access:**
- View available scholarships
- Create scholarship applications
- Upload supporting documents
- Edit draft applications
- Submit applications
- View own application status
- Book interview appointments
- View interview schedules
- Receive notifications
- Update personal profile
- View application history

❌ **Cannot Access:**
- Other students' applications
- Administrative functions
- Financial allocation details
- System settings
- User management

#### Dashboard Features:
- **Quick Stats Cards:**
  - Applications submitted: X
  - Pending applications: X
  - Approved applications: X
  - Interview appointments: X

- **Action Items:**
  - Scholarships closing soon
  - Documents needed
  - Interview reminders
  - Application status updates

#### Navigation Menu:
```
🏠 หน้าแรก (Dashboard)
💰 ทุนการศึกษา (Scholarships)
📄 ใบสมัครของฉัน (My Applications)
📎 เอกสาร (Documents)
🎤 การสัมภาษณ์ (Interviews)
🏆 ประวัติการได้ทุน (Award History)
👤 ข้อมูลส่วนตัว (Profile)
🔔 การแจ้งเตือน (Notifications)
```

### 2. SCHOLARSHIP_OFFICER (เจ้าหน้าที่ทุน)
**Login Credentials:** Employee ID + Password

#### Permissions:
✅ **Can Access:**
- Create and manage scholarships
- Review all applications
- Verify documents
- Schedule interviews
- Assign interviewers
- Approve/reject applications
- Allocate funds
- Generate reports
- Send notifications to students
- View budget information
- Manage scholarship sources

❌ **Cannot Access:**
- User account management
- System configuration
- Delete approved allocations
- Access other officers' private notes

#### Dashboard Features:
- **Statistics Overview:**
  - Total applications: X
  - Pending reviews: X
  - Interviews scheduled: X
  - Budget utilization: X%

- **Urgent Tasks:**
  - Applications pending review
  - Documents awaiting verification
  - Interviews needing assignment
  - Budget approvals needed

#### Navigation Menu:
```
🏠 หน้าแรก (Dashboard)
💰 จัดการทุน (Scholarship Management)
📋 ตรวจสอบใบสมัคร (Application Review)
📎 ตรวจสอบเอกสาร (Document Verification)
🎤 จัดการสัมภาษณ์ (Interview Management)
💸 จัดสรรทุน (Fund Allocation)
📊 รายงาน (Reports)
🔔 ส่งการแจ้งเตือน (Send Notifications)
⚙️ ตั้งค่าทุน (Scholarship Settings)
```

### 3. INTERVIEWER (ผู้สัมภาษณ์)
**Login Credentials:** Employee ID + Password

#### Permissions:
✅ **Can Access:**
- View assigned interview schedules
- Access applicant information for interviews
- Submit interview scores and feedback
- View interview guidelines
- Update availability
- Confirm interview appointments

❌ **Cannot Access:**
- Other interviewers' evaluations
- Final decision making
- Financial information
- System administration
- Student contact information beyond interviews

#### Dashboard Features:
- **Today's Schedule:**
  - Upcoming interviews
  - Interview room assignments
  - Applicant basic info

- **Interview Status:**
  - Completed interviews: X
  - Pending interviews: X
  - Scores submitted: X

#### Navigation Menu:
```
🏠 หน้าแรก (Dashboard)
📅 ตารางสัมภาษณ์ (Interview Schedule)
📝 บันทึกผลการสัมภาษณ์ (Submit Results)
👥 ผู้สมัครที่ได้รับมอบหมาย (Assigned Applicants)
⏰ ตั้งเวลาว่าง (Set Availability)
📋 เกณฑ์การประเมิน (Evaluation Criteria)
```

### 4. ADMIN (ผู้ดูแลระบบ)
**Login Credentials:** Admin ID + Password

#### Permissions:
✅ **Can Access:**
- Complete system access
- User account management
- Role assignments
- System settings
- Database backup/restore
- Security settings
- Audit logs
- System monitoring
- Global reports
- Email configurations

❌ **Cannot Access:**
- Individual student/staff passwords (encrypted)

#### Dashboard Features:
- **System Overview:**
  - Total users: X
  - Active sessions: X
  - System health: Status
  - Storage usage: X%

- **Admin Tasks:**
  - User accounts pending approval
  - System alerts
  - Backup status
  - Security events

#### Navigation Menu:
```
🏠 หน้าแรก (Dashboard)
👥 จัดการผู้ใช้ (User Management)
🛡️ จัดการสิทธิ์ (Role Management)
⚙️ ตั้งค่าระบบ (System Settings)
📊 รายงานรวม (Comprehensive Reports)
📜 บันทึกกิจกรรม (Activity Logs)
🔐 ความปลอดภัย (Security)
💾 สำรองข้อมูล (Data Backup)
📧 ตั้งค่าอีเมล (Email Configuration)
📈 ติดตามระบบ (System Monitoring)
```

## Page Access Matrix

| Page/Function | Student | Officer | Interviewer | Admin |
|---------------|---------|---------|-------------|-------|
| Login | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Browse Scholarships | ✅ | ✅ | ❌ | ✅ |
| Apply for Scholarship | ✅ | ❌ | ❌ | ❌ |
| Review Applications | ❌ | ✅ | ❌ | ✅ |
| Document Verification | ❌ | ✅ | ❌ | ✅ |
| Interview Scheduling | ❌ | ✅ | ❌ | ✅ |
| Submit Interview Results | ❌ | ❌ | ✅ | ✅ |
| Fund Allocation | ❌ | ✅ | ❌ | ✅ |
| User Management | ❌ | ❌ | ❌ | ✅ |
| System Settings | ❌ | ❌ | ❌ | ✅ |
| Reports | View Own | Full Access | Limited | Full Access |

## Security Implementation

### Session Management
```javascript
// Session timeout based on role
const sessionTimeout = {
  student: 30 * 60 * 1000,      // 30 minutes
  officer: 60 * 60 * 1000,      // 1 hour  
  interviewer: 45 * 60 * 1000,  // 45 minutes
  admin: 120 * 60 * 1000        // 2 hours
};
```

### Route Protection
```javascript
// Protected route middleware
const protectedRoutes = {
  '/student/*': ['student'],
  '/officer/*': ['scholarship_officer'],
  '/interviewer/*': ['interviewer'],
  '/admin/*': ['admin'],
  '/reports/*': ['scholarship_officer', 'admin']
};
```

### Data Access Controls
```javascript
// API access controls
const apiPermissions = {
  'GET /api/applications': {
    student: 'own-only',
    officer: 'all',
    admin: 'all'
  },
  'POST /api/applications': {
    student: 'create-own',
    officer: 'none',
    admin: 'any'
  },
  'PUT /api/applications/:id/approve': {
    officer: 'assigned-only',
    admin: 'any'
  }
};
```

## Multi-Language Support

### Language Options:
- **Thai (Primary)**: All interface elements
- **English (Secondary)**: For international students

### Content Structure:
```json
{
  "th": {
    "dashboard": "หน้าแรก",
    "scholarships": "ทุนการศึกษา",
    "applications": "ใบสมัคร"
  },
  "en": {
    "dashboard": "Dashboard", 
    "scholarships": "Scholarships",
    "applications": "Applications"
  }
}
```

## Mobile Responsiveness by Role

### Student Mobile Priority:
- Quick application status check
- Document photo upload
- Interview appointment booking
- Notification alerts

### Officer Mobile Features:
- Application approval workflow
- Document verification
- Quick status updates
- Emergency notifications

### Admin Mobile Access:
- System monitoring alerts
- User management (limited)
- Critical reports access
- System status dashboard