import { fmt } from '../format.js'

function Metric({ label, value, unit, negative }) {
  return (
    <div className="elec-metric">
      <span className="lbl">{label}</span>
      <span className={`val ${negative ? 'is-negative' : ''}`}>
        {value}
        {unit && <i>{unit}</i>}
      </span>
    </div>
  )
}

export default function ElectricalDetail({ auxiliaries }) {
  if (!auxiliaries?.length) {
    return <p className="home-empty">In attesa dei dati di campo…</p>
  }

  return (
    <div className="elec">
      {auxiliaries.map((a, i) => (
        <section key={a.id} className={`elec-aux elec-${a.kind}`}>
          <header className="elec-aux-head">
            <span className={`kind-badge kind-${a.kind}`}>
              {a.kind === 'source' ? 'GEN' : 'LOAD'}
            </span>
            <h3>
              Aux {i + 1}: {a.name}
            </h3>
          </header>

          <div className="elec-metrics">
            <Metric label="Potenza attiva" value={fmt(a.power, 2)} unit="kW" negative={a.power < 0} />
            <Metric label="Pot. reattiva 3ph" value={fmt(a.reactivePower, 1)} unit="kvar" />
            <Metric
              label="Fattore di potenza"
              value={fmt(a.powerFactor, 2)}
              negative={a.powerFactor < 0}
            />
            <Metric label="Energia assorbita" value={fmt(a.energyIn, 0)} unit="kWh" />
            <Metric label="Energia ceduta" value={fmt(a.energyOut, 0)} unit="kWh" />
          </div>

          <div className="elec-lines">
            <div className="elec-line-col">
              {[1, 2, 3].map((n) => (
                <Metric
                  key={n}
                  label={`Tensione L${n}-N`}
                  value={fmt(a[`voltageL${n}`], 1)}
                  unit="V"
                />
              ))}
            </div>
            <div className="elec-line-col">
              {[1, 2, 3].map((n) => (
                <Metric
                  key={n}
                  label={`Corrente L${n}`}
                  value={fmt(a[`currentL${n}`], 2)}
                  unit="A"
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
