'use client';

import { useEffect } from 'react';
import SpeechRecognitionComponent from "./Components/SpeechInput";
import { FiMic, FiPlus, FiArchive, FiShare2, FiClock, FiFileText, FiLogOut, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-8 py-6 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FiFileText className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LifeDoc</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition">
              Sign In
            </Link>
            <Link href="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition transform hover:scale-105">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                  Your Health, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Documented</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Create, organize, and share your medical records with the power of voice. Modern healthcare management at your fingertips.
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/signup" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition transform hover:scale-105 inline-block">
                  Start Free Trial
                </Link>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:border-gray-900 hover:shadow-lg transition">
                  Learn More
                </button>
              </div>

              <div className="flex gap-8 text-sm text-gray-600">
                <div>✓ No credit card required</div>
                <div>✓ 14-day free trial</div>
                <div>✓ 24/7 support</div>
              </div>
            </div>

            {/* Right - Feature Highlight */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-blue-600">
                  <FiMic className="text-2xl" />
                  <span className="font-semibold">Voice-Powered</span>
                </div>
                <p className="text-gray-700">
                  Simply speak your symptoms, medical history, and health updates. Our AI-powered system converts your voice into well-organized medical records.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100 space-y-3">
                  <p className="text-sm text-gray-600 font-mono">Try it now:</p>
                  <p className="text-gray-800 italic">"I have a persistent headache for 3 days, temperature is 101F"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-20 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-8">
            <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">
              Powerful Features for Modern Healthcare
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: FiMic, title: "Voice Input", desc: "Record medical information hands-free" },
                { icon: FiPlus, title: "Smart Organization", desc: "Automatically categorized health records" },
                { icon: FiShare2, title: "Easy Sharing", desc: "Share with doctors and family securely" },
              ].map((feature, i) => (
                <div key={i} className="p-8 border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition group">
                  <feature.icon className="text-3xl text-blue-600 mb-4 group-hover:scale-110 transition" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-8 text-center space-y-6">
            <h3 className="text-4xl font-bold">Ready to Transform Your Health Records?</h3>
            <p className="text-lg text-blue-100">Join thousands of users managing their health smarter</p>
            <Link href="/signup" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:shadow-xl transition transform hover:scale-105">
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard for logged-in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FiFileText className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LifeDoc</h1>
          </div>
          <div className="flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <FiUser className="text-gray-600" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h2>
          <p className="text-gray-600">Create and manage your health documents with ease</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: FiMic, title: "New Record", desc: "Record voice", color: "from-blue-500 to-blue-600" },
            { icon: FiFileText, title: "All Records", desc: "View documents", color: "from-purple-500 to-purple-600" },
            { icon: FiArchive, title: "Archive", desc: "Saved items", color: "from-pink-500 to-pink-600" },
            { icon: FiShare2, title: "Sharing", desc: "Share records", color: "from-green-500 to-green-600" },
          ].map((card, i) => (
            <button key={i} className={`p-6 bg-gradient-to-br ${card.color} rounded-xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition group text-left`}>
              <card.icon className="text-3xl mb-3 group-hover:rotate-12 transition" />
              <h3 className="font-semibold text-lg">{card.title}</h3>
              <p className="text-sm opacity-90">{card.desc}</p>
            </button>
          ))}
        </div>

        {/* Voice Input Component */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-200">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiMic className="text-blue-600" />
              Record Your Health Information
            </h3>
            <SpeechRecognitionComponent />
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiClock className="text-purple-600" />
            Recent Records
          </h3>
          <div className="text-center py-12 text-gray-500">
            <p>No records yet. Start by recording your first health document!</p>
          </div>
        </div>
      </div>
    </div>
  );
}