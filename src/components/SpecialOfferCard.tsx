import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose cards carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the card's primary action a property of
 * the data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/** The grid offer cards sit in: 3 / 2 / 1 across. */
export const OFFER_GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'

/** Up to two initials, for a casino with no logo artwork. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * An offer card for the listing grids, in the language of
 * sites/betpulsehq-redesign.html's offer rows (`.of`): the casino's logo beside
 * whose offer it is and the offer's name, the amount in terracotta, the stars,
 * then the actions. The whole card opens the offer (the title link is
 * stretched over it); the buttons sit above that layer.
 *
 * `logo` lets a casino page pass its own logo: the offers it lists arrive
 * without their casino attached, and every one of them is that casino's.
 */
export default function SpecialOfferCard({ offer, logo: logoOverride }: { offer: SpecialOffer; logo?: string | null }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const casinoName = offer.casino?.name ?? ''

  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY

  return (
    <article className="of relative flex flex-col gap-1.5 rounded-[18px] border-[1.5px] border-line bg-paper p-4">
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-1.5 text-xs font-bold text-ink">
          {logo ? (
            <Image src={logo} alt="" width={112} height={112} sizes="52px" className="h-full w-full object-contain" />
          ) : (
            initials(casinoName || offer.title)
          )}
        </span>
        <div className="min-w-0">
          {/* WHOSE bonus this is, above its name: the first thing someone
              comparing offers needs. Omitted when the casino is not loaded. */}
          {casinoName && (
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-muted">{casinoName}</p>
          )}
          <h3 className="text-[15px] font-bold leading-[1.3] text-ink [overflow-wrap:anywhere]">
            <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:rounded-[18px] after:content-['']">
              {offer.title}
            </Link>
          </h3>
        </div>
      </div>
      {offer.bonuses && (
        <p className="mt-1 text-sm font-semibold leading-[1.3] text-brand-dark">{offer.bonuses}</p>
      )}
      <span
        className="text-[13px] leading-none tracking-[1px] text-gold"
        role="img"
        aria-label={`${offer.rating} out of 5`}
      >
        {'★'.repeat(offer.rating)}
        <span className="text-line-soft" aria-hidden>
          {'★'.repeat(5 - offer.rating)}
        </span>
      </span>
      <div className="relative z-10 mt-auto flex gap-2 pt-2.5">
        {/*
          * Claim belongs to the Special Offers bonus type and to nothing else.
          *
          *   Special Offers + link   →  Details · Claim → the casino
          *   Special Offers, NO link →  Claim alone, leading to the offer's own
          *                              page, where the terms and the operator
          *                              are.
          *   any other bonus type    →  Details alone.
          */}
        {!(claimable && !offer.affiliate_url) && (
          <Link href={`/special-offers/${offer.slug}`} className="btn-ln min-h-11 flex-1 px-3 text-sm">Details</Link>
        )}
        {claimable && (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or min-h-11 flex-1 px-3 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or min-h-11 flex-1 px-3 text-sm">Claim</Link>
          )
        )}
      </div>
    </article>
  )
}

/**
 * An offer as a row inside a group card — `.of` in
 * sites/betpulsehq-redesign.html: the logo, whose offer it is, its name and
 * amount, and on the right the way in. The whole row opens the offer (the
 * title link is stretched over it) and turns a pale terracotta on hover.
 *
 * The SAME Claim rule as the card: Claim only for the Special Offers type —
 * to the casino when the offer has a link, to its own page when it has none.
 * Any other type shows "Details →".
 *
 * `heading` is the title's level: `h4` under a group card's `h3` (the home
 * page), `h3` where the rows sit straight under a section's `h2`.
 */
export function OfferRow({ offer, logo: logoOverride, heading: Heading = 'h4' }: { offer: SpecialOffer; logo?: string | null; heading?: 'h3' | 'h4' }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY
  const kicker = offer.casino?.name ?? offer.bonus_category_name ?? ''

  return (
    <li className="of relative grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2.5 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:px-5">
      <span aria-hidden className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-1.5 text-xs font-bold text-ink">
        {logo ? (
          <Image src={logo} alt="" width={104} height={104} sizes="52px" className="h-full w-full object-contain" />
        ) : (
          initials(kicker || offer.title)
        )}
      </span>
      <div className="min-w-0">
        {kicker && <p className="font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-muted">{kicker}</p>}
        <Heading className="text-[15px] font-bold leading-[1.3] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </Heading>
        {offer.bonuses && <p className="text-sm font-semibold text-brand-dark [overflow-wrap:anywhere]">{offer.bonuses}</p>}
      </div>
      <div className="relative z-10 col-span-2 flex items-center justify-end gap-3 sm:col-span-1">
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or min-h-11 px-4 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or min-h-11 px-4 text-sm">Claim</Link>
          )
        ) : (
          <span aria-hidden className="text-[13px] font-bold text-brand-dark">Details →</span>
        )}
      </div>
    </li>
  )
}
