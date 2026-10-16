import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useClient } from '../client/ClientContext.jsx'
import { fmt } from '../format.js'

const STATUS = {
  ok: { label: 'OK', cls: 'ok' },
  warning: { label: 'In scadenza', cls: 'warning' },
  due: { label: 'Intervento richiesto', cls: 'due' },
}

export default function Maintenance() {
  const { clientId } = useClient()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setError('')
    api
      .maintenance(clientId)
      .then((data) => alive && setItems(data.items))
      .catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [clientId])

  return (
    <section className="page">
      {error && <div className="alert">{error}</div>}

      <div className="table-wrap">
        <table className="tags-table">
          <thead>
            <tr>
              <th>Aux</th>
              <th className="col-num">Ore funzionamento</th>
              <th className="col-num">Ore da ultimo servizio</th>
              <th className="col-num">Intervallo</th>
              <th>Ultimo intervento</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const since = it.runningHours - it.lastServiceHours
              const s = STATUS[it.status] || STATUS.ok
              return (
                <tr key={it.id}>
                  <td>{it.name}</td>
                  <td className="col-num">{fmt(it.runningHours, 0)}</td>
                  <td className="col-num">{fmt(since, 0)}</td>
                  <td className="col-num">{fmt(it.serviceIntervalHours, 0)}</td>
                  <td>{new Date(it.lastServiceDate).toLocaleDateString('it-IT')}</td>
                  <td>
                    <span className={`status-badge status-${s.cls}`}>{s.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
