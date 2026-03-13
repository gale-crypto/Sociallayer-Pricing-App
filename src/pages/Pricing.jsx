import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { initializePaddle } from '@paddle/paddle-js';

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
  const [paddle, setPaddle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const monthlyCardRef = useRef(null);
  const annualCardRef = useRef(null);

  // console.log('Paddle Environment', import.meta.env.VITE_PADDLE_CLIENT_TOKEN, import.meta.env.VITE_PADDLE_ENVIRONMENT)

  // Initialize Paddle when component mounts
  useEffect(() => {
    initializePaddle({
      environment: import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox',
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN || 'your_client_side_token_here',
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') {
          console.log('Checkout completed!', event.data);
          // Notify Chrome extension to activate Pro (pay.sociallayer.app → extension)
          const extensionId = import.meta.env.VITE_EXTENSION_ID;
          if (typeof chrome !== 'undefined' && chrome.runtime && extensionId) {
            chrome.runtime.sendMessage(extensionId, { type: 'SUBSCRIPTION_UPDATED', data: event.data }, (response) => {
              if (chrome.runtime.lastError) {
                console.warn('[Pricing] Extension not installed or not reachable:', chrome.runtime.lastError.message);
              } else if (response?.ok) {
                console.log('[Pricing] Extension updated to Pro');
              }
            });
          }
          // Analytics
          if (typeof window.gtag !== 'undefined') {
            const planName = event.data?.items?.[0]?.price?.description || 'Pro';
            window.gtag('event', 'purchase', {
              transaction_id: event.data?.id,
              value: planName.includes('Monthly') ? 9.99 : 99.90,
              currency: 'USD'
            });
          }
        }
      }      
    }).then((paddleInstance) => {
      if (paddleInstance) {
        console.log('paddleInstance', paddleInstance);
        setPaddle(paddleInstance);
        console.log('Paddle initialized successfully');
      }
    }).catch(error => {
      console.error('Paddle initialization failed:', error);
      setError('Failed to initialize payment system');
    });
  }, []);

  // When opened from extension with ?plan=monthly|annual, scroll to that plan card
  useEffect(() => {
    const plan = searchParams.get('plan');
    const ref = plan === 'monthly' ? monthlyCardRef.current : plan === 'annual' ? annualCardRef.current : null;
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [searchParams]);

  const handleCheckout = async (priceId, planName) => {
    if (!paddle) {
      setError('Payment system is still loading. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('paddle', paddle);
      // For simple one-time payments, you can open checkout directly
      paddle?.Checkout.open({
        items: [
          { priceId, quantity: 1 }
        ],
        settings: {
          displayMode: 'overlay',
          successUrl: window.location.origin + '/success?plan=' + encodeURIComponent(planName),
          theme: 'dark',
        }
      });
    } catch (err) {
      console.error('Checkout failed:', err);
      setError('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Price IDs - Replace these with your actual Paddle price IDs
  const PRICE_IDS = {
    MONTHLY: 'pri_01khc5mnrvvhp9yhmzd6h27enh', // Replace with your monthly plan price ID
    ANNUAL: 'pri_01khc5p531x8f2bv1z2yyqfmqd'     // Replace with your annual plan price ID
  };

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

      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20 flex-grow w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Social Layer Pro</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            More control, when you want it. Defaults stay the same. Upgrade anytime. Cancel anytime.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-center text-sm">{error}</p>
          </div>
        )}

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
            {/* Monthly Plan Card */}
            <div ref={monthlyCardRef} className="plan-card rounded-3xl p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-xl">Monthly Plan</h3>
                <span className="text-2xl font-bold">
                  $9.99<span className="text-sm font-normal text-slate-400">/mo</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4">Billed monthly. Perfect for flexibility.</p>
              <button 
                type="button" 
                onClick={() => handleCheckout(PRICE_IDS.MONTHLY, 'Monthly Plan')}
                disabled={isLoading || !paddle}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Select Monthly Plan'}
              </button>
            </div>

            {/* Annual Plan Card */}
            <div ref={annualCardRef} className="plan-card highlight rounded-3xl p-6 relative">
              <div className="absolute -top-3 right-6 bg-[#22d3ee] text-[#042f2e] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                Best Value
              </div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-xl">Annual Plan</h3>
                <span className="text-2xl font-bold">
                  $99.90<span className="text-sm font-normal text-slate-400">/yr</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-2">
                Equivalent to $8.33 / month. (2 months free)
              </p>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs line-through text-slate-500">$119.88</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                  Save 16.6%
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => handleCheckout(PRICE_IDS.ANNUAL, 'Annual Plan')}
                disabled={isLoading || !paddle}
                className="cta-button w-full py-4 rounded-2xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Upgrade to Pro'}
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-400 uppercase tracking-widest">
              No account required • 100% local
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-10 mt-auto border-t border-white/5 bg-black/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[12px] font-semibold uppercase tracking-wider text-white/60">
            <a href="https://sociallayer.app/pricing" className="hover:text-[#22d3ee] transition-colors">Pricing</a>
            <a href="https://sociallayer.app/privacy" className="hover:text-[#22d3ee] transition-colors">Privacy Policy</a>
            <a href="https://sociallayer.app/terms" className="hover:text-[#22d3ee] transition-colors">Terms of Use</a>
            <a href="https://sociallayer.app/refund" className="hover:text-[#22d3ee] transition-colors">Refunds</a>
            <a href="https://sociallayer.app/support" className="hover:text-[#22d3ee] transition-colors">Support</a>
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