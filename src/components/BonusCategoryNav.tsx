import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * One colour per bonus type, in order, each with the text colour that reads on
 * it at 4.5:1 or better. The mockup's six, the green a shade deeper (white on
 * its #2BA67A is about 3:1), and two more for sites with more types.
 */
const TYPE_COLOURS: ReadonlyArray<{ bg: string; fg: string }> = [
  { bg: '#c2552b', fg: '#ffffff' },
  { bg: '#1a1d33', fg: '#ffffff' },
  { bg: '#1f8a63', fg: '#ffffff' },
  { bg: '#3b5ba9', fg: '#ffffff' },
  { bg: '#d98a2b', fg: '#1a1d33' },
  { bg: '#7a4e9c', fg: '#ffffff' },
  { bg: '#2c7f8c', fg: '#ffffff' },
  { bg: '#a3485f', fg: '#ffffff' },
]

/** The catch-all's colour, wherever it does appear (its group on the home page). */
const CATCH_ALL_COLOUR = { bg: 'var(--color-ink-soft)', fg: '#ffffff' }

/**
 * The colour of each section, by slug — shared by the mix bar, its keys and
 * the home page's bonus groups, so a type is the same colour everywhere.
 */
export function bonusTypeColours(sections: BonusSection[]): Map<string, { bg: string; fg: string }> {
  const colours = new Map<string, { bg: string; fg: string }>()
  sections
    .filter((section) => section.slug !== CATCH_ALL_SLUG)
    .forEach((section, i) => colours.set(section.slug, TYPE_COLOURS[i % TYPE_COLOURS.length]))
  colours.set(CATCH_ALL_SLUG, CATCH_ALL_COLOUR)
  return colours
}

/**
 * "Browse Bonus Types", from sites/betpulsehq-redesign.html (`.mix`): the bonus
 * types as ONE stacked bar, each segment as wide as its share of the offers,
 * then a key per type with its colour, name and count.
 *
 * The keys are the links that matter — each opens that type's own page, as the
 * chips did before. The bar segments jump to that type's group further down
 * the home page (`#bonus-<slug>`), as the mockup's do; they are a mouse and
 * touch shortcut only (`tabIndex={-1}`, hidden from assistive tech), because
 * the keys already offer every type to the keyboard and to a screen reader.
 *
 * The counts are the SITE's — active, claimable, owned by a casino attached
 * here — resolved server-side. Renders nothing when the site has no Bonus area
 * or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  const colours = bonusTypeColours(sections)
  const total = types.reduce((sum, section) => sum + section.offers_count, 0)

  return (
    <nav aria-labelledby="bonus-types-heading">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-brand-dark">
        {total} {total === 1 ? 'offer' : 'offers'} on the board
      </p>
      <h2 id="bonus-types-heading" className="mt-2.5 font-display text-[30px] font-bold leading-[1.02] text-ink sm:text-[clamp(30px,4.2vw,52px)]">
        {COPY.home.bonusTypesTitle}
      </h2>

      <div aria-hidden className="mt-[26px] flex h-14 gap-[3px] overflow-hidden rounded-[14px] bg-cream sm:h-16">
        {types.map((section) => {
          const colour = colours.get(section.slug)!
          return (
            <a
              key={section.id}
              href={`#bonus-${section.slug}`}
              tabIndex={-1}
              className="seg flex min-w-0 items-center justify-center overflow-hidden px-1 text-xs font-bold sm:text-[15px]"
              style={{ flex: section.offers_count, background: colour.bg, color: colour.fg }}
            >
              {section.offers_count}
            </a>
          )
        })}
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {types.map((section) => (
          <li key={section.id}>
            <Link
              href={`/bonuses/${section.slug}`}
              className="flex min-h-[52px] items-center gap-3 rounded-xl border-[1.5px] border-line bg-paper px-3.5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink"
            >
              <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded" style={{ background: colours.get(section.slug)!.bg }} />
              {/* The type's own icon, as in the Bonus menu. A plain <img>: next/image
                  refuses SVG. alt="" because the label names it. */}
              {section.icon_path && (
                <img src={resolveImageUrl(section.icon_path)!} alt="" width={20} height={20} className="h-5 w-5 shrink-0" />
              )}
              {section.name}
              <span className="ml-auto font-mono text-[13px] text-muted">
                {section.offers_count}
                <span className="sr-only"> {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
