import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'ems-theme'

function initialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* storage non disponibile */
  }
  return 'dark' // tema scuro di default
}

export function ThemeProvider({ children }) {
  const { user, updateTheme } = useAuth()
  const [theme, setTheme] = useState(initialTheme)

  // Al cambio utente (login) applica la preferenza salvata su quell'utente.
  useEffect(() => {
    if (!user) return
    setTheme(user.theme === 'light' ? 'light' : 'dark')
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Applica il tema al DOM; tieni una copia in localStorage per il
  // pre-login (schermata di accesso).
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignora */
    }
  }, [theme])

  const value = useMemo(() => {
    const apply = (next) => {
      setTheme(next)
      if (user) updateTheme(next)
    }
    return {
      theme,
      setTheme: apply,
      toggleTheme: () => apply(theme === 'dark' ? 'light' : 'dark'),
    }
  }, [theme, user, updateTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme deve essere usato dentro <ThemeProvider>')
  return ctx
}
