import logo from '/logo.webp'

export default function Footer() {
  return (
    <footer className="container-pad pb-10">
      <div className="border-t border-[rgb(var(--border))] pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} className="h-6 w-6 rounded-lg" alt="Logo" />
            <span className="text-xs font-medium text-[rgb(var(--muted))]">
              AccelAlpha × Oracle — Troubled Waters: Sailing with AI
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-[10px] font-medium tracking-wide uppercase text-[rgb(var(--muted))]/60">
            All rights reserved. &nbsp;
            <span>@2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
}