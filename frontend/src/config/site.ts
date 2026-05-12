// ONE SOURCE OF TRUTH — edit this file to update name, tagline, socials everywhere.
// All components import from here; nothing is hardcoded.

export const SITE = {
  name: "{{YOUR_NAME}}", // [PLACEHOLDER] e.g. "Alex Rivera"
  initials: "{{INITIALS}}", // [PLACEHOLDER] e.g. "AR"
  tagline: "{{YOUR_TAGLINE}}", // [PLACEHOLDER] e.g. "Product Designer & Front-End Engineer"
  location: "{{YOUR_LOCATION}}", // [PLACEHOLDER] e.g. "London, UK"
  since: "{{SINCE_YEAR}}", // [PLACEHOLDER] e.g. "2018"
  bio_short:
    "{{YOUR_SHORT_BIO}}", // [PLACEHOLDER] 1–2 sentences
  currently: "Building a cinematic portfolio site", // [PLACEHOLDER]
  next: "Open to new projects · Q3 2026", // [PLACEHOLDER]

  // Hero background mode: "shader" | "image" | "solid"
  heroBackground: "image" as "shader" | "image" | "solid",

  // Nav links — label + path
  nav: [
    { label: "Work", path: "/work" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ],

  socials: [
    { label: "email", href: "mailto:{{YOUR_EMAIL}}" }, // [PLACEHOLDER]
    { label: "linkedin", href: "https://linkedin.com/in/{{YOUR_HANDLE}}" }, // [PLACEHOLDER]
    { label: "github", href: "https://github.com/{{YOUR_HANDLE}}" }, // [PLACEHOLDER]
    { label: "twitter", href: "https://twitter.com/{{YOUR_HANDLE}}" }, // [PLACEHOLDER]
  ],

  // OnOffSplit section labels — rename freely
  splitLeft: { label: "BUILD", sub: "Design & Engineering" },
  splitRight: { label: "SHARE", sub: "Writing & Speaking" },

  // Backend API origin (Vite proxy handles /api in dev, override for prod)
  apiBase: "/api",
} as const;
