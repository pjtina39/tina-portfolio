import Link from "next/link";
import profileJson from "@/data/profile.json";
import { SKILL_LABEL } from "@/lib/taxonomy";
import type { Highlight, Profile } from "@/lib/types";

const profile = profileJson as Profile;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-stone-200 pt-12 md:grid-cols-[200px_1fr] md:gap-12">
      <h2 className="font-serif text-3xl text-stone-900">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function Highlights({ items }: { items: Highlight[] }) {
  return (
    <ul className="mt-5 space-y-4">
      {items.map((h) => (
        <li key={h.text}>
          <p className="leading-relaxed text-stone-700">{h.text}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-stone-400">
            {h.skills.map((s) => SKILL_LABEL[s] ?? s).join(" · ")}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const byLevel = (lvl: string) => profile.skills.filter((s) => s.level === lvl);
  return (
    <div className="space-y-20">
      <section className="grid gap-12 pt-6 md:grid-cols-[1.5fr_1fr] md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#b4532a]">
            {profile.headline.split("·")[0].trim()}
            {profile.location && ` · ${profile.location.split(",")[0]}`}
          </p>
          <h1 className="mt-6 font-serif text-6xl leading-[1.02] tracking-tight text-stone-900 md:text-7xl">
            From operations
            <br />
            to <em className="text-[#b4532a]">production AI</em>.
          </h1>
          <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-stone-600">{profile.summary}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <Link href="/match" className="border-b-2 border-[#b4532a] pb-1 text-stone-900 hover:text-[#b4532a]">
              Try the job-match demo
            </Link>
            <Link href="/architecture" className="border-b-2 border-[#b4532a] pb-1 text-stone-900 hover:text-[#b4532a]">
              Read the system design
            </Link>
            {profile.links.map((l) => (
              <a key={l.url} href={l.url} className="text-stone-500 hover:text-stone-900">
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>
        {profile.metrics && (
          <dl className="space-y-6 border-l border-stone-300 pl-8">
            {profile.metrics.map((m) => (
              <div key={m.value}>
                <dt className="font-serif text-3xl text-stone-900">{m.value}</dt>
                <dd className="mt-1 text-sm text-stone-500">{m.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <Section title="Experience">
        <ol className="space-y-14">
          {profile.roles.map((r) => (
            <li key={r.id}>
              <h3 className="font-serif text-2xl text-stone-900">
                {r.title}, <span className="italic">{r.org}</span>
              </h3>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-stone-500">
                {r.start} — {r.end}
              </p>
              <p className="mt-4 font-serif text-lg italic leading-relaxed text-stone-600">{r.summary}</p>
              <Highlights items={r.highlights} />
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Projects">
        {profile.projects.map((p) => (
          <article key={p.id}>
            <h3 className="font-serif text-2xl text-stone-900">
              {p.url ? (
                <Link href={p.url} className="hover:text-[#b4532a]">
                  {p.name}
                </Link>
              ) : (
                p.name
              )}
            </h3>
            <p className="mt-3 font-serif text-lg italic text-stone-600">{p.summary}</p>
            <Highlights items={p.highlights} />
          </article>
        ))}
      </Section>

      {profile.education && (
        <Section title="Education">
          <div className="grid gap-10 md:grid-cols-2">
            <ul className="space-y-5">
              {profile.education.map((e) => (
                <li key={e.school}>
                  <p className="font-serif text-xl text-stone-900">{e.degree}</p>
                  <p className="mt-1 text-sm text-stone-500">
                    {e.school} · {e.years}
                  </p>
                </li>
              ))}
            </ul>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-stone-500">Certifications</p>
              <ul className="mt-3 space-y-1.5 text-stone-700">
                {profile.certifications?.map((c) => <li key={c}>{c}</li>)}
              </ul>
              {profile.languages && (
                <>
                  <p className="mt-6 text-xs uppercase tracking-[0.15em] text-stone-500">Languages</p>
                  <p className="mt-2 text-stone-700">{profile.languages.join(" · ")}</p>
                </>
              )}
            </div>
          </div>
        </Section>
      )}

      <Section title="Skills">
        <div className="grid gap-8 md:grid-cols-3">
          {(["expert", "strong", "working"] as const).map((lvl) => (
            <div key={lvl}>
              <p className="text-xs uppercase tracking-[0.15em] text-[#b4532a]">{lvl}</p>
              <ul className="mt-3 space-y-1.5 text-stone-700">
                {byLevel(lvl).map((s) => (
                  <li key={s.id}>{SKILL_LABEL[s.id] ?? s.id}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
