/**
 * ToolLogos — accurate brand SVG logos with glow + scale hover effects.
 */

import { useState } from "react";

function LogoWrapper({
  children,
  label,
  size = 64,
  glowColor = "#ffffff",
}: {
  children: React.ReactNode;
  label: string;
  size?: number;
  glowColor?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={label}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "0 2.5rem",
        cursor: "default",
        opacity: hovered ? 1 : 0.85,
        transform: hovered ? "scale(1.15)" : "scale(1)",
        transition: "opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: hovered ? `drop-shadow(0 0 14px ${glowColor}99)` : "none",
          transition: "filter 0.3s ease",
        }}
      >
        {children}
      </div>
      <span
        style={{
          fontFamily: "var(--font--body)",
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: hovered ? glowColor : "var(--color--grey-2)",
          transition: "color 0.3s ease",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Adobe Photoshop ────────────────────────────────────────────────────────
export function PhotoshopLogo({ size = 64 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="Photoshop"
      style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", padding:"0 2.5rem", cursor:"default",
        opacity: hovered ? 1 : 0.85, transform: hovered ? "scale(1.15)" : "scale(1)",
        transition:"opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <img src="/logos/photoshop.svg" alt="Photoshop" width={size} height={size}
        style={{ borderRadius: 9, width: 60, height: 60, objectFit:"contain", filter: hovered ? "drop-shadow(0 0 14px #31A8FF99)" : "none", transition:"filter 0.3s ease" }} />
      <span style={{ fontFamily:"var(--font--body)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em",
        textTransform:"uppercase", color: hovered ? "#31A8FF" : "var(--color--grey-2)", transition:"color 0.3s ease", whiteSpace:"nowrap" }}>
        Photoshop
      </span>
    </div>
  );
}

// ── Adobe Premiere Pro ─────────────────────────────────────────────────────
export function PremiereLogo({ size = 64 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="Premiere Pro"
      style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", padding:"0 2.5rem", cursor:"default",
        opacity: hovered ? 1 : 0.85, transform: hovered ? "scale(1.15)" : "scale(1)",
        transition:"opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <img src="/logos/premiere.svg" alt="Premiere Pro" width={size} height={size}
        style={{ borderRadius: 9, width: 60, height: 60, objectFit:"contain", filter: hovered ? "drop-shadow(0 0 14px #9999FF99)" : "none", transition:"filter 0.3s ease" }} />
      <span style={{ fontFamily:"var(--font--body)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em",
        textTransform:"uppercase", color: hovered ? "#9999FF" : "var(--color--grey-2)", transition:"color 0.3s ease", whiteSpace:"nowrap" }}>
        Premiere Pro
      </span>
    </div>
  );
}

// ── Adobe InDesign ─────────────────────────────────────────────────────────
export function InDesignLogo({ size = 64 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="InDesign"
      style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", padding:"0 2.5rem", cursor:"default",
        opacity: hovered ? 1 : 0.85, transform: hovered ? "scale(1.15)" : "scale(1)",
        transition:"opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <img src="/logos/indesign.svg" alt="InDesign" width={size} height={size}
        style={{ borderRadius: 9, width: 60, height: 60, objectFit:"contain", filter: hovered ? "drop-shadow(0 0 14px #FF336699)" : "none", transition:"filter 0.3s ease" }} />
      <span style={{ fontFamily:"var(--font--body)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em",
        textTransform:"uppercase", color: hovered ? "#FF3366" : "var(--color--grey-2)", transition:"color 0.3s ease", whiteSpace:"nowrap" }}>
        InDesign
      </span>
    </div>
  );
}

// ── Adobe Illustrator ──────────────────────────────────────────────────────
export function IllustratorLogo({ size = 64 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="Illustrator"
      style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", padding:"0 2.5rem", cursor:"default",
        opacity: hovered ? 1 : 0.85, transform: hovered ? "scale(1.15)" : "scale(1)",
        transition:"opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <img src="/logos/illustrator.svg" alt="Illustrator" width={size} height={size}
        style={{ borderRadius: 9, width: 60, height: 60, objectFit:"contain", filter: hovered ? "drop-shadow(0 0 14px #FF9A0099)" : "none", transition:"filter 0.3s ease" }} />
      <span style={{ fontFamily:"var(--font--body)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em",
        textTransform:"uppercase", color: hovered ? "#FF9A00" : "var(--color--grey-2)", transition:"color 0.3s ease", whiteSpace:"nowrap" }}>
        Illustrator
      </span>
    </div>
  );
}

// ── Adobe After Effects ────────────────────────────────────────────────────
export function AfterEffectsLogo({ size = 64 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="After Effects"
      style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", padding:"0 2.5rem", cursor:"default",
        opacity: hovered ? 1 : 0.85, transform: hovered ? "scale(1.15)" : "scale(1)",
        transition:"opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <img src="/logos/aftereffects.svg" alt="After Effects" width={size} height={size}
        style={{ borderRadius: 9, width: 60, height: 60, objectFit:"contain", filter: hovered ? "drop-shadow(0 0 14px #9999FF99)" : "none", transition:"filter 0.3s ease" }} />
      <span style={{ fontFamily:"var(--font--body)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em",
        textTransform:"uppercase", color: hovered ? "#9999FF" : "var(--color--grey-2)", transition:"color 0.3s ease", whiteSpace:"nowrap" }}>
        After Effects
      </span>
    </div>
  );
}

// ── Figma ──────────────────────────────────────────────────────────────────
export function FigmaLogo({ size = 64 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="Figma"
      style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", padding:"0 2.5rem", cursor:"default",
        opacity: hovered ? 1 : 0.85, transform: hovered ? "scale(1.15)" : "scale(1)",
        transition:"opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <img src="/logos/figma.svg" alt="Figma" width={size} height={size}
        style={{ width: 60, height: 60, objectFit:"contain", filter: hovered ? "brightness(0) invert(1) drop-shadow(0 0 14px #A259FF99)" : "brightness(0) invert(1)", transition:"filter 0.3s ease" }} />
      <span style={{ fontFamily:"var(--font--body)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em",
        textTransform:"uppercase", color: hovered ? "#A259FF" : "var(--color--grey-2)", transition:"color 0.3s ease", whiteSpace:"nowrap" }}>
        Figma
      </span>
    </div>
  );
}

// ── DaVinci Resolve ────────────────────────────────────────────────────────
export function DaVinciLogo({ size = 64 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="DaVinci Resolve"
      style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", padding:"0 2.5rem", cursor:"default",
        opacity: hovered ? 1 : 0.85, transform: hovered ? "scale(1.15)" : "scale(1)",
        transition:"opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <img src="/logos/davinci.svg" alt="DaVinci Resolve" width={size} height={size}
        style={{ width: 60, height: 60, objectFit:"contain", filter: hovered ? "drop-shadow(0 0 14px #ff304499)" : "none", transition:"filter 0.3s ease" }} />
      <span style={{ fontFamily:"var(--font--body)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em",
        textTransform:"uppercase", color: hovered ? "#ff3044" : "var(--color--grey-2)", transition:"color 0.3s ease", whiteSpace:"nowrap" }}>
        DaVinci Resolve
      </span>
    </div>
  );
}

// ── Canva ──────────────────────────────────────────────────────────────────
export function CanvaLogo({ size = 64 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="Canva"
      style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", padding:"0 2.5rem", cursor:"default",
        opacity: hovered ? 1 : 0.85, transform: hovered ? "scale(1.15)" : "scale(1)",
        transition:"opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <img src="/logos/canva.svg" alt="Canva" width={size} height={size}
        style={{ borderRadius: "50%", width: 60, height: 60, objectFit:"contain", filter: hovered ? "drop-shadow(0 0 14px #00C4CC99)" : "none", transition:"filter 0.3s ease" }} />
      <span style={{ fontFamily:"var(--font--body)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em",
        textTransform:"uppercase", color: hovered ? "#00C4CC" : "var(--color--grey-2)", transition:"color 0.3s ease", whiteSpace:"nowrap" }}>
        Canva
      </span>
    </div>
  );
}

// ── CapCut ─────────────────────────────────────────────────────────────────
export function CapCutLogo({ size = 64 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);
  const height = Math.round(size * (24 / 127.2));
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="CapCut"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0 2.5rem",
        cursor: "default",
        opacity: hovered ? 1 : 0.6,
        transform: hovered ? "scale(1.15)" : "scale(1)",
        transition: "opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <div style={{ height: 60, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <img
          src="/logos/capcut.svg"
          alt="CapCut"
          style={{
            width: size * 2.2,
            height: "auto",
            maxHeight: 36,
            objectFit: "contain",
            filter: hovered
              ? "brightness(0) invert(1) drop-shadow(0 0 14px #ffffff99)"
              : "brightness(0) invert(1)",
            transition: "filter 0.3s ease",
          }}
        />
      </div>
      <span style={{
        fontFamily: "var(--font--body)",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: hovered ? "#ffffff" : "var(--color--grey-2)",
        transition: "color 0.3s ease",
        whiteSpace: "nowrap",
      }}>
        CapCut
      </span>
    </div>
  );
}

// ── Meta Ads ───────────────────────────────────────────────────────────────
export function MetaLogo({ size = 64 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} title="Meta Ads"
      style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", padding:"0 2.5rem", cursor:"default",
        opacity: hovered ? 1 : 0.85, transform: hovered ? "scale(1.15)" : "scale(1)",
        transition:"opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <div style={{ height: 60, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <img src="/logos/meta.svg" alt="Meta"
          style={{ width: size * 2.2, height:"auto", maxHeight: 36, objectFit:"contain",
            filter: hovered ? "brightness(0) invert(1) drop-shadow(0 0 14px #0866FF99)" : "brightness(0) invert(1)", transition:"filter 0.3s ease" }} />
      </div>
      <span style={{ fontFamily:"var(--font--body)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em",
        textTransform:"uppercase", color: hovered ? "#0866FF" : "var(--color--grey-2)", transition:"color 0.3s ease", whiteSpace:"nowrap" }}>
        Meta Ads
      </span>
    </div>
  );
}

