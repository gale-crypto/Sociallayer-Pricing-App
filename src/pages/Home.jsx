import { Link } from 'react-router-dom'

function LogoIcon() {
  return (
    <div
      className="w-[22px] h-[12px] bg-white"
      style={{
        clipPath: "path('M0,6 C5,-2 17,-2 22,6 C17,14 5,14 0,6 Z M4,6 C7,9 15,9 18,6 C15,5 7,5 4,6 Z')",
      }}
    />
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#136a7a] to-[#20e3b2] rounded-full flex items-center justify-center">
            <LogoIcon />
          </div>
          <span className="font-bold text-xl tracking-tight">Social Layer</span>
        </div>
        <Link
          to="/pricing"
          className="back-btn px-6 py-2 rounded-full text-[13px] font-medium tracking-tight transition-all"
        >
          Pricing
        </Link>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-20 flex-grow w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Social Layer</h1>
        <p className="text-slate-300 max-w-xl text-lg mb-10">
          Built for mindful connection.
        </p>
        <Link
          to="/pricing"
          className="cta-button px-8 py-4 rounded-2xl text-lg font-bold inline-block"
        >
          View Pricing
        </Link>
      </main>
      <footer className="w-full text-center py-10 mt-auto border-t border-white/5 bg-black/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <a
            href="https://x.com/sociallayerapp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#22d3ee] transition-all flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @sociallayerapp
          </a>
          <span className="text-[11px] text-white/40 font-bold uppercase tracking-[0.2em]">
            © 2026 Social Layer • Built for Mindful Connection
          </span>
        </div>
      </footer>
    </div>
  )
}
