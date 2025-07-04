"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { User, Lock, LogIn, Building2 } from "lucide-react"
import Loading from "../../components/Authenticating"

export default function LoginPage() {
  const [formData, setFormData] = useState({ id: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [focusedField, setFocusedField] = useState("")
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
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * 0.02 + 0.01,
    }))

    let animationId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(220, 38, 38, ${0.15 * (1 - distance / 120)})`
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
        if (p.opacity > 0.8 || p.opacity < 0.1) p.pulse *= -1
        ctx.fillStyle = `rgba(220, 38, 38, ${p.opacity * 0.6})`
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
     //api call 
    setTimeout(() => {
      setIsLoading(false)
      if (formData.id === "101") router.push("/admin")
      else if (formData.id === "102") router.push("/manager")
      else if (formData.id === "103") router.push("/employee/{")
      else setError("Invalid credentials. Try ID: 101, 102, or 103.")
    }, 1500)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-hidden">
      <Loading isLoading={isLoading} />

      {/* Animated background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Background geometric shapes */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-500/30 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-red-400/40 rounded-lg"
        />
      </div>

      {/* Main login container */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1.0,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className="z-10 w-full max-w-md mx-4"
      >
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg shadow-red-500/25"
          >
            <Building2 className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 font-bold mb-2">SHRM Portal</h1>
          
        </motion.div>

        {/* Login form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-2xl shadow-gray-900/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID Field */}
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <div
                className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                  focusedField === "id" ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50/50"
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12">
                  <User
                    className={`w-5 h-5 transition-colors duration-500 ease-out ${
                      focusedField === "id" ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Employee ID"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  onFocus={() => setFocusedField("id")}
                  onBlur={() => setFocusedField("")}
                  className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                  required
                />
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: focusedField === "id" ? 1 : 0 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-400 origin-left"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <div
                className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                  focusedField === "password" ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50/50"
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12">
                  <Lock
                    className={`w-5 h-5 transition-colors duration-500 ease-out ${
                      focusedField === "password" ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                  required
                />
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: focusedField === "password" ? 1 : 0 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-400 origin-left"
              />
            </motion.div>

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

            {/* Login button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative overflow-hidden bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all duration-500 ease-out px-6 py-4 rounded-xl text-white font-semibold shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
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
              <div className="relative flex items-center justify-center gap-3">
                <LogIn className="w-5 h-5" />
                <span>{isLoading ? "Authenticating..." : "Access Portal"}</span>
              </div>
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 pt-6 border-t border-gray-200 text-center"
          >
            
            <p className="text-gray-500 text-xs">
              Need assistance? Contact{" "}
              <motion.span whileHover={{ color: "#ef4444" }} className="text-red-400 cursor-pointer transition-colors">
                support@enterprise.com
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
    </div>
  )
}
