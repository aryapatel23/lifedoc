'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

// Dynamically wrap the component (NOT the logic)
const SpeechRecognitionComponent = dynamic(
  () => Promise.resolve(VoiceToText),
  { ssr: false }
);

function VoiceToText() {
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [language, setLanguage] = useState('en-IN');

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-IN', name: 'English (India) - Best for Hinglish' },
    { code: 'hi-IN', name: 'Hindi (हिंदी)' },
  ];

  // Apply polyfill ONCE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      SpeechRecognition.applyPolyfill(
        window.SpeechRecognition ||
          (window as any).webkitSpeechRecognition
      );
    }
  }, []);

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language,
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-4 text-red-600">
        Your browser does not support speech recognition. Please use Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Voice to Text
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={startListening}
          disabled={listening}
          className="px-6 py-3 bg-green-600 text-white rounded-md disabled:bg-gray-400"
        >
          🎤 Start Listening
        </button>

        <button
          onClick={stopListening}
          disabled={!listening}
          className="px-6 py-3 bg-red-600 text-white rounded-md disabled:bg-gray-400"
        >
          ⏹ Stop
        </button>

        <button
          onClick={resetTranscript}
          className="px-6 py-3 bg-gray-600 text-white rounded-md"
        >
          Reset
        </button>
      </div>

      <div className="text-center mb-4">
        <p className="text-lg">
          Microphone:{' '}
          <span className={listening ? 'text-green-600' : 'text-red-600'}>
            {listening ? 'ON' : 'OFF'}
          </span>
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg min-h-32 border">
        <p className="text-gray-700">
          <strong>Live Text:</strong>{' '}
          {interimTranscript || transcript || 'Speak now...'}
        </p>

        {finalTranscript && (
          <p className="mt-4 text-blue-700">
            <strong>Final:</strong> {finalTranscript}
          </p>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-6 text-center">
        💡 <strong>Pro Tip:</strong> Use <em>English (India)</em> for best Hinglish
        results
      </p>
    </div>
  );
}

export default SpeechRecognitionComponent;
