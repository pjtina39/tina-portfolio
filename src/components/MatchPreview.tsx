import Link from "next/link";
import profile from "@/data/profile.json";
import { matchJob } from "@/lib/matcher";
import { SAMPLE_JOB } from "@/lib/sample-job";
import type { Profile } from "@/lib/types";

/**
 * Runs the real match engine on the sample ad. It is a server component, so the
 * score is computed once at build time; the count-up and ring animations are
 * pure CSS (see .score-count and .score-ring in globals.css), with no effects.
 */
export function MatchPreview() {
  const result = matchJob(SAMPLE_JOB, profile as Profile);

  const top = result.matches.filter((m) => m.priority === "must").slice(0, 8);
  const circ = 2 * Math.PI * 52;

  return (
    <div className="grid gap-10 rounded-3xl border border-[#e6e1d6] bg-white p-8 md:grid-cols-[220px_1fr] md:p-10">
      <div className="flex flex-col items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-44 w-44 -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#efebe2" strokeWidth="6" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="#8a5a24" strokeWidth="6" strokeLinecap="round" strokeDasharray={circ}
            className="score-ring"
            style={{ "--ring-from": circ, "--ring-to": circ * (1 - result.score / 100) } as React.CSSProperties}
          />
        </svg>
        <div className="-mt-[118px] mb-[62px] text-center">
          <div className="score-count font-serif text-5xl text-[#1b2a4a] tabular-nums" style={{ "--score": result.score } as React.CSSProperties} aria-label={`Fit score ${result.score}`} />
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">fit score</div>
        </div>
              </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a24]">Live result from the real engine</p>
        <h3 className="mt-2 font-serif text-3xl text-[#1b2a4a]">Scored against a sample FDE job ad.</h3>
        <ul className="mt-6 flex flex-wrap gap-2">
          {top.map((m) => (
            <li key={m.skill} className={`rounded-full px-3 py-1.5 text-sm ${m.strength === "evidenced" ? "bg-[#1b2a4a] text-[#f8f6f1]" : "bg-[#efebe2] text-slate-500"}`}>
              {m.strength === "evidenced" ? "✓ " : ""}
              {m.label}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-500">Each tick is backed by a real piece of evidence. Paste any job ad to see it.</p>
        <Link href="/match" className="mt-8 inline-block rounded-full bg-[#1b2a4a] px-6 py-3 text-sm font-medium text-[#f8f6f1] hover:bg-[#2a3d66]">
          Score your own job ad →
        </Link>
      </div>
    </div>
  );
}
