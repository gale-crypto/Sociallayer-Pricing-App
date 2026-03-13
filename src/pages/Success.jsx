import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const plan = searchParams.get('plan') || 'Pro';

  // Notify Chrome extension to activate Pro when user lands on success after payment
  useEffect(() => {
    const extensionId = import.meta.env.VITE_EXTENSION_ID;
    if (typeof chrome !== 'undefined' && chrome.runtime && extensionId) {
      chrome.runtime.sendMessage(extensionId, {
        type: 'SUBSCRIPTION_UPDATED',
        data: { fromSuccessPage: true, plan }
      }, (response) => {
        if (!chrome.runtime.lastError && response?.ok) {
          console.log('[Success] Extension set to Pro');
        }
      });
    }
  }, [plan]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4 p-8 glass rounded-[2.5rem] text-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-slate-300 mb-6">
          Thank you for upgrading to the <span className="text-[#22d3ee] font-semibold">{plan}</span>!
        </p>
        <p className="text-sm text-slate-400 mb-8">
          You'll receive a confirmation email shortly with your receipt and next steps.
        </p>
        <div className="text-xs text-slate-500">
          Redirecting to home in {countdown} seconds...
        </div>
      </div>
    </div>
  );
}