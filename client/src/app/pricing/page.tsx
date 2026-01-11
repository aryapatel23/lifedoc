'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { FaCheck, FaTimes, FaStar, FaShieldAlt, FaBolt, FaSpinner, FaCrown, FaUsers } from 'react-icons/fa';
import api from '@/utils/api';
import stripePromise from '@/utils/stripe';

export default function PricingPage() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const router = useRouter();

    const handleSubscribe = async (plan: string) => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        setLoadingPlan(plan);
        try {
            const { data } = await api.post('/subscription/create-checkout-session', { plan });
            const stripe = await stripePromise;
            if (stripe) {
                const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
                if (error) console.error(error);
            }
        } catch (error) {
            console.error('Subscription Error:', error);
            alert('Failed to start checkout session.');
        } finally {
            setLoadingPlan(null);
        }
    };

    const currentPlan = user?.subscription?.plan || 'free';
    const isPaid = currentPlan !== 'free' && user?.subscription?.status === 'active';

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            period: '/mo',
            description: 'Essential health tracking items',
            color: 'gray',
            features: [
                '5 AI Consultations/mo',
                '5 OCR Scans/mo',
                'Basic Medical Profile',
                'Standard Support'
            ],
            unavailable: [
                'Doctor Reports',
                'Full History',
                'Family Accounts',
                'Smart Insights'
            ],
            icon: FaShieldAlt
        },
        {
            id: 'plus',
            name: 'Plus',
            price: '$4.99',
            period: '/mo',
            description: 'For individuals who need more',
            color: 'blue',
            features: [
                '20 AI Consultations/mo',
                '20 OCR Scans/mo',
                'Unlock Doctor Reports',
                'Unlock Full History',
                'Email Support'
            ],
            unavailable: [
                'Priority Support',
                'Family Sharing'
            ],
            icon: FaBolt
        },
        {
            id: 'premium',
            name: 'Pro',
            price: '$9.99',
            period: '/mo',
            description: 'Unlimited access without limits',
            color: 'amber',
            popular: true,
            features: [
                'Unlimited AI Consultations',
                'Unlimited Scans',
                'Advanced Health Trends',
                'Priority 24/7 Support',
                'Early Access Features'
            ],
            unavailable: [
                'Family Sharing'
            ],
            icon: FaCrown
        },
        {
            id: 'family',
            name: 'Family',
            price: '$19.99',
            period: '/mo',
            description: 'Complete care for your loved ones',
            color: 'purple',
            features: [
                'Everything in Pro',
                'Up to 5 Family Members',
                'Unified Dashboard',
                'Child & Senior Monitoring',
                'Dedicated Care Manager'
            ],
            unavailable: [],
            icon: FaUsers
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Pricing Plans</h2>
                    <h1 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Health</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Choose the plan that fits your needs. Upgrade or cancel anytime.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col rounded-3xl bg-white shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 ${plan.popular ? 'border-amber-400 ring-4 ring-amber-400/20 scale-105 z-10' : 'border-gray-100 hover:border-blue-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
                            )}
                            {plan.popular && (
                                <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Effect Value
                                </div>
                            )}

                            <div className="p-8 flex-1">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-2xl ${plan.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                                        plan.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                            plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                                'bg-gray-100 text-gray-600'
                                    }`}>
                                    <plan.icon />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

                                <div className="mt-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                    {plan.price !== '$0' && <span className="ml-1 text-lg font-medium text-gray-500">{plan.period}</span>}
                                </div>

                                <ul className="mt-8 space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <FaCheck className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                                            <span className="text-sm text-gray-600 font-medium">{feature}</span>
                                        </li>
                                    ))}
                                    {plan.unavailable?.map((feature, idx) => (
                                        <li key={idx} className="flex items-start opacity-50">
                                            <FaTimes className="h-5 w-5 text-gray-400 shrink-0 mr-3" />
                                            <span className="text-sm text-gray-500">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 bg-gray-50 border-t border-gray-100 mt-auto">
                                {plan.id === currentPlan ? (
                                    <button
                                        disabled
                                        className="w-full py-4 px-6 rounded-xl border border-gray-300 bg-white text-gray-500 font-bold cursor-not-allowed text-sm"
                                    >
                                        Current Plan
                                    </button>
                                ) : plan.id === 'free' ? (
                                    <button
                                        disabled
                                        className="w-full py-4 px-6 rounded-xl border border-gray-200 bg-gray-100 text-gray-400 font-bold cursor-not-allowed text-sm"
                                    >
                                        Downgrade
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={loadingPlan === plan.id || loadingPlan !== null}
                                        className={`w-full py-4 px-6 rounded-xl font-bold text-white text-sm shadow-lg transition-all transform active:scale-95 flex justify-center items-center ${loadingPlan !== null && loadingPlan !== plan.id ? 'opacity-50 cursor-not-allowed' : ''
                                            } ${plan.color === 'amber' ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/30' :
                                                plan.color === 'purple' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/30' :
                                                    'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/30'
                                            }`}
                                    >
                                        {loadingPlan === plan.id ? (
                                            <FaSpinner className="animate-spin text-xl" />
                                        ) : (
                                            `Get ${plan.name}`
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-500 text-sm">
                        All plans include our 30-day money-back guarantee. <br />
                        Questions? Contact our <a href="#" className="text-blue-600 underline">support team</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
