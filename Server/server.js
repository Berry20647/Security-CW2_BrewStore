require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const ActivityLog = require("./models/ActivityLog");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const csrf = require("csurf");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
}));

// ✅ Fixed CSP Configuration for reCAPTCHA
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", "http://localhost:5174"],
    scriptSrc: [
      "'self'", 
      "'unsafe-inline'", 
      "https://www.google.com", 
      "https://www.gstatic.com", 
      "http://localhost:5174",
      "https://www.google.com/recaptcha/",
      "https://www.gstatic.com/recaptcha/"
    ],
    styleSrc: [
      "'self'", 
      "'unsafe-inline'", 
      "https://fonts.googleapis.com", 
      "http://localhost:5174"
    ],
    imgSrc: [
      "'self'", 
      "data:", 
      "http://localhost:5001", 
      "http://localhost:5174",
      "https://www.google.com"
    ],
    connectSrc: [
      "'self'", 
      "http://localhost:5001", 
      "http://localhost:5174",
      "https://www.google.com",
      "https://www.gstatic.com",
      "https://rc-epay.esewa.com.np"
    ],
    fontSrc: [
      "'self'", 
      "https://fonts.gstatic.com", 
      "http://localhost:5174"
    ],
    frameSrc: [
      "'self'",
      "https://www.google.com",
      "https://www.google.com/recaptcha/"
    ],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));

// ✅ CSRF Protection Middleware - Fixed configuration
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: false, // Set to false for development (HTTP)
    sameSite: 'lax' // Changed from 'strict' to 'lax' for better compatibility
  }
});

// ✅ Simple CSRF token endpoint (no CSRF protection needed for this endpoint)
app.get("/api/csrf-token", (req, res) => {
  try {
    // Create a temporary CSRF instance just for token generation
    const tempCsrf = csrf({ 
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      }
    });
    
    tempCsrf(req, res, (err) => {
      if (err) {
        console.error("CSRF protection error:", err);
        return res.status(500).json({ error: "CSRF protection error" });
      }
      
      try {
        const token = req.csrfToken();
        console.log("✅ CSRF token generated successfully");
        res.json({ csrfToken: token });
      } catch (tokenError) {
        console.error("CSRF token generation error:", tokenError);
        res.status(500).json({ error: "Failed to generate CSRF token" });
      }
    });
  } catch (error) {
    console.error("CSRF token endpoint error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5174");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Log IP Middleware
async function logIpMiddleware(req, res, next) {
  let token = req.header("Authorization")?.split(" ")[1];
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  let m_user = null;
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      m_user = await User.findById(decoded.id).select("name email");
    }
  } catch {
    m_user = null;
  }

  const userLabel = m_user ? `User (${m_user.name})` : "Guest";
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const method = req.method;
  const url = req.originalUrl;

  let info = `${userLabel} accessed ${url}`;

  if (url.startsWith("/api/auth/login") && method === "POST") {
    info = `${userLabel} logged in`;
  } else if (url.startsWith("/api/auth/logout")) {
    info = `${userLabel} logged out`;
  } else if (url.startsWith("/api/auth/register") && method === "POST") {
    info = `${userLabel} registered`;
  } else if (url.startsWith("/api/auth/forgot-password")) {
    info = `${userLabel} requested password reset`;
  } else if (url.startsWith("/api/auth/reset-password") && method === "POST") {
    info = `${userLabel} reset password`;
  } else if (url.startsWith("/api/users/profile/image") && method === "PUT") {
    info = `${userLabel} updated profile image`;
  } else if (url.startsWith("/api/users/profile") && method === "PUT") {
    if (req.body && typeof req.body === "object" && "password" in req.body) {
      info = `${userLabel} changed password`;
    } else {
      info = `${userLabel} updated profile`;
    }
  } else if (url.startsWith("/api/bookings") && method === "POST") {
    info = `${userLabel} created a booking`;
  } else if (url.startsWith("/api/bookings") && method === "GET") {
    info = `${userLabel} viewed bookings`;
  } else if (url.startsWith("/api/contact") && method === "POST") {
    info = `${userLabel} submitted a contact form`;
  } else if (url.startsWith("/api/coffees") && method === "GET") {
    info = `${userLabel} viewed coffees`;
  }

  const logEntry = {
    ip,
    action: "Request",
    user: m_user?._id,
    userAgent: req.headers["user-agent"],
    url,
    method,
    info,
    meta: {
      body: req.body || {},
      query: req.query || {},
      params: req.params || {}
    }
  };

  try {
    await ActivityLog.create(logEntry);
  } catch (err) {
    console.error("⚠️ Failed to log activity:", err.message);
  }

  next();
}


app.use(logIpMiddleware);

// ✅ Apply CSRF protection to all routes except GET requests and CSRF token endpoint
app.use((req, res, next) => {
  // Skip CSRF protection for GET requests, CSRF token endpoint, and uploads
  if (req.method === 'GET' || 
      req.path === '/api/csrf-token' || 
      req.path.startsWith('/uploads/')) {
    return next();
  }
  
  // Apply CSRF protection to all other requests
  csrfProtection(req, res, next);
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/coffees", require("./routes/coffeeRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/users", userRoutes);

app.get("/api/users/activity-logs", async (req, res) => {
  try {
    const { user } = req.query;
    const filter = user ? { user } : {};
    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(500)
      .populate('user', 'name email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ CSRF Error Handler - Enhanced error handling
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('CSRF token validation failed:', {
      url: req.url,
      method: req.method,
      headers: req.headers,
      cookies: req.cookies
    });
    
    return res.status(403).json({ 
      msg: 'CSRF token validation failed. Please refresh the page and try again.',
      error: 'CSRF_TOKEN_INVALID'
    });
  }
  next(err);
});

const PORT = process.env.PORT || 5001;

// ✅ Proper async startup
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("✅ CSRF Protection Enabled");
      console.log("🔧 CSRF Cookie Settings: httpOnly=true, secure=false, sameSite=lax");
      console.log("🛡️ CSP configured for reCAPTCHA");
    });
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
})();
