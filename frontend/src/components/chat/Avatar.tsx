import type { AvatarSpec } from '../../data/scenarios'

/** Avatar ilustrado (flat) montado a partir de uma especificação em src/data/scenarios.ts. Decorativo. */
export default function Avatar({ spec, className = 'h-10 w-10' }: { spec: AvatarSpec; className?: string }) {
  const { skin, hair, hairStyle, outfit, accessory } = spec
  return (
    <svg viewBox="0 0 64 64" className={`${className} shrink-0 rounded-full bg-surface`} aria-hidden="true" focusable="false">
      {/* cabelo atrás da cabeça */}
      {hairStyle === 'long' && <path d="M14 30c0-13 8-20 18-20s18 7 18 20v22H14z" fill={hair} />}
      {hairStyle === 'wavy' && <path d="M15 28c0-12 7-18 17-18s17 6 17 18c0 4-2 6-4 6H19c-2 0-4-2-4-6z" fill={hair} />}
      {/* ombros e roupa */}
      <path d="M6 64c0-13 11-19 26-19s26 6 26 19z" fill={outfit} />
      {accessory === 'apron' && <path d="M22 64l3-17h14l3 17z" fill="#f4efe6" />}
      {accessory === 'vest' && <path d="M20 64l6-19h12l6 19z" fill="#d8b04a" />}
      {accessory === 'scarf' && <path d="M22 47c6 4 14 4 20 0l2 7c-8 5-16 5-24 0z" fill="#e8b04a" />}
      {accessory === 'tie' && <path d="M30 47h4l2 14-4 3-4-3z" fill="#b22234" />}
      {accessory === 'bowtie' && <path d="M26 48l6 3-6 3zM38 48l-6 3 6 3z" fill="#fff" />}
      {accessory === 'badge' && <rect x="40" y="52" width="7" height="5" rx="1" fill="#f4efe6" />}
      {/* pescoço e cabeça */}
      <rect x="27" y="38" width="10" height="9" fill={skin} />
      <circle cx="32" cy="29" r="13" fill={skin} />
      {/* cabelo na frente */}
      {hairStyle === 'short' && <path d="M19 28c-1-11 6-16 13-16s14 5 13 16c-3-5-7-7-13-7s-10 2-13 7z" fill={hair} />}
      {hairStyle === 'long' && <path d="M19 29c0-10 5-17 13-17s13 7 13 17c-4-3-6-8-8-10-5 3-12 4-18 10z" fill={hair} />}
      {hairStyle === 'wavy' && <path d="M19 29c-2-10 4-17 13-17s15 7 13 17c-2-4-5-8-9-9-3 3-10 4-17 9z" fill={hair} />}
      {hairStyle === 'bun' && (
        <>
          <circle cx="32" cy="12" r="6" fill={hair} />
          <path d="M19 29c0-10 5-15 13-15s13 5 13 15c-4-4-8-6-13-6s-9 2-13 6z" fill={hair} />
        </>
      )}
      {hairStyle === 'cap' && (
        <>
          <path d="M19 26c0-9 5-14 13-14s13 5 13 14z" fill={outfit} />
          <rect x="19" y="24" width="30" height="4" rx="2" fill={outfit} />
          <path d="M19 28c0 6 2 9 4 11-1-4-1-8-4-11z" fill={hair} />
        </>
      )}
      {hairStyle === 'bald' && <path d="M18 30c0 3 1 5 2 6-1-5 0-9 2-12-3 1-4 3-4 6zM46 30c0 3-1 5-2 6 1-5 0-9-2-12 3 1 4 3 4 6z" fill={hair} />}
      {/* rosto */}
      <circle cx="27" cy="30" r="1.5" fill="#2a2018" />
      <circle cx="37" cy="30" r="1.5" fill="#2a2018" />
      <path d="M27 36c3 3 7 3 10 0" stroke="#2a2018" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {accessory === 'glasses' && (
        <g fill="none" stroke="#2a2018" strokeWidth="1.3">
          <circle cx="27" cy="30" r="4" />
          <circle cx="37" cy="30" r="4" />
          <path d="M31 30h2" />
        </g>
      )}
    </svg>
  )
}
