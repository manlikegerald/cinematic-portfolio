/**
 * SplitText — line/char splitting with scroll-triggered reveal.
 *
 * Uses `splitting.js` (free, no GSAP club required) to split the text into
 * individual <span class="char"> and wraps each line in <span class="line">.
 *
 * Animation variants:
 *   reveal-clip  — clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)  (Lando default)
 *   reveal-up    — translateY(100%) → 0, clipped by .line overflow:hidden
 *   chars-stagger — per-char cascade fade+slide
 *
 * All variants skip animations if prefers-reduced-motion is active.
 */

import {
  useEffect,
  useRef,
  createElement,
  type ElementType,
  type ReactNode,
} from "react";
import Splitting from "splitting";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { THEME } from "@/config/theme";

gsap.registerPlugin(ScrollTrigger);

type Variant = "reveal-clip" | "reveal-up" | "chars-stagger";

interface Props {
  as?: ElementType;
  split?: "lines" | "chars" | "words";
  anim?: Variant;
  stagger?: number;   // seconds between items
  duration?: number;  // override per-instance
  delay?: number;
  start?: string;     // ScrollTrigger start position
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function SplitText({
  as: Tag = "p",
  split = "lines",
  anim = "reveal-clip",
  stagger,
  duration,
  delay = 0,
  start = "top 88%",
  children,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const dur = (duration ?? 0.75) * THEME.animIntensity;
  const stag = stagger ?? (split === "chars" ? 0.03 : 0.06);

  useEffect(() => {
    if (!ref.current || prefersReduced) return;

    // Splitting.js splits text into chars; we derive lines ourselves.
    const result = Splitting({ target: ref.current, by: "chars" });
    const chars = result[0]?.chars ?? [];
    const words = result[0]?.words ?? [];

    let targets: Element[];

    if (split === "chars") {
      targets = chars;
    } else if (split === "words") {
      targets = words;
    } else {
      // For "lines" we use words as the unit (Splitting doesn't give lines).
      // Wrap each word's parent line in overflow:hidden for the clip effect.
      targets = words;
    }

    // Wrap parent for overflow:hidden clipping (needed for reveal-up)
    if (anim === "reveal-up") {
      words.forEach((w) => {
        const parent = w.parentElement as HTMLElement;
        if (parent) parent.style.overflow = "hidden";
      });
    }

    let fromVars: gsap.TweenVars;
    let toVars: gsap.TweenVars;

    switch (anim) {
      case "reveal-clip":
        // Animate clip-path from right-masked to fully visible.
        // Each word/char is treated as its own clipped unit.
        fromVars = { clipPath: "inset(0 100% 0 0)" };
        toVars   = { clipPath: "inset(0 0% 0 0)", duration: dur, stagger: stag, ease: "cubic-default", delay };
        break;

      case "reveal-up":
        // Characters slide up from below, clipped by their parent overflow:hidden.
        fromVars = { y: "110%", opacity: 0 };
        toVars   = { y: "0%", opacity: 1, duration: dur, stagger: stag, ease: "cubic-default", delay };
        break;

      case "chars-stagger":
      default:
        fromVars = { opacity: 0, y: 20 };
        toVars   = { opacity: 1, y: 0, duration: dur * 0.6, stagger: stag, ease: "cubic-default", delay };
        break;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, fromVars, {
        ...toVars,
        scrollTrigger: {
          trigger: ref.current!,
          start,
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return createElement(Tag, { ref, className, style }, children);
}
