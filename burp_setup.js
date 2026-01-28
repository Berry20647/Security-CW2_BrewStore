const axios = require('axios');
const http = require('http');

class BurpSuiteSetup {
  constructor() {
    this.baseUrl = 'http://localhost:5001';
    this.clientUrl = 'http://localhost:5174';
    this.burpProxy = 'http://localhost:8080';
  }

  async checkApplicationStatus() {
    console.log('🔍 Checking brewstore application status...');
    
    try {
      const serverResponse = await axios.get(`${this.baseUrl}/api/coffee`);
      console.log('✅ Backend server is running on port 5001');
    } catch (error) {
      console.log('❌ Backend server not accessible on port 5001');
      console.log('   Please start the server with: cd Server && npm start');
    }

    try {
      const clientResponse = await axios.get(this.clientUrl);
      console.log('✅ Frontend client is running on port 5174');
    } catch (error) {
      console.log('❌ Frontend client not accessible on port 5174');
      console.log('   Please start the client with: cd Client && npm run dev');
    }
  }

  async testEndpointsForBurp() {
    console.log('\n🎯 Testing endpoints for Burp Suite...');
    
    const endpoints = [
      { method: 'GET', path: '/api/coffee', description: 'Coffee products' },
      { method: 'POST', path: '/api/auth/login', description: 'Login endpoint' },
      { method: 'POST', path: '/api/auth/register', description: 'Registration endpoint' },
      { method: 'POST', path: '/api/contact', description: 'Contact form' },
      { method: 'GET', path: '/api/users/profile', description: 'User profile (protected)' },
      { method: 'POST', path: '/api/bookings', description: 'Booking endpoint' }
    ];

    for (const endpoint of endpoints) {
      try {
        const url = `${this.baseUrl}${endpoint.path}`;
        const response = await axios({
          method: endpoint.method,
          url: url,
          data: endpoint.method === 'POST' ? { test: 'burp_test' } : undefined,
          timeout: 5000
        });
        
        console.log(`✅ ${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
        console.log(`   Status: ${response.status}`);
      } catch (error) {
        if (error.response) {
          console.log(`⚠️  ${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
          console.log(`   Status: ${error.response.status} (Expected for protected endpoints)`);
        } else {
          console.log(`❌ ${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
          console.log(`   Error: ${error.message}`);
        }
      }
    }
  }

  generateBurpTestCases() {
    console.log('\n📋 Burp Suite Test Cases for brewstore:');
    console.log('='.repeat(60));
    
    const testCases = [
      {
        category: 'Authentication Tests',
        tests: [
          {
            name: 'Login with valid credentials',
            method: 'POST',
            url: '/api/auth/login',
            payload: { email: 'admin@brewstore.com', password: 'admin123' }
          },
          {
            name: 'Login with SQL injection',
            method: 'POST',
            url: '/api/auth/login',
            payload: { email: "admin' OR '1'='1", password: 'anything' }
          },
          {
            name: 'Login with NoSQL injection',
            method: 'POST',
            url: '/api/auth/login',
            payload: { email: { "$ne": null }, password: 'anything' }
          }
        ]
      },
      {
        category: 'Authorization Tests',
        tests: [
          {
            name: 'Access protected endpoint without token',
            method: 'GET',
            url: '/api/users/profile',
            headers: {}
          },
          {
            name: 'Access protected endpoint with invalid token',
            method: 'GET',
            url: '/api/users/profile',
            headers: { Authorization: 'Bearer invalid_token' }
          }
        ]
      },
      {
        category: 'XSS Tests',
        tests: [
          {
            name: 'Contact form XSS test',
            method: 'POST',
            url: '/api/contact',
            payload: {
              name: '<script>alert("XSS")</script>',
              email: 'test@test.com',
              message: '<img src=x onerror=alert("XSS")>'
            }
          }
        ]
      },
      {
        category: 'CSRF Tests',
        tests: [
          {
            name: 'Registration without CSRF token',
            method: 'POST',
            url: '/api/auth/register',
            payload: { name: 'test', email: 'test@test.com', password: 'test123' }
          }
        ]
      },
      {
        category: 'Input Validation Tests',
        tests: [
          {
            name: 'Registration with invalid email',
            method: 'POST',
            url: '/api/auth/register',
            payload: { name: 'test', email: 'notanemail', password: 'test123' }
          },
          {
            name: 'Registration with weak password',
            method: 'POST',
            url: '/api/auth/register',
            payload: { name: 'test', email: 'test@test.com', password: '123' }
          }
        ]
      }
    ];

    for (const category of testCases) {
      console.log(`\n🔍 ${category.category}:`);
      for (const test of category.tests) {
        console.log(`\n   Test: ${test.name}`);
        console.log(`   Method: ${test.method}`);
        console.log(`   URL: ${this.baseUrl}${test.url}`);
        if (test.payload) {
          console.log(`   Payload: ${JSON.stringify(test.payload)}`);
        }
        if (test.headers) {
          console.log(`   Headers: ${JSON.stringify(test.headers)}`);
        }
      }
    }
  }

  async runSetup() {
    console.log('🚀 Burp Suite Setup for brewstore Application');
    console.log('='.repeat(50));
    
    await this.checkApplicationStatus();
    await this.testEndpointsForBurp();
    this.generateBurpTestCases();
    
    console.log('\n📋 Next Steps:');
    console.log('1. Install Burp Suite Professional');
    console.log('2. Configure proxy settings (127.0.0.1:8080)');
    console.log('3. Import Burp\'s SSL certificate');
    console.log('4. Start spidering from http://localhost:5174');
    console.log('5. Run automated scans');
    console.log('6. Perform manual testing with the test cases above');
    
    console.log('\n📖 For detailed instructions, see: BURP_SUITE_GUIDE.md');
  }
}

if (require.main === module) {
  const setup = new BurpSuiteSetup();
  setup.runSetup().catch(console.error);
}

module.exports = BurpSuiteSetup; 