import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { SITE } from "@/config/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Switch to frosted background after 100 px of scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate menu links in when overlay opens
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const links = menuRef.current.querySelectorAll(".menu-link");
    gsap.fromTo(
      links,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "cubic-default" }
    );
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "var(--nav-height)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--container-padding)",
          transition: "background var(--duration-fast) var(--cubic-default), backdrop-filter var(--duration-fast)",
          background: scrolled ? "rgba(0,0,0,0.6)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        {/* Monogram / logo */}
        <NavLink to="/" aria-label="Home">
          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
            <rect width="36" height="36" rx="4" fill="var(--color--accent)" />
            <text
              x="18"
              y="24"
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fontFamily="var(--font--body)"
              fill="var(--color--black)"
            >
              {SITE.initials}
            </text>
          </svg>
        </NavLink>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation">
          <ul style={{ display: "flex", gap: "2rem", listStyle: "none" }}>
            {SITE.nav.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className="text-eyebrow"
                  style={({ isActive }) => ({
                    color: isActive ? "var(--color--accent)" : "var(--color--off-white)",
                    transition: "color var(--duration-fast) var(--cubic-default)",
                  })}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger / menu toggle */}
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            width: 28,
            padding: 2,
          }}
        >
          <span
            style={{
              display: "block",
              height: 2,
              background: "var(--color--off-white)",
              transition: "transform var(--duration-fast) var(--cubic-default)",
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              height: 2,
              background: "var(--color--off-white)",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity var(--duration-fast)",
            }}
          />
          <span
            style={{
              display: "block",
              height: 2,
              background: "var(--color--off-white)",
              transition: "transform var(--duration-fast) var(--cubic-default)",
              transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }}
          />
        </button>
      </header>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.65, 0.05, 0, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              background: "var(--color--dark)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "calc(var(--nav-height) + 2rem) var(--container-padding) 2rem",
            }}
          >
            <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {SITE.nav.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className="menu-link"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "inline-block",
                      fontSize: "clamp(2.5rem, 8vw, 5rem)",
                      fontWeight: 800,
                      fontFamily: "var(--font--display)",
                      fontStyle: "italic",
                      lineHeight: 1,
                      color: "var(--color--off-white)",
                    }}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Socials row */}
            <div
              style={{
                marginTop: "3rem",
                display: "flex",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              {SITE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-eyebrow"
                  style={{ color: "var(--color--grey-1)" }}
                  target={s.label !== "email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
