import Link from "next/link";

/**
 * Pinned promotional banner (NOT a popup). Stays visible near the top of the
 * page per spec. Content is the current activation.
 */
export default function SpotlightConnectsBanner() {
  return (
    <div className="w-full border-y border-primary/30 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-3 sm:flex-row">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            Now Active
          </span>
          <span className="font-heading text-sm text-white md:text-base">
            Spotlight Connects — Summer Series
          </span>
        </div>
        <Link
          href="/events/spotlight-connects"
          className="text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:text-white"
        >
          Learn More →
        </Link>
      </div>
    </div>
  );
}
