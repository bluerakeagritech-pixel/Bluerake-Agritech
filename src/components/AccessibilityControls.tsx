import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, Globe, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AccessibilityControls = () => {
  const { i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
    if (!isSpeaking) {
      const text = document.querySelector('main')?.textContent;
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = i18n.language;
        speechSynthesis.speak(utterance);
      }
    } else {
      speechSynthesis.cancel();
    }
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = i18n.language;
        recognition.continuous = false;
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          // Handle voice commands here
          console.log('Voice input:', transcript);
        };
        recognition.start();
        setIsListening(true);
      }
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      <button
        onClick={toggleSpeech}
        className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
        aria-label={isSpeaking ? 'Stop speaking' : 'Start speaking'}
      >
        {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <button
        onClick={toggleVoiceInput}
        className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <Mic className="w-5 h-5" />
      </button>

      <button
        onClick={() => document.getElementById('language-select')?.click()}
        className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
      </button>

      {!isOnline && (
        <div className="p-3 bg-yellow-500 text-white rounded-full" aria-label="Offline mode">
          <WifiOff className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default AccessibilityControls;