"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Users, Building2, TrendingUp, Clock, DollarSign, BarChart3, Shield, Zap, Globe, CheckCircle, Star, FileText, Mail, UserCheck, Calendar, Briefcase, Award, Target, Database, Code, Smartphone, Lock, RefreshCw, MessageSquare, PieChart, Activity } from 'lucide-react';

const SHRMLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('employee');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Employee Management",
      description: "Complete employee lifecycle management with detailed profiles, role assignments, and hierarchical organization structure."
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Department Management",
      description: "Organize teams efficiently with multi-department support, budget tracking, and organizational hierarchy."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Project Tracking",
      description: "Full project lifecycle management with team assignments, progress monitoring, and client integration."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Attendance System",
      description: "Digital punch in/out system with break management, real-time status tracking, and comprehensive analytics."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Payroll Processing",
      description: "Automated payroll calculations, salary management, and financial reporting with budget tracking."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Real-time statistics, interactive charts, and data visualization for informed decision-making."
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Communication Hub",
      description: "Internal messaging, email integration, and system-wide notifications to keep teams connected."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Document Management",
      description: "Upload, manage, and track employee documents with secure cloud storage integration."
    }
  ];

  const capabilities = [
    {
      category: "Core HR Management",
      items: [
        "Complete employee lifecycle management",
        "Multi-organization support",
        "Department hierarchical structure",
        "Role-based access control (Admin, Manager, Employee, Intern, Head)",
        "Organizational hierarchy visualization",
        "Member directory with advanced search"
      ]
    },
    {
      category: "Project & Task Management",
      items: [
        "Project creation and tracking",
        "Team assignment (Employees, Managers, Interns)",
        "Progress monitoring with completion percentages",
        "Client management integration",
        "Task assignment and tracking",
        "Performance metrics monitoring"
      ]
    },
    {
      category: "Time & Attendance",
      items: [
        "Digital punch in/out system",
        "Break management (lunch, short breaks)",
        "Real-time presence monitoring",
        "Attendance report generation",
        "Monthly attendance analytics",
        "Trend analysis and forecasting"
      ]
    },
    {
      category: "Financial Management",
      items: [
        "Automated payroll processing",
        "Individual salary tracking",
        "Department budget allocation",
        "Financial reporting and summaries",
        "Payroll adjustments and modifications",
        "Expense tracking and management"
      ]
    }
  ];

  const techStack = {
    frontend: [
      { name: "Next.js 14", desc: "React framework with App Router" },
      { name: "TypeScript", desc: "Type-safe development" },
      { name: "Tailwind CSS", desc: "Utility-first styling" },
      { name: "Recharts", desc: "Data visualization" }
    ],
    backend: [
      { name: "Node.js", desc: "Runtime environment" },
      { name: "Express.js", desc: "Web framework" },
      { name: "MongoDB", desc: "NoSQL database" },
      { name: "JWT", desc: "Secure authentication" }
    ]
  };

  const stats = [
    { value: "50K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { value: "99.9%", label: "Uptime", icon: <Activity className="w-6 h-6" /> },
    { value: "24/7", label: "Support", icon: <MessageSquare className="w-6 h-6" /> },
    { value: "150+", label: "Organizations", icon: <Building2 className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director at TechCorp",
      content: "SHRM has revolutionized how we manage our workforce. The automation features alone have saved us 20+ hours per week.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Operations Manager at StartupXYZ",
      content: "The attendance tracking and payroll integration is seamless. Best HR solution we've implemented.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "CEO at InnovateLabs",
      content: "Comprehensive, intuitive, and powerful. SHRM has everything we need to manage our growing team.",
      rating: 5
    }
  ];

  const useCases = [
    {
      title: "Startups & SMBs",
      description: "Scale your HR operations as you grow with flexible, cost-effective solutions.",
      features: ["Quick setup", "Affordable pricing", "Essential features", "Easy scaling"]
    },
    {
      title: "Enterprise Organizations",
      description: "Manage complex organizational structures with advanced features and security.",
      features: ["Multi-org support", "Advanced analytics", "Custom workflows", "Enterprise security"]
    },
    {
      title: "Remote Teams",
      description: "Keep distributed teams connected with digital attendance and collaboration tools.",
      features: ["Remote tracking", "Digital communication", "Time zone support", "Cloud-based access"]
    }
  ];

  const integrations = [
    { name: "Cloudinary", icon: <Database className="w-6 h-6" />, desc: "File storage" },
    { name: "Nodemailer", icon: <Mail className="w-6 h-6" />, desc: "Email service" },
    { name: "JWT", icon: <Lock className="w-6 h-6" />, desc: "Authentication" },
    { name: "MongoDB", icon: <Database className="w-6 h-6" />, desc: "Database" }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-red-600">
                SHRM
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Features</a>
              <a href="#capabilities" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Capabilities</a>
              <a href="#technology" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Technology</a>
              <a href="#testimonials" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Testimonials</a>
              <button className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:shadow-lg hover:shadow-red-500/50 transition-all font-medium">
                Get Started
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-700 hover:text-red-600 transition-colors">Features</a>
              <a href="#capabilities" className="block py-2 text-gray-700 hover:text-red-600 transition-colors">Capabilities</a>
              <a href="#technology" className="block py-2 text-gray-700 hover:text-red-600 transition-colors">Technology</a>
              <a href="#testimonials" className="block py-2 text-gray-700 hover:text-red-600 transition-colors">Testimonials</a>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:shadow-lg transition-all">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full border border-red-200">
              <Zap className="w-4 h-4 mr-2 text-red-600" />
              <span className="text-sm text-red-700 font-medium">Next-Generation HR Management</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-gray-900">
              Strategic Human Resource
              <br />
              <span className="text-red-600">
                Management System
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A comprehensive full-stack HR solution built with cutting-edge technology. 
              Manage employees, track projects, monitor attendance, process payroll, and gain actionable insights—all in one powerful, unified platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-red-500/30 transition-all flex items-center justify-center group">
                Start Free Trial
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 border-2 border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-50 transition-all">
                Watch Demo
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
              {stats.map((stat, index) => (
                <div key={index} className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="flex justify-center mb-3 text-red-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-red-600">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logo Ticker */}
      <section className="py-16 border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-600 mb-8 font-semibold">Built with industry-leading technologies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {["MongoDB", "Next.js", "Express", "Node.js", "TypeScript", "Tailwind CSS"].map((tech, index) => (
              <div key={index} className="text-gray-400 hover:text-red-600 transition-colors font-bold text-lg">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-red-600">
              Comprehensive HR Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your workforce efficiently, all in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-red-500 transition-all hover:shadow-xl group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Capabilities */}
      <section id="capabilities" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-red-600">
              Powerful Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deep dive into the comprehensive features that make SHRM the most complete HR management solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {capabilities.map((capability, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-red-600 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  {capability.category}
                </h3>
                <ul className="space-y-3">
                  {capability.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-red-600">
              Admin Dashboard Overview
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real-time insights and comprehensive analytics at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 rounded-2xl text-white">
              <PieChart className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Interactive Charts</h3>
              <p className="text-red-100">Attendance trends, project status, and performance metrics visualized beautifully</p>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 rounded-2xl text-white">
              <TrendingUp className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Real-time Statistics</h3>
              <p className="text-red-100">Employee count, active projects, department metrics updated live</p>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 rounded-2xl text-white">
              <Activity className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Performance Tracking</h3>
              <p className="text-red-100">Monthly performance analysis with actionable insights</p>
            </div>
          </div>

          <div className="bg-gray-100 p-12 rounded-3xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Complete Data Visibility</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  The admin dashboard provides a comprehensive overview with key metrics, interactive charts for attendance trends, 
                  project status distribution, and monthly performance tracking. Make data-driven decisions with real-time insights.
                </p>
                <ul className="space-y-3">
                  {["Customizable widgets", "Export reports", "Mobile responsive", "Dark/Light mode"].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-red-600 mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <BarChart3 className="w-full h-48 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-red-600">
              Built on Modern Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leveraging the latest technologies for performance, security, and scalability
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-red-600 flex items-center">
                <Code className="w-6 h-6 mr-3" />
                Frontend Technologies
              </h3>
              <div className="space-y-4">
                {techStack.frontend.map((tech, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{tech.name}</h4>
                      <p className="text-gray-600 text-sm">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-red-600 flex items-center">
                <Database className="w-6 h-6 mr-3" />
                Backend Technologies
              </h3>
              <div className="space-y-4">
                {techStack.backend.map((tech, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{tech.name}</h4>
                      <p className="text-gray-600 text-sm">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-red-600 text-center">Key Integrations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {integrations.map((integration, idx) => (
                <div key={idx} className="text-center p-4 hover:bg-red-50 rounded-xl transition-colors">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3 text-red-600">
                    {integration.icon}
                  </div>
                  <h4 className="font-bold text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-600">{integration.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-red-600">
              Perfect for Every Organization
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From startups to enterprises, SHRM adapts to your unique needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-red-500 transition-all">
                <Target className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{useCase.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="w-4 h-4 text-red-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-red-600">
                Enterprise-Grade Security
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Your data security is our top priority. SHRM implements industry-leading security measures to protect your sensitive HR information.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">JWT Authentication</h3>
                    <p className="text-gray-600">Secure token-based authentication with encrypted password storage using bcrypt.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Role-Based Access Control</h3>
                    <p className="text-gray-600">Granular permissions ensure users only access data relevant to their role.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Data Encryption</h3>
                    <p className="text-gray-600">All sensitive data encrypted at rest and in transit with industry standards.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-12 rounded-2xl shadow-2xl border border-gray-100">
              <div className="text-center mb-8">
                <Shield className="w-24 h-24 mx-auto mb-4 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900">Protected & Compliant</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["GDPR Ready", "SSL Certified", "SOC 2 Type II", "ISO 27001"].map((cert, idx) => (
                  <div key={idx} className="p-4 bg-red-50 rounded-lg text-center">
                    <CheckCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-red-600">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about transforming their HR operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-red-600 text-red-600" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API & Integration */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-red-600">
              Developer-Friendly API
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RESTful API with comprehensive documentation for seamless integration with your existing tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Comprehensive Endpoints</h3>
              <div className="space-y-4">
                {[
                  { method: "POST", endpoint: "/api/auth/login", desc: "User authentication" },
                  { method: "GET", endpoint: "/api/employees", desc: "Retrieve all employees" },
                  { method: "POST", endpoint: "/api/projects", desc: "Create new project" },
                  { method: "GET", endpoint: "/api/attendance/hr/:hrId", desc: "Get attendance data" },
                  { method: "POST", endpoint: "/api/payroll", desc: "Process payroll" }
                ].map((api, idx) => (
                  <div key={idx} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <span className={`px-3 py-1 rounded text-xs font-bold mr-4 ${api.method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {api.method}
                    </span>
                    <div className="flex-1">
                      <code className="text-sm text-gray-900 font-mono">{api.endpoint}</code>
                      <p className="text-gray-600 text-sm mt-1">{api.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">API Features</h3>
              <ul className="space-y-4">
                {[
                  "RESTful architecture",
                  "JSON request/response format",
                  "Comprehensive error handling",
                  "Rate limiting protection",
                  "CORS security enabled",
                  "Detailed documentation",
                  "Webhook support",
                  "Real-time updates"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Ready to Transform Your HR Operations?
              </h2>
              <p className="text-xl text-red-100 mb-8 leading-relaxed">
                Join hundreds of organizations using SHRM to streamline their workforce management. 
                Start your free trial today and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-red-600 rounded-full font-semibold hover:shadow-xl transition-all">
                  Start Your Free Trial
                </button>
                <button className="w-full sm:w-auto px-8 py-4 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all">
                  Schedule a Demo
                </button>
              </div>
              <p className="mt-6 text-red-100 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-red-600">SHRM</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Strategic Human Resource Management System - Your complete HR solution for modern organizations.
              </p>
              <p className="text-gray-600 text-sm">
                Built with Next.js, Express, and MongoDB
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gray-900">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-red-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Updates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-red-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Press Kit</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gray-900">Resources</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-red-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm mb-4 sm:mb-0">
              © 2024 SHRM - Strategic Human Resource Management System. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-red-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-red-600 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SHRMLandingPage;