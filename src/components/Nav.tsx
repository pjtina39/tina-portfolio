import Link from "next/link";

const links = [
  { href: "/", label: "Work" },
  { href: "/match", label: "Job match" },
  { href: "/architecture", label: "System design" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-10 bg-[#faf7f2]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-serif text-xl text-stone-900">
          Tina Zeng
        </Link>
        <ul className="flex gap-6 text-sm text-stone-600">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-stone-900">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
