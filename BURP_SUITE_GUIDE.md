 🕷️ Burp Suite Pro Penetration Testing Guide

## 📋 Prerequisites

### Required Software:
- **Burp Suite Professional** (Download from PortSwigger)
- **Web Browser** (Chrome/Firefox recommended)
- **brewstore Application** (Running on localhost)

### Application URLs:
- **Backend API**: `http://localhost:5001`
- **Frontend Client**: `http://localhost:5174`

## 🚀 Step 1: Install and Configure Burp Suite Pro

### 1.1 Download Burp Suite Professional
- Visit: https://portswigger.net/burp/pro
- Download Burp Suite Professional
- Install and activate with your license

### 1.2 Configure Burp Suite Proxy
1. **Open Burp Suite Pro**
2. **Go to Proxy → Options**
3. **Configure Proxy Listener**:
   - Interface: `127.0.0.1`
   - Port: `8080`
   - Check "Running" checkbox

### 1.3 Configure Browser Proxy
1. **Chrome/Edge**:
   - Settings → Advanced → System → Open proxy settings
   - Manual proxy setup
   - HTTP Proxy: `127.0.0.1:8080`

2. **Firefox**:
   - Settings → Network Settings
   - Manual proxy configuration
   - HTTP Proxy: `127.0.0.1:8080`

## 🔧 Step 2: Import SSL Certificate

### 2.1 Download Burp Certificate
1. **In Burp Suite**: Proxy → Options → Import/Export CA Certificate
2. **Download certificate** (cacert.der)
3. **Install in browser**:
   - Chrome: Settings → Privacy → Security → Manage certificates
   - Firefox: Settings → Privacy → View Certificates → Authorities

## 🕷️ Step 3: Spider Your Application

### 3.1 Start Spidering
1. **Navigate to**: `http://localhost:5174` in your browser
2. **In Burp Suite**: Go to Spider tab
3. **Click "New Scan"**
4. **Configure**:
   - Application login: None (for public pages)
   - Crawl scope: `localhost:5174`
   - Click "OK"

### 3.2 Monitor Spider Progress
- Watch the Spider tab for discovered URLs
- Ensure all endpoints are discovered
- Note any authentication-required pages

## 🔍 Step 4: Run Automated Scanner

### 4.1 Configure Scanner
1. **Go to Scanner tab**
2. **Click "New Scan"**
3. **Select "Crawl and audit"**
4. **Configure scan settings**:
   - Scan speed: Normal
   - Scan type: Full
   - Include all discovered URLs

### 4.2 Start Scanning
- Click "OK" to start scan
- Monitor progress in Scanner tab
- Review findings as they appear

## ⚔️ Step 5: Manual Testing with Intruder

### 5.1 Test Authentication Endpoints
1. **Go to Target tab**
2. **Find**: `/api/auth/login`
3. **Right-click → Send to Intruder**
4. **Configure payloads**:
   ```
   Payload 1 (email): admin@test.com, test@test.com, admin
   Payload 2 (password): admin, password, 123, admin123
   ```

### 5.2 Test Registration Endpoints
1. **Find**: `/api/auth/register`
2. **Send to Intruder**
3. **Test with various payloads**:
   ```
   XSS: <script>alert('XSS')</script>
   SQL: ' OR 1=1 --
   NoSQL: {"$ne": null}
   ```

## 🔄 Step 6: Use Repeater for Manual Testing

### 6.1 Test API Endpoints
1. **Go to Repeater tab**
2. **Add requests for**:
   - `GET /api/users/profile`
   - `POST /api/auth/login`
   - `POST /api/contact`
   - `GET /api/coffee`

### 6.2 Test Authentication Bypass
```http
GET /api/users/profile HTTP/1.1
Host: localhost:5001
Authorization: Bearer invalid_token
```

### 6.3 Test CSRF Protection
```http
POST /api/auth/register HTTP/1.1
Host: localhost:5001
Content-Type: application/json
X-CSRF-Token: invalid_token

{
  "name": "test",
  "email": "test@test.com",
  "password": "test123"
}
```

