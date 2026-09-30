// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import twi from "./locales/twi.json";
import ewe from "./locales/ewe.json";
import hausa from "./locales/hausa.json";
import dagbani from "./locales/dagbani.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    twi: { translation: twi },
    ewe: { translation: ewe },
    hausa: { translation: hausa },
    dagbani: { translation: dagbani },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
