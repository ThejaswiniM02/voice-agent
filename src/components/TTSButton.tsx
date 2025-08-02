'use client';

import { useState } from 'react';

const TTSButton = () => {
  const [loading, setLoading] = useState(false);

  const speakText = (text: string) => {
    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => resolve();
      utterance.onerror = (err) => reject(err);
      speechSynthesis.speak(utterance);
    });
  };

  const handleSpeak = async () => {
    try {
      setLoading(true);
      await speakText("Hello! I'm your voice assistant.");
    } catch (error) {
      console.error("Speech error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition duration-200"
    >
      {loading ? 'Speaking...' : 'Speak'}
    </button>
  );
};

export default TTSButton;

