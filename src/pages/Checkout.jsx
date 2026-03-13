import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { initializePaddle } from '@paddle/paddle-js';

const PRICE_IDS = {
  MONTHLY: 'pri_01khc5mnrvvhp9yhmzd6h27enh',
  ANNUAL: 'pri_01khc5p531x8f2bv1z2yyqfmqd',
};

export default function Checkout() {
  const [paddle, setPaddle] = useState(null);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const openedRef = useRef(false);

  const plan = (searchParams.get('plan') || 'annual').toLowerCase();
  const isMonthly = plan === 'monthly';
  const priceId = isMonthly ? PRICE_IDS.MONTHLY : PRICE_IDS.ANNUAL;
  const planName = isMonthly ? 'Monthly Plan' : 'Annual Plan';

  useEffect(() => {
    if (plan !== 'monthly' && plan !== 'annual') {
      navigate('/', { replace: true });
      return;
    }

    initializePaddle({
      environment: import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox',
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN || 'your_client_side_token_here',
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') {
          const extensionId = import.meta.env.VITE_EXTENSION_ID;
          if (typeof chrome !== 'undefined' && chrome.runtime && extensionId) {
            chrome.runtime.sendMessage(extensionId, { type: 'SUBSCRIPTION_UPDATED', data: event.data }, () => {});
          }
          if (typeof window.gtag !== 'undefined') {
            const name = event.data?.items?.[0]?.price?.description || planName;
            window.gtag('event', 'purchase', {
              transaction_id: event.data?.id,
              value: name.includes('Monthly') ? 9.99 : 99.90,
              currency: 'USD',
            });
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
  }, [plan, planName, navigate]);

  // Auto-open checkout modal once Paddle is ready
  useEffect(() => {
    if (!paddle || !priceId || openedRef.current) return;

    openedRef.current = true;
    setError(null);

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        displayMode: 'overlay',
        successUrl: window.location.origin + '/success?plan=' + encodeURIComponent(planName),
        theme: 'dark',
      },
    }).catch((err) => {
      console.error('Checkout open failed:', err);
      setError('Failed to open checkout. Please try again.');
      openedRef.current = false;
    });
  }, [paddle, priceId, planName]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md mx-4 p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-[#22d3ee] hover:underline"
          >
            Back to pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md mx-4 p-8 text-center">
        <div className="animate-pulse text-slate-400 mb-4">Opening checkout...</div>
        <p className="text-sm text-slate-500">If the checkout modal did not appear, check for a popup blocker.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 text-[#22d3ee] hover:underline text-sm"
        >
          Back to pricing
        </button>
      </div>
    </div>
  );
}
