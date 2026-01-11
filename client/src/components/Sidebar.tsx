'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaHeartbeat, FaBookMedical, FaFileMedical, FaUserMd, FaSignOutAlt, FaMicrophone, FaCamera, FaUser, FaLightbulb, FaCalendarAlt, FaUsers, FaBell, FaHistory, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store/store';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user } = useSelector((state: any) => state.auth); // Typed as any to access custom user fields without modifying slice types immediately

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: FaHome },
        { name: 'AI Consultation', path: '/consultation', icon: FaMicrophone },
        { name: 'My History', path: '/consultation/history', icon: FaHistory },
        // { name: 'Rx Scanner', path: '/scan', icon: FaCamera },
        { name: 'Measurements', path: '/measurements', icon: FaHeartbeat },
        { name: 'Diary', path: '/diary', icon: FaBookMedical },
        { name: 'Medical Info', path: '/medical-info', icon: FaBookMedical },
        { name: 'Lab Reports', path: '/lab-reports', icon: FaFileMedical },
        { name: 'Doctor Reports', path: '/doctor-reports', icon: FaUserMd },
        { name: 'Appointments', path: '/appointments', icon: FaCalendarAlt },
        { name: 'Family Health', path: '/family', icon: FaUsers },
        { name: 'Insights', path: '/insights', icon: FaLightbulb },
    ];

    if (user?.type === 'admin') {
        navItems.unshift({ name: 'Admin Panel', path: '/admin', icon: FaUsers });
    }

    if (user?.type === 'doctor') {
        navItems.unshift({ name: 'Doctor Dashboard', path: '/doctor/dashboard', icon: FaUserMd });
    }


    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`h-screen w-72 bg-white border-r border-gray-200 fixed left-0 top-0 z-50 flex flex-col font-sans transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-8">
                    <h1 className="text-2xl font-extrabold flex items-center space-x-2 text-gray-900 tracking-tight">
                        <span>Docmetry</span>
                    </h1>
                </div>

                <nav id="onboarding-sidebar" className="flex-1 px-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                id={`sidebar-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                                href={item.path}
                                onClick={onClose} // Close sidebar on nav click (mobile)
                                className={`flex items-center space-x-3 px-5 py-3.5 rounded-sm transition-all duration-300 group ${isActive
                                    ? 'bg-gradient-primary text-white shadow-md shadow-[#7A8E6B]/20'
                                    : 'text-gray-500 hover:bg-[#7A8E6B]/10 hover:text-[#7A8E6B]'
                                    }`}
                            >
                                <item.icon className={`text-xl ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#7A8E6B]'}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-2">
                    {/* Subscription Status Badge */}
                    <div className={`rounded-xl p-4 mb-2 ${user?.subscription?.plan === 'premium'
                        ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200'
                        : 'bg-gray-50 border border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-bold uppercase tracking-wider ${user?.subscription?.plan === 'premium' ? 'text-amber-700' : 'text-gray-500'
                                }`}>
                                {user?.subscription?.plan === 'premium' ? 'Premium Plan' : 'Free Plan'}
                            </span>
                            {user?.subscription?.plan === 'premium' && <FaStar className="text-amber-500" />}
                        </div>

                        {user?.subscription?.plan !== 'premium' && (
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Consultations</span>
                                        <span>{user?.usage?.aiConsultations || 0}/5</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(((user?.usage?.aiConsultations || 0) / 5) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Scans</span>
                                        <span>{user?.usage?.ocrScans || 0}/5</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(((user?.usage?.ocrScans || 0) / 5) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <Link
                                    href="/pricing"
                                    onClick={onClose}
                                    className="block w-full text-center bg-gray-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-black transition-colors"
                                >
                                    Upgrade to Premium
                                </Link>
                            </div>
                        )}

                        {user?.subscription?.plan === 'premium' && (
                            <p className="text-xs text-amber-800 font-medium">
                                Unlimited Access Unlocked
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                        <span className="text-xs font-bold text-gray-500 uppercase">Settings & Accessibility</span>
                    </div>
                    <Link
                        href="/profile"
                        onClick={onClose}
                        className="flex items-center space-x-3 px-4 py-2 w-full rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                        <FaUser className="text-xl" />
                        <span className="font-medium">Profile</span>
                    </Link>


                    <div className="h-px bg-gray-200 my-2"></div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;