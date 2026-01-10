"use client";

import React from "react";
import SOSButton from "@/components/SOSButton";
import SpeechInput from "@/app/Components/SpeechInput";

export default function ActionDock() {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-end gap-4 print:hidden">

            {/* Speech Input */}
            <div className="relative group">
                <SpeechInput className="!static !transform-none !bottom-auto !right-auto" />
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl w-48 text-center border border-white/10">
                    <p className="font-bold mb-0.5 text-blue-400">Voice Typing</p>
                    <p className="text-gray-300">Speak to fill out forms and text fields automatically.</p>
                </div>
            </div>

            {/* SOS Button */}
            <div className="relative group">
                <SOSButton className="!static !transform-none !bottom-auto !right-auto" />
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl whitespace-nowrap border border-white/10">
                    Emergency SOS (Hold 3s)
                </div>
            </div>

        </div>
    );
}
