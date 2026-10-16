import { useEffect } from 'react'
import { useI18n } from '../i18n/LanguageContext.jsx'

const OPTIONS = [
  { code: 'en', key: 'lang.en' },
  { code: 'it', key: 'lang.it' },
  { code: 'de', key: 'lang.de' },
]

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

export default function LanguageDialog({ open, onClose }) {
  const { lang, setLang, t } = useI18n()

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={t('lang.dialogTitle')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head modal-head-titled">
          <h2 className="modal-title">{t('lang.dialogTitle')}</h2>
          <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          <div className="lang-list" role="listbox">
            {OPTIONS.map((o) => (
              <button
                key={o.code}
                type="button"
                role="option"
                aria-selected={o.code === lang}
                className={`lang-option ${o.code === lang ? 'is-active' : ''}`}
                onClick={() => {
                  setLang(o.code)
                  onClose()
                }}
              >
                <span>{t(o.key)}</span>
                {o.code === lang && <span className="lang-check">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
