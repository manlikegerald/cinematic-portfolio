import { useEffect, useState } from "react";
import Hero from "@/components/sections/Hero";
import HorizontalScroll from "@/components/sections/HorizontalScroll";
import OnOffSplit from "@/components/sections/OnOffSplit";
import ProjectGrid from "@/components/sections/ProjectGrid";
import MarqueeRow from "@/components/primitives/MarqueeRow";
import { ALL_TOOL_LOGOS } from "@/components/primitives/ToolLogos";
import ContactBlock from "@/components/sections/ContactBlock";
import SocialInsightsSection from "@/components/sections/SocialInsights";
import Section from "@/components/sections/Section";
import { getProfile, getProjects, type Profile, type Project } from "@/lib/api";
import { SITE } from "@/config/site";

// Placeholder gallery items for the horizontal scroll
const GALLERY_ITEMS = [
  { type: "image" as const, src: "/images/gallery/independence-day.webp", alt: "One Voice Choir — Ghana Independence Day poster", year: "2024" },
  { type: "image" as const, src: "/images/gallery/one-voice-choir-youtube.webp", alt: "One Voice Choir Ghana — YouTube Channel Promo", year: "2025" },
  { type: "text" as const, quote: "It's not about the destination, it's about what you build on the way.", credit: "— [PLACEHOLDER]" },
  { type: "image" as const, src: "/images/gallery/bace-digital-marketing.webp", alt: "BACE Africa — Digital Marketing Solutions", year: "2023" },
  { type: "image" as const, src: "/images/gallery/lord-not-my-will-cover.webp", alt: "Lord Not My Will — Loretta Larbi ft Nxon, album art", year: "2024" },
  { type: "text" as const, quote: "Good design is invisible. Great design is unforgettable.", credit: "— [PLACEHOLDER]" },
  { type: "image" as const, src: "/images/gallery/lord-not-my-will-promo.webp", alt: "Lord Not My Will — Coming Soon promo", year: "2024" },
  { type: "image" as const, src: "/images/gallery/loretta-1k-subscribers.webp", alt: "Loretta Larbi — 1K YouTube Subscribers milestone", year: "2024" },
  { type: "image" as const, src: "/images/gallery/resounding-hope.webp", alt: "Freedom Choir Ghana — Resounding Hope Kumasi Edition", year: "2026" },
];


export default function Home() {
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProfile().then(setProfile).catch(console.error);
    getProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <>
      {/* 1. Hero */}
      <Hero profile={profile} />

      {/* 2. Horizontal scroll gallery */}
      <Section theme="dark">
        <HorizontalScroll items={GALLERY_ITEMS} />
      </Section>

      {/* 3. OnOffSplit */}
      <OnOffSplit
        left={{
          label: SITE.splitLeft.label,
          sub: SITE.splitLeft.sub,
          description:
            "From brand identities that communicate before a word is read, to layout systems that hold together across every surface — design is how I make the invisible visible.",
          link: "/work",
          linkLabel: "See the work",
          tags: ["Brand Identity", "Figma", "Illustrator", "Print", "Digital"],
        }}
        right={{
          label: SITE.splitRight.label,
          sub: SITE.splitRight.sub,
          description:
            "Directing, editing, and producing video content that earns attention — from music videos and wedding films to social campaigns that trend at number one.",
          link: "/work",
          linkLabel: "View projects",
          tags: ["Video Production", "Direction", "Social Media", "Editing", "DaVinci"],
        }}
      />

      {/* 4. Featured projects */}
      <Section
        theme="dark"
        style={{ padding: "var(--section-padding) var(--container-padding)" }}
      >
        <div className="container">
          <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "1rem" }}>
            Selected work
          </p>
          <h2 className="text-title-reg-mona" style={{ marginBottom: "3rem" }}>
            Things I'm proud of
          </h2>
          <ProjectGrid projects={projects} limit={3} />
        </div>
      </Section>

      {/* 5. Tool logos marquee — single row, left scroll */}
      <Section
        theme="dark"
        style={{ padding: "4rem 0", borderBlock: "1px solid var(--color--dark-tint-2)" }}
      >
        <p className="text-eyebrow" style={{
          color: "var(--color--grey-2)",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}>
          Tools & Software
        </p>
        <MarqueeRow speed={35} direction="left" pauseOnHover>
          {ALL_TOOL_LOGOS}
        </MarqueeRow>
      </Section>

      {/* 6. Social Insights */}
      <SocialInsightsSection />

      {/* 7. Contact CTA */}
      <ContactBlock />
    </>
  );
}
