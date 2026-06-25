import React, { useEffect, useState } from 'react';

interface AdSenseContainerProps {
  slotIndex?: 1 | 2 | 3;
}

export default function AdSenseContainer({ slotIndex = 1 }: AdSenseContainerProps) {
  // @ts-ignore
  const adClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  
  // Resolve slot ID depending on slotIndex
  let adSlotId = '';
  if (slotIndex === 1) {
    // @ts-ignore
    adSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID;
  } else if (slotIndex === 2) {
    // @ts-ignore
    adSlotId = import.meta.env.VITE_ADSENSE_SLOT_2;
  } else if (slotIndex === 3) {
    // @ts-ignore
    adSlotId = import.meta.env.VITE_ADSENSE_SLOT_3;
  }

  const [adError, setAdError] = useState(false);
  const [isProdDomain, setIsProdDomain] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isProd = hostname === 'britishrail.co.uk' || hostname === 'www.britishrail.co.uk';
      setIsProdDomain(isProd);
    }
  }, []);

  useEffect(() => {
    if (isProdDomain && adClientId && adSlotId) {
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
        console.warn(`AdSense Slot ${slotIndex} failed to initialize:`, err);
        setAdError(true);
      }
    }
  }, [adClientId, adSlotId, slotIndex, isProdDomain]);

  // If Google AdSense is fully configured and on the live domain, render the real ad code
  if (isProdDomain && adClientId && adSlotId && !adError) {
    return (
      <div className="max-w-4xl mx-auto my-6 px-4" id={`real-adsense-unit-${slotIndex}`}>
        <div className="text-center text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
          Advertisement (Slot {slotIndex})
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
    <div className="max-w-4xl mx-auto my-6 px-4" id={`adsense-setup-container-${slotIndex}`}>
      <div className="bg-slate-50 hover:bg-slate-100/80 transition p-4 sm:p-5 rounded-2xl border border-slate-200/80 text-center relative overflow-hidden group">
        <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
          Advertisement Placeholder
        </div>
        
        <div className="text-xs font-semibold text-slate-700 mt-2">
          {slotIndex === 1 && "Looking for accommodations? Plan hotel stays simultaneously to save more bundle travel values."}
          {slotIndex === 2 && "Need travel insurance? Keep your split journeys covered with comprehensive transit protection."}
          {slotIndex === 3 && "Looking for car rentals? Seamlessly rent vehicles at your destination for total travel flexibility."}
        </div>

        {!isProdDomain && adClientId && adSlotId && (
          <div className="mt-3.5 pt-3 border-t border-dashed border-slate-200 text-[10px] text-emerald-600 font-mono flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3">
            <span>🔒 <strong>AdSense Safety Guard Active:</strong> IDs are successfully recognized, but live ads are restricted to the production domain to prevent invalid impressions during testing.</span>
          </div>
        )}
      </div>
    </div>
  );
}
