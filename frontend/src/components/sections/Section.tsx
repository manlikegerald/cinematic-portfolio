/**
 * Section — generic wrapper that sets data-theme on <html> as it scrolls into view.
 *
 * Mirrors landonorris.com's `data-gl-change-from` / `data-gl-change-to` pattern.
 * A ScrollTrigger fires on enter AND leave (reverse direction) so theme tracks scroll.
 */

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Theme = "dark" | "light" | "accent";

interface Props {
  children: ReactNode;
  theme?: Theme;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export default function Section({
  children,
  theme = "dark",
  id,
  className,
  style,
  as: Tag = "section",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    // ScrollTrigger fires when 40% of the section enters the viewport
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => {
        document.documentElement.dataset.theme = theme;
      },
      onEnterBack: () => {
        document.documentElement.dataset.theme = theme;
      },
    });

    return () => trigger.kill();
  }, [theme]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
}
