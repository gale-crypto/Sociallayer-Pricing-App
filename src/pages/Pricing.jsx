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

export default function Pricing() {
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
          to="/"
          className="back-btn px-6 py-2 rounded-full text-[13px] font-medium tracking-tight transition-all"
        >
          Back to Home
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20 flex-grow w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Social Layer Pro</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            More control, when you want it. Defaults stay the same. Upgrade anytime. Cancel anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="glass rounded-[2.5rem] p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-8 text-[#22d3ee]">Why Go Pro?</h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <p className="text-slate-200">Unlimited edits and suggestions</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <p className="text-slate-200">Advanced settings and tone controls</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <p className="text-slate-200">App-level control (Gmail integration)</p>
              </li>
            </ul>
          </div>

          <div className="glass rounded-[2.5rem] p-8 flex flex-col gap-6">
            <div className="plan-card rounded-3xl p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-xl">Monthly Plan</h3>
                <span className="text-2xl font-bold">
                  $9.99<span className="text-sm font-normal text-slate-400">/mo</span>
                </span>
              </div>
              <p className="text-sm text-slate-400">Billed monthly. Perfect for flexibility.</p>
            </div>

            <div className="plan-card highlight rounded-3xl p-6 relative">
              <div className="absolute -top-3 right-6 bg-[#22d3ee] text-[#042f2e] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                Best Value
              </div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-xl">Annual Plan</h3>
                <span className="text-2xl font-bold">
                  $99.90<span className="text-sm font-normal text-slate-400">/yr</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Equivalent to $8.33 / month. (2 months free)
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs line-through text-slate-500">$119.88</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                  Save 16.6%
                </span>
              </div>
            </div>

            <button type="button" className="cta-button w-full py-4 rounded-2xl text-lg font-bold mt-4">
              Upgrade to Pro
            </button>
            <p className="text-center text-[11px] text-slate-400 uppercase tracking-widest">
              No account required • 100% local
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-10 mt-auto border-t border-white/5 bg-black/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[12px] font-semibold uppercase tracking-wider text-white/60">
            <Link to="/pricing" className="hover:text-[#22d3ee] transition-colors">
              Pricing
            </Link>
            <Link to="/privacy" className="hover:text-[#22d3ee] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#22d3ee] transition-colors">
              Terms of Use
            </Link>
            <Link to="/refund" className="hover:text-[#22d3ee] transition-colors">
              Refunds
            </Link>
            <Link to="/support" className="hover:text-[#22d3ee] transition-colors">
              Support
            </Link>
          </nav>
          <div className="flex flex-col items-center gap-4">
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
        </div>
      </footer>
    </div>
  )
}
