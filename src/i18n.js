import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from "i18next-xhr-backend";

const navigatorLanguage = navigator.language;
const defaultLanguage = navigatorLanguage.includes("fr") ? "fr" : "en";

i18n
  .use(backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    fallbackLng: "en" || defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
