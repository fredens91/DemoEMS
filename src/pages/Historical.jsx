import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api.js'
import { useClient } from '../client/ClientContext.jsx'
import { fmt } from '../format.js'

// Grandezze selezionabili nel grafico storico. L'energia è cumulata
// sull'intervallo scelto nella tab "Intervallo".
const VALUES = [
  { key: 'energy', label: 'Energia', unit: 'kWh' },
  { key: 'power', label: 'Potenza', unit: 'kW' },
  { key: 'voltage', label: 'Tensione', unit: 'V' },
  { key: 'current', label: 'Corrente', unit: 'A' },
]

const RANGES = [
  { label: '6 ore', hours: 6 },
  { label: '12 ore', hours: 12 },
  { label: '1 giorno', hours: 24 },
  { label: '48 ore', hours: 48 },
  { label: '7 giorni', hours: 168 },
  { label: '1 mese', hours: 720 },
]

// Geometria del grafico (unita' viewBox).
const W = 860
const H = 320
const PAD = { top: 16, right: 18, bottom: 40, left: 64 }
const IW = W - PAD.left - PAD.right
const IH = H - PAD.top - PAD.bottom

function niceTicks(min, max, count = 5) {
  const span = max - min || 1
  const rawStep = span / count
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const norm = rawStep / mag
  const step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag
  const start = Math.ceil(min / step) * step
  const ticks = []
  for (let v = start; v <= max + step * 0.001; v += step) ticks.push(Math.round(v * 100) / 100)
  return ticks
}

function xLabel(ts, hours) {
  const d = new Date(ts)
  if (hours <= 24) {
    return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  }
  if (hours <= 48) {
    return d.toLocaleString('it-IT', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })
}

