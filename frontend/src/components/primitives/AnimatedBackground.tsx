/**
 * AnimatedBackground — GSAP-driven SVG vector animation for the Hero.
 *
 * Draws a field of:
 *   - Slow-drifting geometric rings (accent + white, low opacity)
 *   - A fine grid of dots that pulse in staggered waves
 *   - Two diagonal accent lines that trace across the canvas
 *   - Floating triangles that rotate and drift
 *
 * Everything is driven by GSAP timelines so it respects
 * prefers-reduced-motion (all animation is skipped).
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (prefersReduced || !svgRef.current) return;

    const ctx = gsap.context(() => {
      // ── Rings: slow breathe (scale + opacity) ──────────────────────
      gsap.utils.toArray<SVGCircleElement>(".bg-ring").forEach((ring, i) => {
        gsap.to(ring, {
          scale: 1.22,
          opacity: 0.85,
          duration: 4 + i * 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.7,
          transformOrigin: "center center",
        });
      });

      // ── Dots: staggered opacity pulse ──────────────────────────────
      gsap.to(".bg-dot", {
        opacity: 0.35,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 6,
          from: "random",
        },
      });

      // ── Accent lines: draw across then fade ────────────────────────
      gsap.utils.toArray<SVGLineElement>(".bg-line").forEach((line, i) => {
        const length = 1200;
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 6 + i * 2,
          repeat: -1,
          ease: "none",
          delay: i * 3,
        });
      });

      // ── Triangles: slow float + rotation ───────────────────────────
      gsap.utils.toArray<SVGPolygonElement>(".bg-triangle").forEach((tri, i) => {
        gsap.to(tri, {
          y: i % 2 === 0 ? -40 : 40,
          rotation: i % 2 === 0 ? 120 : -120,
          opacity: 0.04,
          duration: 10 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 1.5,
          transformOrigin: "center center",
        });
      });

      // ── Large background circle: very slow drift ───────────────────
      gsap.to(".bg-hero-circle", {
        x: 60,
        y: -40,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, svgRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  // Build dot grid (8 cols × 6 rows)
  const dots: { cx: number; cy: number }[] = [];
  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 6; row++) {
      dots.push({
        cx: 80 + col * 160,
        cy: 120 + row * 140,
      });
    }
  }

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* ── Large drifting background circle ── */}
      <circle
        className="bg-hero-circle"
        cx="1100"
        cy="200"
        r="420"
        fill="none"
        stroke="var(--color--accent)"
        strokeWidth="2.5"
        opacity="0.35"
      />

      {/* ── Rings ── */}
      {[
        { cx: 200,  cy: 700, r: 280 },
        { cx: 900,  cy: 450, r: 180 },
        { cx: 1300, cy: 750, r: 220 },
        { cx: 500,  cy: 150, r: 140 },
      ].map((ring, i) => (
        <circle
          key={i}
          className="bg-ring"
          cx={ring.cx}
          cy={ring.cy}
          r={ring.r}
          fill="none"
          stroke={i % 2 === 0 ? "var(--color--accent)" : "var(--color--white)"}
          strokeWidth="2"
          opacity="0.55"
        />
      ))}

      {/* ── Dot grid ── */}
      {dots.map((d, i) => (
        <circle
          key={i}
          className="bg-dot"
          cx={d.cx}
          cy={d.cy}
          r="1.5"
          fill="var(--color--grey-1)"
          opacity="0.12"
        />
      ))}

      {/* ── Diagonal accent lines ── */}
      <line
        className="bg-line"
        x1="0" y1="900" x2="1440" y2="0"
        stroke="var(--color--accent)"
        strokeWidth="0.5"
        opacity="0.12"
      />
      <line
        className="bg-line"
        x1="300" y1="900" x2="1440" y2="200"
        stroke="var(--color--white)"
        strokeWidth="0.5"
        opacity="0.06"
      />

      {/* ── Floating triangles ── */}
      {[
        { points: "120,800 160,730 80,730",  opacity: 0.06 },
        { points: "1300,100 1340,40 1260,40", opacity: 0.05 },
        { points: "700,820 730,770 670,770",  opacity: 0.07 },
        { points: "1100,600 1140,540 1060,540", opacity: 0.04 },
      ].map((tri, i) => (
        <polygon
          key={i}
          className="bg-triangle"
          points={tri.points}
          fill="none"
          stroke="var(--color--accent)"
          strokeWidth="1"
          opacity={tri.opacity}
        />
      ))}

      {/* ── Small cross / plus marks ── */}
      {[
        { x: 380, y: 300 },
        { x: 1050, y: 680 },
        { x: 640,  y: 820 },
      ].map((pos, i) => (
        <g key={i} opacity="0.1" stroke="var(--color--grey-1)" strokeWidth="1">
          <line x1={pos.x - 8} y1={pos.y} x2={pos.x + 8} y2={pos.y} />
          <line x1={pos.x} y1={pos.y - 8} x2={pos.x} y2={pos.y + 8} />
        </g>
      ))}
    </svg>
  );
}
