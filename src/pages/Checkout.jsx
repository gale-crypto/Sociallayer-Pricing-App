import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initializePaddle } from '@paddle/paddle-js';

const PRICE_IDS = {
  MONTHLY: 'pri_01khc5mnrvvhp9yhmzd6h27enh',
  ANNUAL: 'pri_01khc5p531x8f2bv1z2yyqfmqd',
  LIFETIME: 'pri_01km01y3rftzj68symngtmadv5',
};

function planFromUrl(searchParams) {
  const p = (searchParams.get('plan') || 'annual').toLowerCase();
  if (p === 'monthly') return 'monthly';
  if (p === 'lifetime') return 'lifetime';
  return 'annual';
}

function LogoIcon() {
  return (
    <div
      className="w-[22px] h-[12px] bg-white"
      style={{
        clipPath: "path('M0,6 C5,-2 17,-2 22,6 C17,14 5,14 0,6 Z M4,6 C7,9 15,9 18,6 C15,5 7,5 4,6 Z')",
      }}
    />
  );
}

export default function Checkout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [paddle, setPaddle] = useState(null);
  const [error, setError] = useState(null);
  const planParam = planFromUrl(searchParams);
  const [selectedPlan, setSelectedPlan] = useState(planParam);
  const navigate = useNavigate();
  const openedFromUrlRef = useRef(false);
  const [showLifetimePopup, setShowLifetimePopup] = useState(false);

  // Keep state in sync with URL when visiting with ?plan=monthly|annual
  useEffect(() => {
    setSelectedPlan(planParam);
  }, [planParam]);

  // Strong popup only when the upgrade/checkout page is opened.
  useEffect(() => {
    try {
      const key = 'socialLayerLifetimeDealPopupShown_page';
      if (sessionStorage.getItem(key) !== '1') {
        sessionStorage.setItem(key, '1');
        setShowLifetimePopup(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    initializePaddle({
      environment: import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox',
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN || 'your_client_side_token_here',
      checkout: {
        settings: {
          displayMode: 'inline',
          variant: 'one-page',
          theme: 'dark',
          frameTarget: 'checkout-container',
          frameInitialHeight: '450',
          /* Match site theme: transparent so glass wrapper shows, rounded corners */
          frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none; border-radius: 1rem;',
        },
      },
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') {
          console.log('Checkout completed!', event.data);
          const extensionId = import.meta.env.VITE_EXTENSION_ID;
          if (typeof chrome !== 'undefined' && chrome.runtime && extensionId) {
            chrome.runtime.sendMessage(extensionId, { type: 'SUBSCRIPTION_UPDATED', data: event.data }, () => {});
          }
        }
      },
    })
      .then((paddleInstance) => {
        if (paddleInstance) setPaddle(paddleInstance);
      })
      .catch((err) => {
        console.error('Paddle init failed:', err);
        setError('Failed to load checkout. Please try again.');
      });
  }, []);

  const handlePlanSwitch = (plan) => {
    setSelectedPlan(plan);
    // Update URL so link reflects current plan: /checkout?plan=monthly|annual|lifetime
    setSearchParams({ plan });
    if (!paddle) return;

    const priceId =
      plan === 'monthly' ? PRICE_IDS.MONTHLY :
      plan === 'lifetime' ? PRICE_IDS.LIFETIME :
      PRICE_IDS.ANNUAL;
    const planName = plan === 'monthly' ? 'Monthly Plan' : plan === 'lifetime' ? 'Lifetime Plan' : 'Annual Plan';

    paddle.Checkout.open({
      items: [{ priceId: priceId, quantity: 1 }],
      settings: {
        successUrl: window.location.origin + '/success?plan=' + encodeURIComponent(planName),
      },
    });
  };

  // When user visits /checkout?plan=monthly|annual (e.g. from extension), open that plan's checkout once Paddle is ready
  useEffect(() => {
    if (!paddle || !selectedPlan || openedFromUrlRef.current) return;
    openedFromUrlRef.current = true;
    const priceId =
      selectedPlan === 'monthly' ? PRICE_IDS.MONTHLY :
      selectedPlan === 'lifetime' ? PRICE_IDS.LIFETIME :
      PRICE_IDS.ANNUAL;
    const planName = selectedPlan === 'monthly' ? 'Monthly Plan' : selectedPlan === 'lifetime' ? 'Lifetime Plan' : 'Annual Plan';
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        successUrl: window.location.origin + '/success?plan=' + encodeURIComponent(planName),
      },
    });
  }, [paddle, selectedPlan]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#136a7a] to-[#20e3b2] rounded-full flex items-center justify-center">
            <LogoIcon />
          </div>
          <span className="font-bold text-xl tracking-tight">Social Layer</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 lg:py-16 flex-grow w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Complete your upgrade</h1>
          <p className="text-slate-300 text-lg">
            Choose your plan below. You can switch or cancel anytime.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-center text-sm">{error}</p>
          </div>
        )}

        <div className="glass rounded-[2.5rem] p-8 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-[#22d3ee]">Choose your plan</h2>

          {/* Small lifetime card (upgrade page only) */}
          <button
            type="button"
            onClick={() => handlePlanSwitch('lifetime')}
            className={`w-full rounded-2xl border p-4 text-left transition-colors ${
              selectedPlan === 'lifetime'
                ? 'border-[#22d3ee] bg-[#22d3ee]/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-bold text-sm text-white/90">$79.90 Lifetime</div>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-full uppercase">
                295/300 Sold
              </span>
            </div>
          </button>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handlePlanSwitch('monthly')}
              className={`plan-card rounded-3xl p-6 text-left transition-all ${
                selectedPlan === 'monthly' ? 'highlight' : ''
              }`}
            >
              <h3 className="font-bold text-xl">Monthly Plan</h3>
              <p className="text-2xl font-bold mt-2">
                $12.00<span className="text-sm font-normal text-slate-400">/mo</span>
              </p>
              <p className="text-sm text-slate-400 mt-2">Billed monthly. Perfect for flexibility.</p>
            </button>

            <button
              type="button"
              onClick={() => handlePlanSwitch('annual')}
              className={`plan-card rounded-3xl p-6 text-left transition-all relative ${
                selectedPlan === 'annual' ? 'highlight' : ''
              }`}
            >
              <div className="absolute -top-2 right-4 bg-[#22d3ee] text-[#042f2e] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Best Value
              </div>
              <h3 className="font-bold text-xl">Annual Plan</h3>
              <p className="text-2xl font-bold mt-2">
                $120.00<span className="text-sm font-normal text-slate-400">/yr</span>
              </p>
              <p className="text-sm text-slate-400 mt-1">Equivalent to $10.00 / month.</p>
              <span className="inline-block mt-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                Save $24.00 (16.7%)
              </span>
            </button>
          </div>

          <div className="checkout-container"></div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-[#22d3ee] transition-colors text-sm text-center"
          >
            ← Back to pricing
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-400 uppercase tracking-widest mt-6">
          No account required • Secure payment
        </p>
      </main>

      {/* Strong lifetime popup (only when checkout page is opened) */}
      {showLifetimePopup && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-slate-900 border border-white/10 p-6 shadow-2xl text-white">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div />
              <button
                type="button"
                onClick={() => setShowLifetimePopup(false)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="text-[#22d3ee] font-semibold text-base text-center mb-6">
              Unlock Lifetime - $79.90 (295/300 sold)
            </p>

            <button
              type="button"
              onClick={() => {
                setShowLifetimePopup(false);
                handlePlanSwitch('lifetime');
              }}
              className="w-full py-4 rounded-2xl text-lg font-bold bg-[#22d3ee] text-[#042f2e] hover:bg-[#1bbbd6] transition-colors"
            >
              Unlock Lifetime
            </button>

            <button
              type="button"
              onClick={() => setShowLifetimePopup(false)}
              className="w-full py-3 mt-3 rounded-2xl text-sm font-semibold bg-white/5 text-white/70 hover:bg-white/10 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      <footer className="w-full text-center py-10 mt-auto border-t border-white/5 bg-black/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[12px] font-semibold uppercase tracking-wider text-white/60">
            <a href="https://sociallayer.app/pricing" className="hover:text-[#22d3ee] transition-colors">Pricing</a>
            <a href="https://sociallayer.app/privacy" className="hover:text-[#22d3ee] transition-colors">Privacy Policy</a>
            <a href="https://sociallayer.app/terms" className="hover:text-[#22d3ee] transition-colors">Terms of Use</a>
            <a href="https://sociallayer.app/refund" className="hover:text-[#22d3ee] transition-colors">Refunds</a>
          </nav>
          <span className="text-[11px] text-white/40 font-bold uppercase tracking-[0.2em]">
            © 2026 Social Layer • Built for Mindful Connection
          </span>
        </div>
      </footer>
    </div>
  );
}