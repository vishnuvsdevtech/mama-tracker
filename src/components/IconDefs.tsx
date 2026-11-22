import { HEART_PATH } from './Heart'
/** Shared <symbol>s for static illustrations that use <use href="#i-heart"/>. */
export default function IconDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="i-heart" viewBox="0 0 24 24"><path fill="currentColor" d={HEART_PATH} /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#E5EDDF" /><path d="M7 12.5l3.2 3L17 8.8" fill="none" stroke="#71866A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      </defs>
    </svg>
  )
}
