# Testing

## Unit tests

Run the unit suite with:

```bash
npm test
```

Unit tests live in dedicated folders beside their domain: `src/lib/test` for
library helpers and component modules follow the
`src/components/ComponentName/test/ComponentName.test.tsx` convention.

The suite covers:

- Total compensation, chronology sorting, growth, CAGR, and display formatting
- Timeline-payload validation and input sanitization
- Browser storage of anonymous edit tokens
- Compensation-breakdown and career-learnings presentation

## End-to-end tests

Install the Playwright browser once on a new machine:

```bash
npx playwright install chromium
```

Then run:

```bash
npm run test:e2e
```

The E2E suite lives in `tests/e2e` because each scenario spans several pages
and components. It starts the app and checks that visitors can open the timeline
builder from the homepage, add career events, and see the resulting progression
statistics. It intentionally avoids saving a timeline, so it does not require a
Postgres database.
