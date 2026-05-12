// ONE SOURCE OF TRUTH — edit this file to update name, tagline, socials everywhere.
// All components import from here; nothing is hardcoded.

export const SITE = {
  name: "Gerald Adjeman-Cofie",
  initials: "GA",
  tagline: "Graphic Designer · Video Editor · Social Media Strategist",
  location: "Tema, Ghana",
  since: "2018",
  bio_short:
    "Creative multimedia professional with 5+ years of experience in graphic design, video production, and digital marketing.",
  currently: "MDG Consultant for Africa at Wilmar Africa LTD",
  next: "Open to new design & brand projects · 2026",

  // Hero background mode: "shader" | "image" | "solid"
  heroBackground: "image" as "shader" | "image" | "solid",

  // Nav links — label + path
  nav: [
    { label: "Work", path: "/work" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ],

  socials: [
    { label: "email",    href: "mailto:adjemancofiegerald@gmail.com" },
    { label: "linkedin", href: "https://www.linkedin.com/in/gerald-adjeman-cofie-bb2307216" },
    { label: "github",   href: "https://github.com/manlikegerald" },
  ],

  // OnOffSplit section labels
  splitLeft:  { label: "DESIGN", sub: "Brand & Visual Identity" },
  splitRight: { label: "CREATE", sub: "Video & Social Media" },

  // Backend API origin (Vite proxy handles /api in dev, override for prod)
  apiBase: "/api",
} as const;