function TimeSeriesChart({ series, tagMeta }) {
  const wrapRef = useRef(null)
  const [hover, setHover] = useState(null)

  const points = series?.points ?? []
  const hours = series?.hours ?? 24

  const model = useMemo(() => {
    if (points.length < 2) return null
    const values = points.map((p) => p.value)
    let lo = Math.min(...values)
    let hi = Math.max(...values)
    if (lo === hi) {
      lo -= 1
      hi += 1
    }
    // Includi lo zero per la potenza (asse simmetrico su carichi/generazione).
    if (tagMeta?.key === 'power') {
      lo = Math.min(lo, 0)
      hi = Math.max(hi, 0)
    }
    const yTicks = niceTicks(lo, hi, 5)
    const loT = Math.min(lo, yTicks[0])
    const hiT = Math.max(hi, yTicks[yTicks.length - 1])
    const span = hiT - loT || 1

    const t0 = points[0].t
    const t1 = points[points.length - 1].t
    const xAt = (t) => PAD.left + ((t - t0) / (t1 - t0 || 1)) * IW
    const yAt = (v) => PAD.top + (1 - (v - loT) / span) * IH

    const coords = points.map((p) => [xAt(p.t), yAt(p.value)])
    const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
    const baseY = yAt(tagMeta?.key === 'power' ? 0 : loT)
    const area = `${line} L${coords[coords.length - 1][0].toFixed(1)} ${baseY.toFixed(1)} L${coords[0][0].toFixed(1)} ${baseY.toFixed(1)} Z`

    // Tick X: ~7 etichette equispaziate sui campioni.
    const every = Math.max(1, Math.ceil(points.length / 7))
    const xTicks = points
      .map((p, i) => ({ i, t: p.t, x: xAt(p.t) }))
      .filter((_, i) => i % every === 0)

    return { loT, hiT, yTicks, xAt, yAt, xTicks, line, area, baseY, coords, t0, t1 }
  }, [points, tagMeta])

  function onMove(e) {
    if (!model || !wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const vbX = ((e.clientX - rect.left) / rect.width) * W
    const frac = (vbX - PAD.left) / IW
    const idx = Math.round(frac * (points.length - 1))
    if (idx >= 0 && idx < points.length) setHover(idx)
  }

  if (!model) return <div className="chart-empty">Dati insufficienti per l'intervallo scelto</div>

  const hp = hover != null ? points[hover] : null
  const hx = hp ? model.xAt(hp.t) : 0
  const hy = hp ? model.yAt(hp.value) : 0

  return (
    <div
      className="chart-box"
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
        {/* griglia + asse Y */}
        {model.yTicks.map((v) => {
          const y = model.yAt(v)
          return (
            <g key={`y${v}`}>
              <line className="chart-grid" x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} />
              <text className="chart-axis-y" x={PAD.left - 10} y={y + 4} textAnchor="end">
                {fmt(v)}
              </text>
            </g>
          )
        })}
        {/* linea dello zero evidenziata (potenza) */}
        {tagMeta?.key === 'power' && model.loT < 0 && (
          <line
            className="chart-zero"
            x1={PAD.left}
            y1={model.yAt(0)}
            x2={W - PAD.right}
            y2={model.yAt(0)}
          />
        )}
        {/* asse X */}
        <line className="chart-grid" x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} />
        {model.xTicks.map((tk) => (
          <g key={`x${tk.t}`}>
            <line className="chart-tickmark" x1={tk.x} y1={H - PAD.bottom} x2={tk.x} y2={H - PAD.bottom + 5} />
            <text className="chart-axis-x" x={tk.x} y={H - PAD.bottom + 18} textAnchor="middle">
              {xLabel(tk.t, hours)}
            </text>
          </g>
        ))}

        <path className="chart-area" d={model.area} />
        <path className="chart-line" d={model.line} />

        {/* etichette assi */}
        <text className="chart-axis-title" x={PAD.left} y={12} textAnchor="start">
          {tagMeta?.label} [{series.unit}]
        </text>

        {hp && (
          <g>
            <line className="chart-guide" x1={hx} y1={PAD.top} x2={hx} y2={H - PAD.bottom} />
            <circle className="chart-dot" cx={hx} cy={hy} r="4" />
          </g>
        )}
      </svg>

      {hp && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(hx / W) * 100}%`,
            transform: `translateX(${hx > W * 0.7 ? '-100%' : '0'}) translateX(${hx > W * 0.7 ? '-10px' : '10px'})`,
          }}
        >
          <div className="chart-tooltip-t">
            {new Date(hp.t).toLocaleString('it-IT', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          <div className={`chart-tooltip-v ${hp.value < 0 ? 'is-negative' : ''}`}>
            {fmt(hp.value)} {series.unit}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Historical() {
  const { clientId } = useClient()

  const [auxList, setAuxList] = useState([])
  const [aux, setAux] = useState('')
  const [tag, setTag] = useState('power')
  const [hours, setHours] = useState(24)
  const [series, setSeries] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Elenco ausiliari del cliente selezionato.
  useEffect(() => {
    let alive = true
    api
      .tags(clientId)
      .then((snap) => {
        if (!alive) return
        const list = (snap.auxiliaries || []).map((a) => ({ id: a.id, name: a.name }))
        setAuxList(list)
        setAux((prev) => (list.some((a) => a.id === prev) ? prev : list[0]?.id || ''))
      })
      .catch(() => alive && setAuxList([]))
    return () => {
      alive = false
    }
  }, [clientId])

  useEffect(() => {
    if (!aux) return
    let alive = true
    setError('')
    setLoading(true)
    api
      .history(aux, tag, hours)
      .then((data) => alive && setSeries(data))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [aux, tag, hours])

  const tagMeta = VALUES.find((v) => v.key === tag)
  const rangeLabel = RANGES.find((r) => r.hours === hours)?.label ?? `${hours} ore`

  return (
    <section className="page">
      <div className="page-toolbar">
        <div className="filters">
          <label>
            Aux
            <select value={aux} onChange={(e) => setAux(e.target.value)}>
              {auxList.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Valori
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              {VALUES.map((v) => (
                <option key={v.key} value={v.key}>
                  {v.label} [{v.unit}]
                </option>
              ))}
            </select>
          </label>
          <label>
            Intervallo
            <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
              {RANGES.map((r) => (
                <option key={r.hours} value={r.hours}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card">
        <div className="card-title">
          {tagMeta?.label} · {rangeLabel}
          {series && (
            <span className="unit">
              {' '}
              — passo {series.stepHours < 1 ? `${series.stepHours * 60} min` : `${series.stepHours} h`}
            </span>
          )}
        </div>
        {loading && !series ? (
          <div className="chart-empty">Caricamento…</div>
        ) : (
          <TimeSeriesChart series={series} tagMeta={tagMeta} />
        )}
      </div>

      <div className="table-wrap">
        <table className="tags-table">
          <thead>
            <tr>
              <th>Istante</th>
              <th className="col-num">
                {tagMeta?.label} <span className="unit">{series?.unit}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {(series?.points ?? []).map((p) => (
              <tr key={p.t}>
                <td>
                  {new Date(p.t).toLocaleString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className={`col-num ${p.value < 0 ? 'is-negative' : ''}`}>{fmt(p.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