## 📊 Step 7: Test Specific Vulnerabilities

### 7.1 SQL/NoSQL Injection Tests
```json
// Test login endpoint
{
  "email": "admin' OR '1'='1",
  "password": "anything"
}

{
  "email": {"$ne": null},
  "password": "anything"
}
```

### 7.2 XSS Tests
```json
// Test contact form
{
  "name": "<script>alert('XSS')</script>",
  "email": "test@test.com",
  "message": "<img src=x onerror=alert('XSS')>"
}
```

### 7.3 Authorization Tests
```http
GET /api/users HTTP/1.1
Host: localhost:5001
Authorization: Bearer regular_user_token
```

## 🔍 Step 8: Test File Upload Security

### 8.1 Test Malicious File Uploads
1. **Find file upload endpoint**
2. **Test with**:
   - `.php` files
   - `.sh` files
   - Large files (>10MB)
   - Files with special characters

### 8.2 Test Directory Traversal
```
../../../etc/passwd
..\..\..\windows\system32\drivers\etc\hosts
```

## 📈 Step 9: Generate Report

### 9.1 Export Findings
1. **Go to Issues tab**
2. **Review all findings**
3. **Export report**: Report → Generate report
4. **Save as HTML/PDF**

### 9.2 Document Results
Create a report with:
- **Vulnerabilities found**
- **Severity levels**
- **Proof of concept**
- **Remediation steps**

## 🎯 brewstore Specific Test Cases

### Authentication Tests
```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "admin@brewstore.com",
  "password": "admin123"
}
```

### Coffee API Tests
```http
GET /api/coffee HTTP/1.1
GET /api/coffee/admin HTTP/1.1
POST /api/coffee HTTP/1.1
```

### Booking API Tests
```http
POST /api/bookings HTTP/1.1
Content-Type: application/json

{
  "date": "2024-01-01",
  "time": "10:00",
  "guests": 5
}
```

### Contact Form Tests
```http
POST /api/contact HTTP/1.1
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@test.com",
  "message": "Test message"
}
```

## 📊 Expected Test Results

### ✅ Security Features to Verify:
- **Authentication**: Login/logout working correctly
- **Authorization**: Protected routes properly secured
- **CSRF Protection**: Tokens required for state-changing operations
- **Rate Limiting**: Multiple requests properly throttled
- **Input Validation**: Malicious input properly sanitized
- **File Upload**: Only safe file types accepted
- **Error Handling**: No sensitive information in error messages

### ❌ Common Vulnerabilities to Check:
- **SQL Injection**: Database queries properly parameterized
- **XSS**: User input properly escaped
- **CSRF**: Tokens validated on all state-changing operations
- **Authentication Bypass**: No way to access protected resources
- **Information Disclosure**: No sensitive data in responses
- **Privilege Escalation**: Users cannot access admin functions

## 🔧 Troubleshooting

### Common Issues:
1. **Certificate Errors**: Install Burp's CA certificate
2. **Proxy Not Working**: Check browser proxy settings
3. **Application Not Loading**: Ensure server is running
4. **SSL Errors**: Accept Burp's certificate warnings

### Debug Steps:
1. **Check Burp Suite logs**
2. **Verify proxy configuration**
3. **Test with simple HTTP requests**
4. **Check browser developer tools**

## 📋 Test Checklist

- [ ] Burp Suite Pro installed and configured
- [ ] Proxy settings configured in browser
- [ ] SSL certificate imported
- [ ] Application running on localhost
- [ ] Spider completed successfully
- [ ] Automated scan completed
- [ ] Manual testing performed
- [ ] All endpoints tested
- [ ] Vulnerabilities documented
- [ ] Report generated

## 🎯 Success Criteria

Your application passes Burp Suite testing if:
- ✅ No critical vulnerabilities found
- ✅ All authentication/authorization working
- ✅ Input validation properly implemented
- ✅ CSRF protection enabled
- ✅ Rate limiting functional
- ✅ No information disclosure
- ✅ File upload security implemented

---

**Remember**: Burp Suite Pro is a professional tool. Always test in a controlled environment and never test against production systems without proper authorization. 