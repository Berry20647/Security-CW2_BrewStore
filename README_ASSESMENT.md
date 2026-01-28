# Brew Store beans Security Assessment

## Executive Summary

Brew Store beans is a modern e-commerce platform with a strong focus on user security and privacy. The application implements robust authentication, authorization, and data protection mechanisms, including JWT-based authentication, optional TOTP-based multi-factor authentication (MFA), rate limiting, and email verification. While the system covers most OWASP Top Ten risks, there are areas for improvement, such as advanced input validation, automated security testing, and production-grade monitoring. This assessment is based on a direct scan of the current codebase and configuration, with all claims verifiable in the source.

---

## Fully Implemented Features

### Core Features

| Feature                        | Status      | Description                                      |
|------------------------------- |------------ |--------------------------------------------------|
| User Registration & Login      | ✅ Complete | Secure registration, login, and password reset.   |
| Profile Management             | ✅ Complete | Update info, change password, enable/disable 2FA. |
| Product Catalog & Orders       | ✅ Complete | CRUD for coffee beans, cart, checkout, order history.|
| Admin Dashboard                | ✅ Complete | User management, block/unblock, RBAC.            |
| Email Verification             | ✅ Complete | For new emails and password resets.              |

### Security Features

| Feature                        | Status      | Description                                      |
|------------------------------- |------------ |--------------------------------------------------|
| Password Hashing               | ✅ Complete | bcryptjs, 10 rounds.                             |
| JWT Authentication             | ✅ Complete | 7-day expiry, Bearer tokens.                     |
| 2FA (TOTP)                     | ✅ Complete | speakeasy, QR code setup, enforced on login.     |
| Rate Limiting                  | ✅ Complete | express-rate-limit on login and signup.          |
| Role-Based Access Control      | ✅ Complete | isAdmin boolean, admin-only endpoints.           |
| CORS                           | ✅ Complete | Restricted to localhost origins, credentials.    |
| Environment Secrets            | ✅ Complete | dotenv, not committed.                           |
| Email Verification             | ✅ Complete | Tokenized, 1-hour expiry.                        |
| Input Validation               | ✅ Complete | Validation in frontend/backend.             |
| Logging                        | ✅ Complete | Console logs for errors/events.                  |

#### Mechanisms and Configurations

- **Authentication**: JWT tokens signed with `process.env.JWT_SECRET`, 7-day expiry, sent as Bearer tokens.
- **Password Storage**: bcryptjs, 10 rounds, no password reuse or expiry enforcement.
- **MFA**: TOTP via speakeasy, QR code setup, enforced on login if enabled.
- **Rate Limiting**: 5 login attempts per 15 minutes per IP, 5 signup attempts per hour per IP.
- **RBAC**: isAdmin boolean, admin-only endpoints, blocked users cannot log in.
- **Email Verification**: SHA-256 token, 1-hour expiry, required for additional emails.
- **CORS**: Only allows localhost:5174 and 3000, credentials enabled.
- **Secrets**: All sensitive values in `.env`, not committed.
- **Logging**: Console logs for errors, failed logins, password resets.

---

## Technical Implementation Details

### JWT Token Signing

```js
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
```

### MFA (TOTP)

```js
if (user.twoFactorEnabled) {
  if (!twoFactorCode) return res.status(206).json({ twoFactorRequired: true });
  const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token: twoFactorCode });
  if (!verified) return res.status(400).json({ msg: "Invalid 2FA code" });
}
```

### Rate Limiting

```js
const loginLimiter = rateLimit({ windowMs: 15*60*1000, max: 5 });
const signupLimiter = rateLimit({ windowMs: 60*60*1000, max: 5 });
```

### Password Policy

```js
// Password strength indicator (frontend)
const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const medium = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
```

### Email Verification

```js
const verifyToken = crypto.randomBytes(32).toString("hex");
const verifyTokenHash = crypto.createHash("sha256").update(verifyToken).digest("hex");
user.emailVerifyToken = verifyTokenHash;
user.emailVerifyExpire = Date.now() + 60*60*1000; // 1 hour
```

### CORS Configuration

```js
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:3000"],
  credentials: true
}));
```

---

## Security Metrics

### Authentication Security

- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens, 7-day expiry, Bearer in Authorization header
- 2FA (TOTP) available and enforced if enabled
- Email verification required for new emails

### Data Protection

- Passwords and 2FA secrets stored securely in MongoDB
- No explicit database encryption; relies on MongoDB and host security
- No explicit TLS config in code; must be enforced at deployment

### Monitoring & Auditing

- Console logs for errors, failed logins, password resets
- No external SIEM, alerting, or retention policy

---

## Security Testing Results

### Automated Tests

- Linting: ESLint for frontend
- Dependency Scanning: Manual via `npm audit`
- No SAST/DAST or automated security test scripts found

### Manual Testing

- Password strength: Weak/strong passwords tested during registration
- Rate limiting: Exceed login/signup attempts, observe lockout
- 2FA: Enable, login, and test TOTP enforcement
- Email verification: Add new email, verify via link, test expiry
- RBAC: Attempt admin endpoints as non-admin
- JWT tampering: Modify token, observe 401
- Blocked user: Block user, attempt login
- Password reset: Use reset link, test expiry

#### Penetration Testing Considerations

- Authentication bypass: JWT validation, 2FA enforcement
- NoSQL injection: Mongoose queries, input validation
- XSS/CSRF: No explicit protection; JWT auth only
- Session hijacking: JWT only, no cookies
- Privilege escalation: isAdmin checks in all admin routes

---

## Compliance Checklist

### Core Requirements

- [x] User Registration & Login
- [x] Profile Management
- [x] Product Catalog & Orders
- [x] Admin Dashboard
- [x] Email Verification

### Security Requirements

- [x] Password Hashing (bcryptjs)
- [x] JWT Authentication
- [x] 2FA (TOTP)
- [x] Email Verification for new emails
- [x] Rate Limiting on login/signup
- [x] RBAC (isAdmin)
- [x] CORS restricted
- [x] Secrets in .env
- [x] Logging of errors/events

### Advanced Features

- [x] Multi-Email Support with Verification
- [x] 2FA (TOTP)
- [ ] Automated security tests (SAST/DAST)
- [ ] Session cookies or CSRF protection
- [ ] Advanced input validation/sanitization
- [ ] External log aggregation/alerting
- [ ] HTTPS enforcement (must be set up in deployment)
- [ ] Account lockout/progressive delays

---

## Security Demonstration

### Video Demo Script

1. Register a new user with a strong password and verify email.
2. Log in, enable 2FA, scan QR code, confirm with TOTP.
3. Log out, log in again—see 2FA prompt.
4. Add a secondary email, verify via email link, log in with secondary email.
5. Exceed login attempts—observe rate limiting.
6. Attempt admin-only route as user—see forbidden.
7. Block a user as admin, attempt login as blocked user.
8. Reset password via email, confirm link expiry.

---

## Conclusion

Brew Store beans demonstrates a mature security posture with robust authentication, authorization, and user management. Key features like 2FA, rate limiting, and email verification are implemented and tested. The application is suitable for production deployment with further enhancements in automated security testing, advanced monitoring, and input validation. All claims in this document are based on direct code and configuration review.

---

## Contact

- For security issues, contact the project maintainer or open an issue in the repository.
- See also:
  - `README_SECURITY.md`
  - `SECURITY_FEATURES.md`
  - [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
  - [Node.js Security Best Practices](https://github.com/goldbergyoni/nodebestpractices#security-best-practices)
  - [JWT Security Guidelines](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

