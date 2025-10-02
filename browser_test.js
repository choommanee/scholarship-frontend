// ทดสอบ API โดยตรงใน browser console
// เปิด http://localhost:3000 แล้วรันใน developer console (F12)

// Test 1: ทดสอบ fetch API
fetch('http://localhost:8080/health')
  .then(res => res.json())
  .then(data => console.log('Health check:', data))
  .catch(err => console.error('Health check error:', err));

// Test 2: ทดสอบ login API
fetch('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@university.ac.th',
    password: 'demo123'
  })
})
  .then(res => res.json())
  .then(data => console.log('Login success:', data))
  .catch(err => console.error('Login error:', err));

// Test 3: ตรวจสอบ environment
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
});
