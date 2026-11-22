import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
const Onboarding = lazy(() => import('./pages/Onboarding'))
import Home from './pages/Home'
// pages that aren't needed on first load are split into their own small files
const Profile = lazy(() => import('./pages/Profile'))
const Kicks = lazy(() => import('./pages/tools/Kicks'))
const Contractions = lazy(() => import('./pages/tools/Contractions'))
const Visits = lazy(() => import('./pages/tools/Visits'))
const Weight = lazy(() => import('./pages/tools/Weight'))
const Sources = lazy(() => import('./pages/Sources'))

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
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/start" element={<Navigate to="/start/hello" replace />} />
        <Route path="/start/:step" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sources" element={<Sources />} />
        <Route path="/tools/kicks" element={<Kicks />} />
        <Route path="/tools/contractions" element={<Contractions />} />
        <Route path="/tools/visits" element={<Visits />} />
        <Route path="/tools/weight" element={<Weight />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </>
  )
}
