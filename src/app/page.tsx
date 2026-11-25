import Link from "next/link";
import profileJson from "@/data/profile.json";
import { SKILL_LABEL } from "@/lib/taxonomy";
import type { Highlight, Profile } from "@/lib/types";

const profile = profileJson as Profile;

function Highlights({ items }: { items: Highlight[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((h) => (
        <li key={h.text} className="text-sm text-zinc-700">
          <p>{h.text}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {h.skills.map((s) => (
              <span key={s} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600">
                {SKILL_LABEL[s] ?? s}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const byLevel = (lvl: string) => profile.skills.filter((s) => s.level === lvl);
  return (
    <div className="space-y-16">
      <section>
        {profile.location && <p className="text-sm font-medium text-indigo-600">{profile.location}</p>}
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="mt-2 text-xl text-zinc-600">{profile.headline}</p>
        <p className="mt-6 max-w-2xl leading-relaxed text-zinc-700">{profile.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/match" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Try the job-match demo
          </Link>
          <Link href="/architecture" className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100">
            See the system design
          </Link>
          {profile.links.map((l) => (
            <a key={l.url} href={l.url} className="px-2 py-2 text-sm text-zinc-600 underline-offset-4 hover:underline">
              {l.label}
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
        <ol className="mt-6 space-y-8 border-l border-zinc-200 pl-6">
          {profile.roles.map((r) => (
            <li key={r.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  {r.title} <span className="font-normal text-zinc-500">· {r.org}</span>
                </h3>
                <span className="text-sm text-zinc-500">
                  {r.start} to {r.end}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600">{r.summary}</p>
              <Highlights items={r.highlights} />
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {profile.projects.map((p) => (
            <article key={p.id} className="rounded-lg border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold">
                {p.url ? <Link href={p.url} className="hover:text-indigo-600">{p.name}</Link> : p.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-600">{p.summary}</p>
              <Highlights items={p.highlights} />
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {(["expert", "strong", "working"] as const).map((lvl) => (
            <div key={lvl}>
              <h3 className="text-sm font-medium capitalize text-zinc-500">{lvl}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {byLevel(lvl).map((s) => (
                  <li key={s.id} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm">
                    {SKILL_LABEL[s.id] ?? s.id}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
