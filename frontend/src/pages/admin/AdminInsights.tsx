import { useEffect, useState, type FormEvent } from "react";
import AdminLayout from "./AdminLayout";
import { adminApi, type SocialInsight, type SocialInsightIn, type InsightStat } from "@/lib/adminApi";

const PLATFORMS = ["instagram", "youtube", "tiktok", "x", "facebook", "linkedin"];

const blank: SocialInsightIn = { platform: "instagram", handle: "", stats: [], sort_order: 0 };

export default function AdminInsights() {
  const [insights, setInsights] = useState<SocialInsight[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState<SocialInsightIn>(blank);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error,    setError]    = useState("");
  const [showForm, setShowForm] = useState(false);

  async function load() {
    try { setInsights(await adminApi.getInsights()); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditingId(null);
    setForm({ ...blank, stats: [{ label: "Followers", value: "" }] });
    setShowForm(true);
    setError("");
  }

  function startEdit(ins: SocialInsight) {
    setEditingId(ins.id);
    setForm({ platform: ins.platform, handle: ins.handle, stats: ins.stats.map(s => ({ ...s })), sort_order: ins.sort_order });
    setShowForm(true);
    setError("");
  }

  function cancel() {
    setShowForm(false);
    setEditingId(null);
    setForm(blank);
    setError("");
  }

  function setField<K extends keyof SocialInsightIn>(k: K, v: SocialInsightIn[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  function updateStat(i: number, field: keyof InsightStat, value: string) {
    setForm(p => {
      const stats = [...p.stats];
      stats[i] = { ...stats[i], [field]: value };
      return { ...p, stats };
    });
  }

  function addStat() {
    setForm(p => ({ ...p, stats: [...p.stats, { label: "", value: "" }] }));
  }

  function removeStat(i: number) {
    setForm(p => ({ ...p, stats: p.stats.filter((_, idx) => idx !== i) }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId !== null) {
        const updated = await adminApi.updateInsight(editingId, form);
        setInsights(p => p.map(x => x.id === editingId ? updated : x));
      } else {
        const created = await adminApi.createInsight(form);
        setInsights(p => [...p, created].sort((a, b) => a.sort_order - b.sort_order));
      }
      cancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, platform: string) {
    if (!confirm(`Delete ${platform} insight?`)) return;
    setDeleting(id);
    try {
      await adminApi.deleteInsight(id);
      setInsights(p => p.filter(x => x.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#f5f0e8", marginBottom: "0.25rem" }}>Social Insights</h1>
          <p style={{ color: "#555", fontSize: "0.88rem" }}>{insights.length} platforms</p>
        </div>
        {!showForm && <button onClick={startNew} style={primaryBtn}>+ Add Platform</button>}
      </div>

      {showForm && (
        <div style={{ background: "#141414", border: "1px solid #222", borderRadius: 8, padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#f5f0e8", marginBottom: "1.25rem" }}>
            {editingId ? "Edit Platform" : "New Platform"}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
              <div>
                <label style={lbl}>Platform</label>
                <select style={inp} value={form.platform} onChange={e => setField("platform", e.target.value)}>
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Handle (e.g. @woprikraadodo)</label>
                <input style={inp} value={form.handle} onChange={e => setField("handle", e.target.value)} placeholder="@handle" />
              </div>
              <div>
                <label style={lbl}>Order</label>
                <input style={{ ...inp, width: 64 }} type="number" value={form.sort_order} onChange={e => setField("sort_order", Number(e.target.value))} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <label style={lbl}>Stats</label>
                <button type="button" onClick={addStat} style={{ ...ghostBtn, fontSize: "0.75rem" }}>+ Add stat</button>
              </div>
              {form.stats.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input style={inp} placeholder="Label (e.g. Followers)" value={s.label} onChange={e => updateStat(i, "label", e.target.value)} />
                  <input style={inp} placeholder="Value (e.g. 12.4K)" value={s.value} onChange={e => updateStat(i, "value", e.target.value)} />
                  <button type="button" onClick={() => removeStat(i)} style={{ ...ghostBtn, color: "#e74c3c", borderColor: "#3a1a1a", padding: "0 0.75rem" }}>✕</button>
                </div>
              ))}
            </div>

            {error && <div style={errBox}>{error}</div>}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" disabled={saving} style={primaryBtn}>{saving ? "Saving…" : editingId ? "Save Changes" : "Create"}</button>
              <button type="button" onClick={cancel} style={ghostBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: "#444" }}>Loading…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {insights.map(ins => (
            <div key={ins.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", background: "#141414", border: "1px solid #1e1e1e", borderRadius: 6 }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", minWidth: 80 }}>{ins.platform}</span>
              <span style={{ fontSize: "0.82rem", color: "#555", flex: 1 }}>{ins.handle}</span>
              <div style={{ display: "flex", gap: "1.5rem", flex: 2, flexWrap: "wrap" }}>
                {ins.stats.map((s, i) => (
                  <div key={i}>
                    <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f5f0e8" }}>{s.value}</p>
                    <p style={{ fontSize: "0.7rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button onClick={() => startEdit(ins)} style={ghostBtn}>Edit</button>
                <button onClick={() => handleDelete(ins.id, ins.platform)} disabled={deleting === ins.id} style={{ ...ghostBtn, color: "#e74c3c", borderColor: "#3a1a1a" }}>
                  {deleting === ins.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
          {insights.length === 0 && <p style={{ color: "#444", textAlign: "center", padding: "3rem" }}>No platforms added yet.</p>}
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
