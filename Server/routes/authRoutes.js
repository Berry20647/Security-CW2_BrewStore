const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware"); // ✅ Auth middleware
const { loginLimiter, signupLimiter } = require("../middleware/rateLimiter");

// Register route
router.post("/register", signupLimiter, authController.register);

// Login route
router.post("/login", loginLimiter, authController.login);

// Forgot Password
router.post("/forgot-password", authController.forgotPassword);
// Reset Password
router.post("/reset-password/:token", authController.resetPassword);
// Resend OTP
router.post("/resend-otp", authController.resendOTP);

// Refresh token
router.post("/refresh", authController.refresh);
// Logout
router.post("/logout", authController.logout);

// ✅ Current user route - returns logged-in user info from token
router.get("/me", auth, (req, res) => {
  const { _id, name, email, isAdmin } = req.user;
  res.json({
    id: _id,
    name,
    email,
    isAdmin
  });
});

module.exports = router;
