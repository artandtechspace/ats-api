import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import Cache from 'i18next-localstorage-cache';

import translationEN from './../locale/en.json';
import translationDE from './../locale/de.json';

// the translations
const resources = {
    de: {
        translation: translationDE
    },
    en: {
        translation: translationEN
    }
};

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(Cache)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "de", // use en if detected lng is not available

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        },
        react: {
            wait: true
        }
    });

export default i18n;