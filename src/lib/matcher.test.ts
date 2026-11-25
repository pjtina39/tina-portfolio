import { describe, expect, it } from "vitest";
import profile from "@/data/profile.json";
import { extractRequirements, extractYears, matchJob } from "./matcher";
import { SAMPLE_JOB } from "./sample-job";
import type { Profile } from "./types";

const P = profile as Profile;

describe("extractRequirements", () => {
  it("separates must-have from nice-to-have sections", () => {
    const reqs = extractRequirements(SAMPLE_JOB);
    const by = Object.fromEntries(reqs.map((r) => [r.skill, r.priority]));
    expect(by.python).toBe("must");
    expect(by.evaluation).toBe("must");
    expect(by.docker).toBe("nice");
    expect(by.agents).toBe("nice");
  });

  it("keeps the strongest priority when a skill appears twice", () => {
    const reqs = extractRequirements("Requirements\nPython\nNice to have\nPython notebooks");
    expect(reqs.find((r) => r.skill === "python")?.priority).toBe("must");
  });

  it("does not match skills inside other words", () => {
    expect(extractRequirements("We sell decorative furniture").map((r) => r.skill)).not.toContain("cicd");
  });
});

describe("matchJob", () => {
  it("returns a bounded score with evidence for matched skills", () => {
    const r = matchJob(SAMPLE_JOB, P);
    expect(r.score).toBeGreaterThan(0);
    expect(r.score).toBeLessThanOrEqual(100);
    const py = r.matches.find((m) => m.skill === "python");
    expect(py?.strength).toBe("evidenced");
    expect(py?.evidence.length).toBeGreaterThan(0);
  });

  it("flags skills the profile does not cover as gaps", () => {
    const r = matchJob("Requirements\nKubernetes in production", P);
    expect(r.matches[0].strength).toBe("missing");
    expect(r.score).toBe(0);
    expect(r.gaps[0]).toMatch(/Containers/);
  });

  it("handles text with no recognisable skills", () => {
    const r = matchJob("Hello world", P);
    expect(r.score).toBe(0);
    expect(r.matches).toHaveLength(0);
  });

  it("reads years of experience", () => {
    expect(extractYears(SAMPLE_JOB)).toBe(3);
  });
});
