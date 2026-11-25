"use client";

import { useState } from "react";
import { SAMPLE_JOB } from "@/lib/sample-job";
import type { MatchResult, RequirementMatch } from "@/lib/types";

const LABELS_KEY = "match-labels-v1";

interface Label {
  at: string;
  score: number;
  verdict: string;
  apply: boolean;
  adPreview: string;
}

function loadLabels(): Label[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LABELS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

const strengthStyle: Record<RequirementMatch["strength"], string> = {
  evidenced: "bg-emerald-100 text-emerald-800",
  claimed: "bg-amber-100 text-amber-800",
  missing: "bg-rose-100 text-rose-800",
};

const verdictStyle: Record<MatchResult["verdict"], string> = {
  strong: "text-emerald-700",
  partial: "text-amber-700",
  weak: "text-rose-700",
};

export function MatchDemo() {
  const [ad, setAd] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<Label[]>(loadLabels);
  const [labelled, setLabelled] = useState(false);

  async function run() {
    setLoading(true);
    setError(null);
    setLabelled(false);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobAd: ad }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function label(apply: boolean) {
    if (!result) return;
    const next = [
      ...labels,
      { at: new Date().toISOString(), score: result.score, verdict: result.verdict, apply, adPreview: ad.slice(0, 120) },
    ];
    setLabels(next);
    localStorage.setItem(LABELS_KEY, JSON.stringify(next));
    setLabelled(true);
  }

  function exportLabels() {
    const blob = new Blob([labels.map((l) => JSON.stringify(l)).join("\n")], { type: "application/jsonl" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "match-labels.jsonl";
    a.click();
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <div>
        <textarea
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          placeholder="Paste a job ad here…"
          className="h-96 w-full rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm focus:border-indigo-500 focus:outline-none"
        />
        <div className="mt-3 flex gap-3">
          <button
            onClick={run}
            disabled={!ad.trim() || loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Scoring…" : "Score this job"}
          </button>
          <button
            onClick={() => setAd(SAMPLE_JOB)}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            Try a sample ad
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
      </div>

      <div>
        {!result && (
          <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-sm text-zinc-500">
            The fit score and evidence appear here.
          </div>
        )}
        {result && (
          <div className="space-y-5">
            <div className="rounded-lg border border-zinc-200 bg-white p-5">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-semibold tabular-nums">{result.score}</span>
                <span className="text-zinc-500">/ 100</span>
                <span className={`ml-auto text-lg font-medium capitalize ${verdictStyle[result.verdict]}`}>
                  {result.verdict} fit
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600">{result.summary}</p>
              {result.yearsRequired !== undefined && (
                <p className="mt-1 text-xs text-zinc-500">Ad asks for {result.yearsRequired}+ years of experience.</p>
              )}
              <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4 text-sm">
                {labelled ? (
                  <span className="text-zinc-500">Saved. {labels.length} labelled jobs so far.</span>
                ) : (
                  <>
                    <span className="text-zinc-600">Would I apply?</span>
                    <button onClick={() => label(true)} className="rounded border border-zinc-300 px-2 py-0.5 hover:bg-zinc-100">Yes</button>
                    <button onClick={() => label(false)} className="rounded border border-zinc-300 px-2 py-0.5 hover:bg-zinc-100">No</button>
                  </>
                )}
                {labels.length > 0 && (
                  <button onClick={exportLabels} className="ml-auto text-xs text-indigo-600 hover:underline">
                    Export labels
                  </button>
                )}
              </div>
            </div>

            <ul className="space-y-3">
              {result.matches.map((m) => (
                <li key={m.skill} className="rounded-lg border border-zinc-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{m.label}</span>
                    <span className="text-xs text-zinc-500">{m.priority === "must" ? "must-have" : "nice-to-have"}</span>
                    <span className={`ml-auto rounded px-2 py-0.5 text-xs ${strengthStyle[m.strength]}`}>{m.strength}</span>
                  </div>
                  <p className="mt-1 text-xs italic text-zinc-500">“{m.source}”</p>
                  {m.evidence.map((e) => (
                    <div key={e.text} className="mt-2 border-l-2 border-emerald-300 pl-3 text-sm">
                      <p className="text-zinc-700">{e.text}</p>
                      <p className="text-xs text-zinc-500">{e.where}</p>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
