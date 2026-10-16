import { useEffect } from 'react'
import { useClient } from '../client/ClientContext.jsx'
import { MODULES } from '../data/modules.js'

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

export default function ModulesDialog({ open, onClose }) {
  const { clientName, clientTier, clientActiveModules } = useClient()

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const active = new Set(clientActiveModules)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal-lg"
        role="dialog"
        aria-modal="true"
        aria-label="Moduli E-BOOST"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head modal-head-titled">
          <div>
            <h2 className="modal-title">Moduli E-BOOST</h2>
            <div className="modal-subtitle">
              {clientName} · piano {clientTier}
            </div>
          </div>
          <button type="button" className="icon-btn" aria-label="Chiudi" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="modal-body">
          {MODULES.map((m) => {
            const isActive = active.has(m.id)
            return (
              <article
                key={m.id}
                className={`module-card ${isActive ? 'is-active' : 'is-inactive'}`}
              >
                <div className="module-card-head">
                  <h3 className="module-name">{m.name}</h3>
                  <span className={`module-status ${isActive ? 'is-active' : 'is-inactive'}`}>
                    {isActive ? 'Attivo' : 'Non attivo'}
                  </span>
                </div>

                <p className="module-desc">{m.description}</p>

                <ul className="module-features">
                  {m.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                {!isActive && (
                  <div className="module-cta">
                    <button type="button" className="btn-request">
                      Richiedi
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
