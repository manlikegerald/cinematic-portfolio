/**
 * HorizontalScroll — sticky horizontal photo gallery driven by vertical scroll.
 *
 * GSAP ScrollTrigger pins the section, then translates the inner track
 * leftward as the user scrolls down. Each image has its own small parallax.
 *
 * Degrades to a normal horizontal flex scroll on touch / reduced-motion.
 */

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GalleryItem {
  type: "image" | "text";
  src?: string;
  alt?: string;
  year?: string;
  quote?: string;
  credit?: string;
}

interface Props {
  items: GalleryItem[];
}

// Placeholder solid-color SVG image
function PlaceholderImage({ label }: { label: string }) {
  return (
    <svg
      width="360"
      height="480"
      viewBox="0 0 360 480"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <rect width="360" height="480" fill="var(--color--dark-tint-1)" />
      <text
        x="180"
        y="250"
        textAnchor="middle"
        fontSize="14"
        fill="var(--color--grey-2)"
        fontFamily="var(--font--body)"
      >
        {label}
      </text>
    </svg>
  );
}

export default function HorizontalScroll({ items }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useLayoutEffect(() => {
    if (prefersReduced || !sectionRef.current || !trackRef.current) return;

    const section = sectionRef.current;
    const track   = trackRef.current;

    const ctx = gsap.context(() => {
      // Pin the section and scrub the track horizontally
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true, // recalculate on resize
        },
      });

      // Per-image parallax (small Y offset, each image moves at a different rate)
      track.querySelectorAll<HTMLElement>(".h-scroll__item--image").forEach((img, i) => {
        gsap.fromTo(
          img,
          { y: i % 2 === 0 ? -30 : 30 }, // alternate above/below
          {
            y: i % 2 === 0 ? 30 : -30,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${track.scrollWidth - window.innerWidth}`,
              scrub: 1.5,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [items, prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      style={{
        overflow: prefersReduced ? "auto" : "hidden",
        background: "var(--color--dark)",
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          padding: "6rem 4rem",
          width: "max-content",
          cursor: prefersReduced ? "auto" : "grab",
        }}
      >
        {items.map((item, i) =>
          item.type === "text" ? (
            // Text callout card — principles / quotes
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: "clamp(260px, 22vw, 360px)",
                padding: "3rem 2rem",
                border: "1px solid var(--color--dark-tint-2)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                minHeight: "400px",
              }}
            >
              <p
                className="text-impact-reg-brier"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", fontStyle: "normal", marginBottom: "1rem" }}
              >
                "{item.quote}"
              </p>
              {item.credit && (
                <p className="text-eyebrow" style={{ color: "var(--color--grey-2)" }}>
                  {item.credit}
                </p>
              )}
            </div>
          ) : (
            // Image card
            <div
              key={i}
              className="h-scroll__item--image"
              style={{
                flexShrink: 0,
                width: "clamp(260px, 22vw, 360px)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.alt ?? ""}
                  loading="lazy"
                  style={{ width: "100%", display: "block", objectFit: "contain" }}
                />
              ) : (
                <PlaceholderImage label={item.alt ?? `[PLACEHOLDER] Image ${i + 1}`} />
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}
