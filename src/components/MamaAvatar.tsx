import { useId } from 'react'
import type { MamaLook } from '../lib/profile'
import { cleanId, shade } from './color'
import { HEART_PATH } from './Heart'

const CAP = 'M52 72 C 50 46, 66 40, 80 40 C 96 40, 110 48, 108 72 C 102 58, 92 52, 80 54 C 68 54, 58 60, 52 72Z'
const CAP_PART = 'M52 72 C 50 46, 66 40, 80 40 C 94 40, 110 46, 108 72 C 104 56, 90 50, 80 52 C 70 50, 56 56, 52 72Z'
const BOB_FRONT = 'M52 74 C 50 46, 66 40, 80 40 C 96 40, 110 46, 108 74 C 104 62, 98 58, 92 60 C 86 54, 74 54, 68 60 C 62 58, 56 62, 52 74Z'

export default function MamaAvatar({ look, size = 120, bg, blink = true, className }: { look: MamaLook; size?: number; bg?: string; blink?: boolean; className?: string }) {
  const uid = cleanId(useId())
  const { hair, skin, hairColor, scarf, outfit } = look
  const hc = hair === 'scarf' ? scarf : hairColor
  const back = bg ?? shade(outfit, 0.78)
  const curls = Array.from({ length: 11 }, (_, i) => {
    const a = (Math.PI / 180) * (165 + i * 21)
    return [80 + Math.cos(a) * 30, 74 + Math.sin(a) * 31] as const
  })

  return (
    <svg viewBox="0 0 160 160" width={size} height={size} className={className} role="img" aria-label="Your avatar">
      <defs><clipPath id={`${uid}c`}><circle cx="80" cy="80" r="78" /></clipPath></defs>
      <g clipPath={`url(#${uid}c)`}>
        <circle cx="80" cy="80" r="78" fill={back} />
        {/* hair behind */}
        {hair === 'long' && <path d="M50 66 C 44 100, 46 122, 52 130 L 108 130 C 114 122, 116 100, 110 66 Z" fill={hc} />}
        {hair === 'bob' && <path d="M50 70 C 47 96, 54 104, 64 102 L 96 102 C 106 104, 113 96, 110 70 Z" fill={hc} />}
        {hair === 'curly' && <g fill={hc}>
          {curls.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="12" />)}
          <circle cx="52" cy="96" r="11" /><circle cx="108" cy="96" r="11" />
        </g>}
        {hair === 'bun' && <circle cx="80" cy="37" r="12.5" fill={hc} />}
        {hair === 'scarf' && <path d="M44 74 C 40 40, 120 40, 116 74 C 118 104, 112 122, 80 130 C 48 122, 42 104, 44 74Z" fill={hc} />}

        {/* body + bump */}
        <path d="M28 162 C 28 128, 52 112, 80 112 C 108 112, 132 128, 132 162 Z" fill={outfit} />
        <ellipse cx="86" cy="152" rx="30" ry="22" fill={shade(outfit, 0.12)} />
        <path d={HEART_PATH} transform="translate(79 140) scale(.6)" fill="#fff" opacity=".85" />
        {hair === 'scarf' && <path d="M46 110 C 60 126, 100 126, 114 110 C 110 124, 96 132, 80 132 C 64 132, 50 124, 46 110Z" fill={shade(hc, -0.08)} />}
        <rect x="72" y="92" width="16" height="22" rx="7" fill={shade(skin, -0.07)} />

        {/* head */}
        {hair !== 'scarf' && <><circle cx="52" cy="73" r="5.5" fill={shade(skin, -0.04)} /><circle cx="108" cy="73" r="5.5" fill={shade(skin, -0.04)} /></>}
        <circle cx="80" cy="70" r="28" fill={skin} />

        {/* hair front */}
        {hair === 'bun' && <path d={CAP} fill={hc} />}
        {hair === 'long' && <path d={CAP} fill={hc} />}
        {hair === 'bob' && <path d={BOB_FRONT} fill={hc} />}
        {hair === 'braid' && <path d={CAP_PART} fill={hc} />}
        {hair === 'curly' && <g fill={hc}>
          <circle cx="58" cy="58" r="9" /><circle cx="68" cy="48" r="10" /><circle cx="80" cy="45" r="10" /><circle cx="92" cy="48" r="10" /><circle cx="102" cy="58" r="9" />
        </g>}
        {hair === 'scarf' && <path d="M50 70 C 52 40, 108 40, 110 70 C 102 54, 92 50, 80 50 C 68 50, 58 54, 50 70Z" fill={shade(hc, 0.1)} />}

        {/* face */}
        <g className={blink ? 'm-eyes' : undefined}>
          <ellipse cx="71" cy="73" rx="2.7" ry="3.4" fill="#3A2B2A" />
          <ellipse cx="89" cy="73" rx="2.7" ry="3.4" fill="#3A2B2A" />
          <circle cx="72" cy="72" r=".9" fill="#fff" /><circle cx="90" cy="72" r=".9" fill="#fff" />
        </g>
        <ellipse cx="64" cy="81" rx="5.5" ry="3.4" fill="#F29A8E" opacity=".45" />
        <ellipse cx="96" cy="81" rx="5.5" ry="3.4" fill="#F29A8E" opacity=".45" />
        <path d="M75 83 Q80 88 85 83" fill="none" stroke="#A85F5A" strokeWidth="2" strokeLinecap="round" />

        {hair === 'braid' && <g fill={hc}>
          <circle cx="105" cy="88" r="7.5" /><circle cx="107" cy="100" r="7.5" /><circle cx="109" cy="112" r="7" /><circle cx="110" cy="123" r="6.5" />
          <circle cx="110.5" cy="131" r="3" fill={outfit === '#E7C67A' ? '#C9837C' : '#E7C67A'} />
          <path d="M110 133 l-4 8 h8z" />
        </g>}
      </g>
    </svg>
  )
}
