import { useEffect, useState, type FormEvent } from "react";
import AdminLayout from "./AdminLayout";
import { adminApi, type TimelineEntry, type TimelineIn } from "@/lib/adminApi";

const CATEGORIES = ["work", "life", "award", "school"] as const;
type Category = typeof CATEGORIES[number];

const blankForm: TimelineIn = { year: new Date().getFullYear(), title: "", description: "", category: "work" };

export default function AdminTimeline() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<TimelineIn>(blankForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function load() {
    try { setEntries(await adminApi.getTimeline()); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function startEdit(entry: TimelineEntry) {
    setEditingId(entry.id);
    setForm({ year: entry.year, title: entry.title, description: entry.description, category: entry.category });
    setShowForm(true);
    setError("");
  }

  function startNew() {
    setEditingId(null);
    setForm(blankForm);
    setShowForm(true);
    setError("");
  }

  function cancel() {
    setShowForm(false);
    setEditingId(null);
    setForm(blankForm);
    setError("");
  }

  function set<K extends keyof TimelineIn>(key: K, value: TimelineIn[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId !== null) {
        const updated = await adminApi.updateTimelineEntry(editingId, form);
        setEntries((prev) => prev.map((e) => (e.id === editingId ? updated : e)));
      } else {
        const created = await adminApi.createTimelineEntry(form);
        setEntries((prev) => [created, ...prev]);
      }
      cancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      await adminApi.deleteTimelineEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  const categoryColor: Record<Category, string> = { work: "#3b82f6", life: "#10b981", award: "#f59e0b", school: "#a855f7" };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#f5f0e8", marginBottom: "0.25rem" }}>Timeline</h1>
          <p style={{ color: "#555", fontSize: "0.88rem" }}>{entries.length} entries</p>
        </div>
        {!showForm && (
          <button onClick={startNew} style={primaryBtn}>+ Add Entry</button>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <div style={{ background: "#141414", border: "1px solid #222", borderRadius: 8, padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#f5f0e8", marginBottom: "1.25rem" }}>
            {editingId ? "Edit Entry" : "New Entry"}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Year</label>
                <input style={inp} type="number" value={form.year} onChange={(e) => set("year", Number(e.target.value))} required />
              </div>
              <div style={{ flex: 2 }}>
                <label style={lbl}>Category</label>
                <select style={inp} value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={lbl}>Title</label>
              <input style={inp} value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </div>
            <div>
              <label style={lbl}>Description</label>
              <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            {error && <div style={errBox}>{error}</div>}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" disabled={saving} style={primaryBtn}>{saving ? "Saving…" : editingId ? "Save Changes" : "Create Entry"}</button>
              <button type="button" onClick={cancel} style={ghostBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Entries list */}
      {loading ? (
        <p style={{ color: "#444" }}>Loading…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {entries.map((e) => (
            <div key={e.id} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem 1.25rem", background: "#141414", border: "1px solid #1e1e1e", borderRadius: 6 }}>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#444", minWidth: 42 }}>{e.year}</span>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: categoryColor[e.category], background: `${categoryColor[e.category]}18`, padding: "0.2rem 0.5rem", borderRadius: 3, marginTop: 2, flexShrink: 0 }}>
                {e.category}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.92rem", fontWeight: 500, color: "#f5f0e8", marginBottom: "0.2rem" }}>{e.title}</p>
                <p style={{ fontSize: "0.82rem", color: "#555", lineHeight: 1.5 }}>{e.description}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button onClick={() => startEdit(e)} style={ghostBtn}>Edit</button>
                <button onClick={() => handleDelete(e.id, e.title)} disabled={deleting === e.id} style={{ ...ghostBtn, color: "#e74c3c", borderColor: "#3a1a1a" }}>
                  {deleting === e.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
          {entries.length === 0 && <p style={{ color: "#444", textAlign: "center", padding: "3rem" }}>No entries yet.</p>}
        </div>
      )}
    </AdminLayout>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.72rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "#555", marginBottom: "0.4rem" };
const inp: React.CSSProperties = { width: "100%", padding: "0.65rem 0.85rem", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 4, color: "#f5f0e8", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const primaryBtn: React.CSSProperties = { padding: "0.6rem 1.2rem", background: "#f5f0e8", color: "#0a0a0a", border: "none", borderRadius: 4, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" };
const ghostBtn: React.CSSProperties = { padding: "0.4rem 0.8rem", background: "none", border: "1px solid #2a2a2a", borderRadius: 4, color: "#888", fontSize: "0.8rem", cursor: "pointer" };
const errBox: React.CSSProperties = { padding: "0.6rem 0.9rem", background: "#2a0a0a", border: "1px solid #5a1a1a", borderRadius: 4, color: "#e74c3c", fontSize: "0.82rem" };
