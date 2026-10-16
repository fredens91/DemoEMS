import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.jsx'

/**
 * Cliente (gruppo/impianto) attualmente selezionato.
 * L'insieme dei clienti visibili viene dall'utente (`user.clients`):
 * - admin -> tutti i clienti
 * - customer -> i gruppi a cui appartiene (di norma uno)
 * I moduli E-BOOST sono una proprietà del cliente, non dell'utente.
 */
const ClientContext = createContext(null)

function labelFromId(id) {
  const n = /^cliente-(\d+)$/.exec(id)
  return n ? `Cliente ${n[1]}` : id
}

export function ClientProvider({ children }) {
  const { user } = useAuth()
  const allowedIds = user?.clients?.length ? user.clients : ['cliente-1']

  const [catalog, setCatalog] = useState([])
  const [clientId, setClientIdRaw] = useState(allowedIds[0])

  // Carica anagrafica clienti (nome/tier/moduli); ritenta se fallisce
  // (durante il boot di npm run dev la fetch puo' arrivare prima del backend).
  useEffect(() => {
    let alive = true
    let attempts = 0
    const load = () => {
      api
        .clients()
        .then((d) => {
          if (alive) setCatalog(d.clients || [])
        })
        .catch(() => {
          if (alive && attempts++ < 5) setTimeout(load, 1000)
        })
    }
    load()
    return () => {
      alive = false
    }
  }, [])

  // Mantieni la selezione dentro l'insieme consentito.
  useEffect(() => {
    if (!allowedIds.includes(clientId)) setClientIdRaw(allowedIds[0])
  }, [allowedIds, clientId])

  const value = useMemo(() => {
    const byId = new Map(catalog.map((c) => [c.id, c]))
    // Elenco costruito dai gruppi consentiti all'utente; arricchito con
    // nome/tier/moduli non appena /api/clients ha risposto.
    const list = allowedIds.map(
      (id) =>
        byId.get(id) || { id, name: labelFromId(id), tier: 'Platform', activeModules: [] },
    )
    const current = list.find((c) => c.id === clientId) || list[0]
    return {
      clients: list,
      clientId: current.id,
      clientName: current.name,
      clientTier: current.tier || 'Platform',
      clientActiveModules: current.activeModules || [],
      canSwitch: list.length > 1,
      setClientId: (id) => {
        if (list.some((c) => c.id === id)) setClientIdRaw(id)
      },
    }
  }, [catalog, allowedIds, clientId])

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
}

export function useClient() {
  const ctx = useContext(ClientContext)
  if (!ctx) throw new Error('useClient deve essere usato dentro <ClientProvider>')
  return ctx
}
