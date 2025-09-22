import React from 'react';
import { AdSenseUnit } from './AdSenseUnit';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 border-t border-slate-700/50 mt-12">
      {/* 
        !!! 중요: 아래 "YOUR_AD_SLOT_ID"를 
        실제 Google AdSense 광고 슬롯 ID로 교체해야 광고가 표시됩니다. 
      */}
      <AdSenseUnit adSlot="YOUR_AD_SLOT_ID" />
      
      <p className="text-sm text-slate-500">
        본 서비스는 재미를 위해 제공되며, 과학적 근거가 없습니다. 결과는 참고용으로만 활용해주세요.
      </p>
      <p className="text-sm text-slate-600 mt-1">
        © 2024 AI Face Reader v1.1. All Rights Reserved.
      </p>
    </footer>
  );
};
