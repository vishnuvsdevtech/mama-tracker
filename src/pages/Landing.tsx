import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import WombBaby from '../components/WombBaby'
import CrawlingBaby from '../components/CrawlingBaby'
import IconDefs from '../components/IconDefs'
import Brand from '../components/Brand'
import { Heart, Check, Arrow } from '../components/Heart'
import { useProfile } from '../lib/ProfileContext'
import { useReveal } from '../lib/useReveal'
import { babyFact, mamaFact, sizeFor, trimester } from '../lib/weeks'

export const weekScale = (w: number) => 0.34 + 0.66 * Math.pow((Math.max(4, Math.min(40, w)) - 4) / 36, 0.75)

export default function Landing() {
  const { profile } = useProfile()
  const [week, setWeek] = useState(20)
  const [scrolled, setScrolled] = useState(false)
  useReveal()

  useEffect(() => {
    const track = document.getElementById('track')
    const vine = track?.querySelector<SVGPathElement>('.vine path')
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      if (!track || !vine) return
      const r = track.getBoundingClientRect(), vh = window.innerHeight
      const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.35)))
      vine.style.strokeDashoffset = (1200 * (1 - p)).toFixed(0)
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const startTo = profile ? '/home' : '/start/hello'
  const startLabel = profile ? 'Open my home' : 'Start my nine months'
  const cta = <Link className="btn btn-primary" to={startTo}>{startLabel} <Arrow /></Link>
  const [fruit, cm] = sizeFor(week)

  return (
    <>
      <IconDefs />
      <nav className={`top ${scrolled ? 'scrolled' : ''}`}>
        <div className="wrap row">
          <Brand />
          <div className="navlinks">
            <a href="#week">This week</a>
            <a href="#inside">What's inside</a>
            <a href="#promise">Our promise</a>
            <Link className="btn btn-primary btn-sm" to={startTo}>{profile ? 'My home' : <span>Start<span className="long"> my nine months</span></span>}</Link>
          </div>
        </div>
      </nav>

      <main id="top">
        <header className="hero">
          <div className="wrap">
            <div className="grid">
              <div>
                <div className="hello reveal"><span className="dot"><Heart size={14} color="#A85F5A" /></span>For mamas, from the very first week</div>
                <h1 className="reveal d1">Watch them grow, <em>week by tiny week.</em></h1>
                <p className="lede reveal d2">Learn what's happening inside you both, in words that feel like a hug. Keep every scan, report and question in one gentle place — and see your own little numbers grow, right up to the day you finally meet.</p>
                <div className="cta-row reveal d3">
                  {cta}
                  <a className="btn btn-soft" href="#week">Peek at this week</a>
                </div>
                <div className="trust reveal d4">
                  <span><Check />Stays on your phone</span>
                  <span><Check />No ads, no account</span>
                  <span><Check />Your doctor's word, kept safe</span>
                </div>
              </div>
              <WombBaby
                className="reveal d2"
                interactive followEyes
                scale={weekScale(week)}
                theme={profile?.babyLook.bubble}
                extra={profile?.babyLook.extra}
                skin={profile?.babyLook.skin}
                lines={[`hi ${profile?.callMe.toLowerCase() ?? 'mama'}!`, 'I can hear you', '*tiny kick*', 'love you already', 'hic!', 'more mango please']}
                label="Your baby, floating and growing. Tap to say hello."
                hint={<><Heart size={14} color="#C9837C" />Tap to say hello · <b>heart ≈ 140/min</b></>}
              />
            </div>

            <div className="weekcard reveal" id="week">
              <div className="wk-num"><span>{week}</span><small>weeks</small><span className="wk-tri">Trimester {trimester(week)}</span></div>
              <div>
                <p className="eyebrow" style={{ margin: '0 0 6px' }}>Slide to your week</p>
                <p className="wk-size">Baby is about the size of <em>{fruit}</em></p>
                <span className="wk-cm">{cm}</span>
                <input type="range" min={4} max={40} value={week} aria-label="Week of pregnancy"
                  onChange={e => setWeek(+e.target.value)}
                  style={{ ['--p' as string]: `${((week - 4) / 36) * 100}%` }} />
                <div className="ticks"><span style={{ left: 0 }}>4</span><span style={{ left: '25%' }}>13</span><span style={{ left: '63.9%' }}>27</span><span style={{ left: '100%' }}>40</span></div>
                <div className="facts">
                  <div className="fact baby-f"><h4>Baby this week</h4><span key={'b' + week} className="swap">{babyFact(week)}</span></div>
                  <div className="fact mama-f"><h4>You this week</h4><span key={'m' + trimester(week) + week} className="swap">{mamaFact(week)}</span></div>
                </div>
                <p className="disclaim">General, approximate information — every baby grows at their own pace. Your doctor knows you two best.</p>
              </div>
            </div>
          </div>
        </header>

        {/* FEATURES */}
        <section id="inside">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">What's inside</span>
              <h2>Everything a mama keeps in her head, <em>finally somewhere else.</em></h2>
              <p>Made by people who've lived the WhatsApp-forwards, hospital-folder, "what did the doctor say again?" version of pregnancy.</p>
            </div>
            <div className="features">
              <div className="feat wide reveal">
                <div className="ico c-rose"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="#F6C8BC"/><circle cx="20" cy="18" r="7" fill="#F7CDB5"/><circle cx="17.5" cy="17.5" r="1.2" fill="#3A2B2A"/><circle cx="22.5" cy="17.5" r="1.2" fill="#3A2B2A"/><path d="M18 21q2 1.4 4 0" stroke="#A85F5A" strokeWidth="1.2" fill="none" strokeLinecap="round"/><ellipse cx="20" cy="28" rx="6" ry="3.5" fill="#F1BE9F"/></svg></div>
                <h3>Learn, a little each week</h3>
                <p>What's growing, what's changing in your body, and why — told like a friend who happens to love science. Fruit sizes, tiny milestones, no scary walls of text.</p>
              </div>
              <div className="feat wide reveal d1">
                <div className="ico c-sage"><svg viewBox="0 0 40 40"><rect x="9" y="6" width="22" height="28" rx="4" fill="#CFDCC6"/><rect x="13" y="12" width="14" height="10" rx="2" fill="#71866A"/><path d="M15 20c2-5 8-5 10 0" stroke="#EAF0E4" strokeWidth="1.6" fill="none"/><rect x="13" y="25" width="10" height="2" rx="1" fill="#71866A"/><rect x="13" y="29" width="7" height="2" rx="1" fill="#A7B89C"/></svg></div>
                <h3>Every scan & report, in one folder</h3>
                <p>Snap your scan reports, blood tests and prescriptions. They're kept in order, by week, ready to show at the next visit — no more digging through the gallery in the waiting room.</p>
              </div>
              <div className="feat reveal">
                <div className="ico c-butter"><svg viewBox="0 0 40 40"><path d="M7 30 L14 22 L21 25 L33 11" fill="none" stroke="#C9A646" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="22" r="3" fill="#F7E3A8" stroke="#C9A646" strokeWidth="2"/><circle cx="21" cy="25" r="3" fill="#F7E3A8" stroke="#C9A646" strokeWidth="2"/><circle cx="33" cy="11" r="3.4" fill="#C9A646"/></svg></div>
                <h3>See your numbers grow</h3>
                <p>The weights and measurements from your own reports, on one soft timeline — exactly as your doctor wrote them.</p>
              </div>
              <div className="feat reveal d1">
                <div className="ico c-lav"><svg viewBox="0 0 40 40"><path d="M8 10h24a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H18l-6 5v-5H8a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z" fill="#D9CDE8"/><circle cx="14" cy="19" r="2" fill="#8C76AE"/><circle cx="20" cy="19" r="2" fill="#8C76AE"/><circle cx="26" cy="19" r="2" fill="#8C76AE"/></svg></div>
                <h3>Questions for the doctor</h3>
                <p>Jot them down at 2 a.m. when they pop up. Tick them off in the consultation room.</p>
              </div>
              <div className="feat reveal d2">
                <div className="ico c-peach"><svg viewBox="0 0 40 40"><rect x="8" y="14" width="24" height="18" rx="5" fill="#F6C8AC"/><path d="M15 14v-3a5 5 0 0 1 10 0v3" fill="none" stroke="#E3A285" strokeWidth="2.6"/><use href="#i-heart" x="15" y="18" width="10" height="10" style={{color:'#E58F86'}}/></svg></div>
                <h3>A bag list that waits</h3>
                <p>The hospital-bag checklist wakes up at 35 weeks — not a day before you need to think about it.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SCAN SHOWCASE */}
        <section>
          <div className="wrap scan">
            <div className="copy reveal">
              <span className="eyebrow">Scan day, sorted</span>
              <h2>Your reports, <em>read gently.</em></h2>
              <p>Add a report and the page files it under the right week and lifts out the numbers your doctor wrote — so you can watch the line climb from the dating scan to the growth scan.</p>
              <ul className="ticklist">
                <li><svg><use href="#i-check"/></svg>Files reports by week automatically</li>
                <li><svg><use href="#i-check"/></svg>Shows your numbers — never a verdict on them</li>
                <li><svg><use href="#i-check"/></svg>Never guesses or shows baby's sex. In India that's prohibited by law, and it's not ours to tell.</li>
                <li><svg><use href="#i-check"/></svg>Everything stays on your phone</li>
              </ul>
            </div>
            <div className="reveal d1" id="phoneWrap" style={{position:'relative'}}>
              <div className="phone">
                <div className="ph-top"><b>My scans</b><span className="pill">32 weeks</span></div>
                <div className="docs">
                  <div className="doc"><div className="thumb c-sage"><svg viewBox="0 0 26 26"><rect x="4" y="3" width="18" height="20" rx="3" fill="#A7B89C"/><path d="M8 14c2-5 8-5 10 0" stroke="#fff" strokeWidth="1.6" fill="none"/></svg></div><div className="t"><b>Dating scan</b><span>Week 8 · heartbeat seen</span></div><span className="pill sage">saved</span></div>
                  <div className="doc"><div className="thumb c-sage"><svg viewBox="0 0 26 26"><rect x="4" y="3" width="18" height="20" rx="3" fill="#A7B89C"/><path d="M8 14c2-5 8-5 10 0" stroke="#fff" strokeWidth="1.6" fill="none"/></svg></div><div className="t"><b>NT scan</b><span>Week 12 · doctor's note added</span></div><span className="pill sage">saved</span></div>
                  <div className="doc"><div className="thumb c-rose"><svg viewBox="0 0 26 26"><rect x="4" y="3" width="18" height="20" rx="3" fill="#E9A99D"/><path d="M8 14c2-5 8-5 10 0" stroke="#fff" strokeWidth="1.6" fill="none"/></svg></div><div className="t"><b>Anomaly scan</b><span>Week 20 · 3 questions asked</span></div><span className="pill sage">saved</span></div>
                  <div className="doc"><div className="thumb c-butter"><svg viewBox="0 0 26 26"><rect x="4" y="3" width="18" height="20" rx="3" fill="#E7C67A"/><path d="M8 14c2-5 8-5 10 0" stroke="#fff" strokeWidth="1.6" fill="none"/></svg></div><div className="t"><b>Growth scan</b><span>Week 32 · just added</span></div><span className="pill">new</span></div>
                </div>
                <div className="chart">
                  <div className="ch-h">Estimated weight, from your reports <span>sample</span></div>
                  <svg viewBox="0 0 300 120" aria-label="Sample chart of estimated weight rising from week 20 to week 32">
                    <g stroke="#EBDDD3" strokeWidth="1"><line x1="20" y1="20" x2="290" y2="20"/><line x1="20" y1="60" x2="290" y2="60"/><line x1="20" y1="100" x2="290" y2="100"/></g>
                    <path d="M30 98 L30 98" />
                    <path className="path" d="M30 96 C 80 92, 110 82, 140 70 S 220 40, 280 22" fill="none" stroke="#C9837C" strokeWidth="3.5" strokeLinecap="round"/>
                    <circle className="pt" cx="30" cy="96" r="6" fill="#fff" stroke="#C9837C" strokeWidth="3"/>
                    <circle className="pt" cx="140" cy="70" r="6" fill="#fff" stroke="#C9837C" strokeWidth="3"/>
                    <circle className="pt" cx="210" cy="44" r="6" fill="#fff" stroke="#C9837C" strokeWidth="3"/>
                    <circle className="pt" cx="280" cy="22" r="7" fill="#C9837C"/>
                    <g fontFamily="Nunito, sans-serif" fontSize="11" fontWeight="700" fill="#9A8682"><text x="22" y="116">wk 20</text><text x="128" y="116">24</text><text x="200" y="116">28</text><text x="266" y="116">32</text></g>
                  </svg>
                  <p className="note">Numbers as written in your reports. Questions? That's what the list is for.</p>
                </div>
              </div>
              <div className="float-tag t1"><svg style={{color:'#E58F86'}}><use href="#i-heart"/></svg>Heartbeat seen · wk 8</div>
              <div className="float-tag t2"><svg viewBox="0 0 24 24"><use href="#i-check"/></svg>Filed under week 32</div>
            </div>
          </div>
        </section>

        {/* JOURNEY */}
        <section className="journey">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">The whole journey</span>
              <h2>From a poppy seed <em>to a person.</em></h2>
              <p>One page that walks with you the whole way — and doesn't abandon you on the day it gets real.</p>
            </div>
            <div className="track" id="track">
              <svg className="vine" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path d="M90 20 C 200 -6, 300 46, 400 20 S 600 -6, 700 20 S 860 46, 910 20" fill="none" stroke="#E8B4A6" strokeWidth="3" strokeLinecap="round" strokeDasharray="1200"/></svg>
              <div className="stop reveal"><div className="bead"><svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="5" fill="#C9837C"/><circle cx="25" cy="25" r="11" fill="none" stroke="#F1C4B8" strokeWidth="2" strokeDasharray="3 4"/></svg></div><div><span className="wk">Weeks 1–13</span><h3>Hello, tiny</h3><p>A heartbeat, a due date, and a lot of naps.</p></div></div>
              <div className="stop reveal d1"><div className="bead"><svg viewBox="0 0 50 50"><path d="M25 40c-9-6-13-14-9-22 3-5 9-4 9 1 0-5 6-6 9-1 4 8 0 16-9 22z" fill="#A7B89C"/><path d="M25 40V22" stroke="#71866A" strokeWidth="2"/></svg></div><div><span className="wk">Weeks 14–27</span><h3>The glow</h3><p>A bump, first flutters, the big anomaly scan.</p></div></div>
              <div className="stop reveal d2"><div className="bead"><svg viewBox="0 0 50 50"><ellipse cx="25" cy="27" rx="14" ry="15" fill="#F7CDB5"/><circle cx="21" cy="25" r="1.6" fill="#3A2B2A"/><circle cx="29" cy="25" r="1.6" fill="#3A2B2A"/><path d="M22 31q3 2 6 0" stroke="#A85F5A" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg></div><div><span className="wk">Weeks 28–40</span><h3>Nesting</h3><p>Kicks you can see, a bag by the door.</p></div></div>
              <div className="stop reveal d3"><div className="bead"><svg viewBox="0 0 50 50"><use href="#i-heart" x="9" y="9" width="32" height="32" style={{color:'#E58F86'}}/></svg></div><div><span className="wk">The day</span><h3>Hello, you</h3><p>Type in the real birth date. That's it.</p></div></div>
              <div className="stop turn reveal d4"><div className="bead"><svg viewBox="0 0 50 50"><circle cx="25" cy="22" r="10" fill="#F7CDB5"/><path d="M14 40c2-8 20-8 22 0" fill="#F6DAD2"/><circle cx="22" cy="21" r="1.4" fill="#3A2B2A"/><circle cx="28" cy="21" r="1.4" fill="#3A2B2A"/></svg></div><div><span className="wk">And after</span><h3>Day one, onward</h3><p>Feeds, sleeps, and the paediatrician's questions.</p></div></div>
            </div>

            <div className="turnaround reveal">
              <svg className="clock" viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="50" fill="#FCE7E1"/><circle cx="55" cy="55" r="38" fill="#fff"/><g className="arrow-flip"><path d="M55 30v25l14 10" fill="none" stroke="#A85F5A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></g><circle cx="55" cy="55" r="4" fill="#A85F5A"/></svg>
              <div>
                <h3>On the day they arrive, <em>the countdown turns around.</em></h3>
                <p>Weeks-to-go becomes days-old. The checklist becomes a daily log. Your question list becomes the paediatrician list. Same page, same memories — no starting over at 3 a.m.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROMISE */}
        <section className="promise" id="promise">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Our promise</span>
              <h2>Your pregnancy is <em>nobody's business model.</em></h2>
              <p>Pregnancy data is about as personal as data gets. So we built this the careful way, on purpose.</p>
            </div>
            <div className="promises">
              <div className="prom reveal"><div className="pi c-sage"><svg viewBox="0 0 26 26"><rect x="5" y="11" width="16" height="12" rx="3" fill="#A7B89C"/><path d="M8.5 11V8a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="#71866A" strokeWidth="2.2"/></svg></div><h3>Stays on your phone</h3><p>No account, no server, no tracking. Your scans never leave your device.</p></div>
              <div className="prom reveal d1"><div className="pi c-rose"><svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="9" fill="none" stroke="#C9837C" strokeWidth="2.4"/><path d="M7 19L19 7" stroke="#C9837C" strokeWidth="2.4" strokeLinecap="round"/></svg></div><h3>No ads, ever</h3><p>Nothing to sell you, so nothing to learn about you.</p></div>
              <div className="prom reveal d2"><div className="pi c-lav"><svg viewBox="0 0 26 26"><use href="#i-heart" x="4" y="4" width="18" height="18" style={{color:'#8C76AE'}}/></svg></div><h3>Boy or girl? A surprise.</h3><p>We never guess baby's sex from a scan. It's the law in India — and the best surprise of the whole journey.</p></div>
              <div className="prom reveal d3"><div className="pi c-butter"><svg viewBox="0 0 26 26"><rect x="5" y="4" width="16" height="19" rx="3" fill="#E7C67A"/><path d="M13 9v7M9.5 12.5h7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg></div><h3>Not your doctor</h3><p>We help you learn and remember. Diagnosis and advice stay with the person who knows you.</p></div>
            </div>
          </div>
        </section>

        {/* FINAL */}
        <section className="final">
          <div className="wrap">
            <svg className="mini reveal" viewBox="0 0 170 170" aria-hidden="true">
              <circle cx="85" cy="92" r="70" fill="#FBE2D9"/>
              <g className="sleep-breathe">
                <ellipse cx="85" cy="125" rx="44" ry="22" fill="#F6DAD2"/>
                <path d="M44 120 q41 -26 82 0 v12 h-82z" fill="#F1C4B8"/>
                <circle cx="85" cy="92" r="30" fill="#F7CDB5"/>
                <path d="M71 94 q5 4 10 0 M89 94 q5 4 10 0" stroke="#3A2B2A" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
                <ellipse cx="67" cy="102" rx="6" ry="4" fill="#F29A8E" opacity=".5"/><ellipse cx="103" cy="102" rx="6" ry="4" fill="#F29A8E" opacity=".5"/>
                <path d="M82 106 q3 2 6 0" stroke="#A85F5A" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M84 62 c-4 -6 6 -9 7 -3 c1 4 -5 5 -5 2" fill="none" stroke="#C98B7A" strokeWidth="2.4" strokeLinecap="round"/>
              </g>
              <g className="zzz"><text className="z" x="116" y="64" fontSize="16">z</text><text className="z" x="116" y="64" fontSize="20">z</text><text className="z" x="116" y="64" fontSize="14">z</text></g>
            </svg>
            <h2 className="reveal d1">Nine months goes fast. <em>Keep a little of it.</em></h2>
            <p className="reveal d2">Free, private, and ready in the time it takes to type your due date.</p>
            <div className="reveal d3">{cta}</div>
          </div>
        </section>


      </main>
      <footer>
          <div className="wrap row">
            <span>Nine months, organised · made with <svg><use href="#i-heart"/></svg> in Kerala</span>
            <span>General information only — not medical advice. Always follow your doctor.</span>
          </div>
        </footer>
      <div className="baby-space" aria-hidden="true" />
      <CrawlingBaby />
    </>
  )
}
