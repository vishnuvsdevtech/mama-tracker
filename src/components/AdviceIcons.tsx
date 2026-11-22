/* Small illustrated icons for the week-by-week guide, drawn in the app's pink palette. */
const D = '#C8295E', P = '#FE6490', L = '#FE96B0', INK = '#7A4D60', RED = '#D0314F'

const heart = 'M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z'

const ICONS = {
  capsule: <>
    <g transform="rotate(-40 20 20)">
      <rect x="7" y="14" width="26" height="12" rx="6" fill="#fff" stroke={D} strokeWidth="2" />
      <path d="M20 14h7a6 6 0 0 1 0 12h-7z" fill={P} stroke={D} strokeWidth="2" />
      <path d="M11 17.5h5" stroke={L} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  </>,
  tabletRed: <>
    <path d="M17.5 13v3.5a7.5 4 0 0 0 15.0 0V13" fill="#C8295E" stroke={D} strokeWidth="2" />
    <ellipse cx="25" cy="13" rx="7.5" ry="4" fill="#F27497" stroke={D} strokeWidth="2" />
    <path d="M21.625 13h6.75" stroke={D} strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
    <path d="M5 23v3.5a10 5.5 0 0 0 20 0V23" fill="#B0204F" stroke={D} strokeWidth="2" />
    <ellipse cx="15" cy="23" rx="10" ry="5.5" fill="#E8457A" stroke={D} strokeWidth="2" />
    <path d="M10.5 23h9.0" stroke={D} strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
  </>,
  tabletWhite: <>
    <path d="M17.5 13v3.5a7.5 4 0 0 0 15.0 0V13" fill="#FEB0C2" stroke={D} strokeWidth="2" />
    <ellipse cx="25" cy="13" rx="7.5" ry="4" fill="#FFE3EA" stroke={D} strokeWidth="2" />
    <path d="M21.625 13h6.75" stroke={D} strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
    <path d="M5 23v3.5a10 5.5 0 0 0 20 0V23" fill="#FFD0DB" stroke={D} strokeWidth="2" />
    <ellipse cx="15" cy="23" rx="10" ry="5.5" fill="#fff" stroke={D} strokeWidth="2" />
    <path d="M10.5 23h9.0" stroke={D} strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
  </>,
  milk: <>
    <path d="M10 8h14l-1.8 25a2 2 0 0 1-2 1.8h-6.4a2 2 0 0 1-2-1.8z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M11 14c3 1.5 9 1.5 12 0l-1.3 18.6c-.1 1-1 1.4-1.6 1.4h-6.2c-.7 0-1.5-.5-1.6-1.4z" fill="#FFF6EE" />
    <rect x="23.5" y="23" width="13" height="8" rx="4" fill="#fff" stroke={D} strokeWidth="2" transform="rotate(-25 30 27)" />
    <path d="M26.5 25.5l3-1.4" stroke={L} strokeWidth="1.6" strokeLinecap="round" transform="rotate(-25 30 27)" />
  </>,
  sun: <>
    <g stroke="#D9962B" strokeWidth="2.4" strokeLinecap="round">
      <path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5L32 32M8 32l3.5-3.5M28.5 11.5L32 8" />
    </g>
    <circle cx="20" cy="20" r="8.5" fill="#F7C85B" stroke="#D9962B" strokeWidth="2" />
    <text x="20" y="24" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A5A0E" fontFamily="system-ui,sans-serif">D</text>
  </>,
  calendar: <>
    <rect x="6" y="9" width="28" height="25" rx="5" fill="#fff" stroke={D} strokeWidth="2" />
    <path d="M6 14a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v2H6z" fill={P} />
    <path d="M13 5.5v6M27 5.5v6" stroke={D} strokeWidth="2.6" strokeLinecap="round" />
    <path d={heart} transform="translate(14 18) scale(.5)" fill={P} />
  </>,
  scan: <>
    <rect x="5" y="6" width="30" height="22" rx="4" fill="#3E2230" />
    <path d="M20 9 L10 25 A14 14 0 0 0 30 25 Z" fill="#6E4558" />
    <circle cx="21.5" cy="17.5" r="3.2" fill="#FFC6B3" />
    <path d="M15.5 23c1.8-3.2 6.5-3.6 9-1.4" stroke="#FFC6B3" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <path d="M15 34h10M20 28v6" stroke={D} strokeWidth="2.6" strokeLinecap="round" />
  </>,
  drop: <>
    <path d="M20 5c6.5 8.5 11 14 11 19.5a11 11 0 0 1-22 0C9 19 13.5 13.5 20 5z" fill="#E8457A" stroke={D} strokeWidth="2" />
    <path d="M14 24.5a6 6 0 0 0 4.5 5.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8" />
  </>,
  glucose: <>
    <path d="M17 5c6 8 10 13 10 18a10 10 0 0 1-20 0c0-5 4-10 10-18z" fill="#E8457A" stroke={D} strokeWidth="2" />
    <path d="M11.5 23a5.5 5.5 0 0 0 4 5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8" />
    <rect x="23" y="22" width="11" height="11" rx="2.5" fill="#fff" stroke={D} strokeWidth="2" />
    <path d="M26 25.5h1M30 29.5h1M30 25.5h1M26 29.5h1" stroke={L} strokeWidth="1.8" strokeLinecap="round" />
  </>,
  syringe: <>
    <g transform="rotate(45 20 20)">
      <rect x="15.5" y="7" width="9" height="20" rx="2" fill="#fff" stroke={D} strokeWidth="2" />
      <rect x="16.5" y="16" width="7" height="10" rx="1" fill={L} />
      <path d="M13 7h14M20 2.5v4.5M20 27v9" stroke={D} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M15.5 12h3.5M15.5 16h3.5M15.5 20h3.5" stroke={D} strokeWidth="1.5" />
    </g>
  </>,
  fish: <>
    <path d="M5 20c5.5-7.5 16-8.5 23 0-7 8.5-17.5 7.5-23 0z" fill="#9CC3D9" stroke="#4E7C99" strokeWidth="2" strokeLinejoin="round" />
    <path d="M28 20l7-6.5v13z" fill="#9CC3D9" stroke="#4E7C99" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="11.5" cy="18.5" r="1.7" fill="#24384A" />
    <path d="M17 15.5c1.5 2.5 1.5 6.5 0 9" stroke="#4E7C99" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <path d={heart} transform="translate(27 2) scale(.38)" fill={P} />
  </>,
  cup: <>
    <path d="M7 15h20v7a9.5 9.5 0 0 1-9.5 9.5h-1A9.5 9.5 0 0 1 7 22z" fill="#fff" stroke={INK} strokeWidth="2" />
    <path d="M27 17h2a4 4 0 0 1 0 8h-2.5" fill="none" stroke={INK} strokeWidth="2" />
    <path d="M9 18.5h16" stroke="#A9714B" strokeWidth="3" strokeLinecap="round" />
    <path d="M13 5c-2 2.2 2 3.4 0 6M19 4c-2 2.2 2 3.4 0 6" stroke="#C7A2AF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M5 35h26" stroke={INK} strokeWidth="2" strokeLinecap="round" />
  </>,
  tea: <>
    <path d="M7 15h20v7a9.5 9.5 0 0 1-9.5 9.5h-1A9.5 9.5 0 0 1 7 22z" fill="#FFF6E5" stroke={INK} strokeWidth="2" />
    <path d="M27 17h2a4 4 0 0 1 0 8h-2.5" fill="none" stroke={INK} strokeWidth="2" />
    <path d="M14 21c3-5 8-4 9-2-2 4-6 5-9 2z" fill="#9CC48A" />
    <path d="M14 21l6-2.5" stroke="#6E9B5C" strokeWidth="1.2" />
    <path d="M13 5c-2 2.2 2 3.4 0 6M19 4c-2 2.2 2 3.4 0 6" stroke="#C7A2AF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </>,
  noAlcohol: <>
    <path d="M14 8h12c0 7-2 11-6 11s-6-4-6-11z" fill={L} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M20 19v9M15.5 30h9" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    <circle cx="20" cy="20" r="16" fill="none" stroke={RED} strokeWidth="2.8" />
    <path d="M8.7 8.7l22.6 22.6" stroke={RED} strokeWidth="2.8" strokeLinecap="round" />
  </>,
  avoid: <>
    <circle cx="19" cy="22" r="10.5" fill="#fff" stroke={INK} strokeWidth="2" />
    <circle cx="19" cy="22" r="6" fill="#FFE3EA" />
    <path d="M5 13v5.5a2 2 0 0 0 4 0V13M7 18.5V33" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M33 33V13c-2.5 1.5-3.5 5-3.5 9h3.5" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="30" cy="8.5" r="6.5" fill={RED} />
    <path d="M27.3 5.8l5.4 5.4M32.7 5.8l-5.4 5.4" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" />
  </>,
  apple: <>
    <path d="M20 13c-4-3-12-2-12 6.5 0 7.5 5.5 13.5 8.5 13.5 1.6 0 2.2-1 3.5-1s1.9 1 3.5 1c3 0 8.5-6 8.5-13.5C32 11 24 10 20 13z" fill={P} stroke={D} strokeWidth="2" />
    <path d="M20 13c0-3 1-5.5 3-6.5" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M22.5 9c3-3 7.5-2 8.5.3-3 2.2-6.5 2.2-8.5-.3z" fill="#8BBF7A" />
    <path d="M12.5 18.5a5 5 0 0 1 3-3.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".8" />
  </>,
  shoe: <>
    <path d="M5 28c0-5 1-13 4.5-15 2.5 0 3.5 3.2 7 4.2 4.5 1.3 10.5 2.2 14.5 5 3.2 2.2 4.2 5 2 6.3H7c-1.2 0-2-.6-2-1.5z" fill={L} stroke={D} strokeWidth="2" strokeLinejoin="round" />
    <path d="M5 28.5h29" stroke={D} strokeWidth="2" />
    <path d="M12.5 18l3-2M15.5 20.3l3-2M18.8 21.8l2.6-2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 33h6M14 33h5" stroke={L} strokeWidth="1.8" strokeLinecap="round" />
  </>,
  feet: <>
    {[[13, 22, -12], [26, 17, 10]].map(([x, y, r], i) => (
      <g key={i} transform={`rotate(${r} ${x} ${y})`}>
        <ellipse cx={x} cy={y + 3} rx="5" ry="7.5" fill="#FFC6B3" stroke="#E98F79" strokeWidth="1.6" />
        <circle cx={x - 4} cy={y - 6.5} r="1.7" fill="#FFC6B3" stroke="#E98F79" strokeWidth="1.2" />
        <circle cx={x - 1.3} cy={y - 8} r="1.8" fill="#FFC6B3" stroke="#E98F79" strokeWidth="1.2" />
        <circle cx={x + 1.6} cy={y - 8} r="1.6" fill="#FFC6B3" stroke="#E98F79" strokeWidth="1.2" />
        <circle cx={x + 4} cy={y - 6.6} r="1.4" fill="#FFC6B3" stroke="#E98F79" strokeWidth="1.2" />
      </g>
    ))}
  </>,
  moon: <>
    <path d="M24 6a14 14 0 1 0 10 22A12 12 0 0 1 24 6z" fill="#C3B1E6" stroke="#7E66A8" strokeWidth="2" strokeLinejoin="round" />
    <path d="M30 9l1 2.3 2.3 1-2.3 1-1 2.3-1-2.3-2.3-1 2.3-1z" fill="#F7C85B" />
    <path d="M14 24c1.5 1.4 3.5 1.4 5 0" stroke="#7E66A8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </>,
  mind: <>
    <path d={heart} transform="translate(2 2.5) scale(1.5)" fill={P} stroke={D} strokeWidth="1.3" />
    <path d="M14 17.5c1-1.2 2.4-1.2 3.4 0M22.6 17.5c1-1.2 2.4-1.2 3.4 0" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M16.5 22c2 2 5 2 7 0" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </>,
  phone: <>
    <circle cx="20" cy="20" r="15.5" fill="#FFE1E6" stroke={RED} strokeWidth="2" />
    <path d="M14 11c1-1 3-1 3.6.1l1.5 3.4c.4 1-.3 1.8-1 2.3 1 2.4 2.8 4.2 5.2 5.2.5-.7 1.3-1.4 2.3-1l3.4 1.5c1.1.6 1.1 2.6.1 3.6-1.5 1.5-4 2-7 .5a18 18 0 0 1-8.6-8.6c-1.5-3-1-5.5.5-7z" fill={RED} />
  </>,
  warning: <>
    <path d="M20 5.5l15.5 27a2 2 0 0 1-1.7 3H6.2a2 2 0 0 1-1.7-3z" fill="#FFE1E6" stroke={RED} strokeWidth="2" strokeLinejoin="round" />
    <path d="M20 15v9" stroke={RED} strokeWidth="3" strokeLinecap="round" />
    <circle cx="20" cy="29" r="1.9" fill={RED} />
  </>,
  stethoscope: <>
    <path d="M11 6v9a7 7 0 0 0 14 0V6" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M18 22v3.5a8 8 0 0 0 16 0V23" fill="none" stroke={INK} strokeWidth="2.4" />
    <circle cx="34" cy="19.5" r="4.3" fill={P} stroke={D} strokeWidth="2" />
    <circle cx="11" cy="5.5" r="1.8" fill={INK} /><circle cx="25" cy="5.5" r="1.8" fill={INK} />
  </>,
  hospital: <>
    <path d="M5 14L20 6l15 8" fill="none" stroke={D} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="8" y="13" width="24" height="21" rx="2.5" fill="#fff" stroke={D} strokeWidth="2" />
    <path d="M20 16.5v8M16 20.5h8" stroke={P} strokeWidth="3.2" strokeLinecap="round" />
    <path d="M17 34v-6h6v6" fill="#FFD9E3" stroke={D} strokeWidth="1.8" />
  </>,
}
export type IconName = keyof typeof ICONS

const TONES: Partial<Record<IconName, string>> = {
  sun: '#FFF4D9', fish: '#E8F2F8', moon: '#F1ECFA', feet: '#FFF0E8', phone: '#FFE9EC', warning: '#FFE9EC',
  noAlcohol: '#FFE9EC', avoid: '#FFF0F2', tea: '#FFF6E5', cup: '#FBF1EC', scan: '#F7E8EE', shoe: '#FFEEF2',
}

export default function AdviceIcon({ name, size = 52, bare = false }: { name: IconName; size?: number; bare?: boolean }) {
  const svg = <svg viewBox="0 0 40 40" width={bare ? size : size * 0.66} height={bare ? size : size * 0.66} aria-hidden="true">{ICONS[name]}</svg>
  if (bare) return svg
  return <span className="adv-ico" style={{ width: size, height: size, background: TONES[name] ?? '#FFEEF2' }} aria-hidden="true">{svg}</span>
}
