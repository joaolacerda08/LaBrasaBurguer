import { useEffect, useMemo, useState } from 'react'
import { Clock3, Flame } from 'lucide-react'
import type { StoreConfig } from '../../types/domain'
import { getOpeningStatus } from '../../features/storefront/openingStatus'

export function StoreStatusBar({ store }: { store: StoreConfig }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])
  const status = useMemo(() => getOpeningStatus(store, now), [store, now])

  return <div className="store-status-bar">
    <div className={`store-status-pill ${status.open ? 'is-open' : 'is-closed'}`} role="status" aria-live="polite">
      <span className="status-dot" />
      <span className="status-label">{status.open ? 'ABERTO AGORA' : 'FECHADO AGORA'}</span>
      <span className="status-divider" />
      <span className="status-message">{status.message}</span>
    </div>
    <a className="status-hours-link" href="#horarios"><Clock3 size={14} /> Horários da casa <Flame className="status-flame" size={14} /></a>
  </div>
}
