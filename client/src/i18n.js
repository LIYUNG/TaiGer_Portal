import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translation_resources } from './i18next/translation';

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        compatibilityJSON: 'v3',
        resources: translation_resources,
        ns: [
            'admissions',
            'auth',
            'documents',
            'translation',
            'interviews',
            'common',
            'dashboard',
            'cvmlrl',
            'tickets',
            'customerCenter',
            'Note',
            'courses',
            'survey'
        ],
        defaultNS: 'translation',
        debug: true,
        fallbackLng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
