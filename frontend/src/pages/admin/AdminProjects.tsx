import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { adminApi, type Project } from "@/lib/adminApi";

export default function AdminProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load() {
    try {
      setProjects(await adminApi.getProjects());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#f5f0e8", marginBottom: "0.25rem" }}>
            Projects
          </h1>
          <p style={{ color: "#555", fontSize: "0.88rem" }}>{projects.length} total</p>
        </div>
        <button
          onClick={() => navigate("/admin/projects/new")}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#f5f0e8",
            color: "#0a0a0a",
            border: "none",
            borderRadius: 4,
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Project
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#444" }}>Loading…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {projects.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                background: "#141414",
                border: "1px solid #1e1e1e",
                borderRadius: 6,
              }}
            >
              {p.cover && (
                <img
                  src={p.cover}
                  alt=""
                  style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 3, flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "#f5f0e8", marginBottom: "0.15rem" }}>
                  {p.title}
                </p>
                <p style={{ fontSize: "0.78rem", color: "#555" }}>
                  {p.year} · {p.type} · /{p.slug}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button
                  onClick={() => navigate(`/admin/projects/${p.id}`)}
                  style={ghostBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  disabled={deleting === p.id}
                  style={{ ...ghostBtn, color: "#e74c3c", borderColor: "#3a1a1a" }}
                >
                  {deleting === p.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p style={{ color: "#444", textAlign: "center", padding: "3rem" }}>
              No projects yet. Add your first one!
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

const ghostBtn: React.CSSProperties = {
  padding: "0.4rem 0.8rem",
  background: "none",
  border: "1px solid #2a2a2a",
  borderRadius: 4,
  color: "#888",
  fontSize: "0.8rem",
  cursor: "pointer",
};
