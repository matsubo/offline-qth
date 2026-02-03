import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 翻訳リソースを直接インポート
import jaTranslation from '../public/locales/ja/translation.json'
import enTranslation from '../public/locales/en/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ja: {
        translation: jaTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    fallbackLng: 'ja',
    supportedLngs: ['ja', 'en'],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
