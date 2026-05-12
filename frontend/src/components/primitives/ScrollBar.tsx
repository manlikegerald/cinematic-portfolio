/**
 * ScrollBar — 2px accent-colored bar on the right edge that fills as you scroll.
 * Mirrors landonorris.com's `.scroll-indicator-bar`.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    const bar = barRef.current;

    // ScrollTrigger scrub drives the height from 0% to 100%
    gsap.to(bar, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 2,
        height: 0,
        background: "var(--color--accent)",
        zIndex: 9999,
        pointerEvents: "none",
        transformOrigin: "top",
      }}
      ref={barRef}
    />
  );
}
