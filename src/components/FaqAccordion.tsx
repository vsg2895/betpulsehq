type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ, from sites/betpulsehq-redesign.html (`.faq`): numbered
 * questions under a heavy rule, each opening on a plus that turns into a
 * minus on a terracotta disc (globals.css). The first is open.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="faq mt-[26px] border-t-[1.5px] border-ink">
      {items.map((item, i) => (
        <details key={item.question} open={i === 0} className="border-b border-line">
          <summary className="grid min-h-16 cursor-pointer grid-cols-[40px_minmax(0,1fr)_36px] items-center gap-3 py-5 sm:grid-cols-[56px_minmax(0,1fr)_36px]">
            <span aria-hidden className="font-mono text-sm font-bold text-brand-dark">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="font-display text-[17px] font-semibold leading-[1.3] text-ink sm:text-xl">{item.question}</h3>
            <span aria-hidden className="faq-pm relative h-9 w-9 rounded-full border-[1.5px] border-line-soft" />
          </summary>
          <p className="mb-[22px] max-w-[760px] text-base leading-[1.75] text-ink-soft sm:ml-[68px]">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
