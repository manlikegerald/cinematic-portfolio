/**
 * OnOffSplit — dual-column sticky reveal section.
 *
 * Mirrors landonorris.com's "ON TRACK / OFF TRACK" (`data-otot-section`) section.
 * Left column slides in from the left, right column from the right, as the section
 * pins and the two halves meet in the middle.
 *
 * Props are fully configurable — rename BUILD/SHARE to anything.
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowButton from "@/components/primitives/ArrowButton";

gsap.registerPlugin(ScrollTrigger);

interface Half {
  label: string;     // big display text e.g. "BUILD"
  sub: string;       // subtitle e.g. "Design & Engineering"
  description: string;
  link: string;
  linkLabel?: string;
  theme?: "dark" | "light";
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

      // Slide both columns in from offscreen
      tl.fromTo(leftRef.current,  { xPercent: -100, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none" }, 0)
        .fromTo(rightRef.current, { xPercent: 100,  opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none" }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  const halfStyle = (bg: string, fg: string): React.CSSProperties => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "var(--section-padding) var(--container-padding)",
    background: bg,
    color: fg,
    minHeight: "100svh",
    overflow: "hidden",
  });

  return (
    <section
      ref={sectionRef}
      style={{ display: "flex", overflow: "hidden" }}
    >
      {/* Left half */}
      <div ref={leftRef} style={halfStyle("var(--color--dark)", "var(--color--off-white)")}>
        <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "1rem" }}>
          {left.sub}
        </p>
        <h2
          className="text-impact-reg-mona"
          style={{ marginBottom: "1.5rem", color: "var(--color--white)" }}
        >
          {left.label}
        </h2>
        <p className="text-body-reg-mona" style={{ maxWidth: "38ch", marginBottom: "2rem", color: "var(--color--grey-1)" }}>
          {left.description}
        </p>
        <ArrowButton href={left.link} label={left.linkLabel ?? `View ${left.label}`} />
      </div>

      {/* Divider line */}
      <div
        aria-hidden="true"
        style={{ width: 1, background: "var(--color--dark-tint-2)", flexShrink: 0 }}
      />

      {/* Right half */}
      <div ref={rightRef} style={halfStyle("var(--color--off-white)", "var(--color--black)")}>
        <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "1rem" }}>
          {right.sub}
        </p>
        <h2
          className="text-impact-reg-brier"
          style={{ marginBottom: "1.5rem", color: "var(--color--black)", fontStyle: "normal" }}
        >
          {right.label}
        </h2>
        <p className="text-body-reg-mona" style={{ maxWidth: "38ch", marginBottom: "2rem", color: "var(--color--grey-2)" }}>
          {right.description}
        </p>
        <ArrowButton
          href={right.link}
          label={right.linkLabel ?? `View ${right.label}`}
          style={{ color: "var(--color--black)", borderColor: "var(--color--black)" }}
        />
      </div>
    </section>
  );
}
