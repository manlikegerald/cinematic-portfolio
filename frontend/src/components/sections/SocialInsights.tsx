import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getInsights, type SocialInsight } from "@/lib/api";
import { SITE } from "@/config/site";

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E1306C",
  youtube:   "#FF0000",
  tiktok:    "#ffffff",
  x:         "#ffffff",
  facebook:  "#1877F2",
  linkedin:  "#0A66C2",
};

const PLATFORM_ICONS: Record<string, JSX.Element> = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a0a0a"/>
    </svg>
  ),
  tiktok: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
    </svg>
  ),
  x: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
};

function InsightCard({ insight }: { insight: SocialInsight }) {
  const color = PLATFORM_COLORS[insight.platform] ?? "var(--color--accent)";
  const icon  = PLATFORM_ICONS[insight.platform];
  const href  = SITE.socials.find(s => s.label === insight.platform)?.href ?? "#";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.65, 0.05, 0, 1] }}
      whileHover={{ y: -4 }}
      style={{
        display: "block",
        textDecoration: "none",
        background: "var(--color--dark-tint-1)",
        border: "1px solid var(--color--dark-tint-2)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        transition: "border-color 0.25s",
        cursor: "pointer",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = color + "55")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--color--dark-tint-2)")}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ color, display: "flex" }}>{icon}</div>
          <div>
            <p className="text-eyebrow" style={{ color, fontSize: "0.7rem", letterSpacing: "0.12em" }}>
              {insight.platform.toUpperCase()}
            </p>
            {insight.handle && (
              <p style={{ fontFamily: "var(--font--body)", fontSize: "0.8rem", color: "var(--color--grey-2)", marginTop: "0.1rem" }}>
                {insight.handle}
              </p>
            )}
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ color: "var(--color--grey-2)" }}>
          <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--color--dark-tint-2)", marginBottom: "1.5rem" }} />

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(insight.stats.length, 3)}, 1fr)`, gap: "1rem" }}>
        {insight.stats.map((stat, i) => (
          <div key={i}>
            <p style={{ fontFamily: "var(--font--body)", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 700, color: "var(--color--off-white)", lineHeight: 1.1, marginBottom: "0.3rem" }}>
              {stat.value}
            </p>
            <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", fontSize: "0.65rem" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.a>
  );
}

export default function SocialInsightsSection() {
  const [insights, setInsights] = useState<SocialInsight[]>([]);

  useEffect(() => {
    getInsights().then(setInsights).catch(console.error);
  }, []);

  if (insights.length === 0) return null;

  return (
    <section
      data-theme="dark"
      style={{ padding: "var(--section-padding) var(--container-padding)" }}
    >
      <div className="container">
        <motion.p
          className="text-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ color: "var(--color--grey-2)", marginBottom: "1rem" }}
        >
          Social presence
        </motion.p>

        <motion.h2
          className="text-impact-reg-brier"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          style={{ marginBottom: "3rem", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          By the numbers.
        </motion.h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
          gap: "1.25rem",
        }}>
          {insights.map(ins => <InsightCard key={ins.id} insight={ins} />)}
        </div>
      </div>
    </section>
  );
}
