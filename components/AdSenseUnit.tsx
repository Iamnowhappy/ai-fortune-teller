import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export const AdSenseUnit: React.FC = () => {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const adElement = adRef.current;
        if (!adElement) {
            return;
        }

        const pushAd = () => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                 // The ad has been pushed, we can stop observing.
                if (observer) {
                    observer.disconnect();
                }
            } catch (e) {
                console.error("AdSense push error:", e);
            }
        };

        // ResizeObserver is the most robust way to wait for the container to have a size.
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                // Once the container has a width, we can push the ad.
                if (entry.contentRect.width > 0) {
                    pushAd();
                    break; // No need to check other entries
                }
            }
        });

        observer.observe(adElement);

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, []);

    return (
        // A container with an explicit width and min-height ensures AdSense has a valid slot to fill.
        <div ref={adRef} style={{ minHeight: '90px', width: '100%', textAlign: 'center' }}>
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-6155471193826443"
                 data-ad-slot="YOUR_AD_SLOT_ID"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
    );
};