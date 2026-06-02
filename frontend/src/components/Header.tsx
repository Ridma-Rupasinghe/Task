import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import logo from '/logo.webp'

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="container-pad py-5"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img src={logo} className="h-10 w-10 rounded-lg" alt="Logo" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[rgb(var(--accent))]">
              AccelAlpha × Oracle
            </div>
            <div className="truncate text-sm font-semibold text-display">
              Troubled Waters: Sailing with AI
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          <a
            href="#agenda"
            className="hidden sm:inline-flex items-center btn-ghost text-xs sm:text-sm"
          >
            Agenda
          </a>
          <a
            href="#invite"
            className="btn-primary text-xs sm:text-sm"
          >
            <span className="hidden xs:inline">Get personalized </span>invite
          </a>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center cursor-pointer justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] shadow-sm transition-all hover:border-[rgb(var(--accent))]/40 hover:text-[rgb(var(--fg))]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>
        </nav>
      </div>

      {/* Subtle border bottom */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[rgb(var(--border))] to-transparent" />
    </motion.header>
  )
}