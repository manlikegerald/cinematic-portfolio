import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowButton from "@/components/primitives/ArrowButton";

gsap.registerPlugin(ScrollTrigger);

interface Half {
  label: string;
  sub: string;
  description: string;
  link: string;
  linkLabel?: string;
  tags?: string[];
}

interface Props {
  left: Half;
  right: Half;
}

export default function OnOffSplit({ left, right }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useLayoutEffect(() => {
    if (prefersReduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=150%",
        },
      });
      tl.fromTo(leftRef.current,  { xPercent: -100, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none" }, 0)
        .fromTo(rightRef.current, { xPercent:  100, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none" }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section ref={sectionRef} style={{ display: "flex", overflow: "hidden", position: "relative" }}>

      {/* ── LEFT PANEL — dark ── */}
      <div
        ref={leftRef}
        style={{
          flex: 1,
          minHeight: "100svh",
          background: "var(--color--dark)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "var(--section-padding) var(--container-padding)",
          position: "relative",
          overflow: "hidden",
          clipPath: "polygon(0 0, 100% 0, 96% 100%, 0 100%)",
        }}
      >
        {/* Faded background number */}
        <span aria-hidden="true" style={{
          position: "absolute",
          top: "50%",
          right: "-0.1em",
          transform: "translateY(-50%)",
          fontSize: "clamp(12rem, 30vw, 22rem)",
          fontFamily: "var(--font--impact)",
          fontWeight: 900,
          color: "var(--color--off-white)",
          opacity: 0.06,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.04em",
        }}>01</span>

        {/* Accent top bar */}
        <div style={{
          position: "absolute",
          top: "var(--section-padding)",
          left: "var(--container-padding)",
          right: "4%",
          height: 1,
          background: "linear-gradient(90deg, var(--color--accent) 0%, transparent 100%)",
        }} />

        {/* Top label */}
        <div style={{
          position: "absolute",
          top: "var(--section-padding)",
          left: "var(--container-padding)",
          paddingTop: "1.25rem",
        }}>
          <span className="text-eyebrow" style={{ color: "var(--color--accent)", fontSize: "0.85rem", letterSpacing: "0.18em" }}>
            01 / {left.sub}
          </span>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            className="text-impact-reg-mona"
            style={{
              color: "var(--color--white)",
              marginBottom: "1.5rem",
              fontSize: "clamp(4rem, 10vw, 8rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
            }}
          >
            {left.label}
          </h2>

          {/* Accent rule */}
          <div style={{ width: 48, height: 2, background: "var(--color--accent)", marginBottom: "1.5rem" }} />

          <p className="text-body-reg-mona" style={{
            maxWidth: "36ch",
            marginBottom: "2rem",
            color: "var(--color--grey-1)",
            lineHeight: 1.8,
            fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
          }}>
            {left.description}
          </p>

          {left.tags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
              {left.tags.map(t => (
                <span key={t} style={{
                  fontFamily: "var(--font--body)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color--grey-2)",
                  border: "1px solid var(--color--dark-tint-2)",
                  borderRadius: "2rem",
                  padding: "0.3rem 0.75rem",
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          <ArrowButton href={left.link} label={left.linkLabel ?? `View ${left.label}`} />
        </div>
      </div>

      {/* ── RIGHT PANEL — light ── */}
      <div
        ref={rightRef}
        style={{
          flex: 1,
          minHeight: "100svh",
          background: "var(--color--off-white)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "var(--section-padding) var(--container-padding)",
          paddingLeft: "calc(var(--container-padding) + 2%)",
          position: "relative",
          overflow: "hidden",
          clipPath: "polygon(4% 0, 100% 0, 100% 100%, 0 100%)",
          marginLeft: -1,
        }}
      >
        {/* Faded background number */}
        <span aria-hidden="true" style={{
          position: "absolute",
          top: "50%",
          left: "-0.1em",
          transform: "translateY(-50%)",
          fontSize: "clamp(12rem, 30vw, 22rem)",
          fontFamily: "var(--font--impact)",
          fontWeight: 900,
          color: "var(--color--dark)",
          opacity: 0.07,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.04em",
        }}>02</span>

        {/* Accent top bar */}
        <div style={{
          position: "absolute",
          top: "var(--section-padding)",
          left: "4%",
          right: "var(--container-padding)",
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, var(--color--dark) 100%)",
          opacity: 0.15,
        }} />

        {/* Top label */}
        <div style={{
          position: "absolute",
          top: "var(--section-padding)",
          right: "var(--container-padding)",
          paddingTop: "1.25rem",
          textAlign: "right",
        }}>
          <span className="text-eyebrow" style={{ color: "var(--color--grey-2)", fontSize: "0.85rem", letterSpacing: "0.18em", opacity: 0.85 }}>
            02 / {right.sub}
          </span>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            className="text-impact-reg-mona"
            style={{
              color: "var(--color--black)",
              marginBottom: "1.5rem",
              fontSize: "clamp(4rem, 10vw, 8rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
            }}
          >
            {right.label}
          </h2>

          {/* Dark rule */}
          <div style={{ width: 48, height: 2, background: "var(--color--black)", opacity: 0.2, marginBottom: "1.5rem" }} />

          <p className="text-body-reg-mona" style={{
            maxWidth: "36ch",
            marginBottom: "2rem",
            color: "var(--color--grey-2)",
            lineHeight: 1.8,
            fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
          }}>
            {right.description}
          </p>

          {right.tags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
              {right.tags.map(t => (
                <span key={t} style={{
                  fontFamily: "var(--font--body)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color--grey-2)",
                  border: "1px solid",
                  borderColor: "rgba(0,0,0,0.15)",
                  borderRadius: "2rem",
                  padding: "0.3rem 0.75rem",
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          <ArrowButton
            href={right.link}
            label={right.linkLabel ?? `View ${right.label}`}
            style={{ color: "var(--color--black)", borderColor: "var(--color--black)" }}
          />
        </div>
      </div>
    </section>
  );
}
