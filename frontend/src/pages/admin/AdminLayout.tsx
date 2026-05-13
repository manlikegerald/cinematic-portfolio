import { useEffect, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin" },
  { label: "Projects", path: "/admin/projects" },
  { label: "Timeline", path: "/admin/timeline" },
  { label: "Profile", path: "/admin/profile" },
];

function signOut(navigate: ReturnType<typeof useNavigate>) {
  localStorage.removeItem("admin_token");
  navigate("/admin/login");
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100svh",
        background: "#0a0a0a",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#f5f0e8",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: "#0e0e0e",
          borderRight: "1px solid #1c1c1c",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 0",
        }}
      >
        <div
          style={{
            padding: "0 1.25rem 1.5rem",
            borderBottom: "1px solid #1c1c1c",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#444",
              marginBottom: "0.2rem",
            }}
          >
            Portfolio
          </p>
          <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f5f0e8" }}>Admin</p>
        </div>

        <nav style={{ flex: 1, padding: "0 0.75rem" }}>
          {NAV_ITEMS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              style={({ isActive }) => ({
                display: "block",
                padding: "0.55rem 0.75rem",
                marginBottom: "0.15rem",
                borderRadius: 5,
                fontSize: "0.88rem",
                color: isActive ? "#f5f0e8" : "#666",
                background: isActive ? "#1a1a1a" : "transparent",
                textDecoration: "none",
                transition: "color 0.15s, background 0.15s",
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #1c1c1c" }}>
          <button
            onClick={() => signOut(navigate)}
            style={{
              background: "none",
              border: "none",
              color: "#555",
              fontSize: "0.82rem",
              cursor: "pointer",
              padding: 0,
              letterSpacing: "0.04em",
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2rem 2.5rem",
          maxWidth: 960,
        }}
      >
        {children}
      </main>
    </div>
  );
}
