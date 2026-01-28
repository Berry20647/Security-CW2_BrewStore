const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const validator = require("validator");
const sanitizeHtml = require('sanitize-html');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'brewstore Login OTP Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3E2C27;">brewstore Security Verification</h2>
        <p>Your login verification code is:</p>
        <h1 style="color: #c6a27e; font-size: 32px; text-align: center; letter-spacing: 8px; padding: 20px; background: #f5f5f5; border-radius: 8px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">brewstore - Your Coffee Journey</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Register Controller
const register = async (req, res) => {
  try {
    let { name, email, password, token } = req.body;
    // Sanitize inputs
    name = sanitizeHtml(validator.trim(name || ""), { allowedTags: [], allowedAttributes: {} });
    name = validator.escape(name);
    email = sanitizeHtml(validator.trim(email || ""), { allowedTags: [], allowedAttributes: {} });
    email = validator.normalizeEmail(email);
    password = sanitizeHtml(validator.trim(password || ""), { allowedTags: [], allowedAttributes: {} });
    // Validate name
    if (!/^[A-Za-z\s]{2,}$/.test(name)) {
      return res.status(400).json({ msg: "Name must be at least 2 letters and only contain letters and spaces." });
    }
    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format." });
    }
    // Validate password
    const strongPassword = password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    if (!strongPassword) {
      return res.status(400).json({ msg: "Password must be at least 8 characters, include upper, lower, number, and special character." });
    }
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });
    // Recaptcha
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`);
    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success) {
      console.error("Recaptcha verification failed:", recaptchaData);
      return res.status(400).json({ msg: "Recaptcha verification failed" });
    }
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emails: [{ address: email, verified: true }],
      passwordHistory: [hashedPassword],
      passwordLastChanged: now
    });
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Helper to generate tokens
function generateAccessToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
}
function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password, twoFactorCode, otpCode, userId } = req.body;

    // If OTP is provided, we're in verification mode
    if (otpCode && userId) {
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ msg: "Invalid user" });

      if (!user.otpCode || user.otpCode !== otpCode || !user.otpExpiresAt || user.otpExpiresAt < Date.now()) {
        return res.status(400).json({ msg: "Invalid or expired OTP code" });
      }

      // OTP verified, complete login
      user.otpVerified = true;
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      user.refreshToken = refreshToken;
      await user.save();

      // Set tokens as httpOnly, secure cookies
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: "/",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      return res.json({
        token: accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    }

    // Regular login flow
    // Find user by any verified email
    const user = await User.findOne({
      $or: [
        { email },
        { emails: { $elemMatch: { address: email, verified: true } } }
      ]
    });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Account lockout check
    if (user.lockoutUntil && user.lockoutUntil > Date.now()) {
      const minutes = Math.ceil((user.lockoutUntil - Date.now()) / 60000);
      return res.status(403).json({ msg: `Account locked. Try again in ${minutes} minute(s).` });
    }

    if (user.isBlocked) return res.status(403).json({ msg: "User is blocked. Please contact support." });

    // Password expiry: 7 days
    if (user.passwordLastChanged && (Date.now() - new Date(user.passwordLastChanged).getTime()) > 7 * 24 * 60 * 60 * 1000) {
      return res.status(403).json({ msg: "Password expired. Please reset your password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      // Lock account after 10 failed attempts for 15 minutes
      if (user.failedLoginAttempts >= 10) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        return res.status(403).json({ msg: "Account locked due to too many failed login attempts. Try again in 15 minutes." });
      } else {
        await user.save();
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;

    // If 2FA is enabled, require code
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(206).json({
          msg: "2FA required",
          twoFactorRequired: true,
          userId: user._id,
          email: user.email
        });
      }
      const speakeasy = require("speakeasy");
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: twoFactorCode
      });
      if (!verified) return res.status(400).json({ msg: "Invalid 2FA code" });
    }

    // Generate and send OTP
    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.otpVerified = false;
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(user.email, otp);
    if (!emailSent) {
      return res.status(500).json({ msg: "Failed to send OTP email" });
    }

    return res.status(206).json({
      msg: "OTP sent to your email",
      otpRequired: true,
      userId: user._id,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Refresh token endpoint
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ msg: "No refresh token" });
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }
    // Rotate refresh token
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();
    // Issue new access token
    const newAccessToken = generateAccessToken(user);
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: "/",
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });
    res.json({ msg: "Token refreshed" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Logout endpoint
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }
    res.clearCookie("token", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    res.json({ msg: "Logged out" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by any verified email
    const user = await User.findOne({
      $or: [
        { email },
        { emails: { $elemMatch: { address: email, verified: true } } }
      ]
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'brewstore Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3E2C27;">Password Reset Request</h2>
          <p>You requested a password reset for your brewstore account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #c6a27e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
          <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">brewstore - Your Coffee Journey</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });
    // Validate password
    const strongPassword = password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    if (!strongPassword) {
      return res.status(400).json({ msg: "Password must be at least 8 characters, include upper, lower, number, and special character." });
    }
    // Prevent password reuse (last 2 passwords)
    for (const oldHash of (user.passwordHistory || [])) {
      if (await bcrypt.compare(password, oldHash)) {
        return res.status(400).json({ msg: "You cannot reuse your last 2 passwords." });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.passwordLastChanged = new Date();
    user.passwordHistory = [hashedPassword, ...(user.passwordHistory || [])].slice(0, 2);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ msg: "Password reset successful. Please login." });
  } catch (err) {
    res.status(500).json({ msg: "Failed to reset password. Try again later." });
  }
};

// Resend OTP Controller
const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.otpVerified = false;
    await user.save();

    // Send new OTP email
    const emailSent = await sendOTPEmail(user.email, otp);
    if (!emailSent) {
      return res.status(500).json({ msg: "Failed to send OTP email" });
    }

    res.json({ msg: "New OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  refresh,
  logout,
  resendOTP
};
