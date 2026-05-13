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
    { label: "email",     href: "mailto:adjemancofiegerald@gmail.com" },
    { label: "linkedin",  href: "https://www.linkedin.com/in/gerald-adjeman-cofie-bb2307216" },
    { label: "instagram", href: "https://www.instagram.com/woprikraadodo?igsh=MWRkd3doZW5nbDNudw%3D%3D&utm_source=qr" },
    { label: "x",         href: "https://x.com/woprikraadodo?s=21" },
    { label: "tiktok",    href: "https://www.tiktok.com/@woprikraadodo?_r=1&_t=ZS-96KV3HsSO8a" },
    { label: "youtube",   href: "https://youtube.com/@officialgerald?si=WKghuakynY1m9MC2" },
    { label: "facebook",  href: "https://www.facebook.com/share/1ED1ftzF4T/?mibextid=wwXIfr" },
    { label: "github",    href: "https://github.com/manlikegerald" },
  ],

  // OnOffSplit section labels
  splitLeft:  { label: "DESIGN", sub: "Brand & Visual Identity" },
  splitRight: { label: "CREATE", sub: "Video & Social Media" },

  // Backend API origin (Vite proxy handles /api in dev, override for prod)
  apiBase: import.meta.env.VITE_API_BASE ?? "/api",
} as const;