// ── Google Analytics ───────────────────────────────────────────────────────
export function GoogleAnalyticsLogo({ size = 64 }: { size?: number }) {
  return (
    <LogoWrapper label="Google Analytics" size={size} glowColor="#F9AB00">
      <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="50" height="50" rx="9" fill="#fff" />
        {/* 3 bars — GA logo approximation */}
        <rect x="9"  y="30" width="8" height="14" rx="4" fill="#E37400" />
        <rect x="21" y="20" width="8" height="24" rx="4" fill="#F9AB00" />
        <rect x="33" y="9"  width="8" height="35" rx="4" fill="#E37400" />
      </svg>
    </LogoWrapper>
  );
}

// ── All logos exported for the marquee ────────────────────────────────────
export const ALL_TOOL_LOGOS = [
  <PhotoshopLogo       key="ps"       size={60} />,
  <PremiereLogo        key="pr"       size={60} />,
  <InDesignLogo        key="id"       size={60} />,
  <IllustratorLogo     key="ai"       size={60} />,
  <AfterEffectsLogo    key="ae"       size={60} />,
  <DaVinciLogo         key="davinci"  size={60} />,
  <FigmaLogo           key="figma"    size={60} />,
  <CanvaLogo           key="canva"    size={60} />,
  <CapCutLogo          key="capcut"   size={60} />,
  <MetaLogo            key="meta"     size={60} />,
  <GoogleAnalyticsLogo key="ga"       size={60} />,
];
