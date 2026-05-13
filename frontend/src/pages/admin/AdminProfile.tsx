import { useEffect, useState, type FormEvent } from "react";
import AdminLayout from "./AdminLayout";
import { adminApi, type ProfileIn, type Social } from "@/lib/adminApi";

export default function AdminProfile() {
  const [form, setForm] = useState<ProfileIn>({
    name: "", tagline: "", bio_short: "", bio_long: "",
    location: "", socials: [], currently: "", next: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.getProfile()
      .then((p) => setForm({
        name: p.name, tagline: p.tagline,
        bio_short: p.bio_short, bio_long: p.bio_long,
        location: p.location, socials: p.socials,
        currently: p.currently, next: p.next,
      }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof ProfileIn>(key: K, value: ProfileIn[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setSocial(index: number, field: keyof Social, value: string) {
    setForm((prev) => {
      const socials = [...prev.socials];
      socials[index] = { ...socials[index], [field]: value };
      return { ...prev, socials };
    });
  }

  function addSocial() {
    setForm((prev) => ({ ...prev, socials: [...prev.socials, { label: "", href: "" }] }));
  }

  function removeSocial(index: number) {
    setForm((prev) => ({ ...prev, socials: prev.socials.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await adminApi.updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLayout><p style={{ color: "#444" }}>Loading…</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#f5f0e8", marginBottom: "0.4rem" }}>Profile</h1>
      <p style={{ color: "#555", fontSize: "0.88rem", marginBottom: "2rem" }}>
        Your bio, tagline, and social links shown across the site.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 640 }}>
        <Row label="Name"><input style={inp} value={form.name} onChange={(e) => set("name", e.target.value)} required /></Row>
        <Row label="Tagline"><input style={inp} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></Row>
        <Row label="Location"><input style={inp} value={form.location} onChange={(e) => set("location", e.target.value)} /></Row>
        <Row label="Short Bio (shown on homepage)">
          <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} value={form.bio_short} onChange={(e) => set("bio_short", e.target.value)} />
        </Row>
        <Row label="Long Bio (shown on about page)">
          <textarea style={{ ...inp, minHeight: 140, resize: "vertical" }} value={form.bio_long} onChange={(e) => set("bio_long", e.target.value)} />
        </Row>
        <Row label="Currently">
          <input style={inp} value={form.currently} onChange={(e) => set("currently", e.target.value)} placeholder="What you're working on now" />
        </Row>
        <Row label="Next">
          <input style={inp} value={form.next} onChange={(e) => set("next", e.target.value)} placeholder="What's coming up" />
        </Row>

        {/* Socials */}
        <div>
          <label style={{ ...lbl, marginBottom: "0.75rem" }}>Social Links</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {form.socials.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input style={{ ...inp, flex: 1 }} placeholder="Label (e.g. Instagram)" value={s.label} onChange={(e) => setSocial(i, "label", e.target.value)} />
                <input style={{ ...inp, flex: 2 }} placeholder="URL" value={s.href} onChange={(e) => setSocial(i, "href", e.target.value)} />
                <button type="button" onClick={() => removeSocial(i)} style={{ ...ghostBtn, color: "#e74c3c", borderColor: "#3a1a1a", flexShrink: 0 }}>×</button>
              </div>
            ))}
            <button type="button" onClick={addSocial} style={{ ...ghostBtn, alignSelf: "flex-start", marginTop: "0.25rem" }}>
              + Add Link
            </button>
          </div>
        </div>

        {error && <div style={errBox}>{error}</div>}
        {saved && <div style={{ padding: "0.6rem 0.9rem", background: "#0a2a1a", border: "1px solid #1a5a3a", borderRadius: 4, color: "#2ecc71", fontSize: "0.82rem" }}>Profile saved!</div>}

        <button type="submit" disabled={saving} style={primaryBtn}>
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </AdminLayout>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.72rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "#555", marginBottom: "0.4rem" };
const inp: React.CSSProperties = { width: "100%", padding: "0.65rem 0.85rem", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 4, color: "#f5f0e8", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const primaryBtn: React.CSSProperties = { padding: "0.7rem 1.5rem", background: "#f5f0e8", color: "#0a0a0a", border: "none", borderRadius: 4, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" };
const ghostBtn: React.CSSProperties = { padding: "0.4rem 0.8rem", background: "none", border: "1px solid #2a2a2a", borderRadius: 4, color: "#888", fontSize: "0.8rem", cursor: "pointer" };
const errBox: React.CSSProperties = { padding: "0.6rem 0.9rem", background: "#2a0a0a", border: "1px solid #5a1a1a", borderRadius: 4, color: "#e74c3c", fontSize: "0.82rem" };
