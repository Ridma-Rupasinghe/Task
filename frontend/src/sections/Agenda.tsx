import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AgendaSession } from "../types";
import {
  fetchAllKeywords,
  fetchAllSessions,
  fetchSessionsByQuery,
} from "../lib/api";
import SessionCard from "../components/SessionCard";

export default function Agenda() {
  const [agendaQuery, setAgendaQuery] = useState("");
  const [agendaLoading, setAgendaLoading] = useState(false);
  const [agendaError, setAgendaError] = useState<string | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [displaySessions, setDisplaySessions] = useState<AgendaSession[]>([]);

  const loadAllSessions = useCallback(async () => {
    setAgendaLoading(true);
    setAgendaError(null);
    try {
      setDisplaySessions(await fetchAllSessions());
    } catch (err: unknown) {
      setAgendaError(err instanceof Error ? err.message : "Failed to load sessions.");
    } finally {
      setAgendaLoading(false);
    }
  }, []);

  const loadSessionsByQuery = useCallback(async (query: string) => {
    setAgendaLoading(true);
    setAgendaError(null);
    try {
      setDisplaySessions(await fetchSessionsByQuery(query));
    } catch (err: unknown) {
      setAgendaError(err instanceof Error ? err.message : "Failed to search sessions.");
    } finally {
      setAgendaLoading(false);
    }
  }, []);

  async function handleAllSessions() {
    setSelectedKeyword(null);
    setAgendaQuery("");
    await loadAllSessions();
  }

  async function handleKeywordClick(keyword: string) {
    setSelectedKeyword(keyword);
    setAgendaQuery(keyword);
    await loadSessionsByQuery(keyword);
  }

  useEffect(() => {
    void loadAllSessions();
    void fetchAllKeywords().then(setKeywords).catch(() => setKeywords([]));
  }, [loadAllSessions]);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    const q = agendaQuery.trim();
    if (!q) return;
    searchDebounceRef.current = setTimeout(() => {
      setSelectedKeyword(null);
      void loadSessionsByQuery(q);
    }, 350);
    return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
  }, [agendaQuery, loadSessionsByQuery]);

  return (
    <section id="agenda" className="container-pad pb-14">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="card overflow-hidden"
      >
        {/* Header strip */}
        <div className="border-b border-[rgb(var(--border))] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="section-label mb-2">Programme</div>
              <h2 className="text-2xl font-semibold tracking-tight text-display sm:text-3xl">
                Conference Agenda
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Filter sessions by keyword or search below.
              </p>
            </div>

            {/* Search — fixed: pl-9 on input so text starts after icon */}
            <div className="w-full sm:max-w-xs">
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
                  xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                {/* pl-9 (2.25rem) gives the icon room; pr-3 normal right padding */}
                <input
                  value={agendaQuery}
                  onChange={(e) => setAgendaQuery(e.target.value)}
                  placeholder="Search sessions…"
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] py-2.5 pl-9 pr-3 text-sm shadow-sm outline-none transition-all placeholder:text-[rgb(var(--muted))]/60 focus:border-[rgb(var(--accent))]/60 focus:ring-2 focus:ring-[rgb(var(--accent))]/20"
                />
              </div>
            </div>
          </div>

          {/* Keyword pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => void handleAllSessions()}
              className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide transition-all ${
                selectedKeyword === null && !agendaQuery.trim()
                  ? "border-[rgb(var(--accent))]/40 bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]"
                  : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]/40 hover:text-[rgb(var(--accent))]"
              }`}
            >
              All sessions
            </button>
            {keywords.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => void handleKeywordClick(k)}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide transition-all ${
                  selectedKeyword === k
                    ? "border-[rgb(var(--gold))]/40 bg-[rgb(var(--gold))]/10 text-[rgb(var(--gold))]"
                    : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]/40 hover:text-[rgb(var(--accent))]"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          {agendaError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/8 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {agendaError}
            </div>
          )}

          {agendaLoading && (
            <div className="flex items-center gap-2 py-6 text-sm text-[rgb(var(--muted))]">
              <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Loading sessions…
            </div>
          )}

          {/* Grid: 1 col on mobile, 2 on sm+, 3 on xl+ */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {displaySessions.length === 0 && !agendaLoading && (
              <p className="col-span-full py-6 text-center text-sm text-[rgb(var(--muted))]">
                No sessions match your search. Try another keyword or click <em>All sessions</em>.
              </p>
            )}
            {displaySessions.map((s, i) => (
              <motion.div
                key={s.sessionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: 'easeOut' }}
              >
                <SessionCard session={s} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}