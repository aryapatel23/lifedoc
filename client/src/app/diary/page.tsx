'use client';
import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchDiaryEntries } from '@/store/slices/diarySlice';
import Link from 'next/link';
import { FaPlus, FaPenFancy, FaSmile, FaMeh, FaFrown, FaBolt, FaCloudRain } from 'react-icons/fa';

export default function DiaryPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { entries, loading } = useSelector((state: RootState) => state.diary);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchDiaryEntries(user.id));
        }
    }, [dispatch, user]);

    const getMoodIcon = (mood?: string) => {
        switch (mood) {
            case 'happy': return <FaSmile className="text-yellow-500 text-xl" />;
            case 'energetic': return <FaBolt className="text-orange-500 text-xl" />;
            case 'neutral': return <FaMeh className="text-gray-500 text-xl" />;
            case 'sad': return <FaCloudRain className="text-blue-500 text-xl" />;
            case 'stressed': return <FaFrown className="text-red-500 text-xl" />;
            default: return <FaSmile className="text-gray-400 text-xl" />;
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64 p-8">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Health Diary</h1>
                            <p className="text-gray-500 mt-1">Journal your thoughts and track your mood.</p>
                        </div>
                        <Link
                            href="/diary/new"
                            className="btn-primary space-x-2"
                        >
                            <FaPlus />
                            <span>New Entry</span>
                        </Link>
                    </header>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading entries...</p>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaPenFancy className="text-2xl text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your diary is empty</h3>
                            <p className="text-gray-500 mb-6">Write your first entry to start tracking your journey.</p>
                            <Link
                                href="/diary/new"
                                className="text-purple-600 font-medium hover:underline"
                            >
                                Write an entry &rarr;
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {entries.map((entry) => (
                                <div key={entry._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#7A8E6B]/30 hover:shadow-md transition flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm font-semibold text-gray-400">
                                            {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            {getMoodIcon(entry.mood)}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{entry.summary}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                                        {entry.rawText || "No additional text details."}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {entry.tags?.map((tag, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
