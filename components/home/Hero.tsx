import Link from "next/link";
import { org } from "@/config/organization";

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Brand gradient + darkening overlay. Placeholder slot: a ReactBits
          animated background (e.g. SplashCursor / GridScan) can drop in here. */}
      <div className="hero-gradient absolute inset-0 opacity-90" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-3xl">
        <p className="mb-4 font-ui text-xs uppercase tracking-[0.3em] text-white/80">
          Community · Culture · Connection
        </p>
        <h1 className="font-impact text-5xl uppercase leading-tight text-white md:text-7xl">
          {org.tagline}
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-ui text-base text-white/85 md:text-lg">
          {org.description}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/events/spotlight-connects"
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-white/90"
          >
            Explore Spotlight Connects
          </Link>
          <Link
            href="/get-involved"
            className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white"
          >
            Get Involved
          </Link>
        </div>
      </div>
    </section>
  );
}
