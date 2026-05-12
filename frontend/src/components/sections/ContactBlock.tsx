import MagneticButton from "@/components/primitives/MagneticButton";
import { SITE } from "@/config/site";
import { useNavigate } from "react-router-dom";
import { useReveal } from "@/hooks/useReveal";

export default function ContactBlock() {
  const navigate  = useNavigate();
  // @ts-expect-error generic ref
  const titleRef = useReveal({ y: 30 });

  return (
    <section
      data-theme="accent"
      style={{
        background: "var(--color--accent)",
        padding: "var(--section-padding) var(--container-padding)",
        textAlign: "center",
      }}
    >
      <div className="container">
        <p className="text-eyebrow" style={{ marginBottom: "1rem" }}>
          Let's talk
        </p>
        {/* @ts-expect-error ref */}
        <h2 ref={titleRef} className="text-impact-reg-brier" style={{ color: "var(--color--black)", marginBottom: "2rem" }}>
          Got a project in mind?
        </h2>
        <MagneticButton
          onClick={() => navigate("/contact")}
          label="Start a conversation"
          style={{
            border: "1px solid var(--color--black)",
            color: "var(--color--black)",
          }}
        />
      </div>
    </section>
  );
}
