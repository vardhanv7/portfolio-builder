"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface Props {
  portfolioUserId?: string;
  variant: "modern" | "minimal" | "creative";
  primary: string;
  secondary?: string;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  _hp: string; // honeypot
}

const EMPTY: FormState = { name: "", email: "", subject: "", message: "", _hp: "" };

export default function ContactForm({ portfolioUserId, variant, primary, secondary }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          portfolioUserId,
          _hp: form._hp,
        }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Send failed");
      }
      setSent(true);
      setForm(EMPTY);
      toast.success("Message sent! They'll get back to you soon.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  }

  // ── Input class builders ────────────────────────────────────────────────────

  const inputBase: Record<Props["variant"], string> = {
    modern:
      "w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2",
    minimal:
      "w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-b-2",
    creative:
      "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 backdrop-blur-sm",
  };

  const labelBase: Record<Props["variant"], string> = {
    modern: "block text-xs font-medium text-zinc-400 mb-1.5",
    minimal: "block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5",
    creative: "block text-xs font-medium text-white/60 mb-1.5",
  };

  const ic = inputBase[variant];
  const lc = labelBase[variant];

  const focusRingStyle = { "--tw-ring-color": `${primary}80` } as React.CSSProperties;

  // ── Success message ─────────────────────────────────────────────────────────

  if (sent) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 py-12 text-center ${variant === "minimal" ? "text-gray-600" : "text-white/70"}`}>
        <div className="text-4xl">✉️</div>
        <p className="font-semibold text-base">Message sent!</p>
        <p className="text-sm opacity-70">I'll get back to you as soon as possible.</p>
        <button
          onClick={() => setSent(false)}
          className="mt-2 text-xs underline opacity-60 hover:opacity-100"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Honeypot — hidden from real users, bots fill it */}
      <input
        type="text"
        name="_hp"
        value={form._hp}
        onChange={(e) => update("_hp", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
      />
      {/* Name + Email row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={lc}>Name</label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={ic}
            style={focusRingStyle}
            required
          />
        </div>
        <div>
          <label className={lc}>Email</label>
          <input
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={ic}
            style={focusRingStyle}
            required
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className={lc}>Subject</label>
        <input
          type="text"
          placeholder="What's this about?"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className={ic}
          style={focusRingStyle}
          required
        />
      </div>

      {/* Message */}
      <div>
        <label className={lc}>Message</label>
        <textarea
          rows={4}
          placeholder="Your message…"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${ic} resize-none`}
          style={focusRingStyle}
          required
        />
      </div>

      {/* Submit button */}
      {variant === "creative" ? (
        <button
          type="submit"
          disabled={sending}
          className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, ${primary}, ${secondary ?? primary})`,
            boxShadow: `0 4px 20px ${primary}40`,
          }}
        >
          {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {sending ? "Sending…" : "Send Message"}
        </button>
      ) : variant === "minimal" ? (
        <button
          type="submit"
          disabled={sending}
          className="flex items-center gap-2 self-start border-b-2 pb-0.5 text-sm font-semibold transition-all hover:gap-3 disabled:opacity-50"
          style={{ borderColor: primary, color: primary }}
        >
          {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {sending ? "Sending…" : "Send Message"}
        </button>
      ) : (
        <button
          type="submit"
          disabled={sending}
          className="flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: primary }}
        >
          {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {sending ? "Sending…" : "Send Message"}
        </button>
      )}
    </form>
  );
}
