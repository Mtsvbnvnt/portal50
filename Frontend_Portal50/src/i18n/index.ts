import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones
import es from './locales/es.json';
import en from './locales/en.json';
import pt from './locales/pt.json';

const resources = {
  es: { translation: es },
  en: { translation: en },
  pt: { translation: pt }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Español como idioma por defecto
    debug: false,
    
    interpolation: {
      escapeValue: false // React ya escapa por defecto
    },
    
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'portal50-language',
      caches: ['localStorage', 'cookie']
    }
  });

export default i18n;