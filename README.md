# Career Intelligence Platform

A personal portfolio and an explainable AI job-match engine, both powered by one
structured career knowledge base.

- **Portfolio** (`/`): experience, projects and skills, rendered from `src/data/profile.json`.
- **Job match demo** (`/match`): paste a job ad, get a 0–100 fit score with evidence for every requirement.
- **System design** (`/architecture`): architecture, CI/CD flow, design decisions and roadmap.

## Architecture in one paragraph

`profile.json` (roles, projects, skills, and *highlights* tagged with the skills they prove)
is bundled at build time. Portfolio pages are prerendered and served from Vercel's CDN.
`POST /api/match` is a serverless function that runs `src/lib/matcher.ts`:
extract requirements from the ad (must vs nice-to-have) → retrieve tagged evidence →
grade each skill (evidenced / claimed / missing) → weighted score. The matcher is pure
TypeScript with no network calls, so it is deterministic and unit-tested in CI.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # unit tests for the match engine
npm run lint && npm run typecheck && npm run build   # same checks as CI
```

## Edit your profile

Everything personal is in `src/data/profile.json`. Each highlight lists the skill ids it
proves (ids are in `src/lib/taxonomy.ts`). Remove `"placeholder": true` once the content
is real, and the draft banner disappears.

**Only public content goes in this file.** Private CVs, salary notes and application
history belong in `/private/` (git-ignored) or, later, a private database.

## API

```bash
curl -X POST https://<your-site>/api/match \
  -H 'Content-Type: application/json' \
  -d '{"jobAd": "Requirements\nPython, LLMs, CI/CD"}'
```

Returns `{ score, verdict, summary, matches[{skill, priority, strength, evidence[]}], gaps[] }`.

## Deploy

See [docs/DEPLOY.md](docs/DEPLOY.md).
