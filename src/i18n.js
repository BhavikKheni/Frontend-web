import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
//import detector from 'i18next-browser-languagedetector';
import backend from 'i18next-xhr-backend';

const navigatorLanguage = navigator.language;
const defaultLanguage = navigatorLanguage.includes('guj') ? 'guj' : 'en';

i18n
  .use(backend)
  // .use(detector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    fallbackLng: 'en' || defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
