# Next Features

## Public Page Controls

Let each creator decide which parts of a salary progression appear on the
public link and in exported share images.

### Sections to show or hide

- Timeline
- Compensation progression chart
- Milestone chart
- Key statistics
- Compensation breakdown (base, bonus, and equity)
- Career learnings

### Privacy controls

- Show or anonymize company names
- Show exact compensation, rounded values, or percentage changes only
- Show exact dates or years only

### Suggested presets

- **Full story** — all enabled sections
- **Charts only** — compensation and milestone charts with key statistics
- **Timeline only** — career events without compensation charts
- **Anonymous summary** — anonymized employers, rounded compensation, and
  selected insights

Store these options in a flexible per-timeline presentation settings object so
future sections, such as offer comparisons or projections, can be added without
a schema redesign. The public page and generated export should always respect
the same settings.

## Career Learnings

Add an optional section at the end of a timeline where creators can share the
choices, skills, and lessons that shaped their career progression. This gives
viewers useful context beyond compensation figures.

### Suggested fields

- A short headline, such as “Specializing in distributed systems accelerated my
  growth.”
- A longer description of the learning or decision
- Optional career stage or date range it relates to
- Optional tags, such as `negotiation`, `promotion`, `switching jobs`,
  `technical skills`, `leadership`, or `relocation`

### Presentation

- Show learnings as a clearly separate, optional public-page section after the
  charts and timeline.
- Allow creators to choose which individual learnings are public.
- Include an option to omit learnings from image exports while keeping them on
  the public link.
- Keep employer names and personally identifying details optional so the
  section remains safe to share anonymously.

### Future extensions

- A guided prompt library to help creators write useful, specific learnings
- Voting or bookmarking once a community feature is intentionally introduced
- Filtering public learnings by role, experience level, country, or tag

## View Count

Show creators how many times their public link has been viewed, as light
social proof and feedback that sharing is working.

### Mechanics

- Increment a counter on the timeline row each time the public page (`/t/[slug]`)
  is loaded.
- Debounce or dedupe repeat views from the same visitor (for example, a
  short-lived cookie or session marker) so a creator refreshing their own link
  doesn't inflate the count.
- Exclude the creator's own edit-mode visits from the count.

### Presentation

- Display the count only to the creator (for example, in the editor's Share
  panel), not as a public figure on the shared page itself.
- Keep it a simple number rather than a full analytics breakdown, consistent
  with the tool's lightweight, anonymous nature.

### Future extensions

- Basic breakdown by day/week if creators want more than a raw total
- Fold into the per-timeline presentation settings if creators want to opt out
  of view tracking entirely
