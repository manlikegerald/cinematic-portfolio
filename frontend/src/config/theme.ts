// Design token config — one-line changes here re-skin the whole site.
// These values are mirrored in tokens.css as CSS variables.
// Change them here AND in tokens.css to keep both in sync.

export const THEME = {
  // Brand colors
  accent: "#d2ff00", // [PLACEHOLDER] lime — swap to your brand color
  dark: "#282c20", // [PLACEHOLDER] dark green — swap to your dark

  // Display font — swap the family string to change globally.
  // Pair: fonts.display is for headlines, fonts.body for UI/copy.
  fonts: {
    display: "'Fraunces', Georgia, serif", // swap to 'Editorial New' if licensed
    body: "'Mona Sans', 'Inter', system-ui, sans-serif",
  },

  // Global animation intensity multiplier (1 = default, 0 = none).
  // Components read this and scale their durations accordingly.
  animIntensity: 1,
} as const;
