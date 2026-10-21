import Link from 'next/link'

/**
 * BetPulseHQ brand mark: an ink-navy rounded square holding a terracotta disc
 * that radiates, with a cream centre carrying an ECG trace — a pulse reading.
 * Beside it the wordmark and a small-caps tagline. Taken from
 * sites/betpulsehq.html.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request,
 * stays crisp at any size, and takes its colours from the theme tokens, so a
 * palette change here is a palette change everywhere. The Link carries the
 * accessible name; the artwork is aria-hidden to avoid a duplicate
 * announcement.
 *
 * `onDark` is for the footer, which sits on the ink ground the mark's own
 * backing square is made of. Without it the square disappears into the footer
 * and the logo reads as a floating disc, so the backing and the wordmark invert
 * while the disc and the trace — the identity itself — stay exactly as they
 * are. One component rather than two, so the header's mark and the footer's can
 * never drift apart.
 */
export default function Logo({
  className = '',
  onDark = false,
}: {
  className?: string
  onDark?: boolean
}) {
  // Only the BACKING square inverts. The centre disc stays cream in both
  // variants — it is what the ink trace is drawn on, and flipping it to ink
  // would leave the trace invisible on its own background.
  const plate = onDark ? 'var(--color-cream)' : 'var(--color-ink)'

  return (
    <Link
      href="/"
      aria-label="BetPulseHQ home"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-ink' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <svg
        viewBox="0 0 42 42"
        className="h-9 w-9 shrink-0 sm:h-[42px] sm:w-[42px]"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="42" height="42" rx="11" fill={plate} />
        <circle cx="21" cy="21" r="14" fill="var(--color-brand)" />
        {/* The eight radiating spokes. Drawn in the PLATE colour, not in cream
            directly, so they keep reading as gaps cut out of the disc on
            either ground. */}
        <g stroke={plate} strokeWidth="3.4">
          <path d="M21 7v5M21 30v5M7 21h5M30 21h5M11.1 11.1l3.5 3.5M27.4 27.4l3.5 3.5M30.9 11.1l-3.5 3.5M14.6 27.4l-3.5 3.5" />
        </g>
        <circle cx="21" cy="21" r="9" fill="var(--color-cream)" />
        {/* The pulse trace. Ink on cream in both variants — it is the one mark
            that must stay legible at 36px, so it never takes a tinted colour. */}
        <path
          d="M13.5 21.5h3l1.8-4 2.7 8 2.4-6.5 1.2 2.5h3.9"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[20px] font-extrabold tracking-[-0.03em] sm:text-[22px] ${
            onDark ? 'text-white' : 'text-ink'
          }`}
        >
          BetPulse<span className="text-brand">HQ</span>
        </span>
        <span
          className={`mt-[5px] text-[9px] font-semibold uppercase tracking-[0.2em] ${
            onDark ? 'text-white/55' : 'text-faint'
          }`}
        >
          Casino rankings &amp; bonuses
        </span>
      </span>
    </Link>
  )
}
