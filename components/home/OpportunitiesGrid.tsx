import Link from "next/link";

interface Card {
  icon: string;
  title: string;
  body: string;
  href: string;
}

// Home overview cards. (Placeholder slot: this grid can later be swapped for a
// ReactBits MagicBento layout without changing the page.)
const CARDS: Card[] = [
  { icon: "📅", title: "Events", body: "Spotlight Connects — browse upcoming gatherings and RSVP.", href: "/events" },
  { icon: "🏆", title: "Awards", body: "Denver Spotlight Awards — meet the nominees and cast your vote.", href: "/events/awards" },
  { icon: "💰", title: "Support", body: "Back the Artist Fund through transparent contributions.", href: "/support" },
  { icon: "📨", title: "Get Involved", body: "Sponsor, vend, volunteer, shoot, or perform. Your stage awaits.", href: "/get-involved" },
  { icon: "✨", title: "About", body: "Our mission, vision, and the community we serve.", href: "/about" },
  { icon: "✉️", title: "Contact", body: "Reach the Denver Spotlight team directly.", href: "/contact" },
];

export default function OpportunitiesGrid() {
  return (
    <section className="mx-auto grid max-w-5xl gap-5 px-6 py-16 sm:grid-cols-2 md:grid-cols-3">
      {CARDS.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="group rounded-2xl border border-white/10 bg-card p-6 transition hover:-translate-y-1 hover:border-primary/60"
        >
          <span className="mb-3 block text-2xl">{c.icon}</span>
          <h3 className="font-heading text-lg text-white group-hover:text-primary">{c.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{c.body}</p>
        </Link>
      ))}
    </section>
  );
}
