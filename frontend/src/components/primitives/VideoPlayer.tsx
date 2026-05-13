/**
 * VideoPlayer — cinematic in-app video player.
 *
 * Supports:
 *   - YouTube  (youtube.com/watch?v=ID  or  youtu.be/ID)
 *   - Vimeo    (vimeo.com/ID)
 *   - Direct   (.mp4 / .webm / .mov URLs)
 *
 * Before the user clicks play, shows a poster image (or a dark placeholder).
 * On click, replaces the poster with the embedded player / native video.
 * Matches the site's dark cinematic aesthetic.
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  url: string;
  poster?: string;      // thumbnail image URL
  title?: string;       // accessible label
  aspectRatio?: string; // default "16/9"
}

// ── URL parsers ────────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function isLinkedIn(url: string): boolean {
  return /linkedin\.com\//i.test(url);
}

type VideoType = "youtube" | "vimeo" | "direct" | "linkedin" | "unknown";

function detectType(url: string): VideoType {
  if (getYouTubeId(url)) return "youtube";
  if (getVimeoId(url))   return "vimeo";
  if (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(url)) return "direct";
  if (isLinkedIn(url))   return "linkedin";
  return "unknown";
}

// ── Sub-components ─────────────────────────────────────────────────────────

function PlayButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Play video"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1,   opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.65, 0.05, 0, 1] }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        zIndex: 2,
      }}
    >
      {/* Outer ring */}
      <div style={{
        position: "relative",
        width: 80,
        height: 80,
        borderRadius: "50%",
        border: "2px solid var(--color--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
      }}>
        {/* Pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: "1.5px solid var(--color--accent)",
            pointerEvents: "none",
          }}
        />
        {/* Play triangle */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"
          style={{ marginLeft: 4 }}>
          <polygon points="8,5 24,14 8,23" fill="var(--color--accent)" />
        </svg>
      </div>

      <span style={{
        fontFamily: "var(--font--body)",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--color--off-white)",
      }}>
        Play
      </span>
    </motion.button>
  );
}

// LinkedIn card — opens the post in a new tab (LinkedIn blocks iframe embedding)
function LinkedInCard({ url, poster, title }: { url: string; poster?: string; title: string }) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {poster ? (
        <img src={poster} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0a0a14 0%, #0a0a0a 100%)" }} />
      )}
      {/* Scrim */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
      {/* Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem" }}>
        {/* LinkedIn logo mark */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <rect width="40" height="40" rx="6" fill="#0A66C2" />
          <path d="M13 16h-4v12h4V16zm-2-7a2 2 0 110 4 2 2 0 010-4zm8 7h-4v12h4v-6c0-1.8 1-3 2.5-3s2.5 1 2.5 3v6h4v-6.5c0-3.5-2-5.5-5-5.5-1.5 0-2.8.7-3.5 1.8V16z" fill="white" />
        </svg>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font--body)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color--grey-2)", marginBottom: "0.4rem" }}>
            LinkedIn Video
          </p>
          <p style={{ fontFamily: "var(--font--body)", fontSize: "1rem", fontWeight: 600, color: "var(--color--off-white)" }}>
            {title}
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.65rem 1.4rem",
            background: "#0A66C2",
            color: "#fff",
            borderRadius: "2rem",
            fontFamily: "var(--font--body)",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textDecoration: "none",
          }}
        >
          Watch on LinkedIn
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function VideoPlayer({ url, poster, title = "Video", aspectRatio = "16/9" }: Props) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const type = detectType(url);

  // LinkedIn can't be embedded — show the card directly without a play interaction
  if (type === "linkedin") {
    return (
      <div style={{ position: "relative", width: "100%", aspectRatio, background: "var(--color--dark)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
        <LinkedInCard url={url} poster={poster} title={title} />
      </div>
    );
  }

  const handlePlay = useCallback(() => {
    setPlaying(true);
    // For direct video, call .play() after state update
    setTimeout(() => videoRef.current?.play(), 50);
  }, []);

  const embedUrl = (() => {
    if (type === "youtube") {
      const id = getYouTubeId(url);
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&color=white`;
    }
    if (type === "vimeo") {
      const id = getVimeoId(url);
      return `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
    }
    return null;
  })();

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio,
      background: "var(--color--dark)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
    }}>

      <AnimatePresence mode="wait">
        {!playing ? (
          /* ── Poster / idle state ── */
          <motion.div
            key="poster"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Poster image or dark gradient placeholder */}
            {poster ? (
              <img
                src={poster}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, var(--color--dark-tint-1) 0%, var(--color--dark) 100%)",
              }} />
            )}

            {/* Dark scrim over poster */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
            }} />

            {/* Video title */}
            <div style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "1.5rem",
              zIndex: 3,
            }}>
              <p style={{
                fontFamily: "var(--font--body)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color--grey-2)",
                marginBottom: "0.25rem",
              }}>
                {type === "youtube" ? "YouTube" : type === "vimeo" ? "Vimeo" : "Video"}
              </p>
              <p style={{
                fontFamily: "var(--font--body)",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--color--off-white)",
              }}>
                {title}
              </p>
            </div>

            <PlayButton onClick={handlePlay} />
          </motion.div>

        ) : (
          /* ── Active player ── */
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ position: "absolute", inset: 0 }}
          >
            {(type === "youtube" || type === "vimeo") && embedUrl ? (
              <iframe
                src={embedUrl}
                title={title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            ) : type === "direct" ? (
              <video
                ref={videoRef}
                src={url}
                controls
                playsInline
                style={{ width: "100%", height: "100%", background: "#000" }}
              />
            ) : (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "var(--color--grey-2)",
                fontFamily: "var(--font--body)",
                fontSize: "0.9rem",
              }}>
                Unsupported video format
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
