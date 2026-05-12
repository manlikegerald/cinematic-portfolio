/**
 * MagneticButton — button that drifts toward the cursor when within radius px.
 *
 * Uses Framer Motion useMotionValue + useSpring so the pull feels springy.
 * Magnetic effect is disabled when prefers-reduced-motion is active.
 */

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Props {
  children?: ReactNode;
  label?: string;         // text label shorthand
  onClick?: () => void;
  radius?: number;        // px — magnetic pull radius
  small?: boolean;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export default function MagneticButton({
  children,
  label,
  onClick,
  radius = 80,
  small = false,
  className,
  style,
  "aria-label": ariaLabel,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring gives a nice eased follow — stiffness & damping tune the feel
  const x = useSpring(rawX, { stiffness: 150, damping: 20 });
  const y = useSpring(rawY, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: MouseEvent) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius) {
      rawX.set(dx * 0.35);
      rawY.set(dy * 0.35);
    }
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: small ? "0.5rem 1rem" : "0.75rem 1.5rem",
    border: "1px solid var(--color--off-white)",
    borderRadius: "2rem",
    fontSize: small ? "0.75rem" : "0.875rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "pointer",
    color: "var(--color--off-white)",
    background: "transparent",
    transition: `background var(--duration-fast) var(--cubic-default),
                 color var(--duration-fast) var(--cubic-default),
                 border-color var(--duration-fast) var(--cubic-default)`,
    ...style,
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y, ...baseStyle } as React.CSSProperties}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
      whileHover={{ background: "var(--color--accent)", color: "var(--color--black)", borderColor: "var(--color--accent)" }}
      whileTap={{ scale: 0.96 }}
    >
      {label ?? children}
    </motion.button>
  );
}
