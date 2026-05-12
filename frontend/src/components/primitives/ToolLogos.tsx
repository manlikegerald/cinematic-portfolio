/**
 * ToolLogos — SVG logos for each tool, styled to match the dark site aesthetic.
 * White/off-white at rest, accent color on hover.
 */

import { useState } from "react";

interface LogoProps {
  size?: number;
  color?: string;
  hoverColor?: string;
}

function LogoWrapper({ children, label, size = 48 }: { children: React.ReactNode; label: string; size?: number }) {
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
        gap: "0.6rem",
        padding: "0 2.5rem",
        cursor: "default",
        opacity: hovered ? 1 : 0.55,
        transition: "opacity 0.3s ease",
      }}
    >
      <div style={{ width: size, height: size, flexShrink: 0 }}>{children}</div>
      <span style={{
        fontFamily: "var(--font--body)",
        fontSize: "0.6rem",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: hovered ? "var(--color--accent)" : "var(--color--grey-2)",
        transition: "color 0.3s ease",
        whiteSpace: "nowrap",
      }}>
        {label}
      </span>
    </div>
  );
}

// ── Adobe Photoshop ────────────────────────────────────────────────────────
export function PhotoshopLogo({ size = 48 }: LogoProps) {
  return (
    <LogoWrapper label="Photoshop" size={size}>
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="50" height="50" rx="8" fill="#001E36"/>
        <rect width="50" height="50" rx="8" fill="none" stroke="#31A8FF" strokeWidth="1.5"/>
        <text x="7" y="34" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" fill="#31A8FF">Ps</text>
      </svg>
    </LogoWrapper>
  );
}

// ── Adobe Premiere Pro ─────────────────────────────────────────────────────
export function PremiereLogo({ size = 48 }: LogoProps) {
  return (
    <LogoWrapper label="Premiere Pro" size={size}>
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="50" height="50" rx="8" fill="#0D0221"/>
        <rect width="50" height="50" rx="8" fill="none" stroke="#9999FF" strokeWidth="1.5"/>
        <text x="6" y="34" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" fill="#9999FF">Pr</text>
      </svg>
    </LogoWrapper>
  );
}

// ── Adobe InDesign ─────────────────────────────────────────────────────────
export function InDesignLogo({ size = 48 }: LogoProps) {
  return (
    <LogoWrapper label="InDesign" size={size}>
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="50" height="50" rx="8" fill="#1A0030"/>
        <rect width="50" height="50" rx="8" fill="none" stroke="#FF3AB0" strokeWidth="1.5"/>
        <text x="7" y="34" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" fill="#FF3AB0">Id</text>
      </svg>
    </LogoWrapper>
  );
}

// ── Adobe Illustrator ──────────────────────────────────────────────────────
export function IllustratorLogo({ size = 48 }: LogoProps) {
  return (
    <LogoWrapper label="Illustrator" size={size}>
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="50" height="50" rx="8" fill="#1C0A00"/>
        <rect width="50" height="50" rx="8" fill="none" stroke="#FF9A00" strokeWidth="1.5"/>
        <text x="8" y="34" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" fill="#FF9A00">Ai</text>
      </svg>
    </LogoWrapper>
  );
}

// ── DaVinci Resolve ────────────────────────────────────────────────────────
export function DaVinciLogo({ size = 48 }: LogoProps) {
  return (
    <LogoWrapper label="DaVinci Resolve" size={size}>
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="50" height="50" rx="8" fill="#1A1A1A"/>
        {/* Outer circle */}
        <circle cx="25" cy="25" r="18" stroke="#BE2C2C" strokeWidth="2" fill="none"/>
        {/* Inner circle */}
        <circle cx="25" cy="25" r="9" fill="#BE2C2C"/>
        {/* Top dot */}
        <circle cx="25" cy="8" r="3" fill="#ffffff"/>
      </svg>
    </LogoWrapper>
  );
}

// ── Figma ──────────────────────────────────────────────────────────────────
export function FigmaLogo({ size = 48 }: LogoProps) {
  return (
    <LogoWrapper label="Figma" size={size}>
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="50" height="50" rx="8" fill="#1E1E1E"/>
        {/* Figma F-shape using coloured circles */}
        {/* Top-left — red */}
        <rect x="13" y="7" width="12" height="12" rx="6" fill="#F24E1E"/>
        {/* Top-right — purple */}
        <rect x="25" y="7" width="12" height="12" rx="6" fill="#A259FF"/>
        {/* Middle-left — orange */}
        <rect x="13" y="19" width="12" height="12" rx="6" fill="#FF7262"/>
        {/* Middle-right — blue (circle) */}
        <circle cx="31" cy="25" r="6" fill="#1ABCFE"/>
        {/* Bottom-left — green */}
        <rect x="13" y="31" width="12" height="12" rx="6" fill="#0ACF83"/>
      </svg>
    </LogoWrapper>
  );
}

// ── Canva ──────────────────────────────────────────────────────────────────
export function CanvaLogo({ size = 48 }: LogoProps) {
  return (
    <LogoWrapper label="Canva" size={size}>
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="50" height="50" rx="25" fill="#7D2AE8"/>
        <text x="9" y="34" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" fill="#ffffff">C</text>
        <circle cx="38" cy="25" r="5" fill="#00C4CC"/>
      </svg>
    </LogoWrapper>
  );
}

// ── CapCut ─────────────────────────────────────────────────────────────────
export function CapCutLogo({ size = 48 }: LogoProps) {
  return (
    <LogoWrapper label="CapCut" size={size}>
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="50" height="50" rx="12" fill="#000000"/>
        {/* Scissors icon */}
        <circle cx="16" cy="18" r="5" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="16" cy="32" r="5" stroke="white" strokeWidth="2" fill="none"/>
        <line x1="20" y1="21" x2="38" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="20" y1="29" x2="38" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </LogoWrapper>
  );
}

// ── Meta Business Suite ────────────────────────────────────────────────────
export function MetaLogo({ size = 48 }: LogoProps) {
  return (
    <LogoWrapper label="Meta Ads" size={size}>
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="50" height="50" rx="8" fill="#0866FF"/>
        {/* Infinity / Meta M shape */}
        <path
          d="M8 25 C8 18 13 14 18 18 C21 21 23 25 25 25 C27 25 29 21 32 18 C37 14 42 18 42 25 C42 32 37 36 32 32 C29 29 27 25 25 25 C23 25 21 29 18 32 C13 36 8 32 8 25Z"
          fill="white"
        />
      </svg>
    </LogoWrapper>
  );
}

// ── All logos as an array for easy mapping ─────────────────────────────────
export const ALL_TOOL_LOGOS = [
  <PhotoshopLogo  key="ps"       size={44} />,
  <PremiereLogo   key="pr"       size={44} />,
  <InDesignLogo   key="id"       size={44} />,
  <IllustratorLogo key="ai"      size={44} />,
  <DaVinciLogo    key="davinci"  size={44} />,
  <FigmaLogo      key="figma"    size={44} />,
  <CanvaLogo      key="canva"    size={44} />,
  <CapCutLogo     key="capcut"   size={44} />,
  <MetaLogo       key="meta"     size={44} />,
];
