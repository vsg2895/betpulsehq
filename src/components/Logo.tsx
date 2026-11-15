import Link from 'next/link'

/**
 * BetPulseHQ brand mark, from sites/betpulsehq-redesign.html: the ECG pulse
 * trace on a navy tile, the wordmark with "HQ" in terracotta, and a mono
 * tagline.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request
 * and stays crisp at any size. The artwork is aria-hidden; the Link's name is
 * its visible text.
 *
 * `onDark` is for the navy footer: the tile steps a shade lighter so it still
 * reads as a tile, and the wordmark turns white. One component, so the
 * header's mark and the footer's can never drift apart.
 */
export default function Logo({
  className = '',
  onDark = false,
}: {
  className?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      {/* The mark from sites/betpulsehq-redesign.html: the pulse trace on a
          navy tile — a step lighter on the navy footer, so the tile still
          reads as a tile there. */}
      <svg viewBox="0 0 38 38" className="h-[38px] w-[38px] shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="38" rx="10" fill={onDark ? 'var(--color-navy-2)' : 'var(--color-navy)'} />
        <path d="M6 20h7l3-7 5 13 3-6h8" fill="none" stroke="#ff7a45" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className={`font-display text-[19px] font-bold tracking-[-0.02em] sm:text-[20px] ${onDark ? 'text-white' : 'text-ink'}`}>
          BetPulse<span className={onDark ? 'text-brand-soft' : 'text-brand'}>HQ</span>
        </span>
        <span className={`mt-[5px] font-mono text-[11px] font-bold uppercase tracking-[0.06em] ${onDark ? 'text-night-muted' : 'text-muted'}`}>
          Casino rankings &amp; bonuses
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
