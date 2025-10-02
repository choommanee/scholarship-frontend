/**
 * Test script for Payment and Analytics Services
 * Run with: npx ts-node test_frontend_services.ts
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Test credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@university.ac.th',
  password: 'admin123'
};

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
  data?: any;
}

const results: TestResult[] = [];

async function getAdminToken(): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, ADMIN_CREDENTIALS);
    console.log('✅ Admin login successful');
    return response.data.token;
  } catch (error: any) {
    console.error('❌ Admin login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testPaymentMethods(token: string) {
  const testName = 'Get Payment Methods';
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/methods`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const methods = response.data;
    results.push({
      name: testName,
      status: 'PASS',
      message: `Found ${methods.length} payment methods`,
      data: methods
    });
    console.log(`✅ ${testName}: ${methods.length} methods`);
  } catch (error: any) {
    results.push({
      name: testName,
      status: 'FAIL',
      message: error.response?.data?.error || error.message
    });
    console.error(`❌ ${testName}:`, error.response?.data || error.message);
  }
}

async function testAnalyticsDashboard(token: string) {
  const testName = 'Get Analytics Dashboard';
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const dashboard = response.data;
    results.push({
      name: testName,
      status: 'PASS',
      message: `Total periods: ${dashboard.total_periods}`,
      data: dashboard
    });
    console.log(`✅ ${testName}:`, dashboard);
  } catch (error: any) {
    results.push({
      name: testName,
      status: 'FAIL',
      message: error.response?.data?.error || error.message
    });
    console.error(`❌ ${testName}:`, error.response?.data || error.message);
  }
}

async function testProcessingTime(token: string) {
  const testName = 'Get Average Processing Time';
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/processing-time`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    results.push({
      name: testName,
      status: 'PASS',
      message: `Average: ${response.data.average_processing_time_days} days`,
      data: response.data
    });
    console.log(`✅ ${testName}:`, response.data);
  } catch (error: any) {
    results.push({
      name: testName,
      status: 'FAIL',
      message: error.response?.data?.error || error.message
    });
    console.error(`❌ ${testName}:`, error.response?.data || error.message);
  }
}

async function testBottlenecks(token: string) {
  const testName = 'Get Bottlenecks Analysis';
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/bottlenecks`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    results.push({
      name: testName,
      status: 'PASS',
      message: 'Bottlenecks retrieved',
      data: response.data
    });
    console.log(`✅ ${testName}:`, response.data);
  } catch (error: any) {
    results.push({
      name: testName,
      status: 'FAIL',
      message: error.response?.data?.error || error.message
    });
    console.error(`❌ ${testName}:`, error.response?.data || error.message);
  }
}

async function testAllStatistics(token: string) {
  const testName = 'Get All Statistics';
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/statistics/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const stats = response.data;
    results.push({
      name: testName,
      status: 'PASS',
      message: `Found ${stats.length} statistics records`,
      data: stats
    });
    console.log(`✅ ${testName}: ${stats.length} records`);
  } catch (error: any) {
    results.push({
      name: testName,
      status: 'FAIL',
      message: error.response?.data?.error || error.message
    });
    console.error(`❌ ${testName}:`, error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('\n🧪 Starting Frontend Services Tests\n');
  console.log('='.repeat(50));

  try {
    // Get admin token
    const token = await getAdminToken();
    console.log('');

    // Test Payment Service
    console.log('\n📦 Testing Payment Service');
    console.log('-'.repeat(50));
    await testPaymentMethods(token);

    // Test Analytics Service
    console.log('\n📊 Testing Analytics Service');
    console.log('-'.repeat(50));
    await testAnalyticsDashboard(token);
    await testProcessingTime(token);
    await testBottlenecks(token);
    await testAllStatistics(token);

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 Test Summary\n');

    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;

    results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${result.name}: ${result.message}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
    console.log('='.repeat(50));

    if (failed === 0) {
      console.log('\n🎉 All tests passed!\n');
    } else {
      console.log('\n⚠️ Some tests failed. Please check the errors above.\n');
    }

  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
  }
}

// Run tests
runTests();
