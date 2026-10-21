/**
 * Frequently asked questions for this site.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data from
 * this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. Here they
 * explain the cycle, because that is what this brand is — a reading with a date
 * on it rather than a verdict filed once.
 *
 * Nothing below claims a figure this site cannot show. "Each casino carries the
 * date of its last reading" is a statement about method; a specific payout time
 * would be a measurement no reader could check and no column here holds.
 */
export const FAQ_ITEMS = [
  {
    question: 'What does "live pulse" actually mean?',
    answer:
      'That a ranking here has a date attached and gets revisited, rather than being written once and left. When an operator rewrites its wagering terms, shortens an offer or drops a payment method, the reading changes and its place on the list changes with it.',
  },
  {
    question: 'What is checked on each pass?',
    answer:
      'The bonus terms first: the wagering multiplier and what it applies to, the minimum deposit, the withdrawal cap, the maximum bet while wagering and the expiry. Then whether the offer is still live at all, and whether the operator still accepts players from the regions listed against it.',
  },
  {
    question: 'Where do the bonus figures on this site come from?',
    answer:
      "From the operator's own terms page, not from the promotional banner. The two disagree more often than you would expect, and when they do, the terms page is what a player is actually held to.",
  },
  {
    question: 'Does a casino pay to rank higher?',
    answer:
      'No. We earn a commission when somebody signs up through a link here, and that arrangement has no bearing on the order of the list. An operator whose terms no longer read well drops regardless of what it pays.',
  },
  {
    question: 'Why do some casinos have no bonus listed?',
    answer:
      'Because nothing is running that we would put a reader in front of. A lapsed offer comes off the board rather than sitting there with an expired date on it, and the casino keeps its page without one.',
  },
  {
    question: 'What is on the list and what is not?',
    answer:
      'Only operators we have actually read. The list is deliberately short for that reason — a directory of every casino in existence tells you nothing, and padding it out with unread entries would be the fastest way to make the rest of it worthless.',
  },
] as const
