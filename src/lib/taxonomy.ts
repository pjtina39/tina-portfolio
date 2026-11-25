// Skill taxonomy: a canonical id, a display label and the phrases that
// signal the skill in free text. Requirement extraction is only as good
// as this list, so extend it when a job ad mentions something it misses.

export interface SkillDef {
  id: string;
  label: string;
  patterns: string[]; // lower-case phrases, matched on word boundaries
}

export const SKILLS: SkillDef[] = [
  { id: "python", label: "Python", patterns: ["python", "pandas", "numpy", "fastapi"] },
  { id: "typescript", label: "TypeScript / JavaScript", patterns: ["typescript", "javascript", "node.js", "nodejs", "node"] },
  { id: "react", label: "React / Next.js", patterns: ["react", "next.js", "nextjs", "frontend", "front-end"] },
  { id: "sql", label: "SQL", patterns: ["sql", "postgres", "postgresql", "bigquery", "snowflake", "mysql"] },
  { id: "apis", label: "APIs and integration", patterns: ["api", "apis", "rest", "graphql", "integration", "integrations", "integrate"] },
  { id: "cloud", label: "Cloud (AWS / Azure / GCP)", patterns: ["aws", "azure", "gcp", "google cloud", "cloud"] },
  { id: "docker", label: "Containers", patterns: ["docker", "kubernetes", "k8s", "containers", "containerised", "containerized"] },
  { id: "cicd", label: "CI/CD and deployment", patterns: ["ci/cd", "ci", "cd", "continuous integration", "continuous delivery", "deployment", "deploy", "devops", "github actions"] },
  { id: "system-design", label: "System design", patterns: ["system design", "architecture", "architect", "scalable", "distributed systems", "solution design"] },
  { id: "llm", label: "LLMs and generative AI", patterns: ["llm", "llms", "large language model", "large language models", "generative ai", "genai", "gen ai", "gpt", "claude", "openai", "anthropic"] },
  { id: "rag", label: "Retrieval and RAG", patterns: ["rag", "retrieval", "retrieval-augmented", "vector database", "vector search", "semantic search", "search"] },
  { id: "embeddings", label: "Embeddings", patterns: ["embedding", "embeddings"] },
  { id: "prompting", label: "Prompt engineering", patterns: ["prompt engineering", "prompt", "prompts", "prompting"] },
  { id: "agents", label: "Agents and orchestration", patterns: ["agent", "agents", "agentic", "orchestration", "tool use", "langchain", "langgraph", "mcp"] },
  { id: "ml", label: "Machine learning", patterns: ["machine learning", "ml", "scikit-learn", "sklearn", "pytorch", "tensorflow", "deep learning", "model training", "lightgbm", "xgboost", "predictive modelling", "predictive modeling"] },
  { id: "nlp", label: "NLP", patterns: ["nlp", "natural language processing", "text classification", "entity extraction", "entity resolution", "entity matching", "named entity", "sentiment"] },
  { id: "classification", label: "Classification", patterns: ["classification", "classifier", "classifiers", "tagging"] },
  { id: "ranking", label: "Ranking and recommendation", patterns: ["ranking", "recommendation", "recommender", "relevance"] },
  { id: "evaluation", label: "Model evaluation", patterns: ["evaluation", "evals", "eval", "benchmark", "benchmarking", "metrics", "a/b test", "a/b testing"] },
  { id: "data-pipelines", label: "Data pipelines", patterns: ["data pipeline", "data pipelines", "etl", "airflow", "spark", "data engineering", "dbt", "analytics engineering"] },
  { id: "data-analysis", label: "Data analysis", patterns: ["data analysis", "analytics", "dashboards", "insights", "statistics"] },
  { id: "client-facing", label: "Client-facing delivery", patterns: ["client", "clients", "client-facing", "customer", "customers", "customer-facing", "consulting", "stakeholder", "stakeholders"] },
  { id: "communication", label: "Communication", patterns: ["communication", "communicate", "presenting", "presentation", "storytelling", "explain"] },
  { id: "product", label: "Product thinking", patterns: ["product", "product requirements", "discovery", "roadmap", "user research", "prototype", "prototyping", "poc", "proof of concept"] },
  { id: "operations", label: "Operations and process", patterns: ["operations", "process improvement", "workflow", "workflows", "automation", "automate"] },
  { id: "agile", label: "Agile delivery", patterns: ["agile", "scrum", "kanban", "sprint", "sprints"] },
  { id: "full-stack", label: "Full-stack development", patterns: ["full-stack", "full stack", "fullstack", "end-to-end", "end to end"] },
  { id: "security", label: "Security and governance", patterns: ["security", "governance", "compliance", "responsible ai", "privacy", "gdpr"] },
];

export const SKILL_LABEL: Record<string, string> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s.label]),
);

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const COMPILED = SKILLS.map((s) => ({
  id: s.id,
  re: new RegExp(
    `(?<![a-z0-9])(${s.patterns.map(escape).join("|")})(?![a-z0-9])`,
    "i",
  ),
}));

/** Every skill id whose patterns appear in the text. */
export function detectSkills(text: string): string[] {
  return COMPILED.filter((c) => c.re.test(text)).map((c) => c.id);
}
