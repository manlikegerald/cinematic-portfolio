import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { adminApi } from "@/lib/adminApi";

interface Stat {
  label: string;
  value: number;
  link: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getProjects(), adminApi.getTimeline(), adminApi.getProfile()])
      .then(([projects, timeline]) => {
        setStats([
          { label: "Projects", value: projects.length, link: "/admin/projects" },
          { label: "Timeline Entries", value: timeline.length, link: "/admin/timeline" },
        ]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "#f5f0e8",
          marginBottom: "0.4rem",
        }}
      >
        Dashboard
      </h1>
      <p style={{ color: "#555", fontSize: "0.88rem", marginBottom: "2rem" }}>
        Overview of your portfolio content.
      </p>

      {loading ? (
        <p style={{ color: "#444" }}>Loading…</p>
      ) : (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {stats.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.link)}
              style={{
                flex: "1 1 160px",
                padding: "1.5rem",
                background: "#141414",
                border: "1px solid #222",
                borderRadius: 8,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#f5f0e8",
                  marginBottom: "0.3rem",
                }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {s.label}
              </p>
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {[
          { label: "Add Project", path: "/admin/projects/new" },
          { label: "Add Timeline Entry", path: "/admin/timeline/new" },
          { label: "Edit Profile", path: "/admin/profile" },
        ].map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              padding: "0.65rem 1.2rem",
              background: "#f5f0e8",
              color: "#0a0a0a",
              border: "none",
              borderRadius: 4,
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </AdminLayout>
  );
}
