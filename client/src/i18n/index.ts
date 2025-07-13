import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import frTranslation from './locales/fr/translation.json';
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import ptTranslation from './locales/pt/translation.json';
import itTranslation from './locales/it/translation.json';
import deTranslation from './locales/de/translation.json';
import nlTranslation from './locales/nl/translation.json';
import zhTranslation from './locales/zh/translation.json';
import jaTranslation from './locales/ja/translation.json';
import koTranslation from './locales/ko/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: 'fr', // Force French as default language
    fallbackLng: 'fr',
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      fr: {
        translation: frTranslation,
      },
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
      pt: {
        translation: ptTranslation,
      },
      it: {
        translation: itTranslation,
      },
      de: {
        translation: deTranslation,
      },
      nl: {
        translation: nlTranslation,
      },
      zh: {
        translation: zhTranslation,
      },
      ja: {
        translation: jaTranslation,
      },
      ko: {
        translation: koTranslation,
      },
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;