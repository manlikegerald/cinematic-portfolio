import { useEffect, useRef, createContext, useContext, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Register a custom GSAP easing that matches our CSS --cubic-default token.
// GSAP components can reference it as ease: "cubic-default".
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(gsap as any).registerEase("cubic-default", "M0,0 C0.65,0.05 0,1 1,1");

const LenisContext = createContext<Lenis | null>(null);

// Hook to grab the Lenis instance from any child (e.g. ArrowButton "back to top").
export const useLenis = () => useContext(LenisContext);

interface Props {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Don't init Lenis for users who prefer reduced motion — browser native scroll only.
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // ── Sync Lenis with GSAP's ticker so ScrollTrigger uses Lenis positions ──
    // This is the canonical recipe from the Lenis docs + GSAP forums.
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
