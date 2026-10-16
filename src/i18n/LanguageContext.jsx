import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { translations } from './translations.js'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'ems-lang'
const SUPPORTED = ['it', 'en', 'de']

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (SUPPORTED.includes(saved)) return saved
  } catch {
    /* storage non disponibile */
  }
  return 'it'
}

export function LanguageProvider({ children }) {
  const { user, updateLanguage } = useAuth()
  const [lang, setLangState] = useState(initialLang)

  // Al login applica la lingua salvata sull'utente.
  useEffect(() => {
    if (!user) return
    setLangState(SUPPORTED.includes(user.lang) ? user.lang : 'it')
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignora */
    }
  }, [lang])

  const value = useMemo(() => {
    const dict = translations[lang] || translations.it
    const t = (key) => dict[key] ?? translations.it[key] ?? key
    const setLang = (next) => {
      if (!SUPPORTED.includes(next)) return
      setLangState(next)
      if (user) updateLanguage(next)
    }
    return { lang, setLang, t }
  }, [lang, user, updateLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n deve essere usato dentro <LanguageProvider>')
  return ctx
}
