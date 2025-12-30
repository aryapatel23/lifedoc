'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FaArrowLeft, FaVial, FaNotesMedical, FaInfoCircle, FaClipboardCheck, FaMicroscope, FaFlask, FaClipboardList } from 'react-icons/fa';

interface LabTest {
    _id: string;
    name: string;
    description: string;
    normalRange: string;
    preparation: string;
    clinicalSignificance: string;
    category: string;
}

const TestDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useSelector((state: RootState) => state.auth);
    const [test, setTest] = useState<LabTest | null>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api/reference';

    useEffect(() => {
        if (token && id) {
            fetchDetails();
        }
    }, [token, id]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/tests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setTest(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 ml-0 md:ml-72 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3AAFA9]"></div>
                </div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 ml-0 md:ml-72 p-8 text-center text-gray-500">
                    Test not found.
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-0 md:ml-72 p-8 transition-all duration-300">
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-[#3AAFA9] mb-6 flex items-center transition-colors font-medium"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-[#3AAFA9]/10 p-8 border-b border-[#3AAFA9]/20">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-2xl text-[#3AAFA9]">
                                <FaMicroscope />
                            </div>
                            <span className="px-3 py-1 bg-white/60 text-[#2B7A78] text-sm font-semibold rounded-full border border-[#3AAFA9]/20">
                                {test.category}
                            </span>
                            {test.source === 'MedlinePlus' && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
                                    MedlinePlus API
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{test.name}</h1>

                        {/* Description (Handle HTML if from API) */}
                        <div className="text-gray-700 text-lg leading-relaxed max-w-4xl">
                            <div dangerouslySetInnerHTML={{ __html: test.description }} className="prose prose-sm md:prose-base text-gray-700" />
                        </div>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        {/* Clinical Significance / Summary */}
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaNotesMedical className="mr-2 text-green-500" />
                                Clinical Summary
                            </h3>
                            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                                <p className="text-gray-700 leading-relaxed font-medium">
                                    {test.clinicalSignificance}
                                </p>
                            </div>
                        </div>

                        {/* Normal Range (Usually N/A for API) */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaFlask className="mr-2 text-[#3AAFA9]" />
                                Normal Range / Values
                            </h3>
                            <div className="bg-[#3AAFA9]/5 p-6 rounded-2xl border border-[#3AAFA9]/20 h-full">
                                <p className="text-gray-700 font-medium">
                                    {test.normalRange || 'Reference ranges vary by laboratory. Consult your doctor.'}
                                </p>
                            </div>
                        </div>

                        {/* Preparation */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaClipboardList className="mr-2 text-orange-500" />
                                Preparation
                            </h3>
                            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 h-full">
                                <p className="text-gray-700 font-medium">
                                    {test.preparation || 'Follow specific instructions provided by your healthcare provider.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestDetailsPage;
