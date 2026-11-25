// Job-match engine. Pure functions, no network calls, so it is cheap,
// deterministic, testable and runs the same in the browser, in the API
// route and in CI.
//
// Pipeline:  job ad ──► 1. extract requirements ──► 2. retrieve evidence
//            ──► 3. score each requirement ──► 4. weighted fit score

import { detectSkills, SKILL_LABEL } from "./taxonomy";
import type {
  Evidence,
  MatchResult,
  Priority,
  Profile,
  Requirement,
  RequirementMatch,
} from "./types";

const NICE_HEADINGS =
  /(nice to have|nice-to-have|preferred|desirable|bonus|plus|good to have|would be great|advantage)/i;
const MUST_HEADINGS =
  /(requirements|required|must have|must-have|essential|qualifications|what you('|’)ll need|you have|about you|what we('|’)re looking for|responsibilities|what you('|’)ll do)/i;

/** Step 1: split the ad into lines and tag each skill as must-have or nice-to-have. */
export function extractRequirements(ad: string): Requirement[] {
  const lines = ad
    .split(/\r?\n|(?<=[.;])\s+(?=[A-Z])/)
    .map((l) => l.trim())
    .filter(Boolean);

  const found = new Map<string, Requirement>();
  let section: Priority = "must";

  for (const line of lines) {
    const isHeading = line.length < 60 && !/[.]$/.test(line);
    if (isHeading && NICE_HEADINGS.test(line)) {
      section = "nice";
      continue;
    }
    if (isHeading && MUST_HEADINGS.test(line)) {
      section = "must";
      continue;
    }

    // An inline cue ("ideally", "a plus") downgrades just this line.
    const priority: Priority =
      section === "nice" || NICE_HEADINGS.test(line) || /\bideally\b/i.test(line)
        ? "nice"
        : "must";

    for (const skill of detectSkills(line)) {
      const prev = found.get(skill);
      // Keep the strongest priority seen for each skill.
      if (!prev || (prev.priority === "nice" && priority === "must")) {
        found.set(skill, { skill, label: SKILL_LABEL[skill] ?? skill, priority, source: line });
      }
    }
  }
  return [...found.values()];
}

export function extractYears(ad: string): number | undefined {
  const m = ad.match(/(\d{1,2})\s*\+?\s*(?:years|yrs)/i);
  return m ? Number(m[1]) : undefined;
}

const STOP = new Set(
  "a an and are as at be by for from has have in is it of on or our the to we with you your will this that who into across".split(" "),
);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+#/ ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

interface Doc {
  where: string;
  text: string;
  skills: string[];
  toks: string[];
}

/** Flatten the profile into searchable evidence documents (one per highlight). */
export function buildIndex(profile: Profile): Doc[] {
  const docs: Doc[] = [];
  for (const r of profile.roles)
    for (const h of r.highlights)
      docs.push({ where: `${r.title}, ${r.org}`, text: h.text, skills: h.skills, toks: tokens(h.text) });
  for (const p of profile.projects)
    for (const h of p.highlights)
      docs.push({ where: `Project: ${p.name}`, text: h.text, skills: h.skills, toks: tokens(h.text) });
  return docs;
}

/** Step 2: rank evidence for one requirement. Skill tag match dominates; word overlap breaks ties. */
function retrieve(req: Requirement, docs: Doc[], k = 2): Evidence[] {
  const q = new Set(tokens(req.source));
  return docs
    .filter((d) => d.skills.includes(req.skill))
    .map((d) => {
      const overlap = d.toks.filter((t) => q.has(t)).length;
      return { where: d.where, text: d.text, score: 1 + overlap / Math.max(q.size, 1) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

const WEIGHT: Record<Priority, number> = { must: 2, nice: 1 };
const STRENGTH = { evidenced: 1, claimed: 0.5, missing: 0 } as const;

/** Steps 3 and 4: score every requirement and combine into a 0–100 fit score. */
export function matchJob(ad: string, profile: Profile): MatchResult {
  const reqs = extractRequirements(ad);
  const docs = buildIndex(profile);
  const claimed = new Set(profile.skills.map((s) => s.id));

  const matches: RequirementMatch[] = reqs.map((r) => {
    const evidence = retrieve(r, docs);
    const strength = evidence.length ? "evidenced" : claimed.has(r.skill) ? "claimed" : "missing";
    return { ...r, strength, evidence };
  });

  const total = matches.reduce((s, m) => s + WEIGHT[m.priority], 0);
  const got = matches.reduce((s, m) => s + WEIGHT[m.priority] * STRENGTH[m.strength], 0);
  const score = total ? Math.round((got / total) * 100) : 0;
  const verdict = score >= 75 ? "strong" : score >= 50 ? "partial" : "weak";

  const order = { missing: 0, claimed: 1, evidenced: 2 };
  matches.sort(
    (a, b) => WEIGHT[b.priority] - WEIGHT[a.priority] || order[a.strength] - order[b.strength],
  );

  const gaps = matches
    .filter((m) => m.strength !== "evidenced")
    .map((m) => `${m.label}${m.priority === "must" ? " (must-have)" : ""}${m.strength === "claimed" ? ": listed as a skill but no project evidence yet" : ": not covered"}`);

  const must = matches.filter((m) => m.priority === "must");
  const mustHit = must.filter((m) => m.strength === "evidenced").length;
  const summary = reqs.length
    ? `${mustHit} of ${must.length} must-have skills backed by evidence; ${gaps.length} gap${gaps.length === 1 ? "" : "s"} to address.`
    : "No recognisable skills found in this text. Paste the requirements section of a job ad.";

  return { score, verdict, matches, gaps, yearsRequired: extractYears(ad), summary };
}
