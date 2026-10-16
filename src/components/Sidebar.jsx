import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useClient } from '../client/ClientContext.jsx'
import { useI18n } from '../i18n/LanguageContext.jsx'

const NAV = [
  { to: '/home', key: 'nav.home' },
  { to: '/realtime', key: 'nav.realtime' },
  { to: '/historical', key: 'nav.historical' },
  { to: '/maintenance', key: 'nav.maintenance' },
]

function ChevronDown({ open }) {
  return (
    <svg
      className={`sidebar-plant-chevron ${open ? 'is-open' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function Sidebar() {
  const { clients, clientId, clientName, clientTier, canSwitch, setClientId } = useClient()
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link to="/home" className="sidebar-logo" aria-label="Home">
          <Logo height={26} />
        </Link>
        <span className="sidebar-tier">{clientTier}</span>
      </div>

      <nav className="sidebar-nav">
        {canSwitch ? (
          <div className={`sidebar-plant ${open ? 'is-open' : ''}`} ref={ref}>
            <button
              type="button"
              className="sidebar-plant-toggle"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span>{clientName}</span>
              <ChevronDown open={open} />
            </button>

            {open && (
              <div className="sidebar-plant-menu" role="listbox">
                {clients.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="option"
                    aria-selected={c.id === clientId}
                    className={`sidebar-plant-option ${c.id === clientId ? 'is-active' : ''}`}
                    onClick={() => {
                      setClientId(c.id)
                      setOpen(false)
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="sidebar-plant">
            <div className="sidebar-plant-static">{clientName}</div>
          </div>
        )}

        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            {t(item.key)}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-help">
        {t('help.text')} <a href="#">{t('help.contact')}</a>
      </div>
    </aside>
  )
}
