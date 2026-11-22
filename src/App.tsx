import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Profile from './pages/Profile'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <div className="bg-blobs" aria-hidden="true"><span className="b1" /><span className="b2" /><span className="b3" /></div>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/start" element={<Navigate to="/start/hello" replace />} />
        <Route path="/start/:step" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
