import Link from "next/link";
import Image from "next/image";
import { org } from "@/config/organization";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/90 px-6 py-4 backdrop-blur md:px-10">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src={org.logos.primary}
          alt={org.name}
          width={150}
          height={40}
          priority
          className="h-9 w-auto object-contain"
        />
        <span className="font-heading text-lg tracking-wide text-white">{org.name}</span>
      </Link>
      <nav className="hidden items-center gap-6 md:flex">
        {org.nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="text-xs uppercase tracking-wider text-white/80 transition-colors hover:text-primary"
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
