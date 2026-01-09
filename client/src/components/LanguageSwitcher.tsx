'use client';

import { useEffect, useState } from 'react';
import { FaGlobe, FaTimes, FaChevronUp } from 'react-icons/fa';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: any;
    }
}

export default function LanguageSwitcher() {
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
        <div className="print:hidden">
            {/* Hidden container for the Google widget */}
            <div id="google_translate_element" className="hidden"></div>

            {isOpen && (
                <div className="bg-white rounded-lg shadow-lg p-4 mb-2 border border-blue-100 w-full animate-slide-up">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-gray-800">Select Language</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`flex flex-col items-start p-2 rounded-lg border-2 transition-all w-full ${currentLang === lang.code
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <span className="text-sm font-bold">{lang.native}</span>
                                <span className="text-xs opacity-70 uppercase tracking-wider">{lang.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 px-4 py-2 w-full rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
                <FaGlobe className="text-xl" />
                <div className="text-left flex-1">
                    <span className="font-medium text-sm">
                        {languages.find(l => l.code === currentLang)?.native || 'English'}
                    </span>
                </div>
                <FaChevronUp size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
    );
}
