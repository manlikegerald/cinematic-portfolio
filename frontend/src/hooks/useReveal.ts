import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Returns a ref to attach to any element you want to fade/slide in on scroll.
// Respects prefers-reduced-motion: skips the tween and just shows the element.
export function useReveal(options?: {
  y?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useLayoutEffect(() => {
    if (!ref.current || prefersReduced) return;

    const el = ref.current;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: options?.y ?? 40 },
      {
        opacity: 1,
        y: 0,
        duration: options?.duration ?? 0.75,
        delay: options?.delay ?? 0,
        ease: "cubic-default",
        scrollTrigger: {
          trigger: el,
          start: options?.start ?? "top 88%",
          once: true,
        },
      }
    );

    return () => { tween.kill(); };
  }, []);

  return ref;
}
