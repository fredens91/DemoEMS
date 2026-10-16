import { useAuth } from '../auth/AuthContext.jsx'
import { useClient } from '../client/ClientContext.jsx'
import { useStream } from '../stream/StreamContext.jsx'
import { useI18n } from '../i18n/LanguageContext.jsx'
import { MODULES } from '../data/modules.js'
import { fmt } from '../format.js'

function shortDesc(text) {
  const first = text.split('. ')[0]
  return first.endsWith('.') ? first : `${first}.`
}

export default function Home() {
  const { user } = useAuth()
  const { clientName, clientTier, clientActiveModules } = useClient()
  const { snapshot } = useStream()
  const { t } = useI18n()

  const activeSet = new Set(clientActiveModules)
  const activeModules = MODULES.filter((m) => activeSet.has(m.id))

  const aux = snapshot?.auxiliaries ?? []
  const loads = aux.filter((a) => a.kind === 'load')
  const sources = aux.filter((a) => a.kind === 'source')
  const drawn = loads.reduce((s, a) => s + Math.max(a.power, 0), 0)
  const generated = sources.reduce((s, a) => s + Math.abs(Math.min(a.power, 0)), 0)
  const energyToday = aux.reduce((s, a) => s + a.energyToday, 0)

  return (
    <section className="page home">
      <div>
        <h2 className="home-hello">
          {t('home.welcome')}, {user?.name || 'utente'}
        </h2>
        <p className="home-sub">
          {clientName} · {t('home.plan')} <strong>{clientTier}</strong>
        </p>
      </div>

      <section className="home-block">
        <h3>{t('home.activeModules')}</h3>
        {activeModules.length === 0 ? (
          <p className="home-empty">{t('home.noModules')}</p>
        ) : (
          <div className="home-modules">
            {activeModules.map((m) => (
              <article key={m.id} className="home-module">
                <h4>{m.name}</h4>
                <p>{shortDesc(m.description)}</p>
                <ul>
                  {m.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="home-block">
        <h3>{t('home.overview')}</h3>

        {aux.length === 0 ? (
          <p className="home-empty">{t('home.waiting')}</p>
        ) : (
          <>
            <div className="stat-grid">
              <div className="stat-tile">
                <div className="stat-num">{aux.length}</div>
                <div className="stat-lbl">{t('home.stat.aux')}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-num">{loads.length}</div>
                <div className="stat-lbl">{t('home.stat.loads')}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-num">{sources.length}</div>
                <div className="stat-lbl">{t('home.stat.sources')}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-num">
                  {fmt(drawn, 0)} <span className="stat-unit">kW</span>
                </div>
                <div className="stat-lbl">{t('home.stat.drawn')}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-num is-negative">
                  {fmt(generated, 0)} <span className="stat-unit">kW</span>
                </div>
                <div className="stat-lbl">{t('home.stat.generated')}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-num">
                  {fmt(energyToday, 0)} <span className="stat-unit">kWh</span>
                </div>
                <div className="stat-lbl">{t('home.stat.energyToday')}</div>
              </div>
            </div>

            <p className="home-narrative">
              L'impianto di <strong>{clientName}</strong> monitora <strong>{aux.length}</strong>{' '}
              ausiliari ({loads.length} in prelievo, {sources.length} in generazione). In questo
              momento assorbe circa <strong>{fmt(drawn, 0)} kW</strong>
              {generated > 0 && (
                <> a fronte di <strong>{fmt(generated, 0)} kW</strong> autoprodotti</>
              )}
              , con un bilancio netto di <strong>{fmt(drawn - generated, 0)} kW</strong>.
            </p>

            <div className="aux-chips">
              {aux.map((a) => (
                <span key={a.id} className="aux-chip">
                  <span className={`kind-badge kind-${a.kind}`}>
                    {a.kind === 'source' ? 'GEN' : 'LOAD'}
                  </span>
                  {a.name}
                </span>
              ))}
            </div>
          </>
        )}
      </section>
    </section>
  )
}
