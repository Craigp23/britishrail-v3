import React, { useEffect, useState } from 'react';

export default function AdSenseContainer() {
  // @ts-ignore
  const adClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  // @ts-ignore
  const adSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID;
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    if (adClientId && adSlotId) {
      try {
        // Ensure script is injected
        const scriptId = 'google-adsense-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }

        // Push ad unit init to adsbygoogle stack
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.warn('AdSense failed to initialize:', err);
        setAdError(true);
      }
    }
  }, [adClientId, adSlotId]);

  // If Google AdSense is fully configured, render the real ad code
  if (adClientId && adSlotId && !adError) {
    return (
      <div className="max-w-4xl mx-auto my-6 px-4" id="real-adsense-unit">
        <div className="text-center text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
          Advertisement
        </div>
        <div className="overflow-hidden bg-slate-50 border border-slate-200 rounded-xl p-2 min-h-[90px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client={adClientId}
            data-ad-slot={adSlotId}
          />
        </div>
      </div>
    );
  }

  // Elegant fallback explaining setup details
  return (
    <div className="max-w-4xl mx-auto my-6 px-4" id="adsense-setup-container">
      <div className="bg-slate-50 hover:bg-slate-100/80 transition p-4 sm:p-5 rounded-2xl border border-slate-200/80 text-center relative overflow-hidden group">
        <div className="absolute top-2 right-3 text-[8px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
          AdSense Ready
        </div>
        
        <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
          Advertisement Placeholder
        </div>
        
        <div className="text-xs font-semibold text-slate-700 mt-2">
          Looking for accommodations? Plan hotel stays simultaneously to save more bundle travel values.
        </div>

        <div className="mt-3.5 pt-3 border-t border-dashed border-slate-200 text-[10px] text-slate-500 font-mono flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3">
          <span>💡 <strong>Real AdSense Integration Available:</strong></span>
          <span className="text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm text-[9px]">
            Set <code className="font-bold text-slate-800 font-mono">VITE_ADSENSE_CLIENT_ID</code> and <code className="font-bold text-slate-800 font-mono">VITE_ADSENSE_SLOT_ID</code> to show live ads.
          </span>
        </div>
      </div>
    </div>
  );
}
