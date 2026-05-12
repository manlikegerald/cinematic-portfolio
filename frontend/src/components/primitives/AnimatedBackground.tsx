/**
 * AnimatedBackground — topographic contour lines for the Hero.
 *
 * Draws concentric organic closed curves (like a topo map) centred on the
 * viewport. Each band pulses outward in a slow staggered wave via GSAP.
 * Respects prefers-reduced-motion.
 */

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";

interface Harmonic {
  freq: number;
  amp: number;
  phase: number;
}

function buildContour(
  cx: number,
  cy: number,
  baseR: number,
  harmonics: Harmonic[],
  steps = 360
): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    let r = baseR;
    for (const h of harmonics) {
      r += h.amp * Math.sin(h.freq * theta + h.phase);
    }
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ") + " Z";
}

// Seeded pseudo-random so shapes are stable across renders
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Props {
  /** Swap off-white lines → dark, keeping accent. Use on light sections. */
  invert?: boolean;
}

export default function AnimatedBackground({ invert = false }: Props) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const SIZE = 1000;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const COUNT = 14;
  const rStep = (SIZE * 0.46) / COUNT;

  const contours = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: COUNT }, (_, i) => {
      const baseR = rStep * (i + 1);
      const harmonics: Harmonic[] = [
        { freq: 2 + (i % 3),   amp: baseR * (0.04 + rand() * 0.04), phase: rand() * Math.PI * 2 },
        { freq: 3 + (i % 4),   amp: baseR * (0.02 + rand() * 0.03), phase: rand() * Math.PI * 2 },
        { freq: 5 + (i % 2),   amp: baseR * (0.01 + rand() * 0.02), phase: rand() * Math.PI * 2 },
      ];
      const accent = i === 3 || i === 9;
      return {
        d: buildContour(cx, cy, baseR, harmonics),
        accent,
        opacity: accent ? 0.55 : 0.18 + (i / COUNT) * 0.08,
        strokeWidth: accent ? 1.8 : 1.1,
      };
    });
  }, [rStep, cx, cy]);

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      pathRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          scale: 1.06,
          opacity: contours[i].opacity * 1.5,
          transformOrigin: `${cx}px ${cy}px`,
          duration: 5 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.22,
        });
      });
    });

    return () => ctx.revert();
  }, [contours, cx, cy, prefersReduced]);

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {contours.map(({ d, accent, opacity, strokeWidth }, i) => (
        <path
          key={i}
          ref={(el) => { pathRefs.current[i] = el; }}
          d={d}
          fill="none"
          stroke={accent ? "var(--color--accent)" : invert ? "var(--color--dark)" : "var(--color--off-white)"}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      ))}
    </svg>
  );
}
