import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    api
      .me()
      .then((data) => {
        if (alive) setUser(data.user)
      })
      .catch(() => {
        if (alive) setUser(null)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (name, email, password) => {
    const data = await api.register(name, email, password)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      setUser(null)
    }
  }, [])

  // Salva la preferenza tema sull'utente loggato.
  const updateTheme = useCallback(async (theme) => {
    try {
      const data = await api.setTheme(theme)
      setUser(data.user)
    } catch {
      /* la UI ha già applicato il tema in locale */
    }
  }, [])

  // Salva la preferenza lingua sull'utente loggato.
  const updateLanguage = useCallback(async (lang) => {
    try {
      const data = await api.setLanguage(lang)
      setUser(data.user)
    } catch {
      /* la UI ha già applicato la lingua in locale */
    }
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateTheme, updateLanguage }),
    [user, loading, login, register, logout, updateTheme, updateLanguage],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve essere usato dentro <AuthProvider>')
  return ctx
}
