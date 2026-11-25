import Link from "next/link";
import profileJson from "@/data/profile.json";
import { SKILL_LABEL } from "@/lib/taxonomy";
import type { Highlight, Profile } from "@/lib/types";
import { HeroVisual } from "@/components/HeroVisual";
import { Journey } from "@/components/Journey";
import { MatchPreview } from "@/components/MatchPreview";
import { Reveal } from "@/components/Reveal";

const profile = profileJson as Profile;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="grid gap-6 border-t border-[#e6e1d6] pt-12 md:grid-cols-[200px_1fr] md:gap-12">
        <h2 className="font-serif text-3xl text-[#1b2a4a]">{title}</h2>
        <div>{children}</div>
      </section>
    </Reveal>
  );
}

function Highlights({ items }: { items: Highlight[] }) {
  return (
    <ul className="mt-5 space-y-4">
      {items.map((h) => (
        <li key={h.text}>
          <p className="leading-relaxed text-slate-700">{h.text}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
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
    <div className="space-y-28">
      <section className="grid items-center gap-10 md:grid-cols-[1.25fr_1fr]">
        <div className="hero-in">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8a5a24]">
            {profile.headline.split("·")[0].trim()}
            {profile.location && ` · ${profile.location.split(",")[0]}`}
          </p>
          <h1 className="mt-6 font-serif text-6xl leading-[1.02] tracking-tight text-[#1b2a4a] md:text-7xl">
            From operations
            <br />
            to <em className="text-[#8a5a24]">production AI</em>.
          </h1>
          <p className="mt-8 max-w-lg font-serif text-xl leading-relaxed text-slate-600">{profile.intro ?? profile.summary}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <Link href="/match" className="rounded-full bg-[#1b2a4a] px-6 py-3 font-medium text-[#f8f6f1] transition hover:-translate-y-0.5 hover:bg-[#2a3d66]">
              Try the job-match demo
            </Link>
            <Link href="/architecture" className="border-b-2 border-[#8a5a24] pb-1 text-[#1b2a4a] hover:text-[#8a5a24]">
              Read the system design
            </Link>
          </div>
          <div className="mt-6 flex gap-5 text-sm">
            {profile.links.map((l) => (
              <a key={l.url} href={l.url} className="text-slate-500 hover:text-[#1b2a4a]">
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="hero-in">
          <HeroVisual />
        </div>
      </section>

      {profile.metrics && (
        <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#1b2a4a] text-[#f8f6f1]">
          <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-y-12 px-6 py-16 md:grid-cols-4">
            {profile.metrics.map((m, i) => (
              <Reveal key={m.label} className={i > 0 ? "md:border-l md:border-white/15 md:pl-8" : ""}>
                <dt className="font-serif text-5xl leading-none tracking-tight">
                  {m.value}
                  {m.to && (
                    <span className="block text-2xl italic text-[#d9b98a]">→ {m.to}</span>
                  )}
                </dt>
                <dd className="mt-4 max-w-[14rem] text-sm leading-snug text-slate-300">{m.label}</dd>
              </Reveal>
            ))}
          </dl>
        </section>
      )}

      {profile.journey && (
        <Reveal>
          <section>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8a5a24]">The journey</p>
            <h2 className="mt-3 font-serif text-4xl text-[#1b2a4a]">
              I&apos;ve been the operator, the analyst <em className="text-[#8a5a24]">and</em> the engineer.
            </h2>
            <div className="mt-12">
              <Journey steps={profile.journey} />
            </div>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8a5a24]">Built for this interview</p>
          <h2 className="mt-3 mb-10 font-serif text-4xl text-[#1b2a4a]">How well do I fit a role? Ask the system.</h2>
          <MatchPreview />
        </section>
      </Reveal>

      <Section title="Experience">
        <ol className="space-y-14">
          {profile.roles.map((r) => (
            <li key={r.id}>
              <h3 className="font-serif text-2xl text-[#1b2a4a]">
                {r.title}, <span className="italic">{r.org}</span>
              </h3>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                {r.start} — {r.end}
              </p>
              <p className="mt-4 font-serif text-lg italic leading-relaxed text-slate-600">{r.summary}</p>
              <Highlights items={r.highlights} />
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Projects">
        {profile.projects.map((p) => (
          <article key={p.id}>
            <h3 className="font-serif text-2xl text-[#1b2a4a]">
              {p.url ? (
                <Link href={p.url} className="hover:text-[#8a5a24]">
                  {p.name}
                </Link>
              ) : (
                p.name
              )}
            </h3>
            <p className="mt-3 font-serif text-lg italic text-slate-600">{p.summary}</p>
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
                  <p className="font-serif text-xl text-[#1b2a4a]">{e.degree}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {e.school} · {e.years}
                  </p>
                </li>
              ))}
            </ul>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Certifications</p>
              <ul className="mt-3 space-y-1.5 text-slate-700">
                {profile.certifications?.map((c) => <li key={c}>{c}</li>)}
              </ul>
              {profile.languages && (
                <>
                  <p className="mt-6 text-xs uppercase tracking-[0.15em] text-slate-500">Languages</p>
                  <p className="mt-2 text-slate-700">{profile.languages.join(" · ")}</p>
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
              <p className="text-xs uppercase tracking-[0.15em] text-[#8a5a24]">{lvl}</p>
              <ul className="mt-3 space-y-1.5 text-slate-700">
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
