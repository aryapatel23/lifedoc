'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { encrypt } from '@/utils/cryptoUtils';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const pendingEmail = sessionStorage.getItem('pendingEmail');
    if (!pendingEmail) {
      router.push('/signup');
    } else {
      setEmail(pendingEmail);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const encryptedData = encrypt({ email, otp });

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        encryptedData
      });

      if (response.status === 200) {
        const { token } = response.data;
        const rememberMe = JSON.parse(sessionStorage.getItem('rememberMe') || 'false');
        
        if (rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        sessionStorage.removeItem('pendingEmail');
        sessionStorage.removeItem('rememberMe');
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Email</h2>
        <p className="text-gray-600 mb-4 text-center">
          Please enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border rounded text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
