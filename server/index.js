require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const userRoutes = require("./routes/users");

// ── Connect to MongoDB ────────────────────────────
connectDB();

const app = express();

// ── Security Middleware ───────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Rate limiting — 100 requests per 15 min per IP
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  }),
);

// ── General Middleware ────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// ── API Routes ────────────────────────────────────
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "🌿 Gossip API is running",
    env: process.env.NODE_ENV,
  });
});

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// ── Start Server ──────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Gossip server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}\n`);
});
