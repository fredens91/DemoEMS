import { Outlet, useLocation } from 'react-router-dom'
import Topbar from './Topbar.jsx'
import Sidebar from './Sidebar.jsx'
import { ClientProvider } from '../client/ClientContext.jsx'
import { StreamProvider } from '../stream/StreamContext.jsx'
import { useI18n } from '../i18n/LanguageContext.jsx'

const SECTION_KEYS = {
  '/home': 'section.home',
  '/realtime': 'section.realtime',
  '/historical': 'section.historical',
  '/maintenance': 'section.maintenance',
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const { t } = useI18n()
  const title = SECTION_KEYS[pathname] ? t(SECTION_KEYS[pathname]) : 'EMS'

  return (
    <ClientProvider>
      <StreamProvider>
        <div className="app-shell">
          <Topbar />
          <div className="app-body">
            <Sidebar />
            <main className="app-main">
              <div className="section-bar">
                <h1>{title}</h1>
              </div>
              <div className="app-content">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </StreamProvider>
    </ClientProvider>
  )
}
