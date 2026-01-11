'use client';
import Link from 'next/link';
import { FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function PaymentFailedPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                    <FaTimesCircle />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
                <p className="text-gray-600 mb-6">
                    The transaction was not completed. No charges were made to your account.
                </p>

                <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-left flex gap-3">
                    <div className="mt-1">
                        <FaExclamationTriangle className="text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-yellow-900 text-sm mb-1">Common Issues</h3>
                        <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
                            <li>Card was declined by bank</li>
                            <li>Insufficient funds</li>
                            <li>Internet connection timeout</li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/pricing"
                        className="block w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        Try Again
                    </Link>

                    <Link
                        href="/dashboard"
                        className="block w-full text-gray-500 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
