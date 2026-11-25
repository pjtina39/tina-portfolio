// POST /api/match  { "jobAd": "..." }  ->  MatchResult
// Runs as a Vercel serverless function. The knowledge base is bundled at
// build time, so there is no database call and no secret to manage yet.
// Phase 4 adds an LLM step here, with the API key held in a Vercel
// environment variable so it never reaches the browser or the repo.

import profile from "@/data/profile.json";
import { matchJob } from "@/lib/matcher";
import type { Profile } from "@/lib/types";

const MAX_CHARS = 20_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const jobAd = (body as { jobAd?: unknown })?.jobAd;
  if (typeof jobAd !== "string" || !jobAd.trim()) {
    return Response.json({ error: "Field 'jobAd' must be a non-empty string." }, { status: 400 });
  }
  if (jobAd.length > MAX_CHARS) {
    return Response.json({ error: `Job ad is longer than ${MAX_CHARS} characters.` }, { status: 413 });
  }

  const started = performance.now();
  const result = matchJob(jobAd, profile as Profile);
  const ms = Math.round(performance.now() - started);

  return Response.json(result, { headers: { "Server-Timing": `match;dur=${ms}` } });
}
