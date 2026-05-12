import { useEffect, useState } from "react";
import Section from "@/components/sections/Section";
import SplitText from "@/components/primitives/SplitText";
import MarqueeRow from "@/components/primitives/MarqueeRow";
import HighlightLine from "@/components/primitives/HighlightLine";
import { getProfile, getTimeline, type Profile, type TimelineItem } from "@/lib/api";
import { SITE } from "@/config/site";
import { useReveal } from "@/hooks/useReveal";

const VALUES = [
  "Craft", "Clarity", "Curiosity", "Openness",
  "Speed", "Depth", "Honesty", "Play",
];

function TimelineEntry({ item }: { item: TimelineItem }) {
  // @ts-expect-error generic ref
  const ref = useReveal({ y: 20, delay: 0.1 });
  return (
    <div
      // @ts-expect-error ref
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "5rem 1fr",
        gap: "1.5rem",
        paddingBlock: "2rem",
        borderBottom: "1px solid var(--color--dark-tint-2)",
      }}
    >
      <span className="text-eyebrow" style={{ color: "var(--color--accent)", paddingTop: "0.25rem" }}>
        {item.year}
      </span>
      <div>
        <HighlightLine trigger="scroll">
          <h3 className="text-title-reg-mona" style={{ display: "inline" }}>
            {item.title}
          </h3>
        </HighlightLine>
        <p className="text-body-reg-mona" style={{ marginTop: "0.5rem", color: "var(--color--grey-2)" }}>
          {item.description}
        </p>
        <span
          className="text-eyebrow"
          style={{
            display: "inline-block",
            marginTop: "0.5rem",
            color: item.category === "work"
              ? "var(--color--accent)"
              : item.category === "award"
              ? "var(--color--grey-1)"
              : "var(--color--grey-2)",
          }}
        >
          {item.category}
        </span>
      </div>
    </div>
  );
}

export default function About() {
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  useEffect(() => {
    getProfile().then(setProfile).catch(console.error);
    getTimeline().then(setTimeline).catch(console.error);
  }, []);

  const bio = profile?.bio_long ?? "[PLACEHOLDER] A longer bio about who you are, what you've built, and where you're headed.";

  return (
    <>
      <Section
        theme="dark"
        style={{ paddingTop: "calc(var(--nav-height) + 4rem)", paddingBottom: "var(--section-padding)" }}
      >
        <div className="container">
          {/* Split: portrait + bio */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "4rem",
              marginBottom: "6rem",
              alignItems: "start",
            }}
          >
            {/* Portrait placeholder */}
            <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", aspectRatio: "3/4", background: "var(--color--dark-tint-1)" }}>
              <svg width="100%" height="100%" viewBox="0 0 300 400">
                <rect width="300" height="400" fill="var(--color--dark-tint-1)" />
                <text x="150" y="210" textAnchor="middle" fontSize="13" fill="var(--color--grey-2)" fontFamily="var(--font--body)">
                  [PLACEHOLDER] Portrait
                </text>
              </svg>
            </div>

            {/* Bio */}
            <div>
              <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "1rem" }}>
                About
              </p>
              <SplitText
                as="h1"
                split="words"
                anim="reveal-clip"
                start="top 95%"
                className="text-impact-reg-brier"
                style={{ marginBottom: "2rem", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                {profile?.name ?? SITE.name}
              </SplitText>
              <p className="text-body-reg-mona" style={{ color: "var(--color--grey-1)", lineHeight: 1.8 }}>
                {bio}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "0.5rem" }}>
            Timeline
          </p>
          <h2 className="text-title-reg-mona" style={{ marginBottom: "2rem" }}>
            How I got here
          </h2>
          {timeline.length > 0 ? (
            timeline.map((item) => <TimelineEntry key={item.id} item={item} />)
          ) : (
            <p className="text-body-reg-mona" style={{ color: "var(--color--grey-2)" }}>
              [PLACEHOLDER] Timeline entries will appear here after seeding the database.
            </p>
          )}
        </div>
      </Section>

      {/* Values marquee */}
      <Section
        theme="accent"
        style={{ padding: "2rem 0", background: "var(--color--accent)" }}
      >
        <MarqueeRow speed={20} direction="left">
          {VALUES.map((v) => (
            <span
              key={v}
              className="text-eyebrow"
              style={{ padding: "0 2rem", color: "var(--color--black)", whiteSpace: "nowrap", fontSize: "0.75rem" }}
            >
              {v} ·
            </span>
          ))}
        </MarqueeRow>
      </Section>
    </>
  );
}
