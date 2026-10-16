const NF = {
  0: new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 }),
  1: new Intl.NumberFormat('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  2: new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
}

export function fmt(value, decimals = 1) {
  if (value == null || Number.isNaN(value)) return '--'
  return (NF[decimals] || NF[1]).format(value)
}

export function fmtTime(ts) {
  if (!ts) return '--'
  return new Date(ts).toLocaleTimeString('it-IT')
}

// Colonne della tabella "Consumi elettrici" (Realtime).
// Tensioni e correnti sono mostrate nel popup di dettaglio.
export const TAGS = [
  { key: 'energyToday', label: 'Energia oggi', unit: 'kWh', decimals: 0 },
  { key: 'energyWeek', label: 'Energia settimana', unit: 'kWh', decimals: 0 },
  { key: 'power', label: 'Potenza', unit: 'kW', decimals: 1 },
]
