import Link from "next/link";
import { org } from "@/config/organization";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#050505] px-6 py-10 text-center">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4">
        <span className="font-heading text-base text-white">{org.name}</span>
        <nav className="flex flex-wrap justify-center gap-4">
          {org.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-xs uppercase tracking-wider text-white/60 transition-colors hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-4">
          {org.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="text-xs text-white/50 transition-colors hover:text-primary"
            >
              {s.label}
            </a>
          ))}
        </div>
        <p className="text-xs text-white/40">
          © 2026 {org.name}. <span className="text-primary">Powered by Buckets.</span>
        </p>
      </div>
    </footer>
  );
}
