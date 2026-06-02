import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { AgendaSession } from '../types'

function SessionModal({ session, onClose }: { session: AgendaSession; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const keywords = session.focusKeywords
    .split(',').map((k) => k.trim()).filter(Boolean).slice(0, 8)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4"
      style={{ backgroundColor: 'rgba(10,11,14,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--gold))] to-[rgb(var(--accent2))]" />

        <div className="p-5 sm:p-6">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] transition-all hover:border-[rgb(var(--accent))]/40 hover:text-[rgb(var(--fg))]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Time badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--accent))]/25 bg-[rgb(var(--accent))]/8 px-2.5 py-1 text-[11px] font-medium text-[rgb(var(--accent))]">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {session.time}
          </div>

          {/* Title — allow wrapping, generous right padding so it never hides under close btn */}
          <h3 className="mt-3 pr-10 text-xl font-semibold leading-snug text-display">{session.title}</h3>

          {/* Speaker */}
          <div className="mt-2 flex items-center gap-1.5 text-sm text-[rgb(var(--muted))]">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="break-words">{session.speaker}</span>
          </div>

          <div className="my-4 h-px bg-gradient-to-r from-[rgb(var(--border))] via-[rgb(var(--border))]/50 to-transparent" />

          {/* Description */}
          <p className="text-sm leading-relaxed text-[rgb(var(--muted))]">{session.description}</p>

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {keywords.map((k) => (
                <span key={k} className="tag-pill">{k}</span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function SessionCard({ session }: { session: AgendaSession }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.div
        layout
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="group relative flex flex-col rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Left accent on hover */}
        <div className="absolute inset-y-0 left-0 w-0.5 rounded-l-2xl bg-gradient-to-b from-[rgb(var(--accent))] to-[rgb(var(--gold))] opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Top row: text + button — key fix: min-w-0 on wrapper, flex-1 on text block */}
        <div className="flex min-w-0 items-start gap-3">
          <div className="min-w-0 flex-1">
            {/* Time badge */}
            <div className="inline-flex items-center gap-1 rounded-md bg-[rgb(var(--accent))]/8 px-2 py-0.5 text-[10px] font-medium text-[rgb(var(--accent))]">
              {session.time}
            </div>
            {/* Title: line-clamp allows wrapping up to 2 lines, never overflows */}
            <div className="mt-2 line-clamp-2 text-sm font-semibold leading-snug">
              {session.title}
            </div>
            {/* Speaker: truncate only if truly long */}
            <div className="mt-1.5 flex min-w-0 items-center gap-1 text-xs text-[rgb(var(--muted))]">
              <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="truncate">{session.speaker}</span>
            </div>
          </div>

          {/* Details button: shrink-0 so it never squishes, but text block gets all remaining space */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 self-start rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--muted))] transition-all hover:border-[rgb(var(--accent))]/40 hover:bg-[rgb(var(--accent))]/8 hover:text-[rgb(var(--accent))]"
          >
            Details
          </button>
        </div>

        {/* Keyword preview chips */}
        {session.focusKeywords && (
          <div className="mt-3 flex flex-wrap gap-1">
            {session.focusKeywords
              .split(',').map((k) => k.trim()).filter(Boolean).slice(0, 3)
              .map((k) => (
                <span key={k} className="rounded-md bg-[rgb(var(--bg))] px-1.5 py-0.5 text-[10px] text-[rgb(var(--muted))]">
                  {k}
                </span>
              ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {open && <SessionModal session={session} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}