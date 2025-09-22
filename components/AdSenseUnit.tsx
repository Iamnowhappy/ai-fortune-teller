import React, { useEffect, useRef } from 'react';

// Extend the Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseUnitProps {
  adSlot: string;
}

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({ adSlot }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    // If the ad slot is a placeholder, don't try to load an ad.
    if (adSlot === 'YOUR_AD_SLOT_ID') {
      return;
    }

    const adElement = adRef.current;
    if (!adElement) {
      return;
    }

    const pushAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // The ad has been pushed, we can stop observing.
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    };

    // Use ResizeObserver to wait for the container to have a size.
    observerRef.current = new ResizeObserver(entries => {
      for (const entry of entries) {
        // Once the container has a width, we can push the ad.
        if (entry.contentRect.width > 0) {
          pushAd();
          break; // No need to check other entries
        }
      }
    });

    observerRef.current.observe(adElement);

    // Cleanup function to disconnect the observer when the component unmounts.
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [adSlot]); // Re-run effect if adSlot changes

  // If the ad slot is a placeholder, render an informative message instead of an ad.
  if (adSlot === 'YOUR_AD_SLOT_ID') {
    return (
      <div className="w-full max-w-2xl mx-auto my-6 min-h-[90px] flex items-center justify-center bg-slate-800 border border-slate-700 rounded-lg">
        <p className="text-slate-400">광고가 표시될 영역입니다.</p>
      </div>
    );
  }

  return (
    <div ref={adRef} className="w-full max-w-2xl mx-auto my-6 min-h-[90px]" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6155471193826443"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};
