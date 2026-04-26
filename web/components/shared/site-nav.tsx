"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/start", label: "바로 시작" },
  { href: "/examples", label: "업종별 예시" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-[0.35em] text-violet-300 transition hover:text-violet-200"
        >
          AMUGOTO
        </Link>

        <nav className="flex min-w-0 flex-1 justify-end">
          <div className="flex items-center gap-2 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-violet-500/50 bg-violet-500/15 text-white"
                      : "border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
