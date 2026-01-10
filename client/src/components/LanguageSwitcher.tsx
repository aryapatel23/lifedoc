'use client';

import { useEffect, useState } from 'react';
import { FaGlobe, FaTimes, FaChevronUp } from 'react-icons/fa';

interface LanguageSwitcherProps {
    className?: string; // Allow custom positioning/styling
}

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: any;
    }
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        // Initialize Google Translate
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,gu,mr', // English, Hindi, Gujarati, Marathi
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };

        // Load the script if not already loaded
        if (!document.getElementById('google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }

        // Check for existing cookie to set initial state
        const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
        if (match) {
            setCurrentLang(match[1]);
        }
    }, []);

    const changeLanguage = (langCode: string) => {
        // specific logic to set the google translate cookie
        // The cookie format Google expects is /sourceLang/targetLang
        const cookieValue = `/en/${langCode}`;

        // We need to set it on domain level to ensure it sticks
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=${cookieValue}; path=/;`; // Fallback

        setCurrentLang(langCode);
        setIsOpen(false);

        // Reload to apply translation
        window.location.reload();
    };

    const languages = [
        { code: 'en', label: 'English', native: 'English' },
        { code: 'hi', label: 'Hindi', native: 'हिंदी' },
        { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
        { code: 'mr', label: 'Marathi', native: 'मराठी' },
    ];

    return (
        <div className={`relative flex flex-col items-end gap-4 print:hidden ${className || ''}`}>
            {/* Hidden container for the Google widget */}
            <div id="google_translate_element" className="hidden"></div>

            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl p-6 mb-2 border border-blue-100 w-72 animate-slide-up">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Select Language</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 p-2"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="grid gap-3">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all ${currentLang === lang.code
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <span className="text-lg font-bold">{lang.native}</span>
                                <span className="text-xs opacity-70 uppercase tracking-wider">{lang.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                            Powered by <span className="font-bold text-gray-500">Google Translate</span>
                        </p>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-3 bg-white text-gray-800 px-6 py-4 rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg transition-colors ${isOpen ? 'bg-red-500' : 'bg-blue-600 group-hover:bg-blue-700'}`}>
                    {isOpen ? <FaTimes /> : <FaGlobe />}
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Language</p>
                    <p className="text-sm font-bold text-gray-900">
                        {languages.find(l => l.code === currentLang)?.native || 'English'}
                    </p>
                </div>
                {!isOpen && <FaChevronUp className="text-gray-300 group-hover:text-blue-500" />}
            </button>
        </div>
    );
}
