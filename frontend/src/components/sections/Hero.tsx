import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "@/components/primitives/SplitText";
import AnimatedBackground from "@/components/primitives/AnimatedBackground";
import ArrowButton from "@/components/primitives/ArrowButton";
import SocialIcons from "@/components/primitives/SocialIcons";
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
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: "var(--nav-height)",
      }}
    >
      {/* Mobile styles */}
      <style>{`
        @media (max-width: 640px) {
          .hero-portfolio-label { font-size: 1rem !important; margin-bottom: 1.5rem !important; }
          .hero-tagline { font-size: 0.75rem !important; margin-bottom: 0 !important; }
          .hero-info-row { flex-direction: column !important; gap: 1.25rem !important; margin-top: 2rem !important; align-items: center !important; }
          .hero-info-row > div { width: 100%; max-width: 320px; }
          .hero-arrow { display: none !important; }
        }
      `}</style>

      {/* Layer 1 — solid dark base */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, background: "var(--color--dark)", zIndex: 0 }}
      />

      {/* Layer 2 — vector animation */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <AnimatedBackground />
      </div>

      {/* Layer 3 — optional parallax image */}
      {SITE.heroBackground === "image" && (
        <div
          ref={imageRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-10% 0",
            zIndex: 2,
            backgroundImage: "linear-gradient(135deg, rgba(40,44,32,0.55) 0%, rgba(40,44,32,0.75) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Layer 4 — gradient vignette */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background: "linear-gradient(to top, var(--color--dark) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
        }}
      />

      {/* Layer 5 — content */}
      <div className="container" style={{ position: "relative", zIndex: 4, textAlign: "center" }}>
        <p className="hero-portfolio-label" style={{
          fontFamily: "var(--font--body)",
          fontSize: "1.8rem",
          fontWeight: 800,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "var(--color--off-white)",
          opacity: 0.75,
          marginBottom: "3.5rem",
        }}>
          Portfolio
        </p>

        <SplitText
          as="h1"
          split="words"
          anim="reveal-up"
          stagger={0.06}
          delay={0.2}
          start="top 100%"
          className="text-impact-reg-brier"
          style={{
            color: "var(--color--white)",
            marginBottom: "1.25rem",
            fontStyle: "normal",
            fontSize: "clamp(2.8rem, 12vw, 11rem)",
            lineHeight: 1,
            wordBreak: "break-word",
          }}
        >
          {name}
        </SplitText>

        <p className="text-eyebrow hero-tagline" style={{
          color: "var(--color--accent)",
          marginBottom: "4rem",
          fontSize: "clamp(0.75rem, 1.4vw, 1.1rem)",
        }}>
          {tagline} · Since {SITE.since}
        </p>

        <div className="hero-info-row" style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "3rem",
          flexWrap: "wrap",
          marginTop: "4rem",
        }}>
          <div style={{ borderLeft: "2px solid var(--color--accent)", paddingLeft: "1.25rem", textAlign: "left" }}>
            <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "0.35rem", fontSize: "clamp(0.7rem, 1.1vw, 0.95rem)" }}>
              Currently
            </p>
            <p className="text-body-reg-mona" style={{ color: "var(--color--off-white)", fontSize: "clamp(0.85rem, 1.4vw, 1.15rem)" }}>
              {currently}
            </p>
          </div>
          <div style={{ borderLeft: "2px solid var(--color--dark-tint-2)", paddingLeft: "1.25rem", textAlign: "left" }}>
            <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "0.35rem", fontSize: "clamp(0.7rem, 1.1vw, 0.95rem)" }}>
              Next
            </p>
            <p className="text-body-reg-mona" style={{ color: "var(--color--grey-1)", fontSize: "clamp(0.85rem, 1.4vw, 1.15rem)" }}>
              {next}
            </p>
          </div>
          <div className="hero-arrow" style={{ alignSelf: "center" }}>
            <ArrowButton href="/work" label="View my work" />
          </div>
        </div>
      </div>

      {/* Bottom — social icons pinned to bottom */}
      <div style={{
        position: "absolute",
        bottom: "var(--section-padding)",
        left: 0,
        right: 0,
        zIndex: 4,
        display: "flex",
        justifyContent: "center",
      }}>
        <SocialIcons exclude={["email", "github"]} />
      </div>
    </section>
  );
}
