import { useEffect, useRef } from "react";
import { useMotionValue } from "framer-motion";

// Tracks cursor position as motion values — consumed by MagneticButton.
export function useCursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return { cursorX: x, cursorY: y };
}

// Returns whether the cursor is within `radius` pixels of a ref element.
export function useNearElement(radius = 80) {
  const ref = useRef<HTMLElement | null>(null);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // Dampen the pull — move at most half the offset
        offsetX.set(dx * 0.35);
        offsetY.set(dy * 0.35);
      } else {
        offsetX.set(0);
        offsetY.set(0);
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [radius, offsetX, offsetY]);

  return { ref, offsetX, offsetY };
}
