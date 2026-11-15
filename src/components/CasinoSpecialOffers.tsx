'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { SpecialOffer } from '@shared/types/specialOffer'

const PER_PAGE = 4

/**
 * A casino's attached special offers, shown 4 at a time with the total count —
 * the mockup's "Bonuses At This Casino" (sites/betpulsehq-redesign.html): one
 * card of offer rows (`.of`) with the casino's logo, the bonus type, the offer
 * and its amount. When there are more
 * than 4, client-side pagination pages through them (the offers already arrive
 * with the casino, so no extra fetch is needed).
 *
 * `logo` is the casino's own: the offers listed here arrive without their
 * casino attached, and every one of them is this casino's.
 */
export default function CasinoSpecialOffers({ offers, logo }: { offers: SpecialOffer[]; logo?: string | null }) {
  const [page, setPage] = useState(0)

  // The API may serialize an empty relation as {} rather than []; guard for it
  // so a casino with no offers doesn't crash (offers.slice is not a function).
  const list = Array.isArray(offers) ? offers : []
  const total = list.length
  if (total === 0) return null

  const pageCount = Math.ceil(total / PER_PAGE)
  const start = page * PER_PAGE
  const visible = list.slice(start, start + PER_PAGE)

  return (
    <section className="mt-11">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <h2 className="min-w-0 font-display text-[26px] font-bold leading-tight text-ink sm:text-[clamp(26px,3vw,36px)]">
          {COPY.casinos.offersHeading} <span className="font-mono text-lg font-bold text-muted">({total})</span>
        </h2>
        {pageCount > 1 && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous offers"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border-[1.5px] border-line-soft bg-paper text-ink transition-colors hover:border-ink disabled:opacity-40 disabled:hover:border-line-soft"
            >
              ←
            </button>
            {/* `whitespace-nowrap`, and it is load-bearing: in a flex row next
                to a heading this is three tokens ("1", "/", "2"), and a long
                heading squeezed it into three stacked lines between the two
                arrows. The counter is one word, so it is told to behave like
                one. */}
            <span className="whitespace-nowrap text-sm tabular-nums text-muted">{page + 1} / {pageCount}</span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page === pageCount - 1}
              aria-label="More offers"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border-[1.5px] border-line-soft bg-paper text-ink transition-colors hover:border-ink disabled:opacity-40 disabled:hover:border-line-soft"
            >
              →
            </button>
          </div>
        )}
      </div>

      <ul className="overflow-hidden rounded-[20px] border-[1.5px] border-line bg-paper" role="list">
        {visible.map((offer) => {
          const thumb = logo ?? resolveImageUrl(offer.image_path ?? offer.banner_image)
          return (
            <li key={offer.id} className="border-b border-line last:border-b-0">
              <Link
                href={`/special-offers/${offer.slug}`}
                className="of grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-1 px-4 py-3.5 text-ink sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:px-5"
              >
                <span aria-hidden className="row-span-2 flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-1.5 sm:row-span-1">
                  {thumb && <Image src={thumb} alt="" width={104} height={104} sizes="52px" className="h-full w-full object-contain" />}
                </span>
                <span className="min-w-0">
                  {/* The bonus TYPE, as the editor named it. Only when filed under one. */}
                  {offer.bonus_category_name && (
                    <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-muted">{offer.bonus_category_name}</span>
                  )}
                  <span className="block text-[15px] font-bold leading-[1.3] [overflow-wrap:anywhere]">{offer.title}</span>
                  {offer.bonuses && <span className="block text-sm font-semibold text-brand-dark [overflow-wrap:anywhere]">{offer.bonuses}</span>}
                </span>
                <span className="text-[13px] font-bold text-brand-dark">View offer →</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
