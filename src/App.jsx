import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AppLayout from './components/AppLayout.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Realtime from './pages/Realtime.jsx'
import Historical from './pages/Historical.jsx'
import Maintenance from './pages/Maintenance.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/realtime" element={<Realtime />} />
          <Route path="/historical" element={<Historical />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
