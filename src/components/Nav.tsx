import Link from "next/link";

const links = [
  { href: "/", label: "Portfolio" },
  { href: "/match", label: "Job match demo" },
  { href: "/architecture", label: "System design" },
];

export function Nav() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Tina<span className="text-indigo-600">.ai</span>
        </Link>
        <ul className="flex gap-6 text-sm text-zinc-600">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-zinc-900">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
