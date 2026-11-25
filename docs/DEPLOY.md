# Deploying, step by step (and what each step means)

## The moving parts

| Piece | Job |
|---|---|
| **GitHub repo** | Source of truth. Every change is a commit; every change to `main` goes through a pull request. |
| **GitHub Actions** (`.github/workflows/ci.yml`) | Quality gate. On each PR and push to `main`: install, lint, type check, test, build. |
| **Vercel** | Hosting. Watches the repo. Builds a *preview* deployment per PR and the *production* deployment on each merge to `main`. |

CI (GitHub Actions) and CD (Vercel) are separate on purpose: Actions decides whether a
change is *good*; Vercel decides where it *runs*.

## First deploy (about 5 minutes)

1. **Import the repo in Vercel.** vercel.com → Add New → Project → pick `career-platform` → Import.
   Vercel detects Next.js; leave build settings as default. Click Deploy.
2. **Check the URL** Vercel gives you (`career-platform-xxx.vercel.app`). Open `/match` and run the sample ad.
3. **Protect `main`** (GitHub → Settings → Branches → Add rule for `main`):
   require a pull request, and require the `CI / check` status to pass.
   Now nothing reaches production without green checks.

## Everyday flow

```bash
git checkout -b update-profile
# edit src/data/profile.json
git commit -am "Add real experience"
git push -u origin update-profile
# open a PR → CI runs → Vercel comments with a preview URL → merge → production updates
```

**Rollback:** Vercel → Deployments → pick the previous production build → Promote to Production.
Builds are immutable, so this is instant and doesn't need a new build.

## Secrets (for Phase 4, the LLM step)

Vercel → Project → Settings → Environment Variables → add `ANTHROPIC_API_KEY` for
Production and Preview. Read it only in server code (`process.env.ANTHROPIC_API_KEY` inside
`src/app/api/...`). Never prefix it with `NEXT_PUBLIC_`, which would ship it to browsers.

## Interview talking points

- **Why this architecture?** One source of truth (the knowledge base), two consumers
  (public site, private agent), a stable API contract between them. Static where possible,
  serverless where logic or secrets are needed.
- **How do you know it works?** Unit tests on the match engine run on every PR; a red
  check blocks the merge; every PR has a clickable preview before production.
- **How would you take this to a client?** Same shape on their cloud: containerised API,
  managed Postgres + pgvector for retrieval, secrets in Key Vault / Secrets Manager, SSO in
  front, and an evaluation set in CI so a model change ships only if it beats the baseline.
- **Why not auto-apply?** Human approval protects quality and site terms, and every
  approve/reject is a label for training the Phase 6 classifier.
