import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/adminApi";

const S = {
  page: {
    minHeight: "100svh",
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', system-ui, sans-serif",
  } as React.CSSProperties,
  card: {
    width: "100%",
    maxWidth: 360,
    padding: "2.5rem",
    background: "#141414",
    border: "1px solid #222",
    borderRadius: 8,
  } as React.CSSProperties,
  logo: {
    fontSize: "0.7rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#555",
    marginBottom: "2rem",
  },
  heading: {
    fontSize: "1.4rem",
    fontWeight: 600,
    color: "#f5f0e8",
    marginBottom: "0.4rem",
  },
  sub: {
    fontSize: "0.85rem",
    color: "#555",
    marginBottom: "2rem",
  },
  label: {
    display: "block",
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#666",
    marginBottom: "0.4rem",
  },
  input: {
    width: "100%",
    padding: "0.7rem 0.9rem",
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    borderRadius: 4,
    color: "#f5f0e8",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box" as const,
    marginBottom: "1.5rem",
  },
  btn: (loading: boolean) =>
    ({
      width: "100%",
      padding: "0.75rem",
      background: loading ? "#333" : "#f5f0e8",
      color: "#0a0a0a",
      border: "none",
      borderRadius: 4,
      fontSize: "0.85rem",
      fontWeight: 600,
      letterSpacing: "0.06em",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "background 0.15s",
    }) as React.CSSProperties,
  error: {
    marginTop: "1rem",
    padding: "0.6rem 0.9rem",
    background: "#2a0a0a",
    border: "1px solid #5a1a1a",
    borderRadius: 4,
    color: "#e74c3c",
    fontSize: "0.82rem",
  },
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await adminApi.login(password);
      localStorage.setItem("admin_token", token);
      navigate("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <p style={S.logo}>Portfolio Admin</p>
        <h1 style={S.heading}>Sign in</h1>
        <p style={S.sub}>Enter your admin password to continue.</p>
        <form onSubmit={handleSubmit}>
          <label style={S.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={S.input}
            autoFocus
            required
          />
          <button type="submit" style={S.btn(loading)} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
          {error && <div style={S.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
