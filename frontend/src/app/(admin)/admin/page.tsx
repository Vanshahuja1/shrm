"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, Code, GraduationCap, Plus } from 'lucide-react';
import { useRouter } from "next/navigation";
import Loading from "../../components/Loading"; // Adjust path if needed

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [creativeMsgIndex, setCreativeMsgIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const creativeMessages = [
    "कर्म करो, फल की चिंता मत करो",
    "सफलता का रहस्य निरंतर अभ्यास में छुपा है",
    "जो व्यक्ति अपने सपनों को साकार करने के लिए कड़ी मेहनत करता है, वही सफल होता है",
    "ज्ञान ही सबसे बड़ी संपत्ति है जो कभी चोरी नहीं हो सकती",
    "धैर्य, दृढ़ता और सकारात्मक सोच ही सफलता की कुंजी है",
    "आज का कठिन परिश्रम कल की सफलता का आधार है",
    "विद्या ददाति विनयं - ज्ञान विनम्रता देता है",
    "उत्कृष्टता एक कौशल नहीं, बल्कि एक आदत है",
    "जहाँ चाह है, वहाँ राह है",
    "सच्ची शिक्षा वह है जो चरित्र का निर्माण करे"
  ];

  const router = useRouter();

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
    }, 900); // show loading for at least 900ms
  };

 

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    setCreativeMsgIndex(Math.floor(Math.random() * creativeMessages.length));

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else if (hour < 21) {
      setGreeting('Good Evening');
    } else {
      setGreeting('Good Night');
    }
  }, [currentTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Loading isLoading={isLoading} />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Hey <span className="text-red-600">Narendra Sir</span>
            </h2>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <p className="text-2xl text-gray-700 font-medium">{greeting}</p>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {creativeMessages[creativeMsgIndex]}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-500 mb-1">{formatDate(currentTime)}</p>
            <p className="text-xs text-red-600">Welcome back to your dashboard</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* UPSC Organization */}
          <div 
            onClick={() => handleNavigation('/admin/UPSC')}
            className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">UPSC Organization</h3>
              <p className="text-red-100 text-sm">Civil Services Excellence</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 leading-relaxed">
                Comprehensive UPSC preparation and guidance platform for aspiring civil servants.
              </p>
              <div className="flex items-center text-red-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span>Explore UPSC</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>

          {/* IT Solutions */}
          <div 
            onClick={() => handleNavigation('/admin/IT')}
            className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
          >
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Code className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">IT Solutions</h3>
              <p className="text-gray-300 text-sm">Technology & Innovation</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 leading-relaxed">
                Advanced IT solutions, software development, and digital transformation services.
              </p>
              <div className="flex items-center text-red-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span>Enter IT Hub</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>

          {/* Add New Organization */}
          <div 
            onClick={() => handleNavigation('/admin/new-organization')}
            className="group bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-xl border-2 border-dashed border-red-300 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:border-red-500"
          >
            <div className="p-8 text-center h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 group-hover:scale-110 transition-all duration-300">
                <Plus className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Add New Organization</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Expand your enterprise portfolio with new organizational divisions.
              </p>
              <div className="flex items-center justify-center text-red-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span>Create New</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-600">2</div>
              <div className="text-gray-600">Active Organizations</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-600">24/7</div>
              <div className="text-gray-600">System Availability</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-600">100%</div>
              <div className="text-gray-600">Professional Excellence</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}