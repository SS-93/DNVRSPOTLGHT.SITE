// ─────────────────────────────────────────────────────────────
// White-Label Organization Contract
// A new organization deploys this template by editing THIS FILE only —
// never application logic. Denver Spotlight is deployment #001.
// ─────────────────────────────────────────────────────────────

export type FormType =
  | "sponsor"
  | "vendor"
  | "volunteer"
  | "paparazzi"
  | "performer"
  | "contact"
  | "artist-fund";

export interface NavItem {
  label: string;
  href: string;
}

export interface OrganizationConfig {
  /** Stable id — also used as the Buckets tenant/project id. */
  id: string;
  name: string;
  domain: string;
  contactEmail: string;
  tagline: string;
  description: string;

  /** Brand tokens. Source of truth for theming lives in app/globals.css
   *  (@theme); these mirror them for reference / future runtime theming. */
  theme: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    cardSurface: string;
    heroGradient: string;
  };

  fonts: { heading: string; ui: string; impact: string };

  logos: { primary: string; secondary: string };

  nav: NavItem[];
  socials: NavItem[];

  /** Which interest forms this deployment exposes. */
  forms: FormType[];

  /** Buckets ecosystem integration — opt-in per deployment.
   *  Phase 1 keeps everything off: the site runs on Supabase + Resend only.
   *  Flipping a flag reveals the corresponding Phase 2/3 capability. */
  buckets: {
    enabled: boolean;
    passport: boolean;
    concierto: boolean;
    treasury: boolean;
    coliseum: boolean;
    mediaId: boolean;
  };
}

export const org: OrganizationConfig = {
  id: "denver-spotlight",
  name: "Denver Spotlight",
  domain: "denverspotlight.org",
  contactEmail: "info@denverspotlight.org",
  tagline: "The Creative Pulse",
  description:
    "Illuminating the artists, innovators, and cultural leaders of Denver's vibrant community — recognition, events, culture, connection.",

  theme: {
    primary: "#E000FF",
    secondary: "#D9D9D9",
    background: "#000000",
    surface: "#09090B",
    cardSurface: "#121218",
    heroGradient: "linear-gradient(135deg, #9B00FF 0%, #E000FF 50%, #FF4AF2 100%)",
  },

  fonts: { heading: "Cinzel", ui: "Inter", impact: "Anton" },

  logos: {
    primary: "/LOGOS/denver-spotlight-logo.png",
    secondary: "/LOGOS/spotlight-connects-logo.png",
  },

  nav: [
    { label: "Events", href: "/events" },
    { label: "Awards", href: "/events/awards" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Support", href: "/support" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  socials: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "TikTok", href: "#" },
  ],

  forms: ["sponsor", "vendor", "volunteer", "paparazzi", "performer", "contact", "artist-fund"],

  buckets: {
    enabled: false,
    passport: false,
    concierto: false,
    treasury: false,
    coliseum: false,
    mediaId: false,
  },
};
