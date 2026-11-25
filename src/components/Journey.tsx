"use client";

import { useState } from "react";

type Step = { year: string; title: string; text: string };

/** Clickable career timeline. Defaults to the current role. */
export function Journey({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(Math.max(0, steps.length - 2));
  const s = steps[active];
  return (
    <div>
      <ol className="relative grid grid-cols-7 gap-1">
        <div aria-hidden className="absolute left-0 right-0 top-[7px] h-px bg-[#d6cfc0]" />
        <div
          aria-hidden
          className="absolute left-0 top-[7px] h-px bg-[#8a5a24] transition-all duration-700"
          style={{ width: `${((active + 0.5) / steps.length) * 100}%` }}
        />
        {steps.map((st, i) => (
          <li key={st.year} className="relative">
            <button onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} className="group flex w-full flex-col items-center text-center" aria-pressed={i === active}>
              <span
                className={`h-[15px] w-[15px] rounded-full border-2 transition-all duration-300 ${
                  i === active
                    ? "scale-125 border-[#8a5a24] bg-[#8a5a24]"
                    : i < active
                      ? "border-[#8a5a24] bg-[#f8f6f1]"
                      : "border-[#d6cfc0] bg-[#f8f6f1] group-hover:border-[#8a5a24]"
                } ${st.year === "Next" ? "border-dashed" : ""}`}
              />
              <span className={`mt-3 font-serif text-lg transition-colors ${i === active ? "text-[#8a5a24]" : "text-slate-500 group-hover:text-[#1b2a4a]"}`}>{st.year}</span>
              {st.title && <span className="mt-1 hidden text-xs leading-snug text-slate-500 md:block">{st.title}</span>}
            </button>
          </li>
        ))}
      </ol>
      <div key={active} className="mt-10 rounded-2xl border border-[#e6e1d6] bg-white px-8 py-7 shadow-[0_1px_0_rgba(27,42,74,0.04)] [animation:fade-up_.5s_ease_both]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a24]">{s.year}</p>
        {s.title && <h3 className="mt-2 font-serif text-3xl text-[#1b2a4a]">{s.title}</h3>}
        {s.text && <p className="mt-3 max-w-2xl font-serif text-lg leading-relaxed text-slate-600">{s.text}</p>}
      </div>
    </div>
  );
}
