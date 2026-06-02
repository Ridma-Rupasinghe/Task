import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { GenerateInviteRequest, GenerateInviteResponse } from "../types";
import { fetchInvite } from "../lib/api";


function GeneratedEmail({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");

    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15); // typing speed in ms

    return () => clearInterval(interval);
  }, [text]);

  return (
    <pre className="mt-3 max-h-60 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[rgb(var(--bg))] p-3 text-xs leading-6 text-[rgb(var(--fg))]">
      {displayedText}
    </pre>
  );
}

export default function Invite() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [focus, setFocus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateInviteResponse | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetchInvite({ name: name.trim(), email: email.trim(), focus: focus.trim() } as GenerateInviteRequest);
      setResult(res);
    } catch (err: any) {
      setError(err?.response?.data?.detail?.toString?.() || err?.message?.toString?.() || "Request failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.generated_email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="invite" className="container-pad pb-20">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {/* Section heading */}
        <div className="mb-6 text-center sm:text-left">
          <div className="section-label mb-2">AI Invite Generator</div>
          <h2 className="text-2xl font-semibold tracking-tight text-display sm:text-3xl">
            Get a personalised invitation
          </h2>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            We'll match your focus to the best session and draft a invite email.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-start">
          {/* Form */}
          <div className="card overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--gold))] to-[rgb(var(--accent2))]" />
            <div className="p-5 sm:p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[rgb(var(--muted))] tracking-wide uppercase">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                      placeholder="Jane Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[rgb(var(--muted))] tracking-wide uppercase">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="jane@company.com"
                      type="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[rgb(var(--muted))] tracking-wide uppercase">
                    Professional Focus / Career Challenges
                  </label>
                  <textarea
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    className="input-field min-h-28 resize-y"
                    placeholder='"I am working on warehouse automation and want to explore predictive analytics."'
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Generating…
                    </>
                  ) : (
                    <>
                      Generate invitation
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/8 p-3 text-sm text-rose-600 dark:text-rose-400"
                    >
                      <svg className="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>

          {/* Result */}
          <div className="card overflow-hidden">
            <div className="border-b border-[rgb(var(--border))] px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="section-label mb-0.5">Output</div>
                  <h3 className="text-base font-semibold text-display">
                    {result ? "Your invite is ready" : "Waiting for submission"}
                  </h3>
                </div>
                {/* {result && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Generated
                  </span>
                )} */}
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {result ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* Matched session */}
                  <div className="rounded-xl border border-[rgb(var(--border))] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="section-label">Matched session</div>
                      {/* <div className="rounded-full border border-[rgb(var(--gold))]/30 bg-[rgb(var(--gold))]/8 px-2 py-0.5 text-[10px] font-medium text-[rgb(var(--gold))]">
                        Score: {result.matched_session.score.toFixed(3)}
                      </div> */}
                    </div>
                    <div className="mt-2 text-base font-semibold text-display leading-snug">
                      {result.matched_session.title}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-[rgb(var(--muted))]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {result.matched_session.time}
                      <span className="mx-1">·</span>
                      {result.matched_session.speaker}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[rgb(var(--muted))]">
                      {result.matched_session.description}
                    </p>
                  </div>

                  {/* Generated email */}
                  <div className="rounded-xl border border-[rgb(var(--border))] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="section-label">Generated email</div>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          copied
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'btn-ghost py-1.5'
                        }`}
                      >
                        {copied ? (
                          <><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                        ) : (
                          <><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
                        )}
                      </button>
                    </div>
                    <GeneratedEmail text={result.generated_email} />
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] text-[rgb(var(--muted))]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <p className="max-w-xs text-sm text-[rgb(var(--muted))]">
                    Fill in the form and click <em>Generate invitation</em> to see your personalised invite draft here.
                  </p>
                  
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}