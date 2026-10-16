import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { useStream } from '../stream/StreamContext.jsx'
import { useTheme } from '../theme/ThemeContext.jsx'
import { useI18n } from '../i18n/LanguageContext.jsx'
import { fmtTime } from '../format.js'
import ModulesDialog from './ModulesDialog.jsx'
import LanguageDialog from './LanguageDialog.jsx'

const LIVE_LABEL = {
  connecting: 'Connessione',
  live: 'Live',
  paused: 'In pausa',
  error: 'Offline',
}

export default function Topbar() {
  const { user, logout } = useAuth()
  const { snapshot, status } = useStream()
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [modulesOpen, setModulesOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  // Orologio del badge Live: scorre ogni secondo, indipendente dallo snapshot.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      <div className="topbar-left">E-BOOST - Powered by Veil Energy.</div>

      <div className="topbar-right">
        <span className={`live-badge live-${status}`}>
          <span className="live-dot" />
          {LIVE_LABEL[status] || status}
          {snapshot && <span className="live-time">{fmtTime(now)}</span>}
        </span>

        <div
          className={`topbar-user ${open ? 'is-open' : ''}`}
          ref={ref}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button type="button" className="topbar-user-btn" onClick={() => setOpen((v) => !v)}>
            <strong>{user?.name || 'utente'}</strong>
            <span className="topbar-avatar" aria-hidden>
              {(user?.name || '?').trim().charAt(0).toUpperCase()}
            </span>
          </button>

          <div className="topbar-menu" role="menu">
            <div className="topbar-menu-head">
              <div className="topbar-menu-name">{user?.name}</div>
              <div className="topbar-menu-mail">{user?.email}</div>
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                setModulesOpen(true)
              }}
            >
              {t('menu.modules')}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                setLangOpen(true)
              }}
            >
              {t('menu.language')}
            </button>

            <label className="topbar-menu-row">
              <span>{t('menu.darkTheme')}</span>
              <span className="switch switch-sm">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                <span className="switch-track">
                  <span className="switch-thumb" />
                </span>
              </span>
            </label>

            <button type="button" role="menuitem" onClick={handleLogout}>
              {t('menu.logout')}
            </button>
          </div>
        </div>
      </div>

      <ModulesDialog open={modulesOpen} onClose={() => setModulesOpen(false)} />
      <LanguageDialog open={langOpen} onClose={() => setLangOpen(false)} />
    </header>
  )
}
