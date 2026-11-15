import Link from 'next/link'
import { COPY } from '@/constants/copy'
import { OfferRow } from '@/components/SpecialOfferCard'
import { bonusTypeColours } from '@/components/BonusCategoryNav'
import type { BonusSection } from '@/lib/api'

/**
 * The home page's Bonuses, from sites/betpulsehq-redesign.html (`.groups`):
 * one card per bonus type, two columns of them on a wide screen, each with the
 * type's colour (the same one the mix bar gives it), its name, a link to its
 * own page, and its offers as rows.
 *
 * Every type's offers are in the server HTML. Each card keeps the
 * `#bonus-<slug>` anchor every site's home page exposes — the mix bar's
 * segments land on it.
 *
 * `break-inside-avoid` on each card is what keeps a card whole when the
 * two-column flow splits the set.
 */
export default function BonusGroups({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  const colours = bonusTypeColours(sections)

  return (
    <div className="mt-[26px] gap-5 lg:columns-2">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`bonus-${section.slug}`}
          aria-labelledby={`bonus-${section.slug}-heading`}
          className="mb-5 scroll-mt-24 overflow-hidden rounded-[20px] border-[1.5px] border-line bg-paper break-inside-avoid"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
            <h3 id={`bonus-${section.slug}-heading`} className="flex min-w-0 items-center gap-2.5 font-display text-xl font-bold text-ink">
              <span aria-hidden className="h-3 w-3 shrink-0 rounded" style={{ background: colours.get(section.slug)?.bg }} />
              {section.name}
            </h3>
            <Link
              href={`/bonuses/${section.slug}`}
              className="-my-3 inline-flex min-h-11 items-center py-3 text-sm font-semibold text-brand-dark transition-colors hover:text-ink"
            >
              {COPY.home.seeMore}<span className="sr-only"> {section.name}</span> <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
          {section.description && <p className="border-b border-line px-4 py-3 text-sm text-ink-soft sm:px-5">{section.description}</p>}
          <ul role="list">
            {section.offers.map((offer) => <OfferRow key={offer.id} offer={offer} />)}
          </ul>
        </section>
      ))}
    </div>
  )
}
