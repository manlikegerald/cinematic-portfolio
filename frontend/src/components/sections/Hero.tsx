/**
 * Hero — full-viewport cinematic opening section.
 *
 * Background modes (set SITE.heroBackground in config/site.ts):
 *   "image"  — high-res cover photo with subtle parallax (default)
 *   "solid"  — plain dark background
 *   "shader" — placeholder for future WebGL noise (shows solid for now)
 *
 * Name animates in via SplitText on mount. The "Currently / Next" card
 * mirrors Lando's "Next Race" card widget.
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "@/components/primitives/SplitText";
import ArrowButton from "@/components/primitives/ArrowButton";
import { SITE } from "@/config/site";
import type { Profile } from "@/lib/api";

interface Props {
  profile: Profile | null;
}

export default function Hero({ profile }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);

  // Subtle parallax on background image using ScrollTrigger scrub
  useLayoutEffect(() => {
    if (!imageRef.current || SITE.heroBackground !== "image") return;
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const name    = profile?.name    ?? SITE.name;
  const tagline = profile?.tagline ?? SITE.tagline;
  const currently = profile?.currently ?? SITE.currently;
  const next      = profile?.next      ?? SITE.next;

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      style={{
        position: "relative",
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        paddingBottom: "var(--section-padding)",
      }}
    >
      {/* Background */}
      {SITE.heroBackground === "image" && (
        <div
          ref={imageRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-10% 0",
            background:
              "linear-gradient(135deg, var(--color--dark-tint-1) 0%, var(--color--dark) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Dark gradient overlay so text reads over the image */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, var(--color--dark) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <p className="text-eyebrow" style={{ color: "var(--color--accent)", marginBottom: "1rem" }}>
          {tagline} · Since {SITE.since}
        </p>

        {/* Name — SplitText animates in on load */}
        <SplitText
          as="h1"
          split="words"
          anim="reveal-up"
          stagger={0.06}
          delay={0.2}
          start="top 100%"
          className="text-impact-reg-brier"
          style={{ color: "var(--color--white)", marginBottom: "2.5rem" }}
        >
          {name}
        </SplitText>

        {/* Currently / Next card — mirrors Lando's "Next Race" widget */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              borderLeft: "2px solid var(--color--accent)",
              paddingLeft: "1rem",
            }}
          >
            <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "0.25rem" }}>
              Currently
            </p>
            <p className="text-body-reg-mona" style={{ color: "var(--color--off-white)" }}>
              {currently}
            </p>
          </div>
          <div
            style={{
              borderLeft: "2px solid var(--color--dark-tint-2)",
              paddingLeft: "1rem",
            }}
          >
            <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "0.25rem" }}>
              Next
            </p>
            <p className="text-body-reg-mona" style={{ color: "var(--color--grey-1)" }}>
              {next}
            </p>
          </div>

          <ArrowButton
            href="/work"
            label="View my work"
            style={{ marginLeft: "auto", alignSelf: "center" }}
          />
        </div>
      </div>
    </section>
  );
}
