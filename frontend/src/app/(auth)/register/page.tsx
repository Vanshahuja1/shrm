"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Briefcase,
  Building2,
  DollarSign,
  CreditCard,
  Calendar,
  FolderOpen,
  Users,
  CheckCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface RegisterFormData {
  name: string
  role: string
  upperManager: string
  salary: string
  adharCard: string
  panCard: string
  experience: string
  projects: string
  organizationName: string
  departmentName: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    role: "",
    upperManager: "",
    salary: "",
    adharCard: "",
    panCard: "",
    experience: "",
    projects: "",
    organizationName: "",
    departmentName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [generatedCredentials, setGeneratedCredentials] = useState<{ id: string; password: string } | null>(null)
  const [focusedField, setFocusedField] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Enhanced particle system
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.4 + 0.2,
      pulse: Math.random() * 0.02 + 0.01,
    }))

    let animationId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        p.opacity += p.pulse
        if (p.opacity > 0.6 || p.opacity < 0.1) p.pulse *= -1
        ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity * 0.5})`
        ctx.fill()

        p.x += p.dx
        p.y += p.dy

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          salary: Number.parseFloat(formData.salary) || 0,
          experience: Number.parseInt(formData.experience) || 0,
          projects: formData.projects
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        setGeneratedCredentials({
          id: data.data.id,
          password: data.data.id, // Password is same as ID initially
        })
        setCurrentStep(3) // Move to success step

        // Reset form
        setFormData({
          name: "",
          role: "",
          upperManager: "",
          salary: "",
          adharCard: "",
          panCard: "",
          experience: "",
          projects: "",
          organizationName: "",
          departmentName: "",
        })
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Network error. Please check if the server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const isStep1Valid = formData.name && formData.role && formData.organizationName && formData.departmentName
  const isStep2Valid = true 

  if (generatedCredentials && currentStep === 3) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 w-full max-w-md mx-4"
        >
          <motion.div className="bg-white/90 backdrop-blur-xl border border-green-200 rounded-3xl p-8 shadow-2xl shadow-green-900/10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">Your employee account has been created successfully.</p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-green-800 mb-4">Your Login Credentials</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Employee ID:</span>
                  <span className="font-mono font-bold text-green-700">{generatedCredentials.id}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Password:</span>
                  <span className="font-mono font-bold text-green-700">{generatedCredentials.password}</span>
                </div>
              </div>
              <p className="text-green-600 text-sm mt-4">
                <strong>Important:</strong> Save these credentials securely. You can change your password after first
                login.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/25"
              >
                Login Now
              </Link>
              <button
                onClick={() => {
                  setGeneratedCredentials(null)
                  setCurrentStep(1)
                  setSuccess("")
                }}
                className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
              >
                Register Another Employee
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Background geometric shapes */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-green-500/30 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-green-400/40 rounded-lg"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1.0,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className="z-10 w-full max-w-2xl mx-4"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 shadow-lg shadow-green-500/25"
          >
            <Users className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Registration</h1>
          <p className="text-gray-600">Create a new employee account</p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mt-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep >= step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      currentStep > step ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-2xl shadow-gray-900/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>

                {/* Name Field */}
                <div className="relative">
                  <div
                    className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                      focusedField === "name" ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12">
                      <User
                        className={`w-5 h-5 transition-colors duration-500 ease-out ${
                          focusedField === "name" ? "text-green-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField("")}
                      className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Role Field */}
                <div className="relative">
                  <div
                    className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                      focusedField === "role" ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12">
                      <Briefcase
                        className={`w-5 h-5 transition-colors duration-500 ease-out ${
                          focusedField === "role" ? "text-green-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("role")}
                      onBlur={() => setFocusedField("")}
                      className="bg-transparent flex-1 px-4 py-3 text-gray-900 outline-none"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select Role *</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="hr">HR</option>
                      <option value="employee">Employee</option>
                      <option value="sales">Sales</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>
                </div>

                {/* Organization Name */}
                <div className="relative">
                  <div
                    className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                      focusedField === "organizationName"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12">
                      <Building2
                        className={`w-5 h-5 transition-colors duration-500 ease-out ${
                          focusedField === "organizationName" ? "text-green-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="text"
                      name="organizationName"
                      placeholder="Organization Name *"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("organizationName")}
                      onBlur={() => setFocusedField("")}
                      className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Department Name */}
                <div className="relative">
                  <div
                    className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                      focusedField === "departmentName"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12">
                      <Users
                        className={`w-5 h-5 transition-colors duration-500 ease-out ${
                          focusedField === "departmentName" ? "text-green-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="text"
                      name="departmentName"
                      placeholder="Department Name *"
                      value={formData.departmentName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("departmentName")}
                      onBlur={() => setFocusedField("")}
                      className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStep1Valid}
                  whileHover={{ scale: isStep1Valid ? 1.02 : 1 }}
                  whileTap={{ scale: isStep1Valid ? 0.98 : 1 }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 transition-all duration-500 ease-out px-6 py-4 rounded-xl text-white font-semibold shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Additional Details
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Additional Information */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upper Manager */}
                  <div className="relative">
                    <div
                      className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                        focusedField === "upperManager"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12">
                        <User
                          className={`w-5 h-5 transition-colors duration-500 ease-out ${
                            focusedField === "upperManager" ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <input
                        type="text"
                        name="upperManager"
                        placeholder="Upper Manager"
                        value={formData.upperManager}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("upperManager")}
                        onBlur={() => setFocusedField("")}
                        className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="relative">
                    <div
                      className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                        focusedField === "salary" ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12">
                        <DollarSign
                          className={`w-5 h-5 transition-colors duration-500 ease-out ${
                            focusedField === "salary" ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <input
                        type="number"
                        name="salary"
                        placeholder="Annual Salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("salary")}
                        onBlur={() => setFocusedField("")}
                        className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="relative">
                    <div
                      className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                        focusedField === "experience" ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12">
                        <Calendar
                          className={`w-5 h-5 transition-colors duration-500 ease-out ${
                            focusedField === "experience" ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <input
                        type="number"
                        name="experience"
                        placeholder="Years of Experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("experience")}
                        onBlur={() => setFocusedField("")}
                        className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Aadhar Card */}
                  <div className="relative">
                    <div
                      className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                        focusedField === "adharCard" ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12">
                        <CreditCard
                          className={`w-5 h-5 transition-colors duration-500 ease-out ${
                            focusedField === "adharCard" ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <input
                        type="text"
                        name="adharCard"
                        placeholder="Aadhar Card Number"
                        value={formData.adharCard}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("adharCard")}
                        onBlur={() => setFocusedField("")}
                        className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* PAN Card */}
                  <div className="relative">
                    <div
                      className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                        focusedField === "panCard" ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12">
                        <CreditCard
                          className={`w-5 h-5 transition-colors duration-500 ease-out ${
                            focusedField === "panCard" ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <input
                        type="text"
                        name="panCard"
                        placeholder="PAN Card Number"
                        value={formData.panCard}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("panCard")}
                        onBlur={() => setFocusedField("")}
                        className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="relative md:col-span-2">
                    <div
                      className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                        focusedField === "projects" ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12">
                        <FolderOpen
                          className={`w-5 h-5 transition-colors duration-500 ease-out ${
                            focusedField === "projects" ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <input
                        type="text"
                        name="projects"
                        placeholder="Projects (comma-separated)"
                        value={formData.projects}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("projects")}
                        onBlur={() => setFocusedField("")}
                        className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-3"
                    >
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-all duration-300"
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="flex-1 relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 transition-all duration-500 ease-out px-6 py-4 rounded-xl text-white font-semibold shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      initial={{ x: "-100%" }}
                      animate={{ x: isLoading ? ["0%", "100%"] : "-100%" }}
                      transition={{
                        duration: 1.5,
                        repeat: isLoading ? Number.POSITIVE_INFINITY : 0,
                        ease: "linear",
                      }}
                    />
                    <span className="relative">{isLoading ? "Creating Account..." : "Create Employee Account"}</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </motion.div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
    </div>
  )
}
