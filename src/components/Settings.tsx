import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;

const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
};

const Settings = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleVoiceCommand = () => {
    recognition.start();

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Voice command:', transcript);

      if (transcript.includes('enable email') || transcript.includes('disable email')) {
        document.getElementById('email-toggle')?.click();
      } else if (transcript.includes('enable two-factor') || transcript.includes('disable two-factor')) {
        document.getElementById('2fa-toggle')?.click();
      } else if (transcript.includes('change language to twi')) {
        i18n.changeLanguage('twi');
      } else if (transcript.includes('change language to english')) {
        i18n.changeLanguage('en');
      } else {
        alert(`Unrecognized command: "${transcript}"`);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
    };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>

          {/* TTS Button */}
          <button
            onClick={() =>
              speak(
                'Welcome to the settings page. You can update your account preferences, privacy, and language options.'
              )
            }
            className="ml-auto px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
          >
            🔊 Read Aloud
          </button>

          {/* Voice Command Button */}
          <button
            onClick={handleVoiceCommand}
            className="ml-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            🎤 Speak Command
          </button>
        </div>

        <div className="space-y-6">
          {/* Account Preferences */}
          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Account Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="email-toggle" className="text-gray-700">Email Notifications</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input id="email-toggle" type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="2fa-toggle" className="text-gray-700">Two-Factor Authentication</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input id="2fa-toggle" type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Data Privacy */}
          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Data Privacy</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Share Analytics</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-700">Public Profile</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Localization Settings */}
          <section>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Localization</h2>
            <div className="flex items-center gap-4">
              <label htmlFor="language" className="text-gray-700">Language</label>
              <select
                id="language"
                onChange={(e) => changeLanguage(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="en">English</option>
                <option value="twi">Twi</option>
                <option value="ewe">Ewe</option>
                <option value="hausa">Hausa</option>
                <option value="dagbani">Dagbani</option>
              </select>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
