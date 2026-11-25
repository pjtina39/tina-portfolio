import type { Metadata } from "next";

export const metadata: Metadata = { title: "System design · Tina" };

function Box({ title, sub, tone = "zinc" }: { title: string; sub?: string; tone?: "zinc" | "indigo" | "emerald" | "amber" }) {
  const tones = {
    zinc: "border-stone-300 bg-white",
    indigo: "border-stone-300 bg-[#f3ede4]",
    emerald: "border-[#b4532a]/40 bg-[#fbf1ea]",
    amber: "border-amber-300 bg-amber-50",
  };
  return (
    <div className={`rounded-lg border px-4 py-3 text-center ${tones[tone]}`}>
      <div className="text-sm font-medium text-stone-900">{title}</div>
      {sub && <div className="mt-0.5 text-xs text-stone-500">{sub}</div>}
    </div>
  );
}

const Arrow = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center px-1 text-stone-500">
    <span className="text-lg leading-none">→</span>
    {label && <span className="text-[10px]">{label}</span>}
  </div>
);

const decisions = [
  {
    q: "Why one JSON knowledge base instead of a database?",
    a: "The profile is small, changes rarely and is reviewed like code. A typed JSON file in Git gives version history, pull-request review and zero runtime cost. It is bundled at build time, so pages are static and the API needs no database round trip. Move to Postgres with pgvector once the agent writes data at runtime (saved jobs, labels, applications).",
  },
  {
    q: "Why deterministic matching before an LLM?",
    a: "A rules-and-retrieval baseline is fast, free, testable in CI and fully explainable: every score traces to a sentence. It is also the baseline an LLM version must beat on my labelled data. The LLM step (Phase 4) will rewrite requirement extraction and generate tailored CV text, behind the same API contract.",
  },
  {
    q: "Why a serverless API route instead of running it all in the browser?",
    a: "The match logic could run client-side today, but the API route is the seam for what comes next: LLM calls with a secret key, private profile data that must never ship to the browser, rate limiting and logging. Clients depend on the contract POST /api/match, not on where the code runs.",
  },
  {
    q: "How is private data kept out?",
    a: "Only public, curated content lives in the repo. Private CV variants and application history go in a git-ignored folder locally and, later, in a private store reached only from server code using environment variables set in Vercel. Secrets never use the NEXT_PUBLIC_ prefix, which would expose them to the browser.",
  },
  {
    q: "Why keep a human in the loop for applying?",
    a: "Automatic submission risks bad applications and breaks some job sites' terms. The agent drafts and ranks; I approve. Every approve or reject is a label, which is the training data for the Phase 6 classifier.",
  },
];

const pipeline = [
  { title: "Feature branch", sub: "git push" },
  { title: "Pull request", sub: "GitHub" },
  { title: "CI checks", sub: "lint · types · tests · build" },
  { title: "Preview deploy", sub: "Vercel, unique URL per PR" },
  { title: "Merge to main", sub: "after review" },
  { title: "Production", sub: "Vercel, instant rollback" },
];

