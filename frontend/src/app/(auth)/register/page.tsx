'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, User, Lock, Mail, UserCheck, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Loading from '../../components/Loading';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    id: '',
    password: '',
    manager: ''
  })

  const roles = [
    { value: 'employee', label: 'Employee' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' }
  ]

  const managers = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'mike-johnson', label: 'Mike Johnson' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Handle registration logic here
    }, 2500)
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[3rem] p-12 text-white overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white blur-xl" />
                <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-yellow-400 blur-xl" />
              </div>
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
                    <span className="text-purple-900 font-bold text-xl">S</span>
                  </div>
                  <h1 className="text-4xl font-bold mb-4">
                    We&apos;re so glad to have you on board!
                  </h1>
                  <p className="text-purple-200 text-lg">
                    Join hundreds of thousands of teams in the digital world
                  </p>
                </div>
                
                {/* Team Illustration */}
                <div className="flex justify-center items-end space-x-3 mt-12">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className={`w-16 h-28 bg-gradient-to-b ${
                        i % 2 === 0 ? 'from-orange-400 to-orange-500' : 'from-pink-400 to-pink-500'
                      } rounded-t-full relative`}
                    >
                      <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 ${
                        i % 2 === 0 ? 'bg-orange-800' : 'bg-pink-800'
                      } rounded-full`} />
                      <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-10 h-12 bg-white rounded-lg" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Register Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full -translate-y-16 translate-x-16" />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">S</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
                  <p className="text-gray-600">Create your SHRM account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm appearance-none"
                        required
                      >
                        <option value="">Select your role</option>
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Employee ID */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Employee ID</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                        placeholder="Enter your employee ID"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Manager */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Your Manager</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm appearance-none"
                        required
                      >
                        <option value="">Select your manager</option>
                        {managers.map((manager) => (
                          <option key={manager.value} value={manager.value}>{manager.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all mt-6"
                  >
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}