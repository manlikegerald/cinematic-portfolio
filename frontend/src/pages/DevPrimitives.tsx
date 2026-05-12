/**
 * /dev/primitives — isolated showcase of every animation primitive.
 * Only accessible in development. Helpful for tuning props before use in pages.
 */

import SplitText from "@/components/primitives/SplitText";
import HighlightLine from "@/components/primitives/HighlightLine";
import MarqueeRow from "@/components/primitives/MarqueeRow";
import MagneticButton from "@/components/primitives/MagneticButton";
import ArrowButton from "@/components/primitives/ArrowButton";

const block: React.CSSProperties = {
  padding: "4rem 2rem",
  borderBottom: "1px solid var(--color--dark-tint-2)",
};

const label: React.CSSProperties = {
  fontFamily: "var(--font--body)",
  fontSize: "0.7rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color--grey-2)",
  marginBottom: "2rem",
};

export default function DevPrimitives() {
  return (
    <div
      data-theme="dark"
      style={{ background: "var(--color--dark)", color: "var(--color--off-white)", paddingTop: "5rem" }}
    >
      <h1 style={{ padding: "2rem", fontFamily: "var(--font--body)", fontWeight: 800 }}>
        Primitives showcase
      </h1>

      {/* SplitText — reveal-clip */}
      <div style={block}>
        <p style={label}>SplitText / reveal-clip</p>
        <SplitText as="h2" split="words" anim="reveal-clip" start="top 99%" className="text-impact-reg-mona">
          Design that moves people.
        </SplitText>
      </div>

      {/* SplitText — reveal-up */}
      <div style={block}>
        <p style={label}>SplitText / reveal-up</p>
        <SplitText as="h2" split="words" anim="reveal-up" start="top 99%" className="text-impact-reg-brier">
          Build. Ship. Repeat.
        </SplitText>
      </div>

      {/* SplitText — chars-stagger */}
      <div style={block}>
        <p style={label}>SplitText / chars-stagger</p>
        <SplitText as="h3" split="chars" anim="chars-stagger" start="top 99%" className="text-title-reg-mona">
          Hello, world.
        </SplitText>
      </div>

      {/* HighlightLine — scroll */}
      <div style={block}>
        <p style={label}>HighlightLine / scroll</p>
        <HighlightLine trigger="scroll">
          <span className="text-impact-reg-mona" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            Scroll-triggered wipe
          </span>
        </HighlightLine>
      </div>

      {/* HighlightLine — hover */}
      <div style={block}>
        <p style={label}>HighlightLine / hover (hover me)</p>
        <HighlightLine trigger="hover">
          <span className="text-title-reg-mona">Hover to reveal</span>
        </HighlightLine>
      </div>

      {/* MarqueeRow */}
      <div style={block}>
        <p style={label}>MarqueeRow</p>
        <MarqueeRow speed={20} direction="left" pauseOnHover>
          {["React", "TypeScript", "GSAP", "Tailwind", "FastAPI", "Figma"].map((s) => (
            <span key={s} className="text-eyebrow" style={{ padding: "0 2rem", color: "var(--color--grey-1)", whiteSpace: "nowrap" }}>
              {s} ·
            </span>
          ))}
        </MarqueeRow>
      </div>

      {/* MagneticButton */}
      <div style={{ ...block, display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <p style={{ ...label, width: "100%" }}>MagneticButton</p>
        <MagneticButton label="Default" />
        <MagneticButton label="Small" small />
      </div>

      {/* ArrowButton */}
      <div style={{ ...block, display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <p style={{ ...label, width: "100%" }}>ArrowButton</p>
        <ArrowButton label="Arrow (default)" />
        <ArrowButton label="Arrow (large)" size={72} />
      </div>
    </div>
  );
}
