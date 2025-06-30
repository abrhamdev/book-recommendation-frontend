import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en.json';
import amTranslations from '../locales/am.json';

const savedLang = localStorage.getItem('preferredLang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations }, 
      am: { translation: amTranslations }
    },
    lng: savedLang, // Use saved language
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

// Auto-save language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('preferredLang', lng);
});

export default i18n;