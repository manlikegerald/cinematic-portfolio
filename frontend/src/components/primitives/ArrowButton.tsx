/**
 * ArrowButton — circular CTA button with an SVG arrow that rotates 45° on hover.
 * Replaces Lando's Rive-powered arrow widget.
 * Uses Framer Motion for the hover animation so it stays component-scoped.
 */

import { type MouseEvent as RMouseEvent } from "react";
import { motion } from "framer-motion";

interface Props {
  href?: string;
  onClick?: (e: RMouseEvent) => void;
  label?: string;   // accessible label
  size?: number;    // diameter in pixels
  className?: string;
  style?: React.CSSProperties;
  /** If true renders as <a>, otherwise <button> */
  as?: "a" | "button";
}

export default function ArrowButton({
  href,
  onClick,
  label = "Go",
  size = 56,
  className,
  style,
  as: Tag = href ? "a" : "button",
}: Props) {
  const inner = (
    <>
      {/* Circle outline */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid currentColor",
          transition: "background var(--duration-fast) var(--cubic-default)",
        }}
      />
      {/* Arrow SVG */}
      <motion.svg
        width={size * 0.4}
        height={size * 0.4}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
        transition={{ duration: 0.35, ease: [0.65, 0.05, 0, 1] }}
      >
        <path
          d="M2 14L14 2M14 2H5M14 2V11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </>
  );

  const commonProps = {
    className,
    onClick,
    "aria-label": label,
    style: {
      position: "relative" as const,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "50%",
      cursor: "pointer",
      color: "var(--color--off-white)",
      background: "transparent",
      border: "none",
      flexShrink: 0,
      ...style,
    },
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{ display: "inline-block" }}
    >
      {Tag === "a" ? (
        <motion.a href={href} {...commonProps}
          whileHover={{ color: "var(--color--accent)" }}
        >
          {inner}
        </motion.a>
      ) : (
        <motion.button {...commonProps}
          whileHover={{ color: "var(--color--accent)" }}
        >
          {inner}
        </motion.button>
      )}
    </motion.div>
  );
}
