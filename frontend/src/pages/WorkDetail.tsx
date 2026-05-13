import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "@/components/primitives/SplitText";
import ArrowButton from "@/components/primitives/ArrowButton";
import VideoPlayer from "@/components/primitives/VideoPlayer";
import { getProject, getProjects, type Project } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject]   = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    getProject(slug).then(setProject).catch(console.error);
    getProjects().then(setProjects).catch(console.error);
    window.scrollTo(0, 0);
  }, [slug]);

  // Parallax on cover image
  useEffect(() => {
    if (!coverRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(coverRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: coverRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <div style={{ paddingTop: "calc(var(--nav-height) + 4rem)", padding: "8rem 2rem", textAlign: "center" }}>
        <p className="text-body-reg-mona" style={{ color: "var(--color--grey-2)" }}>Loading…</p>
      </div>
    );
  }

  // Next project for auto-pagination
  const idx  = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article data-theme="dark" style={{ paddingTop: "var(--nav-height)" }}>
      {/* Hero */}
      <section style={{ padding: "4rem var(--container-padding) 3rem" }}>
        <div className="container">
          <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "1.25rem" }}>
            {project.type} · {project.year} · {project.role}
          </p>
          <SplitText
            as="h1"
            split="words"
            anim="reveal-clip"
            start="top 95%"
            className="text-impact-reg-brier"
            style={{ marginBottom: "2rem" }}
          >
            {project.title}
          </SplitText>

          {/* Tags */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-eyebrow"
                style={{
                  padding: "0.25rem 0.75rem",
                  border: "1px solid var(--color--dark-tint-2)",
                  borderRadius: "2rem",
                  color: "var(--color--grey-2)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Full-bleed cover with parallax */}
      <div
        ref={coverRef}
        style={{
          overflow: "hidden",
          aspectRatio: "16/9",
          background: "var(--color--dark-tint-1)",
          marginBottom: "4rem",
        }}
      >
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 1600 900">
            <rect width="1600" height="900" fill="var(--color--dark-tint-1)" />
            <text x="800" y="460" textAnchor="middle" fontSize="18" fill="var(--color--grey-2)" fontFamily="var(--font--body)">
              [PLACEHOLDER] Cover image for {project.title}
            </text>
          </svg>
        )}
      </div>

      {/* Rich content body */}
      <div className="container" style={{ maxWidth: "800px", marginBottom: "4rem" }}>
        {project.content.map((block, i) => {
          if (block.type === "paragraph") {
            return (
              <p key={i} className="text-body-reg-mona" style={{ marginBottom: "1.5rem", color: "var(--color--off-white)" }}>
                {block.value}
              </p>
            );
          }
          if (block.type === "image") {
            return (
              <figure key={i} style={{ marginBottom: "2rem" }}>
                <img src={block.src} alt={block.caption ?? ""} style={{ width: "100%", borderRadius: "var(--radius-md)" }} />
                {block.caption && (
                  <figcaption className="text-eyebrow" style={{ marginTop: "0.5rem", color: "var(--color--grey-2)" }}>
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          return null;
        })}

        {/* Video player — after description, constrained to content width */}
        {project.video_url && (
          <div style={{ marginTop: "3rem", marginBottom: "2rem", maxWidth: 560 }}>
            <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "1rem" }}>
              Watch
            </p>
            <VideoPlayer
              url={project.video_url}
              poster={project.cover || undefined}
              title={project.title}
            />
          </div>
        )}

        {/* External links */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "3rem", flexWrap: "wrap" }}>
          {project.link_live && (
            <a href={project.link_live} target="_blank" rel="noopener noreferrer">
              <ArrowButton label="View live" />
            </a>
          )}
          {project.link_repo && (
            <a href={project.link_repo} target="_blank" rel="noopener noreferrer">
              <ArrowButton label="Source code" />
            </a>
          )}
        </div>
      </div>

      {/* Next project */}
      {next && (
        <section
          style={{
            borderTop: "1px solid var(--color--dark-tint-2)",
            padding: "3rem var(--container-padding)",
          }}
        >
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "0.5rem" }}>
                Next project
              </p>
              <Link
                to={`/work/${next.slug}`}
                className="text-title-reg-mona"
                style={{ color: "var(--color--off-white)" }}
              >
                {next.title}
              </Link>
            </div>
            <ArrowButton href={`/work/${next.slug}`} label={`View ${next.title}`} />
          </div>
        </section>
      )}
    </article>
  );
}
