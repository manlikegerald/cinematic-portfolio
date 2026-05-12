/**
 * ProjectGrid — 3-up card grid with clip-path reveal on scroll.
 * Used on Home (featured 3) and Work page (full filterable list).
 */

import { useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowButton from "@/components/primitives/ArrowButton";
import type { Project } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  projects: Project[];
  limit?: number;   // cap for "featured" view
}

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLLIElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);

  // Clip-path reveal on scroll
  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.fromTo(
      cardRef.current,
      { clipPath: "inset(100% 0 0 0)", opacity: 0 },
      {
        clipPath: "inset(0% 0 0 0)",
        opacity: 1,
        duration: 0.75,
        ease: "cubic-default",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <li ref={cardRef} style={{ listStyle: "none" }}>
      <Link
        to={`/work/${project.slug}`}
        style={{ display: "block", textDecoration: "none" }}
        aria-label={`View ${project.title}`}
      >
        {/* Cover image with hover scale */}
        <div
          ref={imgRef}
          style={{
            overflow: "hidden",
            borderRadius: "var(--radius-lg)",
            marginBottom: "1.25rem",
            aspectRatio: "4/3",
            background: "var(--color--dark-tint-1)",
          }}
        >
          {project.cover ? (
            <img
              src={project.cover}
              alt={project.title}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform var(--duration-slow) var(--cubic-default)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
          ) : (
            <svg width="100%" height="100%" viewBox="0 0 400 300">
              <rect width="400" height="300" fill="var(--color--dark-tint-2)" />
              <text x="200" y="155" textAnchor="middle" fontSize="13" fill="var(--color--grey-2)" fontFamily="var(--font--body)">
                [PLACEHOLDER] {project.title}
              </text>
            </svg>
          )}
        </div>

        {/* Meta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
          <div>
            <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "0.4rem" }}>
              {project.type} · {project.year}
            </p>
            <h3 className="text-title-reg-mona" style={{ color: "var(--color--off-white)" }}>
              {project.title}
            </h3>
            <p className="text-body-reg-mona" style={{ color: "var(--color--grey-2)", marginTop: "0.4rem", fontSize: "0.875rem" }}>
              {project.summary}
            </p>
          </div>
          <ArrowButton
            href={`/work/${project.slug}`}
            label={`View ${project.title}`}
            size={40}
          />
        </div>
      </Link>
    </li>
  );
}

export default function ProjectGrid({ projects, limit }: Props) {
  const visible = limit ? projects.slice(0, limit) : projects;

  return (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
        gap: "2.5rem",
        padding: 0,
      }}
    >
      {visible.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </ul>
  );
}
