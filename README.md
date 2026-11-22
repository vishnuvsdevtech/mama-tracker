# Nine months, organised

**Live:** https://vishnuvsdevtech.github.io/mama-tracker/

A private pregnancy tracker. Dates worked out, appointments in order, documents to
collect, a bag list that waits, and a place to write down questions.

**Nothing leaves the browser.** No account, no server, no analytics, no request
after the page loads. Everything lives in `localStorage` on one device, and the
trash button clears it.

## What it deliberately does not do

No diagnosis, no medicine information, no symptom checker, no advice on whether
something is normal. Every number on the page is arithmetic on a date the user
typed. This was a deliberate scope decision: a consumer health site that implies
medical guidance carries liability that a solo developer should not accept, and
the useful part — organisation — needs none of it.

The page states this in a visible card rather than a footer.

## The three anchors

The user enters **any one** of first-day-of-last-period, due date, or current
week; the other two are computed and written back, so they can never disagree.

```
due  = lmp + 280 days        (Naegele's rule)
lmp  = due − 280 days
lmp  = today − (week × 7)
```

Naegele is a convention, not a measurement — the README and the page both say a due
date is a date, not a deadline.

## Design decisions worth keeping

- **The bag list locks until five weeks out.** A packing list shown at week 9 is
  noise that makes the whole page feel like a checklist generator. Delaying it
  makes it feel attentive.
- **"Next up" is chosen by date, not by week number.** The first version picked the
  first checkpoint with `week >= current`, which labelled a test happening *today*
  as "in 3 days". Comparing computed dates gives the right tense.
- **Ticked documents are struck through, not just ticked.** In a list of fourteen
  the helpful signal is what is missing.
- **Warm rather than clinical.** Muted rose, sage and clay; serif headings; soft
  card shadows. A medical blue-grey palette would have made it read as a form.
- **Night mode is a real palette, not an inversion.** Late pregnancy involves a lot
  of 3 a.m. phone use.

## If this ever became something real

1. **A doctor reviews every medical-adjacent word** before it is public. That is the
   cost that makes this a product rather than a page.
2. **Documents are referenced, not stored.** Uploading scans means holding health
   data, which means consent, retention rules and a breach plan.
3. **Keep it private-by-default.** The strongest feature is that nothing is sent
   anywhere; a login would weaken it.
