'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { encrypt } from '@/utils/cryptoUtils';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { rememberMe, ...dataToEncrypt } = formData;
      const encryptedData = encrypt(dataToEncrypt);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        encryptedData
      });

      if (response.status === 200) {
        const { token } = response.data;
        if (formData.rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-gray-900">Life</div>
          <div className="text-2xl font-bold text-emerald-600">Doc</div>
        </div>
        <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
          EN ▼
        </button>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-8 lg:px-16">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
              Welcome Back
            </h1>
            <p className="text-center text-gray-600 mb-10 text-sm leading-relaxed">
              Sign in to your account to access your medical documents and health history.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    id="rememberMe"
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 text-sm mt-8">
              Don't have an account?{' '}
              <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Sign Up
              </Link>
            </p>

            {/* Footer */}
            <div className="text-center text-gray-500 text-xs mt-12">
              <p>Need help? <a href="mailto:support@lifedoc.com" className="text-emerald-600 hover:text-emerald-700">support@lifedoc.com</a></p>
            </div>
          </div>
        </div>

        {/* Right Side - Content (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-400 to-emerald-600 flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4">
              Your Health Matters
            </h2>
            <p className="text-emerald-50 text-lg leading-relaxed">
              Access your medical records, track your health history, and stay connected with your healthcare providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
