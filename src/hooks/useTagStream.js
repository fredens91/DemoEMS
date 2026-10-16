import { useEffect, useState } from 'react'
import { api } from '../api.js'

/**
 * Versione statica (demo): legge una sola volta lo snapshot salvato delle tag.
 *
 * status: 'connecting' | 'live' | 'error'
 */
export function useTagStream(clientId) {
  const [snapshot, setSnapshot] = useState(null)
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    if (!clientId) return
    let stopped = false
    setStatus('connecting')
    setSnapshot(null)
    api
      .tags(clientId)
      .then((s) => {
        if (!stopped) {
          setSnapshot(s)
          setStatus('live')
        }
      })
      .catch(() => {
        if (!stopped) setStatus('error')
      })
    return () => {
      stopped = true
    }
  }, [clientId])

  return { snapshot, status }
}