const roadmap = [
  ["1", "Portfolio deployed on Vercel", "done"],
  ["2", "Structured career knowledge base", "done (v1, JSON)"],
  ["3", "Job matching and scoring", "done (baseline)"],
  ["4", "LLM requirement extraction, tailored CV and cover letter", "next"],
  ["5", "Agentic job discovery from job APIs and career pages, human approval", "planned"],
  ["6", "Evaluation set from my labels; train a custom match classifier", "planned"],
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-14">
      <section>
        <h1 className="font-serif text-5xl tracking-tight text-stone-900">System design</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          One knowledge base, two consumers: this public portfolio and a private career agent. This page
          shows how the pieces fit, how code reaches production, and the trade-offs behind each choice.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-stone-900">1. Architecture</h2>
        <div className="mt-6 grid items-stretch gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <div className="space-y-2">
            <Box title="Career knowledge base" sub="profile.json: roles, projects, skills, evidence" tone="indigo" />
            <Box title="Skill taxonomy" sub="canonical skills + synonyms" tone="indigo" />
          </div>
          <Arrow label="build time" />
          <div className="space-y-2">
            <Box title="Portfolio pages" sub="static, served from Vercel's CDN" tone="emerald" />
            <Box title="POST /api/match" sub="serverless function" tone="emerald" />
          </div>
          <Arrow label="HTTPS" />
          <div className="space-y-2">
            <Box title="Visitor / interviewer" sub="browser" />
            <Box title="Private career agent" sub="Phase 5, same API" tone="amber" />
          </div>
        </div>

        <h3 className="mt-10 font-serif text-xl text-stone-900">Match request flow</h3>
        <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          <Box title="1. Extract requirements" sub="split ad, detect skills, must vs nice" />
          <Arrow />
          <Box title="2. Retrieve evidence" sub="highlights tagged with the skill, ranked by overlap" />
          <Arrow />
          <Box title="3. Grade each skill" sub="evidenced 1 · claimed 0.5 · missing 0" />
          <Arrow />
          <Box title="4. Weighted score" sub="must ×2, nice ×1, 0–100 + gaps" />
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-stone-900">2. CI/CD: how a change reaches production</h2>
        <div className="mt-6 grid gap-2 md:grid-cols-6">
          {pipeline.map((p, i) => (
            <Box key={p.title} title={p.title} sub={p.sub} tone={i === 2 ? "indigo" : i === 5 ? "emerald" : "zinc"} />
          ))}
        </div>
        <ul className="mt-6 max-w-3xl list-disc space-y-1 pl-5 text-sm text-stone-700">
          <li><b>GitHub Actions</b> runs lint, type check, unit tests and a production build on every pull request. A red check blocks the merge.</li>
          <li><b>Vercel&apos;s GitHub integration</b> builds a preview deployment for every pull request, so a change can be clicked before it ships.</li>
          <li>Merging to <code>main</code> triggers the production deploy. Each deploy is immutable, so rollback is one click to the previous build.</li>
          <li>Secrets (for the Phase 4 LLM key) live in Vercel environment variables, scoped to Preview and Production, never in the repo.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-stone-900">3. Design decisions and trade-offs</h2>
        <div className="mt-6 space-y-4">
          {decisions.map((d) => (
            <details key={d.q} className="rounded-lg border border-stone-200 bg-white p-4" open>
              <summary className="cursor-pointer font-medium text-stone-900">{d.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">{d.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-stone-900">4. Scaling path</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-stone-500">
              <tr><th className="py-2 pr-4 font-medium">When</th><th className="py-2 pr-4 font-medium">Change</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              <tr><td className="py-2 pr-4">Agent stores jobs and labels</td><td className="py-2">Postgres (e.g. Neon or Supabase) with pgvector for embeddings</td></tr>
              <tr><td className="py-2 pr-4">LLM calls add latency and cost</td><td className="py-2">Cache results by job-ad hash; stream responses; rate-limit the public endpoint</td></tr>
              <tr><td className="py-2 pr-4">Job discovery runs on a schedule</td><td className="py-2">Vercel Cron or a queue worker (Python) that pulls from job APIs and writes to the database</td></tr>
              <tr><td className="py-2 pr-4">Matching model improves</td><td className="py-2">Offline evaluation on labelled jobs in CI; ship a new scorer only if it beats the baseline</td></tr>
              <tr><td className="py-2 pr-4">Enterprise client version</td><td className="py-2">Same design on Azure or AWS: container app, managed Postgres, Key Vault or Secrets Manager, SSO</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-stone-900">5. Roadmap</h2>
        <ol className="mt-4 space-y-2 text-sm">
          {roadmap.map(([n, t, s]) => (
            <li key={n} className="flex gap-3">
              <span className="w-16 shrink-0 text-stone-500">Phase {n}</span>
              <span className="flex-1">{t}</span>
              <span className={s.startsWith("done") ? "text-[#b4532a]" : "text-stone-500"}>{s}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
