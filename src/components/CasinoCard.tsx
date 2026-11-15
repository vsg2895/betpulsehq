import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many region chips a card shows before collapsing the rest into a count. */
const REGIONS_SHOWN = 3

function Stars({ rating }: { rating: number }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 18px reads as a rendering fault. The
  // exact figure is printed beside it either way.
  const filled = Math.round(rating)

  return (
    <span
      className="inline-flex items-center tracking-[1px] text-[15px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? 'text-gold' : 'text-line-soft'} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The list the rows sit in — the mockup's `.rows`. Callers render
 * `<ol className={CASINO_LIST}>`; the order of the list is the ranking.
 */
export const CASINO_LIST = 'flex flex-col gap-3'

/**
 * A casino as a ranking row — `.rw` in sites/betpulsehq-redesign.html: the
 * logo, the name with its rating and the regions it accepts, the pulse mark,
 * the bonus, and the two actions. On hover or keyboard focus the row lifts,
 * its edge turns terracotta and the pulse mark lights up (globals.css).
 *
 * Five columns from 1100px; three below that (the pulse mark drops out and
 * the actions take a full-width row of their own); two on a phone, where the
 * bonus also gets a row of its own.
 *
 * The pulse mark is the brand's ECG motif, identical on every row and hidden
 * from assistive tech — decoration, NOT a chart of anything about the casino.
 *
 * NO RANK NUMBER — the network rule is that no casino card shows one; the
 * `<ol>` order is the ranking. `rank` is still accepted so callers did not
 * have to change. The chips carry `countries`, real attached data.
 */
export default function CasinoCard({
  casino,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length

  return (
    <li className="rw grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 gap-y-3 rounded-[18px] border-[1.5px] border-line bg-paper p-3.5 sm:grid-cols-[96px_minmax(0,1fr)_minmax(0,1fr)] sm:gap-[18px] sm:px-[18px] min-[68.75rem]:grid-cols-[104px_minmax(0,1fr)_150px_minmax(0,1fr)_220px]">
      {/* The logo plate. WHITE: operator logos arrive with their own white
          ground baked in. The image fills the plate (contained), so a small
          logo file is never drawn smaller than its box. With no artwork the
          operator's NAME fills the plate instead. */}
      <div className="flex h-[60px] w-[88px] items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-1.5 sm:h-[68px] sm:w-[96px] min-[68.75rem]:w-[104px]">
        {image ? (
          <Image src={image} alt={`${casino.name} logo`} width={208} height={136} sizes="104px" className="h-full w-full object-contain" />
        ) : (
          <span className="text-center text-[13px] font-bold leading-tight text-ink [overflow-wrap:anywhere]">{casino.name}</span>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="font-display text-[19px] font-bold leading-[1.1] text-ink [overflow-wrap:anywhere] sm:text-[21px]">{casino.name}</h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Stars rating={casino.rating} />
            <span className="tabular-nums">{casino.rating.toFixed(1)}</span>
          </span>
          {shownRegions.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Accepts players from">
              {shownRegions.map((country) => (
                <li key={country.id} className="rounded-full bg-win-bg px-[9px] py-[3px] text-xs font-bold text-win">
                  {country.name}
                </li>
              ))}
              {extraRegions > 0 && (
                /* A count, not a tooltip: the full list is on the review
                   page, and a hover affordance is invisible on a phone. */
                <li className="rounded-full bg-surface px-[9px] py-[3px] text-xs font-bold text-ink-soft">+{extraRegions} more</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <svg aria-hidden focusable="false" viewBox="0 0 150 40" className="spark hidden h-10 w-[150px] min-[68.75rem]:block">
        <path d="M0 24h34l6-10 6 10h14l6-20 8 32 6-12h20l6-8 6 8h38" fill="none" strokeWidth="2" strokeLinejoin="round" />
      </svg>

      <p className="col-span-2 font-display text-[17px] font-semibold leading-[1.3] text-ink [overflow-wrap:anywhere] empty:hidden sm:col-span-1 sm:empty:block">
        {casino.bonuses}
      </p>

      <div className="col-span-full flex gap-2 min-[68.75rem]:col-span-1 min-[68.75rem]:flex-col">
        <a
          href={casino.attachment.affiliate_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="btn-or min-h-[42px] flex-1 whitespace-nowrap px-3.5 text-sm"
        >
          {COPY.casinos.visitCasino}
        </a>
        <Link href={`/casinos/${casino.slug}`} className="btn-ln min-h-[42px] flex-1 whitespace-nowrap px-3.5 text-sm">
          {COPY.casinos.readReview}
        </Link>
      </div>
    </li>
  )
}
