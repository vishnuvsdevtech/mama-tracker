import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useProfile } from '../lib/ProfileContext'
import { ageText, fmtDate, whereAreWe } from '../lib/profile'
import MamaAvatar from '../components/MamaAvatar'
import WombBaby from '../components/WombBaby'
import Brand from '../components/Brand'
import { Arrow } from '../components/Heart'

const LIKE_LABEL: Record<string, string> = {
  learn: 'Weekly learning', scans: 'Scans & reports', questions: 'Questions for the doctor',
  bag: 'Hospital bag', journal: 'Little journal', unsure: 'Not sure yet',
}

export default function Profile() {
  const { ready, profile, startEditing, reset } = useProfile()
  const nav = useNavigate()
  const [confirm, setConfirm] = useState(false)
  if (!ready) return null
  if (!profile) return <Navigate to="/start/hello" replace />
  const w = whereAreWe(profile.stage)
  const edit = (step: string) => { startEditing(); nav(`/start/${step}?edit=1`) }

  return (
    <div className="app">
      <nav className="top scrolled">
        <div className="wrap row">
          <Link to="/home" className="icon-btn" aria-label="Back to home"><Arrow back /></Link>
          <Brand to="/home" />
          <span style={{ width: 44 }} />
        </div>
      </nav>
      <main className="wrap profile">
        <h1 className="home-title">Your <em>profile</em></h1>

        <div className="p-grid">
          <div className="p-card">
            <MamaAvatar look={profile.mamaLook} size={110} />
            <div className="p-body">
              <span className="eyebrow">You</span>
              <h2>{profile.mamaName}</h2>
              <p>Little one calls you <b>{profile.callMe}</b></p>
              <div className="p-actions">
                <button className="link" onClick={() => edit('you')}>Edit name</button>
                <button className="link" onClick={() => edit('look')}>Change avatar</button>
              </div>
            </div>
          </div>
          <div className="p-card">
            <div className="p-baby"><WombBaby decor={false} theme={profile.babyLook.bubble} extra={profile.babyLook.extra} skin={profile.babyLook.skin} scale={0.95} /></div>
            <div className="p-body">
              <span className="eyebrow">Little one</span>
              <h2>{profile.babyName || 'Little one'}</h2>
              <p>{w?.pregnant ? <>Week {w.week} · due {fmtDate(w.due!)}{w.estimate && ' (estimate)'}</> : w ? ageText(w.ageDays!) : ''}</p>
              <div className="p-actions">
                <button className="link" onClick={() => edit('baby')}>Edit baby</button>
                <button className="link" onClick={() => edit('when')}>{w?.pregnant ? 'Change dates' : 'Change birth date'}</button>
              </div>
            </div>
          </div>
          <div className="p-card wide">
            <div className="p-body">
              <span className="eyebrow">On your home</span>
              <div className="chips">{(profile.likes.length ? profile.likes : ['unsure']).map(l => <span key={l} className="chip on static">{LIKE_LABEL[l]}</span>)}</div>
              <div className="p-actions"><button className="link" onClick={() => edit('likes')}>Change</button></div>
            </div>
          </div>
        </div>

        <div className="danger">
          <div>
            <b>Start over</b>
            <p>Clears everything saved in this browser. There's no copy anywhere else, so this can't be undone.</p>
          </div>
          {confirm
            ? <div className="p-actions"><button className="btn btn-ghost btn-sm" onClick={() => setConfirm(false)}>Keep it</button><button className="btn btn-danger btn-sm" onClick={async () => { await reset(); nav('/') }}>Yes, clear it</button></div>
            : <button className="btn btn-soft btn-sm" onClick={() => setConfirm(true)}>Start over</button>}
        </div>
      </main>
    </div>
  )
}
