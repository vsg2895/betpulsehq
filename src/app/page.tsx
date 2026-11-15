import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_LIST } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusGroups from '@/components/BonusGroups'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* Hero — the claim and the two ways in on the left, the monitor on
            the right: what each pass re-reads, under a live ECG trace. */}
        <section>
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-4 pb-12 pt-12 min-[61.25rem]:grid-cols-2 min-[61.25rem]:pb-14 min-[61.25rem]:pt-16">
            <div>
              <p className="live inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-[7px] font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
                {COPY.home.heroEyebrow}
              </p>
              <h1 className="mt-[22px] font-display text-[42px] font-bold leading-none text-balance text-ink sm:text-[clamp(42px,6vw,78px)]">
                {COPY.home.heroHeadline} <em className="not-italic text-brand">{COPY.home.heroHighlight}</em>
              </h1>
              <p className="mt-[22px] max-w-[540px] text-lg text-ink-soft">{COPY.home.heroSubtitle}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/casinos" className="btn-or min-h-12 px-[22px] text-[15px]">
                  {COPY.home.featuredCasinos}
                </Link>
                {anyOffersVisible && (
                  <Link href="/special-offers" className="btn-ln min-h-12 px-[22px] text-[15px]">
                    {COPY.home.specialOffers}
                  </Link>
                )}
              </div>
            </div>

            <aside aria-labelledby="monitor-heading" className="rounded-[22px] bg-navy p-4 text-white shadow-[0_30px_60px_-28px_rgba(26,29,51,0.55)] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-night-ink">
                <h2 id="monitor-heading">{COPY.home.monitorTitle}</h2>
                <span className="live inline-flex items-center gap-2">{COPY.home.monitorStatus}</span>
              </div>
              <div aria-hidden className="ecg-grid mt-3 overflow-hidden rounded-[14px] border border-night-line">
                <svg viewBox="0 0 600 150" className="block h-auto w-full">
                  <path className="ecg-trace" d="M0 85H90l12-22 12 22h40l10-62 14 108 12-46h70l12-20 12 20h50l10-62 14 108 12-46h70l12-20 12 20H600" />
                </svg>
              </div>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3" role="list">
                {COPY.home.monitorReads.map((read) => (
                  <li key={read.label} className="rounded-xl border border-night-line bg-navy-2 p-3">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-night-ink">{read.label}</p>
                    <p className="mt-1.5 text-sm font-semibold leading-[1.3]">{read.text}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[13px] text-night-ink">{COPY.home.monitorNote}</p>
            </aside>
          </div>
        </section>

        {/* The ranking — category chips, then the casinos as rows. */}
        <section className="pb-14 pt-6 sm:pb-[72px]" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className="live inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-brand-dark">{COPY.home.rankingLabel}</p>
            <h2 id="top-casinos-heading" className="mt-2.5 font-display text-[30px] font-bold leading-[1.02] text-ink sm:text-[clamp(30px,4.2vw,52px)]">
              {COPY.home.topCasinosTitle}
            </h2>
            <p className="mt-3 max-w-[540px] text-ink-soft">{COPY.home.topCasinosSubtitle}</p>

            {categories.length > 0 && selected && (
              <div className="mt-6">
                <CategoryNav categories={categories} selected={selected} />
              </div>
            )}

            {casinos.length === 0 ? (
              <p className="mt-6 rounded-[18px] border border-dashed border-line bg-paper p-10 text-center text-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={`mt-[22px] ${CASINO_LIST}`}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-6 flex justify-center">
                <Link href={`/categories/${selected}`} className="btn-ln min-h-12 px-[22px] text-[15px]">
                  See more casinos<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Bonus types as one stacked bar. Renders nothing without a Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pb-14 sm:pb-[72px]">
            <div className="mx-auto max-w-[1200px] px-4">
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* How the pulse works — Read → Rank → Re-check, drawn as a cycle that
            closes back on the first stage. */}
        <section className="border-y border-line bg-surface py-14 sm:py-[72px]" aria-labelledby="method-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-brand-dark">{COPY.home.methodLabel}</p>
            <h2 id="method-heading" className="mt-2.5 font-display text-[30px] font-bold leading-[1.02] text-ink sm:text-[clamp(30px,4.2vw,52px)]">
              {COPY.home.methodTitle}
            </h2>
            <p className="mt-3 max-w-[540px] text-ink-soft">{COPY.home.methodSubtitle}</p>
            <ol className="mt-[34px] grid grid-cols-1 gap-7 min-[61.25rem]:grid-cols-3 min-[61.25rem]:gap-10">
              {COPY.home.methodSteps.map((step) => (
                <li key={step.no} className="cy relative rounded-[20px] border-[1.5px] border-line bg-paper p-6">
                  <p className="inline-flex items-center gap-2.5 font-mono text-[13px] font-bold uppercase text-brand-dark">
                    <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-[15px] text-white">{step.no}</span>
                    {step.verb}
                  </p>
                  <h3 className="mt-3.5 font-display text-[22px] font-bold text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-[15px] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-center gap-3 text-sm font-semibold text-ink-soft">
              <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
              </svg>
              <span>{COPY.home.methodLoop}</span>
              <span aria-hidden className="loop-line h-0.5 flex-1" />
            </p>
          </div>
        </section>

        {/* Bonuses — one card per type, built from the same getBonusArea
            payload as the mix bar and the menus. A site without the Bonus
            area keeps the flat grid below. */}
        {bonusSections.length > 0 ? (
          <section className="py-14 sm:py-[72px]" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="bonus-heading" className="font-display text-[30px] font-bold leading-[1.02] text-ink sm:text-[clamp(30px,4.2vw,52px)]">
                  {COPY.home.bonus}
                </h2>
                <Link href="/special-offers" className="-my-3 inline-flex min-h-11 items-center py-3 font-bold text-brand-dark transition-colors hover:text-ink">
                  {COPY.home.viewAll}<span className="sr-only"> bonuses</span> <span aria-hidden className="ml-1">→</span>
                </Link>
              </div>
              <BonusGroups sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="py-14 sm:py-[72px]" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="offers-heading" className="font-display text-[30px] font-bold leading-[1.02] text-ink sm:text-[clamp(30px,4.2vw,52px)]">
                  {COPY.home.specialOffers}
                </h2>
                <Link href="/special-offers" className="-my-3 inline-flex min-h-11 items-center py-3 font-bold text-brand-dark transition-colors hover:text-ink">
                  {COPY.home.viewAll}<span className="sr-only"> special offers</span> <span aria-hidden className="ml-1">→</span>
                </Link>
              </div>
              <div className={`mt-6 ${OFFER_GRID}`}>
                {topOffers.map((offer) => (
                  <SpecialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ — numbered accordion. Every answer is in the HTML, which the
            FAQPage schema above requires. */}
        <section className={bonusSections.length > 0 || topOffers.length > 0 ? '' : 'pt-14 sm:pt-[72px]'} aria-labelledby="faq-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-brand-dark">{COPY.home.faqLabel}</p>
            <h2 id="faq-heading" className="mt-2.5 font-display text-[30px] font-bold leading-[1.02] text-ink sm:text-[clamp(30px,4.2vw,52px)]">
              {COPY.home.faqTitle}
            </h2>
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
    </>
  )
}
