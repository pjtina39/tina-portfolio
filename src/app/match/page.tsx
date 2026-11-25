import type { Metadata } from "next";
import { MatchDemo } from "./MatchDemo";

export const metadata: Metadata = { title: "Job match demo · Tina" };

export default function MatchPage() {
  return (
    <div>
      <h1 className="font-serif text-5xl tracking-tight text-stone-900">Job match demo</h1>
      <p className="mt-3 max-w-2xl text-stone-600">
        Paste a job ad. The engine extracts the must-have and nice-to-have skills, retrieves evidence
        for each one from my career knowledge base, and returns a weighted fit score. Every point of
        the score traces back to a sentence you can check.
      </p>
      <MatchDemo />
    </div>
  );
}
