import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializePaddle } from '@paddle/paddle-js';

const PRICE_IDS = {
  MONTHLY: 'pri_01khc5mnrvvhp9yhmzd6h27enh',
  ANNUAL: 'pri_01khc5p531x8f2bv1z2yyqfmqd',
};

export default function Checkout() {
  const [paddle, setPaddle] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const navigate = useNavigate();

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
          frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;',
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
    if (!paddle) return;

    const priceId = plan === 'monthly' ? PRICE_IDS.MONTHLY : PRICE_IDS.ANNUAL;
    const planName = plan === 'monthly' ? 'Monthly Plan' : 'Annual Plan';

    // If checkout is already open, update it; otherwise open it
    paddle.Checkout.open({
      items: [{ priceId: priceId, quantity: 1 }],
      settings: {
        successUrl: window.location.origin + '/success?plan=' + encodeURIComponent(planName),
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md mx-4 p-8 w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Choose your plan</h2>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        {/* Plan selector buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            type="button"
            onClick={() => handlePlanSwitch('monthly')}
            className={`flex-1 p-4 rounded-xl border transition-all ${
              selectedPlan === 'monthly'
                ? 'border-[#22d3ee] bg-[#22d3ee]/10 text-white'
                : 'border-white/10 text-slate-400'
            }`}
          >
            <div className="font-bold">Monthly</div>
            <div className="text-2xl font-bold mt-1">$9.99<span className="text-sm font-normal">/mo</span></div>
          </button>

          <button
            type="button"
            onClick={() => handlePlanSwitch('annual')}
            className={`flex-1 p-4 rounded-xl border transition-all ${
              selectedPlan === 'annual'
                ? 'border-[#22d3ee] bg-[#22d3ee]/10 text-white'
                : 'border-white/10 text-slate-400'
            }`}
          >
            <div className="font-bold">Annual</div>
            <div className="text-2xl font-bold mt-1">$99.90<span className="text-sm font-normal">/yr</span></div>
            <div className="text-xs text-emerald-400 mt-1">Save 16.6%</div>
          </button>
        </div>

        {/* Inline checkout renders here */}
        <div className="checkout-container"></div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 text-slate-400 hover:text-white text-sm w-full text-center"
        >
          Back to pricing
        </button>
      </div>
    </div>
  );
}