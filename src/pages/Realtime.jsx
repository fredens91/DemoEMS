import { useEffect, useState } from 'react'
import { useStream } from '../stream/StreamContext.jsx'
import { useClient } from '../client/ClientContext.jsx'
import { useI18n } from '../i18n/LanguageContext.jsx'
import { TAGS, fmt } from '../format.js'
import ElectricalDetail from '../components/ElectricalDetail.jsx'

function BurgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

export default function Realtime() {
  const { snapshot } = useStream()
  const { clientTier } = useClient()
  const { t: tr } = useI18n()
  const rows = snapshot?.auxiliaries ?? []
  const showState = clientTier === 'Advanced'
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    function onKey(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <section className="page">
      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">{tr('realtime.panelTitle')}</h2>
          <button
            type="button"
            className="icon-btn"
            aria-label="Apri menu"
            onClick={() => setMenuOpen(true)}
          >
            <BurgerIcon />
          </button>
        </div>

        <div className="table-wrap">
          <table className="tags-table">
            <thead>
              <tr>
                <th className="col-aux">{tr('realtime.aux')}</th>
                {showState && <th>{tr('realtime.state')}</th>}
                {TAGS.map((t) => (
                  <th key={t.key} className="col-num">
                    {t.label}
                    <span className="unit">{t.unit}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={TAGS.length + 1 + (showState ? 1 : 0)} className="empty">
                    {tr('realtime.waiting')}
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="col-aux">
                    <span className={`kind-badge kind-${row.kind}`}>
                      {row.kind === 'source' ? 'GEN' : 'LOAD'}
                    </span>
                    {row.name}
                  </td>
                  {showState && (
                    <td>
                      <span className={`aux-state aux-state-${row.status}`}>
                        {tr(`state.${row.status}`)}
                      </span>
                    </td>
                  )}
                  {TAGS.map((t) => {
                    const v = row[t.key]
                    const negative = t.key === 'power' && v < 0
                    return (
                      <td key={t.key} className={`col-num ${negative ? 'is-negative' : ''}`}>
                        {fmt(v, t.decimals)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="page-note">
        Potenza negativa = energia immessa (generazione). Valori simulati dal modulo di campo
        <code> backend/src/simulator.ts</code>.
      </p>

      {menuOpen && (
        <div className="modal-overlay" onClick={() => setMenuOpen(false)}>
          <div
            className="modal modal-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Tutti i consumi"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head modal-head-titled">
              <h2 className="modal-title">Tutti i consumi</h2>
              <button
                type="button"
                className="icon-btn"
                aria-label="Chiudi"
                onClick={() => setMenuOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <ElectricalDetail auxiliaries={rows} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
