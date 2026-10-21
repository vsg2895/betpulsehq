import { ImageResponse } from 'next/og'

/**
 * Dynamic Open Graph / Twitter card image.
 *
 * Until now no og:image existed anywhere while twitter:card was set to
 * `summary_large_image`, so every share of these pages rendered as an empty
 * card — the single most visible SEO/social gap on the site. Generating it here
 * means it can never drift out of sync with the site name, and needs no binary
 * asset committed to the repo.
 *
 * Next.js picks this file up automatically for every route that does not
 * override it, and injects the absolute og:image/twitter:image URLs plus the
 * width/height and alt text that crawlers expect.
 */
export const alt = 'BetPulseHQ — Casino Rankings With A Live Pulse'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // The ink ground with a terracotta bloom, not a two-colour ramp:
          // this brand spends its one saturated colour in a single place,
          // and a full-bleed gradient would spend it everywhere.
          background: '#1a1d33',
          backgroundImage:
            'radial-gradient(60% 90% at 50% 0%, rgba(184,83,42,0.75), rgba(26,29,51,0) 70%)',
          color: '#f5f2ec',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 10, color: '#f0b89c', textTransform: 'uppercase' }}>
          Casino Rankings &amp; Bonuses
        </div>
        {/* Satori needs an EXPLICIT display on any element with more than one
            child — the wordmark is two coloured spans, so this one says flex
            rather than relying on the browser default it never sees. */}
        <div
          style={{
            display: 'flex',
            fontSize: 104,
            fontWeight: 700,
            marginTop: 24,
            padding: '0 60px',
          }}
        >
          <span>BetPulse</span>
          <span style={{ color: '#e08a5f' }}>HQ</span>
        </div>
        <div style={{ fontSize: 32, marginTop: 32, opacity: 0.7 }}>
          18+ · Gamble responsibly
        </div>
      </div>
    ),
    size,
  )
}
