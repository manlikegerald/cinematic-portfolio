import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { adminApi, type Project, type ProjectIn } from "@/lib/adminApi";

const PROJECT_TYPES = ["Social Media", "Production", "Video", "Brand", "Web", "Design Systems"];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function contentToText(content: { type: string; value?: string }[]): string {
  return content.filter((c) => c.type === "paragraph").map((c) => c.value ?? "").join("\n\n");
}

function textToContent(text: string): { type: string; value: string }[] {
  return text
    .split(/\n\n+/)
    .map((v) => v.trim())
    .filter(Boolean)
    .map((value) => ({ type: "paragraph", value }));
}

const blank: ProjectIn = {
  slug: "", title: "", year: new Date().getFullYear(),
  type: PROJECT_TYPES[0], role: "", summary: "",
  cover: "", gallery: [], content: [], tags: [],
  link_live: null, link_repo: null, video_url: null,
};

export default function AdminProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<ProjectIn & { _contentText: string; _tagsText: string }>({
    ...blank,
    _contentText: "",
    _tagsText: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    adminApi
      .getProjects()
      .then((projects) => {
        const project = projects.find((p) => p.id === Number(id));
        if (!project) { navigate("/admin/projects"); return; }
        setForm({
          slug: project.slug,
          title: project.title,
          year: project.year,
          type: project.type,
          role: project.role,
          summary: project.summary,
          cover: project.cover,
          gallery: project.gallery,
          content: project.content,
          tags: project.tags,
          link_live: project.link_live,
          link_repo: project.link_repo,
          video_url: project.video_url,
          _contentText: contentToText(project.content as { type: string; value?: string }[]),
          _tagsText: project.tags.join(", "),
        });
      })
      .finally(() => setLoading(false));
  }, [id, isNew, navigate]);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: isNew ? slugify(title) : prev.slug,
    }));
  }

  async function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      set("cover", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload: ProjectIn = {
      slug: form.slug,
      title: form.title,
      year: form.year,
      type: form.type,
      role: form.role,
      summary: form.summary,
      cover: form.cover,
      gallery: form.gallery,
      content: textToContent(form._contentText),
      tags: form._tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      link_live: form.link_live || null,
      link_repo: form.link_repo || null,
      video_url: form.video_url || null,
    };
    try {
      if (isNew) {
        await adminApi.createProject(payload);
      } else {
        await adminApi.updateProject(Number(id), payload);
      }
      navigate("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLayout><p style={{ color: "#444" }}>Loading…</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button onClick={() => navigate("/admin/projects")} style={backBtn}>← Back</button>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#f5f0e8" }}>
          {isNew ? "New Project" : "Edit Project"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 680 }}>
        <Row label="Title">
          <input style={inp} value={form.title} onChange={handleTitleChange} required />
        </Row>

        <Row label="Slug">
          <input style={inp} value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
        </Row>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Row label="Year" style={{ flex: 1 }}>
            <input style={inp} type="number" value={form.year} onChange={(e) => set("year", Number(e.target.value))} required />
          </Row>
          <Row label="Type" style={{ flex: 2 }}>
            <select style={inp} value={form.type} onChange={(e) => set("type", e.target.value)}>
              {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Row>
        </div>

        <Row label="Role">
          <input style={inp} value={form.role} onChange={(e) => set("role", e.target.value)} />
        </Row>

        <Row label="Summary">
          <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
        </Row>

        <Row label="Cover Image">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <input style={{ ...inp, flex: 1 }} value={form.cover} onChange={(e) => set("cover", e.target.value)} placeholder="/images/projects/..." />
            <input ref={coverInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverUpload} />
            <button type="button" onClick={() => coverInputRef.current?.click()} style={secondaryBtn} disabled={uploadingCover}>
              {uploadingCover ? "Uploading…" : "Upload"}
            </button>
            {form.cover && <img src={form.cover} alt="" style={{ height: 48, width: 72, objectFit: "cover", borderRadius: 3 }} />}
          </div>
        </Row>

        <Row label="Content (paragraphs — separate with blank line)">
          <textarea style={{ ...inp, minHeight: 160, resize: "vertical" }} value={form._contentText} onChange={(e) => set("_contentText", e.target.value)} />
        </Row>

        <Row label="Tags (comma-separated)">
          <input style={inp} value={form._tagsText} onChange={(e) => set("_tagsText", e.target.value)} placeholder="social media, branding, campaign" />
        </Row>

        <Row label="Live URL">
          <input style={inp} type="url" value={form.link_live ?? ""} onChange={(e) => set("link_live", e.target.value || null)} placeholder="https://..." />
        </Row>

        <Row label="Repo URL">
          <input style={inp} type="url" value={form.link_repo ?? ""} onChange={(e) => set("link_repo", e.target.value || null)} placeholder="https://github.com/..." />
        </Row>

        <Row label="Video URL">
          <input style={inp} type="url" value={form.video_url ?? ""} onChange={(e) => set("video_url", e.target.value || null)} placeholder="https://..." />
        </Row>

        {error && <div style={errBox}>{error}</div>}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={saving} style={primaryBtn}>
            {saving ? "Saving…" : isNew ? "Create Project" : "Save Changes"}
          </button>
          <button type="button" onClick={() => navigate("/admin/projects")} style={secondaryBtn}>
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

function Row({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );
}

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: "#555",
  marginBottom: "0.4rem",
};

const inp: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  background: "#0a0a0a",
  border: "1px solid #2a2a2a",
  borderRadius: 4,
  color: "#f5f0e8",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const primaryBtn: React.CSSProperties = {
  padding: "0.7rem 1.5rem",
  background: "#f5f0e8",
  color: "#0a0a0a",
  border: "none",
  borderRadius: 4,
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  padding: "0.65rem 1.2rem",
  background: "none",
  border: "1px solid #2a2a2a",
  borderRadius: 4,
  color: "#888",
  fontSize: "0.85rem",
  cursor: "pointer",
};

const backBtn: React.CSSProperties = {
  padding: "0.4rem 0.75rem",
  background: "none",
  border: "1px solid #222",
  borderRadius: 4,
  color: "#555",
  fontSize: "0.82rem",
  cursor: "pointer",
};

const errBox: React.CSSProperties = {
  padding: "0.6rem 0.9rem",
  background: "#2a0a0a",
  border: "1px solid #5a1a1a",
  borderRadius: 4,
  color: "#e74c3c",
  fontSize: "0.82rem",
};
