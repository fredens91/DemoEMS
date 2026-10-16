import { createContext, useContext } from 'react'
import { useTagStream } from '../hooks/useTagStream.js'
import { useClient } from '../client/ClientContext.jsx'

/**
 * Una sola connessione SSE condivisa da tutta l'area autenticata,
 * agganciata al cliente selezionato.
 */
const StreamContext = createContext(null)

export function StreamProvider({ children }) {
  const { clientId } = useClient()
  const stream = useTagStream(clientId)
  return <StreamContext.Provider value={stream}>{children}</StreamContext.Provider>
}

export function useStream() {
  const ctx = useContext(StreamContext)
  if (!ctx) throw new Error('useStream deve essere usato dentro <StreamProvider>')
  return ctx
}
