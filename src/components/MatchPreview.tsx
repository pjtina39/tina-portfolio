"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import profile from "@/data/profile.json";
import { matchJob } from "@/lib/matcher";
import { SAMPLE_JOB } from "@/lib/sample-job";
import type { Profile } from "@/lib/types";

/** Runs the real match engine on the sample ad, in the browser, and animates the result. */
export function MatchPreview() {
  const result = useMemo(() => matchJob(SAMPLE_JOB, profile as Profile), []);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      setShown(Math.round(result.score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [result.score]);

  const top = result.matches.filter((m) => m.priority === "must").slice(0, 6);
  const circ = 2 * Math.PI * 52;

  return (
    <div className="grid gap-10 rounded-3xl border border-[#e6e1d6] bg-white p-8 md:grid-cols-[220px_1fr] md:p-10">
      <div className="flex flex-col items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-44 w-44 -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#efebe2" strokeWidth="6" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="#8a5a24" strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - shown / 100)} />
        </svg>
        <div className="-mt-[118px] mb-[62px] text-center">
          <div className="font-serif text-5xl text-[#1b2a4a] tabular-nums">{shown}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">fit score</div>
        </div>
        <p className="text-center text-sm text-slate-500">Sample: Forward Deployed AI Engineer</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a24]">Live, running in your browser</p>
        <h3 className="mt-2 font-serif text-3xl text-[#1b2a4a]">Every point of the score has evidence.</h3>
        <ul className="mt-6 space-y-3">
          {top.map((m) => (
            <li key={m.skill} className="flex gap-3 text-sm">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${m.strength === "evidenced" ? "bg-[#1b2a4a] text-white" : "bg-[#efebe2] text-slate-500"}`}>
                {m.strength === "evidenced" ? "✓" : "–"}
              </span>
              <span>
                <span className="font-medium text-[#1b2a4a]">{m.label}</span>
                {m.evidence[0] && <span className="text-slate-500"> — {m.evidence[0].text.slice(0, 90)}…</span>}
              </span>
            </li>
          ))}
        </ul>
        <Link href="/match" className="mt-8 inline-block rounded-full bg-[#1b2a4a] px-6 py-3 text-sm font-medium text-[#f8f6f1] hover:bg-[#2a3d66]">
          Score your own job ad →
        </Link>
      </div>
    </div>
  );
}
