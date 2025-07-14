require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/database")
const authRoutes = require("./routes/authRoutes")

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("X-XSS-Protection", "1; mode=block")
  next()
})

// Routes
app.use("/api/auth", authRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error)

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err)
  process.exit(1)
})

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
  process.exit(1)
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
