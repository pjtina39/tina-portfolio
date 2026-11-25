// Shape of the career knowledge base (src/data/profile.json).
// The portfolio pages and the match engine both read this one file,
// so a change to the profile updates the site and the demo together.

export type SkillId = string;

export interface Profile {
  name: string;
  headline: string;
  location: string;
  summary: string;
  links: { label: string; url: string }[];
  /** true while the profile still contains placeholder text */
  placeholder?: boolean;
  skills: { id: SkillId; level: "expert" | "strong" | "working" }[];
  roles: Role[];
  projects: Project[];
}

export interface Role {
  id: string;
  title: string;
  org: string;
  start: string;
  end: string;
  summary: string;
  highlights: Highlight[];
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  highlights: Highlight[];
  url?: string;
}

/** One piece of evidence: a concrete thing done, tagged with the skills it proves. */
export interface Highlight {
  text: string;
  skills: SkillId[];
}

export type Priority = "must" | "nice";

export interface Requirement {
  skill: SkillId;
  label: string;
  priority: Priority;
  /** the line of the job ad the skill was found in */
  source: string;
}

export interface Evidence {
  where: string; // e.g. "Role: AI Researcher, Org" or "Project: X"
  text: string;
  score: number;
}

export interface RequirementMatch extends Requirement {
  strength: "evidenced" | "claimed" | "missing";
  evidence: Evidence[];
}

export interface MatchResult {
  score: number; // 0..100
  verdict: "strong" | "partial" | "weak";
  matches: RequirementMatch[];
  gaps: string[];
  yearsRequired?: number;
  summary: string;
}
