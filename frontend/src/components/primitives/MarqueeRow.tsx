/**
 * MarqueeRow — pure-CSS infinite horizontal marquee.
 *
 * Replicates landonorris.com's `data-css-marquee` pattern:
 *   - Content is duplicated so it can loop seamlessly.
 *   - A CSS animation drives translateX; JavaScript only modulates the speed
 *     via a CSS variable when scroll velocity spikes (via GSAP ScrollTrigger.getVelocity()).
 *   - Pauses on hover if `pauseOnHover` is true.
 *   - Respects prefers-reduced-motion: no translation, content shown statically.
 */

import { useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  speed?: number;       // base animation duration in seconds (lower = faster)
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function MarqueeRow({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  className,
  style,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Modulate --marquee-speed CSS variable based on scroll velocity
  useEffect(() => {
    if (prefersReduced || !trackRef.current) return;

    // ScrollTrigger.getVelocity() returns pixels/second of the scroll.
    // We map a high-velocity scroll to a shorter animation duration (faster marquee).
    let raf: number;
    const update = () => {
      const velocity = Math.abs(ScrollTrigger.getVelocity?.() ?? 0);
      const boost = Math.min(velocity / 500, 3); // cap at 3× speed boost
      const newSpeed = speed / (1 + boost);
      trackRef.current?.style.setProperty("--marquee-speed", `${newSpeed}s`);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [speed, prefersReduced]);

  const animation: CSSProperties = prefersReduced
    ? {}
    : {
        // @ts-expect-error CSS custom properties
        "--marquee-speed": `${speed}s`,
        animation: `marquee-${direction} var(--marquee-speed, ${speed}s) linear infinite`,
      };

  return (
    <>
      {/* Inject keyframes once into a <style> tag */}
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
      <div
        className={className}
        style={{ overflow: "hidden", ...style }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            width: "max-content",
            willChange: "transform",
            ...(pauseOnHover ? {} : {}),
            ...animation,
          }}
          onMouseEnter={() => {
            if (pauseOnHover && trackRef.current) {
              trackRef.current.style.animationPlayState = "paused";
            }
          }}
          onMouseLeave={() => {
            if (pauseOnHover && trackRef.current) {
              trackRef.current.style.animationPlayState = "running";
            }
          }}
        >
          {/* Duplicate content so the loop is seamless */}
          <div style={{ display: "flex", flexShrink: 0, alignItems: "center" }}>{children}</div>
          <div style={{ display: "flex", flexShrink: 0, alignItems: "center" }} aria-hidden="true">{children}</div>
        </div>
      </div>
    </>
  );
}
