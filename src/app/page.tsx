import Link from "next/link";
import profileJson from "@/data/profile.json";
import type { Profile } from "@/lib/types";
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

export default function Home() {
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
              Operator, analyst, <em className="text-[#8a5a24]">engineer</em>.
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
          <h2 className="mt-3 mb-10 font-serif text-4xl text-[#1b2a4a]">Do I fit your role? Ask the system.</h2>
          <MatchPreview />
        </section>
      </Reveal>

      {profile.featured && (
        <Section title="Selected work">
          <div className="grid gap-5 md:grid-cols-2">
            {profile.featured.map((w) => {
              const card = (
                <article className="h-full rounded-2xl border border-[#e6e1d6] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_rgba(27,42,74,0.25)]">
                  <h3 className="font-serif text-2xl text-[#1b2a4a]">{w.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{w.blurb}</p>
                  <p className="mt-5 text-[11px] uppercase tracking-[0.15em] text-[#8a5a24]">{w.tags.join(" · ")}</p>
                </article>
              );
              return w.url ? (
                <Link key={w.title} href={w.url}>
                  {card}
                </Link>
              ) : (
                <div key={w.title}>{card}</div>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="Experience">
        <ul className="divide-y divide-[#e6e1d6]">
          {profile.roles.map((r) => (
            <li key={r.id} className="grid gap-1 py-4 first:pt-0 md:grid-cols-[1fr_auto] md:items-baseline">
              <p>
                <span className="font-serif text-xl text-[#1b2a4a]">{r.title}</span>
                <span className="text-slate-500"> · {r.org}</span>
              </p>
              <p className="text-sm text-slate-500">
                {r.start} — {r.end}
              </p>
            </li>
          ))}
        </ul>
        {profile.education && (
          <p className="mt-6 text-sm text-slate-500">
            {profile.education.map((e) => `${e.degree}, ${e.school}`).join(" · ")}
          </p>
        )}
      </Section>

      {profile.toolkit && (
        <Section title="Toolkit">
          <ul className="flex flex-wrap gap-2">
            {profile.toolkit.map((t) => (
              <li key={t} className="rounded-full border border-[#d6cfc0] px-4 py-1.5 text-sm text-slate-700">
                {t}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
