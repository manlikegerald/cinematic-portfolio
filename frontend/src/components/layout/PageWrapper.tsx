import { type ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

interface Props {
  children: ReactNode;
}

// Wraps every page. Manages the full-screen accent-panel page transition.
// On route change: accent panel sweeps in from bottom → pauses 50ms → sweeps out top,
// revealing the new page underneath. Uses --cubic-default easing (~700ms total).
export default function PageWrapper({ children }: Props) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !curtainRef.current) return;

    const curtain = curtainRef.current;

    const tl = gsap.timeline();
    // Sweep in from bottom
    tl.fromTo(
      curtain,
      { yPercent: 100, display: "block" },
      { yPercent: 0, duration: 0.35, ease: "cubic-default" }
    )
      // Hold for one frame then sweep out top
      .to(curtain, {
        yPercent: -100,
        duration: 0.35,
        ease: "cubic-default",
        delay: 0.05,
        onComplete: () => gsap.set(curtain, { display: "none" }),
      });
  }, [location.pathname]);

  return (
    <>
      {/* Full-screen page-transition curtain */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--color--accent)",
          zIndex: 9990,
          display: "none",
          pointerEvents: "none",
        }}
      />
      {children}
    </>
  );
}
