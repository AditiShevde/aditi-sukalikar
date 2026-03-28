# API automation (Playwright)

This folder holds API tests against the Swagger Petstore (`petstore3.swagger.io`). They run through Playwright’s test runner, using its built-in HTTP client instead of wiring up something separate. Layout is simple: constants and types in one place, small helpers for calls, and specs that mostly read like scenarios.

What gets exercised: creating and fetching pets, updates by body and query params, delete, find by status, image upload, and a 404 when the id doesn’t exist. After each test we try to delete anything we created so the next test isn’t fighting leftover data. The Petstore is a shared public API, so one test skips if a follow-up GET looks flaky; the rest still assert what we care about when the service behaves.

## Why Playwright (and the rest)

Playwright gives you tests, assertions, parallel runs, retries on CI, and HTML reports in one package. The `request` fixture is enough for REST calls without pulling in axios or similar, and if you ever add UI tests they share the same config.

TypeScript is there so payloads and responses have a shape worth refactoring against. Faker keeps names and fields from going stale. Allure report is easy to read and understand.

## Where things live

`constants/` has paths and shared values. `types/` has request/response shapes. `helpers/` has: generic HTTP helpers, a payload builder, and pet-specific functions. `pet.spec.ts` is where the stories live—ideally no stray URLs in the spec file.

```
api-automation/
  tests/api/
    constants/
    helpers/
    types/
    pet.spec.ts
  .github/workflows/playwright.yml
  playwright.config.ts
  package.json
```

Base URL lives in `playwright.config.ts` under `use.baseURL` (Petstore v3). There’s a commented dotenv block there if you want env-based URLs later.

## Setup

You’ll need Node (LTS is a safe bet; CI uses the current LTS) and npm.

```bash
cd api-automation
npm install
```

If Playwright complains about browsers, install them so local runs match CI:

```bash
npx playwright install --with-deps
```

## Running tests

All commands assume you’re in `api-automation`.

Most of the time:

```bash
npm run test:api
```

Everything under `tests/`:

```bash
npm test
```

Open the last HTML report after a run:

```bash
npm run test:report
```

Pick a file or a test by title:

```bash
npx playwright test tests/api/pet.spec.ts
npx playwright test -g "delete pet"
```

If you use Allure, run tests first, then:

```bash
npm run allure:generate
npm run allure:open
# or: npm run allure:serve
```

## CI

Locally tests run in parallel; CI pins workers and turns on retries to ride out occasional noise on shared runners.

Useful Playwright links: [API testing](https://playwright.dev/docs/api-testing), [configuration](https://playwright.dev/docs/test-configuration).