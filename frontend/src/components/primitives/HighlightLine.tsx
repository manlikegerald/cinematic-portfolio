/**
 * HighlightLine — accent-color block that wipes across text on scroll or hover.
 *
 * Replicates landonorris.com's `.high-line-reveal` effect:
 *   1. An absolutely-positioned accent block starts at scaleX(0), origin RIGHT.
 *   2. It scales to scaleX(1) (covering the text).
 *   3. transform-origin flips to LEFT, then scales back to 0 (revealing the text below).
 *
 * Trigger options: "scroll" (ScrollTrigger) or "hover".
 */

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  trigger?: "scroll" | "hover";
  duration?: number;
  start?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function HighlightLine({
  children,
  trigger = "scroll",
  duration = 0.45,
  start = "top 90%",
  style,
  className,
}: Props) {
  const wrapRef  = useRef<HTMLSpanElement>(null);
  const blockRef = useRef<HTMLSpanElement>(null);

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useLayoutEffect(() => {
    if (!wrapRef.current || !blockRef.current || prefersReduced) return;

    const block = blockRef.current;

    // Build the two-phase tween: wipe in → flip origin → wipe out
    const buildTween = () =>
      gsap
        .timeline({ paused: true })
        // Phase 1: scaleX 0→1, origin from right
        .fromTo(
          block,
          { scaleX: 0, transformOrigin: "right" },
          { scaleX: 1, duration, ease: "cubic-default" }
        )
        // Phase 2: flip origin, scaleX 1→0
        .to(block, {
          scaleX: 0,
          transformOrigin: "left",
          duration,
          ease: "cubic-default",
        });

    if (trigger === "scroll") {
      const tl = buildTween();
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start,
        once: true,
        onEnter: () => tl.play(),
      });
    } else {
      // Hover mode — play forward on enter, reverse on leave
      const tl = buildTween();
      const el = wrapRef.current;
      const enter = () => tl.restart();
      const leave = () => tl.reverse();
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      };
    }
  }, [trigger, duration, start]);

  return (
    <span
      ref={wrapRef}
      className={className}
      style={{ position: "relative", display: "inline-block", ...style }}
    >
      {children}
      {/* The accent block sits on top; mix-blend-mode lets text show through */}
      <span
        ref={blockRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--color--accent)",
          transformOrigin: "right",
          transform: "scaleX(0)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
    </span>
  );
}
