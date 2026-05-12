import { SITE } from "@/config/site";
import MagneticButton from "@/components/primitives/MagneticButton";
import { useLenis } from "@/components/layout/SmoothScrollProvider";

export default function Footer() {
  const lenis = useLenis();

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.5 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer data-theme="dark" style={{ borderTop: "1px solid var(--color--dark-tint-2)" }}>
      {/* Tier 1 — massive closing statement */}
      <div
        className="container"
        style={{ padding: "var(--section-padding) var(--container-padding)" }}
      >
        <p
          className="text-impact-reg-brier"
          style={{ maxWidth: "14ch", color: "var(--color--off-white)" }}
        >
          Let's build something worth remembering.
        </p>
        <a
          href={SITE.socials.find((s) => s.label === "email")?.href ?? "#"}
          className="text-title-reg-mona"
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            color: "var(--color--accent)",
          }}
        >
          {/* Show the raw email address stripped of mailto: */}
          {SITE.socials
            .find((s) => s.label === "email")
            ?.href.replace("mailto:", "") ?? "[PLACEHOLDER] your@email.com"}
        </a>
      </div>

      {/* Tier 2 — lower bar */}
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          paddingBlock: "1.25rem",
          borderTop: "1px solid var(--color--dark-tint-1)",
        }}
      >
        <span className="text-eyebrow" style={{ color: "var(--color--grey-2)" }}>
          © {year} {SITE.name} · {SITE.location}
        </span>
        <MagneticButton
          onClick={scrollToTop}
          aria-label="Back to top"
          label="Back to top ↑"
          small
        />
      </div>
    </footer>
  );
}
