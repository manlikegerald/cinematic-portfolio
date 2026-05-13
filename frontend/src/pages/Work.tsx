import { useEffect, useState } from "react";
import Section from "@/components/sections/Section";
import ProjectGrid from "@/components/sections/ProjectGrid";
import SplitText from "@/components/primitives/SplitText";
import AnimatedBackground from "@/components/primitives/AnimatedBackground";
import { getProjects, type Project } from "@/lib/api";

type Filter = "all" | string;

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter,   setFilter]   = useState<Filter>("all");

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const types = ["all", ...Array.from(new Set(projects.map((p) => p.type)))];
  const visible = filter === "all" ? projects : projects.filter((p) => p.type === filter);

  return (
    <Section
      theme="dark"
      style={{
        paddingTop: "calc(var(--nav-height) + 4rem)",
        paddingBottom: "var(--section-padding)",
        minHeight: "100svh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.08, pointerEvents: "none" }}>
        <AnimatedBackground />
      </div>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "1rem" }}>
          Selected work
        </p>
        <SplitText
          as="h1"
          split="words"
          anim="reveal-clip"
          start="top 95%"
          className="text-impact-reg-brier"
          style={{ marginBottom: "3rem" }}
        >
          All projects.
        </SplitText>

        {/* Filter row */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className="text-eyebrow"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "2rem",
                border: "1px solid",
                borderColor: filter === t ? "var(--color--accent)" : "var(--color--dark-tint-2)",
                color: filter === t ? "var(--color--accent)" : "var(--color--grey-2)",
                cursor: "pointer",
                background: "transparent",
                transition: "all var(--duration-fast) var(--cubic-default)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <ProjectGrid projects={visible} />
      </div>
    </Section>
  );
}
