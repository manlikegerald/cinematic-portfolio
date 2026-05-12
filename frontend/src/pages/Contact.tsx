import { useState } from "react";
import Section from "@/components/sections/Section";
import SplitText from "@/components/primitives/SplitText";
import MagneticButton from "@/components/primitives/MagneticButton";
import { postContact, type ContactPayload } from "@/lib/api";
import { SITE } from "@/config/site";
import { motion, AnimatePresence } from "framer-motion";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: ContactPayload = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form,   setForm]   = useState<ContactPayload>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");

  const email = SITE.socials.find((s) => s.label === "email")?.href ?? "#";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await postContact(form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "0.875rem 1rem",
    background: "var(--color--dark-tint-1)",
    border: "1px solid var(--color--dark-tint-2)",
    borderRadius: "var(--radius-md)",
    color: "var(--color--off-white)",
    fontSize: "1rem",
    marginTop: "0.375rem",
    transition: "border-color var(--duration-fast) var(--cubic-default)",
  };

  return (
    <Section
      theme="dark"
      style={{ paddingTop: "calc(var(--nav-height) + 4rem)", paddingBottom: "var(--section-padding)", minHeight: "100svh" }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: "4rem",
          alignItems: "start",
        }}
      >
        {/* Left — statement + socials */}
        <div>
          <p className="text-eyebrow" style={{ color: "var(--color--grey-2)", marginBottom: "1rem" }}>
            Contact
          </p>
          <SplitText
            as="h1"
            split="words"
            anim="reveal-clip"
            start="top 95%"
            className="text-impact-reg-brier"
            style={{ marginBottom: "2rem", fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            Let's make something great.
          </SplitText>

          <a
            href={email}
            className="text-title-reg-mona"
            style={{ color: "var(--color--accent)", display: "block", marginBottom: "2rem" }}
          >
            {email.replace("mailto:", "")}
          </a>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {SITE.socials.filter((s) => s.label !== "email").map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-eyebrow"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color--grey-1)" }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right — form or success */}
        <div>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              // Success state — morphs into thank-you card
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.65, 0.05, 0, 1] }}
                style={{
                  padding: "3rem 2rem",
                  background: "var(--color--dark-tint-1)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color--accent)",
                  textAlign: "center",
                }}
              >
                <SplitText
                  as="h2"
                  anim="reveal-up"
                  split="words"
                  start="top 100%"
                  className="text-impact-reg-brier"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", marginBottom: "1rem" }}
                >
                  Message received.
                </SplitText>
                <p className="text-body-reg-mona" style={{ color: "var(--color--grey-1)" }}>
                  I'll be in touch soon. In the meantime, feel free to explore the work.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                noValidate
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                {(["name", "email", "subject"] as const).map((field) => (
                  <label key={field}>
                    <span className="text-eyebrow" style={{ color: "var(--color--grey-2)" }}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--color--accent)")}
                      onBlur={(e)  => (e.target.style.borderColor = "var(--color--dark-tint-2)")}
                    />
                  </label>
                ))}

                <label>
                  <span className="text-eyebrow" style={{ color: "var(--color--grey-2)" }}>
                    Message
                  </span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color--accent)")}
                    onBlur={(e)  => (e.target.style.borderColor = "var(--color--dark-tint-2)")}
                  />
                </label>

                {status === "error" && (
                  <p className="text-eyebrow" style={{ color: "red" }}>
                    Something went wrong. Please try emailing directly.
                  </p>
                )}

                <MagneticButton
                  label={status === "submitting" ? "Sending…" : "Send message →"}
                  style={{ alignSelf: "flex-start", border: "1px solid var(--color--accent)", color: "var(--color--accent)" }}
                />
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
