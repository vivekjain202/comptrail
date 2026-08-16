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

## Career Learnings — shipped (simplified)

Creators can now add a single free-form markdown section — "Career
Learnings" — under the Manage column, sharing the choices, skills, or
decisions that shaped their career. It renders as its own section on the
public page and in exports, right after the timeline, with the same
export/copy-link controls as the chart and timeline sections.

The editor is a GitHub-style Write/Preview tabbed markdown box, with a
fullscreen mode that splits into side-by-side write + live preview panes.

This shipped as one markdown blob rather than the structured multi-entry idea
below — simpler to build, and covers the "share context beyond the numbers"
goal. The richer version remains a future extension if a single block turns
out to be too limiting:

- Multiple individual learnings, each with its own headline, optional
  career stage/date range, and tags (`negotiation`, `promotion`,
  `switching jobs`, `technical skills`, `leadership`, `relocation`)
- Per-entry public/private visibility
- A guided prompt library to help creators write useful, specific learnings
- Filtering public learnings by role, experience level, country, or tag

## View Count — shipped

The public page shows how many times it's been viewed, next to the "shared
salary progression timeline" description — since a raw count isn't sensitive
and creators felt it was more useful as light social proof for visitors than
as a private-only editor stat. It's also still shown in the editor's Share
panel for convenience. Repeat views from the same visitor within a 12-hour
window are deduped via a cookie, and the creator's own visits (detected via
their locally-stored edit token) aren't counted.

Possible future extensions:

- Basic breakdown by day/week if creators want more than a raw total
- Fold into the per-timeline presentation settings if creators want to opt out
  of view tracking entirely
