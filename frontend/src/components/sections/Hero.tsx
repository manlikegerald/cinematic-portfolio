import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "@/components/primitives/SplitText";
import AnimatedBackground from "@/components/primitives/AnimatedBackground";
import ArrowButton from "@/components/primitives/ArrowButton";
import { SITE } from "@/config/site";
import type { Profile } from "@/lib/api";

interface Props {
  profile: Profile | null;
}

export default function Hero({ profile }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);

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

  const name      = profile?.name      ?? SITE.name;
  const tagline   = profile?.tagline   ?? SITE.tagline;
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
      {/* Layer 1 — solid dark base */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--color--dark)",
          zIndex: 0,
        }}
      />

      {/* Layer 2 — vector animation on top of base */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <AnimatedBackground />
      </div>

      {/* Layer 3 — optional parallax image (blends over animation) */}
      {SITE.heroBackground === "image" && (
        <div
          ref={imageRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-10% 0",
            zIndex: 2,
            backgroundImage:
              "linear-gradient(135deg, rgba(40,44,32,0.55) 0%, rgba(40,44,32,0.75) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Layer 4 — gradient vignette so text stays readable */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background:
            "linear-gradient(to top, var(--color--dark) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
        }}
      />

      {/* Layer 5 — content */}
      <div className="container" style={{ position: "relative", zIndex: 4 }}>
        <p className="text-eyebrow" style={{ color: "var(--color--accent)", marginBottom: "1rem" }}>
          {tagline} · Since {SITE.since}
        </p>

        <SplitText
          as="h1"
          split="words"
          anim="reveal-up"
          stagger={0.06}
          delay={0.2}
          start="top 100%"
          className="text-impact-reg-brier"
          style={{ color: "var(--color--white)", marginBottom: "2.5rem", fontStyle: "normal" }}
        >
          {name}
        </SplitText>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ borderLeft: "2px solid var(--color--accent)", paddingLeft: "1rem" }}>
            <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "0.25rem" }}>
              Currently
            </p>
            <p className="text-body-reg-mona" style={{ color: "var(--color--off-white)" }}>
              {currently}
            </p>
          </div>
          <div style={{ borderLeft: "2px solid var(--color--dark-tint-2)", paddingLeft: "1rem" }}>
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
